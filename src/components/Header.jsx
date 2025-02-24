import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

const Header = () => {
  const { user, userRole, selectedBranch } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <header className="dashboard-header">
      <h1>ระบบจัดการข้อมูล</h1>
      <div className="profile-section">
        <img
          src={user?.photoURL || "/default-profile.png"}
          alt="Profile"
          className="profile-pic"
          onClick={() => setShowProfile(!showProfile)}
        />
        {showProfile && (
          <div className="profile-dropdown">
            <p><strong>ชื่อผู้ใช้:</strong> {user?.displayName || "N/A"}</p>
            <p><strong>อีเมล:</strong> {user?.email}</p>
            <p><strong>ตำแหน่ง:</strong> {userRole || "N/A"}</p>
            <p><strong>สาขาที่ประจำอยู่:</strong> {selectedBranch || "ไม่ได้ระบุ"}</p>
            <button onClick={handleLogout} className="logout-btn">🚪 ออกจากระบบ</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
