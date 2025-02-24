import React, { useState } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import "./style/SpecialCare.css";

const SpecialCare = () => {
  // ฟิลด์สำหรับดูแลพิเศษ
  const [careType, setCareType] = useState("");
  const [schedule, setSchedule] = useState("");

  // ฟิลด์สำหรับการประเมินและวางแผนดูแลเบื้องต้น
  const [initialAssessment, setInitialAssessment] = useState(""); // ประเมินสุขภาพร่างกายและจิตใจ
  const [carePlan, setCarePlan] = useState(""); // วางแผนดูแลเฉพาะบุคคล

  // การดูแลทางการแพทย์และสุขภาพ
  const [medicalConsultation, setMedicalConsultation] = useState(""); // ให้คำปรึกษาและตรวจสุขภาพโดยแพทย์
  const [medicationManagement, setMedicationManagement] = useState(""); // ติดตามและจัดการการใช้ยา
  const [rehabilitation, setRehabilitation] = useState(""); // บริการฟื้นฟูสุขภาพ (กายภาพบำบัด, ออกกำลังกาย)

  // การดูแลด้านโภชนาการ
  const [nutritionalPlan, setNutritionalPlan] = useState(""); // วางแผนอาหารที่เหมาะสม
  const [nutritionalConsultation, setNutritionalConsultation] = useState(""); // ให้คำปรึกษาจากนักโภชนาการ

  // การดูแลด้านจิตใจและจิตวิญญาณ
  const [psychologicalSupport, setPsychologicalSupport] = useState(""); // ให้คำปรึกษาจากนักจิตวิทยา
  const [socialActivity, setSocialActivity] = useState(""); // จัดกิจกรรมเพื่อส่งเสริมความรู้สึกเป็นส่วนหนึ่งของสังคม

  // การดูแลด้านสิ่งแวดล้อมและความปลอดภัย
  const [safetyMeasures, setSafetyMeasures] = useState(""); // สภาพแวดล้อมที่ปลอดภัยและข้อแนะนำในการออกแบบที่พัก

  // การติดตามและประเมินผลการดูแล
  const [monitoring, setMonitoring] = useState(""); // ระบบบันทึกและติดตาม เช่น ตารางรับยา, การตรวจสุขภาพประจำ

  const addSpecialCare = async () => {
    // ตรวจสอบว่าฟิลด์ที่จำเป็นถูกกรอกครบถ้วนหรือไม่
    if (!careType || !schedule || !initialAssessment || !carePlan || !medicalConsultation || 
        !medicationManagement || !rehabilitation || !nutritionalPlan || !nutritionalConsultation ||
        !psychologicalSupport || !socialActivity || !safetyMeasures || !monitoring) {
      alert("กรุณากรอกข้อมูลในช่องที่จำเป็นให้ครบถ้วน");
      return;
    }

    try {
      await addDoc(collection(db, "specialCare"), {
        careType,
        schedule,
        initialAssessment,
        carePlan,
        medicalConsultation,
        medicationManagement,
        rehabilitation,
        nutritionalPlan,
        nutritionalConsultation,
        psychologicalSupport,
        socialActivity,
        safetyMeasures,
        monitoring,
      });
      alert("กำหนดการดูแลพิเศษและวางแผนดูแลเบื้องต้นสำเร็จแล้ว");
      // เคลียร์ฟิลด์ทั้งหมด
      setCareType("");
      setSchedule("");
      setInitialAssessment("");
      setCarePlan("");
      setMedicalConsultation("");
      setMedicationManagement("");
      setRehabilitation("");
      setNutritionalPlan("");
      setNutritionalConsultation("");
      setPsychologicalSupport("");
      setSocialActivity("");
      setSafetyMeasures("");
      setMonitoring("");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูลดูแลพิเศษ: ", error);
    }
  };

  return (
    <div className="schedule-container">
      <h3 className="title">การดูแลพิเศษและวางแผนดูแลเบื้องต้น</h3>
      <form
        className="schedule-form"
        onSubmit={(e) => {
          e.preventDefault();
          addSpecialCare();
        }}
      >
        <fieldset className="section">
          <legend>ข้อมูลการดูแลพิเศษ</legend>
          <div className="form-group">
            <label>ประเภทการดูแล (เช่น ฟื้นฟู, นัดพบแพทย์)</label>
            <input
              type="text"
              placeholder="ระบุประเภทการดูแล"
              value={careType}
              onChange={(e) => setCareType(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>กำหนดการ</label>
            <input
              type="text"
              placeholder="ระบุกำหนดการดูแล"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="section">
          <legend>การประเมินและวางแผนดูแลเบื้องต้น</legend>
          <div className="form-group">
            <label>การประเมินสุขภาพร่างกายและจิตใจ</label>
            <textarea
              placeholder="ระบุผลการประเมินเบื้องต้น"
              value={initialAssessment}
              onChange={(e) => setInitialAssessment(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>แผนการดูแลเฉพาะบุคคล</label>
            <textarea
              placeholder="วางแผนการดูแลที่เหมาะสมกับแต่ละบุคคล"
              value={carePlan}
              onChange={(e) => setCarePlan(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="section">
          <legend>การดูแลทางการแพทย์และสุขภาพ</legend>
          <div className="form-group">
            <label>ให้คำปรึกษาและตรวจสุขภาพโดยแพทย์</label>
            <input
              type="text"
              placeholder="ระบุรายละเอียดการให้คำปรึกษา"
              value={medicalConsultation}
              onChange={(e) => setMedicalConsultation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>การติดตามและจัดการการใช้ยา</label>
            <input
              type="text"
              placeholder="ระบุวิธีติดตามการใช้ยา"
              value={medicationManagement}
              onChange={(e) => setMedicationManagement(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>บริการฟื้นฟูสุขภาพ (กายภาพบำบัด, ออกกำลังกาย)</label>
            <input
              type="text"
              placeholder="ระบุรายละเอียดการฟื้นฟูสุขภาพ"
              value={rehabilitation}
              onChange={(e) => setRehabilitation(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="section">
          <legend>การดูแลด้านโภชนาการ</legend>
          <div className="form-group">
            <label>วางแผนอาหารที่เหมาะสม</label>
            <input
              type="text"
              placeholder="ระบุแผนอาหาร"
              value={nutritionalPlan}
              onChange={(e) => setNutritionalPlan(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>คำปรึกษาจากนักโภชนาการ</label>
            <input
              type="text"
              placeholder="ระบุรายละเอียดคำปรึกษา"
              value={nutritionalConsultation}
              onChange={(e) => setNutritionalConsultation(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="section">
          <legend>การดูแลด้านจิตใจและสังคม</legend>
          <div className="form-group">
            <label>คำปรึกษาจากนักจิตวิทยา</label>
            <input
              type="text"
              placeholder="ระบุรายละเอียดการให้คำปรึกษา"
              value={psychologicalSupport}
              onChange={(e) => setPsychologicalSupport(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>กิจกรรมส่งเสริมความเป็นส่วนหนึ่งของสังคม</label>
            <input
              type="text"
              placeholder="ระบุกิจกรรม"
              value={socialActivity}
              onChange={(e) => setSocialActivity(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="section">
          <legend>การดูแลด้านสิ่งแวดล้อมและความปลอดภัย</legend>
          <div className="form-group">
            <label>มาตรการความปลอดภัย</label>
            <input
              type="text"
              placeholder="ระบุมาตรการ (เช่น ติดตั้งราวจับ, แผงฉุกเฉิน)"
              value={safetyMeasures}
              onChange={(e) => setSafetyMeasures(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="section">
          <legend>การติดตามและประเมินผลการดูแล</legend>
          <div className="form-group">
            <label>ระบบบันทึกและติดตาม</label>
            <input
              type="text"
              placeholder="ระบุวิธีการติดตาม (เช่น ตารางรับยา, ตรวจสุขภาพประจำ)"
              value={monitoring}
              onChange={(e) => setMonitoring(e.target.value)}
            />
          </div>
        </fieldset>

        <button type="submit" className="submit-btn">
          บันทึกข้อมูลการดูแลพิเศษและวางแผนดูแลเบื้องต้น
        </button>
      </form>
    </div>
  );
};

export default SpecialCare;
