import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../utils/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./style/MedicineSchedule.css";

const MedicineSchedule = () => {
  // ฟิลด์สำหรับบันทึกข้อมูลการรับยา
  const [medicineName, setMedicineName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [dosage, setDosage] = useState("");
  const [route, setRoute] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [responsible, setResponsible] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const [medicineData, setMedicineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ฟังก์ชันเพิ่มข้อมูลการรับยา
  const addMedicineSchedule = async () => {
    // ตรวจสอบว่าฟิลด์ที่จำเป็นถูกกรอกครบถ้วนหรือไม่
    if (
      !medicineName ||
      !dateTime ||
      !dosage ||
      !route ||
      !frequency ||
      !instructions ||
      !responsible ||
      !status
    ) {
      alert("กรุณากรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วน");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "medicineSchedule"), {
        medicineName,
        genericName,
        dateTime, // เก็บเป็น string; สามารถปรับปรุงเพิ่มเติมได้ตามความต้องการ
        dosage,
        route,
        frequency,
        instructions,
        responsible,
        status,
        note,
      });
      alert("เพิ่มตารางการรับยาสำเร็จแล้ว");
      // เคลียร์ข้อมูลในฟิลด์หลังจากบันทึกเสร็จ
      setMedicineName("");
      setGenericName("");
      setDateTime("");
      setDosage("");
      setRoute("");
      setFrequency("");
      setInstructions("");
      setResponsible("");
      setStatus("");
      setNote("");
      fetchData(); // ดึงข้อมูลใหม่
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มตารางการรับยา: ", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลจาก Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "medicineSchedule"));
      setMedicineData(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // จัดกลุ่มเหตุการณ์ตามวัน (แปลงค่า dateTime เป็นเฉพาะวันที่)
  const eventsByDate = medicineData.reduce((acc, curr) => {
    const eventDate = new Date(curr.dateTime).toDateString();
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(curr);
    return acc;
  }, {});

  // ฟังก์ชันแสดงเนื้อหาในแต่ละวันของปฏิทิน
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateString = date.toDateString();
      if (eventsByDate[dateString]) {
        return (
          <div className="tile-badge">
            {eventsByDate[dateString].length}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="schedule-container">
      <h3 className="title">ตารางการรับยา</h3>
      <div className="form-calendar-wrapper">
        <form
          className="schedule-form"
          onSubmit={(e) => {
            e.preventDefault();
            addMedicineSchedule();
          }}
        >
          <div className="form-group">
            <label>ชื่อยา</label>
            <input
              type="text"
              placeholder="ระบุชื่อยา"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>ชื่อทั่วไป (Generic Name)</label>
            <input
              type="text"
              placeholder="ระบุชื่อทางการแพทย์ (ถ้ามี)"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>วันที่และเวลา</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>ปริมาณ/ขนาดยา</label>
            <input
              type="text"
              placeholder="เช่น 500 mg, 10 ml"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>วิธีการให้ยา</label>
            <select value={route} onChange={(e) => setRoute(e.target.value)}>
              <option value="">เลือกวิธีการให้ยา</option>
              <option value="Oral">รับประทาน</option>
              <option value="Injection">ฉีด</option>
              <option value="Topical">ทาเฉพาะจุด</option>
            </select>
          </div>
          <div className="form-group">
            <label>ความถี่ในการให้ยา</label>
            <input
              type="text"
              placeholder="เช่น ทุกวัน, ทุก 8 ชั่วโมง"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>คำแนะนำในการรับยา</label>
            <textarea
              placeholder="ระบุคำแนะนำ (เช่น หลังอาหาร, ก่อนนอน)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>ผู้รับผิดชอบ/รหัสผู้ดูแล</label>
            <input
              type="text"
              placeholder="ระบุชื่อหรือรหัสผู้ดูแล"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>สถานะการให้ยา</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">เลือกสถานะ</option>
              <option value="Given">ให้แล้ว</option>
              <option value="Not Given">ยังไม่ให้</option>
            </select>
          </div>
          <div className="form-group">
            <label>หมายเหตุ</label>
            <textarea
              placeholder="ระบุหมายเหตุ (ผลข้างเคียง, ปัญหา)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "กำลังเพิ่ม..." : "เพิ่มตารางการรับยา"}
          </button>
        </form>

        <div className="calendar-section">
          <h4>มุมมองปฏิทิน</h4>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
          />
          <h5 className="calendar-date">
            เหตุการณ์ในวันที่ {selectedDate.toDateString()}
          </h5>
          {eventsByDate[selectedDate.toDateString()] ? (
            <ul className="event-list">
              {eventsByDate[selectedDate.toDateString()].map((event) => (
                <li key={event.id}>
                  <strong>{event.medicineName}</strong> ({event.dosage},{" "}
                  {event.route}) - {event.frequency}
                </li>
              ))}
            </ul>
          ) : (
            <p>ไม่มีเหตุการณ์ในวันนี้</p>
          )}
        </div>
      </div>

      <div className="schedule-list">
        <h4>รายการตารางการรับยา</h4>
        {medicineData.length > 0 ? (
          <ul>
            {medicineData.map((data) => (
              <li key={data.id} className="schedule-item">
                <p>
                  <strong>{data.medicineName}</strong>{" "}
                  {data.genericName && `(${data.genericName})`} -{" "}
                  {new Date(data.dateTime).toLocaleString()} - {data.dosage} -{" "}
                  {data.route} - {data.frequency}
                </p>
                <p>คำแนะนำ: {data.instructions}</p>
                <p>
                  ผู้รับผิดชอบ: {data.responsible} | สถานะ: {data.status}
                </p>
                {data.note && <p>หมายเหตุ: {data.note}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>ยังไม่มีตารางการรับยา</p>
        )}
      </div>
    </div>
  );
};

export default MedicineSchedule;
