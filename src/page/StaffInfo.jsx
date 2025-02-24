import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const WorkSchedule = () => {
  const [staffName, setStaffName] = useState("");
  const [shift, setShift] = useState("");
  const [date, setDate] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const staffData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStaffList(staffData);
    };
    fetchStaff();
  }, []);

  const addSchedule = async () => {
    try {
      await addDoc(collection(db, "workSchedules"), {
        staffName: selectedStaff,
        shift: shift,
        date: date,
      });
      alert("Schedule added");
      setSelectedStaff("");
      setShift("");
      setDate("");
    } catch (error) {
      console.error("Error adding schedule: ", error);
    }
  };

  return (
    <div>
      <h3>Work Schedule</h3>
      <form onSubmit={(e) => { e.preventDefault(); addSchedule(); }}>
        <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
          <option value="">Select Staff</option>
          {staffList.map((staff) => (
            <option key={staff.id} value={staff.fullName}>{staff.fullName}</option>
          ))}
        </select>
        <br />
        <input
          type="text"
          placeholder="Shift"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        />
        <br />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <br />
        <button type="submit">Add Schedule</button>
      </form>
      <h3>Staff List</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {staffList.map((staff) => (
          <div key={staff.id} style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>
            <img src={staff.profilePicture} alt={staff.fullName} style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
            <h4>{staff.fullName}</h4>
            <p>Branch: {staff.branchAssigned}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkSchedule;