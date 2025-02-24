import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ถ้ามีคนล็อกอินอยู่แล้ว → ส่งไปหน้า Dashboard
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // 📌 เปลี่ยนไปหน้า Dashboard
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setErrorMessage("ไม่พบบัญชีผู้ใช้นี้");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("รหัสผ่านไม่ถูกต้อง");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("รูปแบบอีเมลไม่ถูกต้อง");
      } else {
        setErrorMessage("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>เข้าสู่ระบบ</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
};

export default Login;
