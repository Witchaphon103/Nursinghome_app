import React, { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import "./style/DailyActivities.css";

const DailyActivities = () => {
  const [formData, setFormData] = useState({
    date: "",
    personalRoutine: "",
    medicationIntake: "",
    nutrition: "",
    exercise: "",
    mentalActivity: "",
    socialActivity: "",
    restAndRelaxation: "",
    healthMonitoring: "",
  });

  const [activities, setActivities] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addToList = () => {
    if (Object.values(formData).some((field) => !field.trim())) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    setActivities([...activities, formData]);
    setFormData({
      date: "",
      personalRoutine: "",
      medicationIntake: "",
      nutrition: "",
      exercise: "",
      mentalActivity: "",
      socialActivity: "",
      restAndRelaxation: "",
      healthMonitoring: "",
    });
  };

  const saveActivities = async () => {
    try {
      for (const activity of activities) {
        await addDoc(collection(db, "dailyActivities"), activity);
      }
      alert("บันทึกกิจกรรมประจำวันสำเร็จแล้ว");
      setActivities([]);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกกิจกรรม: ", error);
    }
  };

  const removeActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  return (
    <div className="daily-container">
      <h3 className="title">กิจกรรมประจำวัน</h3>
      <form
        className="daily-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {Object.keys(formData).map((key) => (
          <div className="form-group" key={key}>
            <label>{key}</label>
            {key === "date" ? (
              <input type="date" name={key} value={formData[key]} onChange={handleChange} />
            ) : (
              <textarea name={key} value={formData[key]} onChange={handleChange} />
            )}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addToList}>เพิ่ม</button>
        <button type="button" className="submit-btn" onClick={saveActivities} disabled={activities.length === 0}>บันทึกกิจกรรม</button>
      </form>

      {/* ตารางแสดงข้อมูล */}
      {activities.length > 0 && (
        <div className="activity-list">
          <h3>รายการกิจกรรมที่เพิ่ม</h3>
          <table>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>กิจวัตรส่วนตัว</th>
                <th>การรับประทานยา</th>
                <th>โภชนาการ</th>
                <th>ออกกำลังกาย</th>
                <th>กิจกรรมทางจิต</th>
                <th>กิจกรรมทางสังคม</th>
                <th>พักผ่อน</th>
                <th>ติดตามสุขภาพ</th>
                <th>ลบ</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.date}</td>
                  <td>{activity.personalRoutine}</td>
                  <td>{activity.medicationIntake}</td>
                  <td>{activity.nutrition}</td>
                  <td>{activity.exercise}</td>
                  <td>{activity.mentalActivity}</td>
                  <td>{activity.socialActivity}</td>
                  <td>{activity.restAndRelaxation}</td>
                  <td>{activity.healthMonitoring}</td>
                  <td>
                    <button className="delete-btn" onClick={() => removeActivity(index)}>ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DailyActivities;
