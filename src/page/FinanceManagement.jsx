import React, { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

const FinanceManagement = () => {
  const [serviceFee, setServiceFee] = useState("");
  const [donation, setDonation] = useState("");

  const addFinanceData = async () => {
    try {
      await addDoc(collection(db, "finance"), {
        serviceFee: serviceFee,
        donation: donation,
      });
      alert("Finance data added");
      setServiceFee("");
      setDonation("");
    } catch (error) {
      console.error("Error adding finance data: ", error);
    }
  };

  return (
    <div>
      <h3>Finance Management</h3>
      <form onSubmit={(e) => { e.preventDefault(); addFinanceData(); }}>
        <input
          type="text"
          placeholder="Service Fee"
          value={serviceFee}
          onChange={(e) => setServiceFee(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Donation"
          value={donation}
          onChange={(e) => setDonation(e.target.value)}
        />
        <br />
        <button type="submit">Add Finance Data</button>
      </form>
    </div>
  );
};

export default FinanceManagement;
