import React, { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

const WorkSchedule = () => {
  const [staffName, setStaffName] = useState("");
  const [shift, setShift] = useState("");
  const [date, setDate] = useState("");

  const addSchedule = async () => {
    try {
      await addDoc(collection(db, "workSchedules"), {
        staffName: staffName,
        shift: shift,
        date: date,
      });
      alert("Schedule added");
      setStaffName("");
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
        <input
          type="text"
          placeholder="Staff Name"
          value={staffName}
          onChange={(e) => setStaffName(e.target.value)}
        />
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
    </div>
  );
};

export default WorkSchedule;
