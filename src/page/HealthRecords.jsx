import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import "./style/HealthRecords.css";

const HealthRecords = () => {
  const { patientId } = useParams();
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const navigate = useNavigate();

  // 🔹 ระบบแบ่งหน้า (Pagination)
  const recordsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = healthRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const fetchHealthRecords = async () => {
    try {
      const q = query(collection(db, "healthRecords"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setHealthRecords(records);
      console.log("📥 ข้อมูลที่โหลดจาก Firestore:", records);
    } catch (error) {
      console.error("🔥 Error fetching health data:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (indexOfLastRecord < healthRecords.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const [newRecord, setNewRecord] = useState({
    bloodPressure: "",
    sugarLevel: "",
    temperature: "",
    heartRate: "",
    weight: "",
    height: "",
    bmi: "",
    lastDoctorVisit: "",
    diagnosis: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editRecord) {
        const recordRef = doc(db, "healthRecords", editRecord.id);
        await updateDoc(recordRef, { ...newRecord });

        setHealthRecords(prevRecords =>
          prevRecords.map(record => (record.id === editRecord.id ? { id: editRecord.id, ...newRecord } : record))
        );

        console.log("✏️ แก้ไขข้อมูลสำเร็จ:", newRecord);
      } else {
        const docRef = await addDoc(collection(db, "healthRecords"), {
          ...newRecord,
          timestamp: serverTimestamp(),
          patientId
        });

        const newRecordWithId = { id: docRef.id, ...newRecord, timestamp: new Date() };
        setHealthRecords([newRecordWithId, ...healthRecords]);
        console.log("✅ เพิ่มบันทึกสุขภาพ:", newRecordWithId);
      }

      setShowForm(false);
      setNewRecord({
        bloodPressure: "",
        sugarLevel: "",
        temperature: "",
        heartRate: "",
        weight: "",
        height: "",
        bmi: "",
        lastDoctorVisit: "",
        diagnosis: "",
      });

      setEditRecord(null);
    } catch (error) {
      console.error("🔥 Error saving health record:", error);
    }
  };

  return (
    <div className="health-records-container">
      <h1>🩺 บันทึกสุขภาพ</h1>

      <button className="add-record-btn" onClick={() => { setShowForm(true); setEditRecord(null); }}>
        ➕ เพิ่มบันทึกสุขภาพ
      </button>

      {loading ? (
        <p>📌 กำลังโหลดข้อมูล...</p>
      ) : currentRecords.length > 0 ? (
        <div className="records-list">
          {currentRecords.map((record) => (
            <div className="record-card" key={record.id}>
              <h2>📋 ข้อมูลสุขภาพ</h2>
              <p><strong>ความดันโลหิต:</strong> {record.bloodPressure || "ไม่ระบุ"}</p>
              <p><strong>ระดับน้ำตาล:</strong> {record.sugarLevel || "ไม่ระบุ"}</p>
              <p><strong>อุณหภูมิ:</strong> {record.temperature || "ไม่ระบุ"} °C</p>
              <p><strong>อัตราการเต้นของหัวใจ:</strong> {record.heartRate || "ไม่ระบุ"} bpm</p>
              <p><strong>น้ำหนัก:</strong> {record.weight || "ไม่ระบุ"} kg</p>
              <p><strong>ส่วนสูง:</strong> {record.height || "ไม่ระบุ"} cm</p>
              <p><strong>BMI:</strong> {record.bmi || "ไม่ระบุ"}</p>
              <p><strong>วันที่พบแพทย์ล่าสุด:</strong> {record.lastDoctorVisit || "ไม่ระบุ"}</p>
              <p><strong>การวินิจฉัยจากแพทย์:</strong> {record.diagnosis || "ไม่ระบุ"}</p>
              <button onClick={() => handleEdit(record)}>✏️ แก้ไข</button>
              <button onClick={() => handleDelete(record.id)}>🗑️ ลบ</button>
            </div>
          ))}
        </div>
      ) : (
        <p>❌ ไม่พบข้อมูลสุขภาพ</p>
      )}

      {/* 🔹 Pagination UI */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>⬅️ ก่อนหน้า</button>
        <span>หน้า {currentPage} จาก {Math.ceil(healthRecords.length / recordsPerPage)}</span>
        <button onClick={nextPage} disabled={indexOfLastRecord >= healthRecords.length}>ถัดไป ➡️</button>
      </div>

      <button onClick={() => navigate(-1)} className="back-btn">⬅️ กลับไป</button>

      {/* 📝 ฟอร์มเพิ่มบันทึกสุขภาพ */}
      {showForm && (
        <div className="form-popup">
          <form className="health-form" onSubmit={handleSubmit}>
            <h2>{editRecord ? "✏️ แก้ไขบันทึกสุขภาพ" : "➕ เพิ่มบันทึกสุขภาพ"}</h2>
            <input type="text" placeholder="ความดันโลหิต" value={newRecord.bloodPressure} onChange={(e) => setNewRecord({ ...newRecord, bloodPressure: e.target.value })} />
            <input type="text" placeholder="ระดับน้ำตาล" value={newRecord.sugarLevel} onChange={(e) => setNewRecord({ ...newRecord, sugarLevel: e.target.value })} />
            <input type="text" placeholder="อุณหภูมิ (°C)" value={newRecord.temperature} onChange={(e) => setNewRecord({ ...newRecord, temperature: e.target.value })} />
            <button type="submit">💾 {editRecord ? "อัปเดตข้อมูล" : "บันทึกข้อมูล"}</button>
            <button type="button" onClick={() => setShowForm(false)}>❌ ยกเลิก</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
