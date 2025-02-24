import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./style/ElderlyInfo.css";

const ElderlyInfo = () => {
  const { patientId } = useParams();
  const [elderly, setElderly] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElderlyData = async () => {
      try {
        const docRef = doc(db, "elderly", patientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setElderly(docSnap.data());
        } else {
          console.error("❌ ไม่พบข้อมูลของผู้สูงอายุนี้");
        }
      } catch (error) {
        console.error("🔥 Error fetching elderly data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElderlyData();
  }, [patientId]);

  return (
    <div className="profile-container">
      <h1>👴 ข้อมูลส่วนตัวผู้สูงอายุ</h1>

      {loading ? (
        <p>📌 กำลังโหลดข้อมูล...</p>
      ) : elderly ? (
        <div className="profile-card">

          {/* 📸 รูปถ่ายปัจจุบัน */}
          <div className="profile-photo">
            <img src={elderly.photoUrl || "/default-profile.png"} alt="Profile" />
          </div>

          {/* 📌 ข้อมูลทั่วไป */}
          <div className="profile-section">
            <h2>📋 ข้อมูลทั่วไป</h2>
            <p><strong>ชื่อ-นามสกุล:</strong> {elderly.fullName}</p>
            <p><strong>วันเกิด:</strong> {elderly.dateOfBirth || "ไม่ระบุ"}</p>
            <p><strong>อายุ:</strong> {elderly.age} ปี</p>
            <p><strong>เพศ:</strong> {elderly.gender || "ไม่ระบุ"}</p>
            <p><strong>หมายเลขบัตรประชาชน / รหัสประจำตัว:</strong> {elderly.nationalId || "ไม่ระบุ"}</p>
          </div>

          {/* 🏡 ที่อยู่และข้อมูลติดต่อ */}
          <div className="profile-section">
            <h2>📍 ที่อยู่และข้อมูลติดต่อ</h2>
            <p><strong>ที่อยู่ปัจจุบัน:</strong> {elderly.currentAddress || "ไม่ระบุ"}</p>
            <p><strong>เบอร์โทรศัพท์:</strong> {elderly.phoneNumber || "ไม่ระบุ"}</p>
            <p><strong>อีเมล:</strong> {elderly.email || "ไม่ระบุ"}</p>
            <p><strong>🧑‍⚕️ ผู้ดูแลหลัก:</strong> {elderly.caregiver?.name || "ไม่ระบุ"} ({elderly.caregiver?.relationship || "ไม่ระบุ"})</p>
            <p><strong>📞 เบอร์ผู้ดูแล:</strong> {elderly.caregiver?.phone || "ไม่ระบุ"}</p>
          </div>

          {/* 🏥 ข้อมูลสุขภาพพื้นฐาน */}
          <div className="profile-section">
            <h2>🩺 ข้อมูลสุขภาพพื้นฐาน</h2>
            <p><strong>โรคประจำตัว:</strong> {elderly.medicalConditions || "ไม่ระบุ"}</p>
            <p><strong>ภาวะสุขภาพพิเศษ:</strong> {elderly.specialConditions || "ไม่ระบุ"}</p>
            <p><strong>การเคลื่อนไหว:</strong> {elderly.mobility || "ไม่ระบุ"}</p>
            <p><strong>ประวัติการแพ้ยา/อาหาร:</strong> {elderly.allergies || "ไม่ระบุ"}</p>
          </div>

          {/* 📄 เอกสารที่เกี่ยวข้อง */}
          <div className="profile-section">
            <h2>📄 เอกสารที่เกี่ยวข้อง</h2>
            <p><strong>ประกันสุขภาพ:</strong> {elderly.insurance || "ไม่มีข้อมูล"}</p>
            <p><strong>ใบรับรองแพทย์:</strong> {elderly.medicalCertificate || "ไม่มีข้อมูล"}</p>
            <p><strong>เอกสารยินยอมการดูแล:</strong> {elderly.consentForm || "ไม่มีข้อมูล"}</p>
          </div>

        </div>
      ) : (
        <p>❌ ไม่พบข้อมูลของผู้สูงอายุนี้</p>
      )}

      {/* 🔙 ปุ่มกลับไปหน้าก่อนหน้า */}
      <button onClick={() => navigate(-1)} className="back-btn">
        ⬅️ กลับไป
      </button>
    </div>
  );
};

export default ElderlyInfo;
