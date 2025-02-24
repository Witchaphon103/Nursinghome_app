import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import { FaUserNurse, FaClipboardList, FaBell, FaUtensils, FaMoneyBillWave, FaShieldAlt, FaChartBar, FaArrowLeft, FaUser, FaNotesMedical, FaPills, FaHeartbeat, FaWalking } from "react-icons/fa";
import "./style/Sidebar.css";

const Sidebar = ({ patientId, branchId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBranch } = useContext(AuthContext); 

  // 🛠 เพิ่ม includes() ให้รองรับหน้าอื่น ๆ ในระบบ
  const isPatientPage = [
    "/patient-detail",
    "/elderly-info",
    "/health-records",
    "/medicine-schedule",
    "/special-care",
    "/daily-activities",
  ].some((path) => location.pathname.includes(path));

  const menuItems = [
    { path: "/dashboard", label: "เลือกสาขา", icon: <FaUserNurse /> },
    { path: "/staff-info", label: "ข้อมูลเจ้าหน้าที่", icon: <FaUserNurse /> },
    { path: "/work-schedule", label: "ตารางเวรงาน", icon: <FaClipboardList /> },
    { path: "/nutrition-management", label: "การจัดการอาหารและโภชนาการ", icon: <FaUtensils /> },
    { path: "/finance-management", label: "การเงินและค่าใช้จ่าย", icon: <FaMoneyBillWave /> },
    { path: "/security-management", label: "ระบบรักษาความปลอดภัย", icon: <FaShieldAlt /> },
    { path: "/reports-and-analysis", label: "รายงานและวิเคราะห์ข้อมูล", icon: <FaChartBar /> },
  ];

  const patientMenu = [
    { path: `/elderly-info/${patientId}`, label: "ข้อมูลส่วนตัวผู้สูงอายุ", icon: <FaUser /> },
    { path: `/health-records/${patientId}`, label: "บันทึกสุขภาพ", icon: <FaNotesMedical /> },
    { path: `/medicine-schedule/${patientId}`, label: "ตารางการรับประทานยา", icon: <FaPills /> },
    { path: `/special-care/${patientId}`, label: "การดูแลพิเศษ", icon: <FaHeartbeat /> },
    { path: `/daily-activities/${patientId}`, label: "กิจกรรมประจำวัน", icon: <FaWalking /> },
  ];

  return (
    <div className="sidebar">
      <h2>{selectedBranch ? `สาขา: ${selectedBranch.name}` : "Dashboard"}</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path} className={location.pathname.includes(item.path) ? "active" : ""} onClick={() => navigate(item.path)}>
            {item.icon} {item.label}
          </li>
        ))}

        {/* 🏥 เมนูสำหรับผู้ป่วย */}
        {isPatientPage && patientId && branchId && (
          <>
            <h3>📌 เมนูผู้สูงอายุ</h3>
            {patientMenu.map((item) => (
              <li key={item.path} className={location.pathname.includes(item.path) ? "active" : ""} onClick={() => navigate(item.path)}>
                {item.icon} {item.label}
              </li>
            ))}
          </>
        )}

        <li className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> ย้อนกลับ
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
