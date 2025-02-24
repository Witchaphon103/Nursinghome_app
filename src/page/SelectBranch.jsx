import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css"; // เชื่อม CSS

const SelectBranch = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState("");

  const branches = ["Bangkok", "Chiang Mai", "Phuket", "Khon Kaen"];

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
        <h1>Select a Branch</h1>
        <select onChange={(e) => setSelectedBranch(e.target.value)}>
          <option value="">-- Select Branch --</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        <button onClick={handleSelectBranch}>Next</button>
      </div>
    </div>
  );
};

export default SelectBranch;
