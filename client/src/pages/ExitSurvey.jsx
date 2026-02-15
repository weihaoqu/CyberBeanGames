import { useState, useEffect } from "react";
import games from "../data/games";
import "./ExitSurvey.css";

const SUS_ITEMS = [
  "I think that I would like to use this platform frequently.",
  "I found the platform unnecessarily complex.",
  "I thought the platform was easy to use.",
  "I think that I would need the support of a technical person to use this platform.",
  "I found the various functions in this platform were well integrated.",
  "I thought there was too much inconsistency in this platform.",
  "I would imagine that most people would learn to use this platform very quickly.",
  "I found the platform very cumbersome to use.",
  "I felt very confident using the platform.",
  "I needed to learn a lot of things before I could get going with this platform.",
];

function ExitSurvey() {
  const [sus, setSus] = useState(Array(10).fill(0));
  const [mostEducational, setMostEducational] = useState("");
  const [mostEnjoyable, setMostEnjoyable] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(0);
  const [improvementComment, setImprovementComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    fetch("/api/research/exit-survey-status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.completed) setAlreadyDone(true); });
  }, []);

  const allSusFilled = sus.every((v) => v > 0);
  const valid = allSusFilled && wouldRecommend > 0;

  const handleSus = (index, value) => {
    setSus((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!valid) return;
    try {
      await fetch("/api/research/exit-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sus,
          mostEducational: mostEducational || null,
          mostEnjoyable: mostEnjoyable || null,
          wouldRecommend,
          improvementComment: improvementComment || null,
        }),
      });
    } catch (err) {
      console.error("Exit survey error:", err);
    }
    setSubmitted(true);
  };

  if (alreadyDone || submitted) {
    return (
      <div className="exit-survey-page">
        <div className="exit-thanks">
          <h2>// THANK YOU</h2>
          <p>{submitted ? "Your responses have been recorded." : "You've already completed the exit survey."}</p>
          <p style={{ marginTop: 8 }}>Your participation helps improve cybersecurity education.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exit-survey-page">
      <h1 className="exit-heading">// Exit Survey</h1>
      <p className="exit-desc">
        Thank you for playing! This survey takes about 3 minutes and helps us evaluate
        the platform as a whole. All responses are anonymous.
      </p>

      {/* SUS Section */}
      <div className="exit-section">
        <div className="exit-section-title">System Usability Scale</div>
        <p className="exit-desc" style={{ marginBottom: 16 }}>
          Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).
        </p>

        {SUS_ITEMS.map((text, i) => (
          <div className="sus-item" key={i}>
            <div className="sus-text">{i + 1}. {text}</div>
            <div className="sus-scale">
              <span className="sus-label">Strongly Disagree</span>
              <div className="sus-options">
                {[1, 2, 3, 4, 5].map((v) => (
                  <div className="sus-option" key={v}>
                    <input
                      type="radio"
                      name={`sus-${i}`}
                      id={`sus-${i}-${v}`}
                      checked={sus[i] === v}
                      onChange={() => handleSus(i, v)}
                    />
                    <label htmlFor={`sus-${i}-${v}`}>{v}</label>
                  </div>
                ))}
              </div>
              <span className="sus-label">Strongly Agree</span>
            </div>
          </div>
        ))}
      </div>

      {/* Final Questions */}
      <div className="exit-section">
        <div className="exit-section-title">Overall Experience</div>

        <div className="exit-field">
          <label className="exit-label">Which game taught you the most?</label>
          <select className="exit-select" value={mostEducational} onChange={(e) => setMostEducational(e.target.value)}>
            <option value="">Select a game (optional)</option>
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>{g.title}</option>
            ))}
          </select>
        </div>

        <div className="exit-field">
          <label className="exit-label">Which game was most enjoyable?</label>
          <select className="exit-select" value={mostEnjoyable} onChange={(e) => setMostEnjoyable(e.target.value)}>
            <option value="">Select a game (optional)</option>
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>{g.title}</option>
            ))}
          </select>
        </div>

        <div className="exit-field">
          <label className="exit-label">Would you recommend this platform to others?</label>
          <div className="exit-recommend">
            {[1, 2, 3, 4, 5].map((v) => (
              <div className="sus-option" key={v}>
                <input
                  type="radio"
                  name="recommend"
                  id={`rec-${v}`}
                  checked={wouldRecommend === v}
                  onChange={() => setWouldRecommend(v)}
                />
                <label htmlFor={`rec-${v}`}>{v}</label>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span className="sus-label">Not at all</span>
            <span className="sus-label" style={{ textAlign: "right" }}>Absolutely</span>
          </div>
        </div>

        <div className="exit-field">
          <label className="exit-label">What would you improve about the experience?</label>
          <textarea
            className="exit-textarea"
            placeholder="Your suggestions (optional)"
            value={improvementComment}
            onChange={(e) => setImprovementComment(e.target.value)}
            maxLength={2000}
          />
        </div>
      </div>

      <button className="exit-submit-btn" disabled={!valid} onClick={handleSubmit}>
        SUBMIT EXIT SURVEY
      </button>
    </div>
  );
}

export default ExitSurvey;
