import { useState } from "react";
import "./DemographicsModal.css";

function DemographicsModal({ onComplete }) {
  const [ageRange, setAgeRange] = useState("");
  const [field, setField] = useState("");
  const [cyberKnowledge, setCyberKnowledge] = useState(0);
  const [priorTraining, setPriorTraining] = useState(false);

  const valid = ageRange && field && cyberKnowledge > 0;

  const handleSubmit = async () => {
    if (!valid) return;
    try {
      await fetch("/api/research/demographics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ageRange, field, cyberKnowledge, priorTraining }),
      });
    } catch (err) {
      console.error("Demographics error:", err);
    }
    onComplete();
  };

  const knowledgeLevels = [
    { value: 1, label: "None" },
    { value: 2, label: "Basic" },
    { value: 3, label: "Moderate" },
    { value: 4, label: "Advanced" },
    { value: 5, label: "Expert" },
  ];

  return (
    <div className="demo-overlay">
      <div className="demo-modal">
        <div className="demo-title">QUICK BACKGROUND</div>
        <div className="demo-subtitle">Help us understand our players (takes 30 seconds)</div>

        <div className="demo-field">
          <label className="demo-label">Age Range</label>
          <select className="demo-select" value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
            <option value="">Select...</option>
            <option value="18-24">18 – 24</option>
            <option value="25-34">25 – 34</option>
            <option value="35-44">35 – 44</option>
            <option value="45+">45+</option>
          </select>
        </div>

        <div className="demo-field">
          <label className="demo-label">Field of Study / Work</label>
          <select className="demo-select" value={field} onChange={(e) => setField(e.target.value)}>
            <option value="">Select...</option>
            <option value="cs-it">Computer Science / IT</option>
            <option value="other-stem">Other STEM</option>
            <option value="non-stem">Non-STEM</option>
            <option value="professional">Working Professional</option>
          </select>
        </div>

        <div className="demo-field">
          <label className="demo-label">Cybersecurity Knowledge</label>
          <div className="demo-radio-group">
            {knowledgeLevels.map((lvl) => (
              <div className="demo-radio-option" key={lvl.value}>
                <input
                  type="radio"
                  name="cyberKnowledge"
                  id={`ck-${lvl.value}`}
                  value={lvl.value}
                  checked={cyberKnowledge === lvl.value}
                  onChange={() => setCyberKnowledge(lvl.value)}
                />
                <label htmlFor={`ck-${lvl.value}`}>{lvl.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-field">
          <label className="demo-checkbox">
            <input
              type="checkbox"
              checked={priorTraining}
              onChange={(e) => setPriorTraining(e.target.checked)}
            />
            <span>I have received formal cybersecurity training before</span>
          </label>
        </div>

        <button className="demo-submit" disabled={!valid} onClick={handleSubmit}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}

export default DemographicsModal;
