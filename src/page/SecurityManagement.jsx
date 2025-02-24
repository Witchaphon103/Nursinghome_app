import React, { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

const SecurityManagement = () => {
  const [entryDetails, setEntryDetails] = useState("");

  const recordEntry = async () => {
    try {
      await addDoc(collection(db, "security"), {
        entryDetails: entryDetails,
        timestamp: new Date(),
      });
      alert("Entry recorded");
      setEntryDetails("");
    } catch (error) {
      console.error("Error recording entry: ", error);
    }
  };

  return (
    <div>
      <h3>Security Management</h3>
      <form onSubmit={(e) => { e.preventDefault(); recordEntry(); }}>
        <textarea
          placeholder="Entry Details"
          value={entryDetails}
          onChange={(e) => setEntryDetails(e.target.value)}
        />
        <br />
        <button type="submit">Record Entry</button>
      </form>
    </div>
  );
};

export default SecurityManagement;
