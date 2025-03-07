import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase"; // นำเข้า Firestore
import "../Dashboard.css"; // เชื่อม CSS

const SelectBranch = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState(""); // สาขาที่เลือก
  const [branches, setBranches] = useState([]); // รายชื่อสาขาจาก Firestore

  // โหลดข้อมูลสาขาจาก Firestore
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchCollection = await getDocs(collection(db, "branches"));
        const branchList = branchCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBranches(branchList);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  // เมื่อกดปุ่ม "Next"
  const handleSelectBranch = () => {
    if (!selectedBranch) {
      alert("Please select a branch.");
      return;
    }
    navigate(`/select-patient/${selectedBranch}`);
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1>🔹 เลือกสาขา</h1>

        {/* Dropdown สำหรับเลือกสาขา */}
        <div className="dropdown-container">
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="">-- Select Branch --</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} {/* แสดงชื่อสาขาจาก Firestore */}
              </option>
            ))}
          </select>
        </div>

        {/* ปุ่มถัดไป */}
        <button className="next-btn" onClick={handleSelectBranch} disabled={!selectedBranch}>
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default SelectBranch;
