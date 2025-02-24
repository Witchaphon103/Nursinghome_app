import React, { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

const NutritionManagement = () => {
  const [meal, setMeal] = useState("");
  const [allergy, setAllergy] = useState("");
  const [nutritionData, setNutritionData] = useState([]);

  const addMeal = async () => {
    try {
      await addDoc(collection(db, "meals"), {
        meal: meal,
        allergy: allergy,
      });
      alert("Meal added");
      setMeal("");
      setAllergy("");
    } catch (error) {
      console.error("Error adding meal: ", error);
    }
  };

  return (
    <div>
      <h3>Nutrition Management</h3>
      <form onSubmit={(e) => { e.preventDefault(); addMeal(); }}>
        <input
          type="text"
          placeholder="Meal"
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Allergy"
          value={allergy}
          onChange={(e) => setAllergy(e.target.value)}
        />
        <br />
        <button type="submit">Add Meal</button>
      </form>

      <h4>Meal List</h4>
      <ul>
        {nutritionData.map((data, index) => (
          <li key={index}>
            <p>{data.meal} - Allergy: {data.allergy}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionManagement;
