import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../utils/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import "./style/BranchSelection.css";

const BranchSelection = () => {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBranches = async () => {
      const querySnapshot = await getDocs(collection(db, "branches"));
      const branchList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBranches(branchList);
    };

    fetchBranches();
  }, []);

  const handleSelectBranch = async (branch) => {
    if (!user) return;

    try {
      await setDoc(doc(db, "users", user.uid), { selectedBranch: branch.id }, { merge: true });
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

  return (
    <div className="branch-selection-container">
      <h1>เลือกสาขา</h1>
      <div className="branch-grid">
        {branches.map((branch) => (
          <div key={branch.id} className="branch-card" onClick={() => handleSelectBranch(branch)}>
            <img src={branch.image} alt={branch.name} />
            <h3>{branch.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchSelection;
