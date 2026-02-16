import { useState } from "react";
import games from "../data/games";
import "./CreatorSurvey.css";

function LikertScale({ name, value, onChange, low, high }) {
  return (
    <>
      <div className="creator-likert">
        {[1, 2, 3, 4, 5].map((v) => (
          <div className="creator-likert-option" key={v}>
            <input type="radio" name={name} id={`${name}-${v}`} checked={value === v} onChange={() => onChange(v)} />
            <label htmlFor={`${name}-${v}`}>{v}</label>
          </div>
        ))}
      </div>
      <div className="creator-likert-labels">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </>
  );
}

function CreatorSurvey() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [gameSlug, setGameSlug] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [conceptChoice, setConceptChoice] = useState("");
  const [conceptTranslation, setConceptTranslation] = useState("");
  const [learningImpact, setLearningImpact] = useState("");
  const [learningExample, setLearningExample] = useState("");
  const [aiToolsUsed, setAiToolsUsed] = useState("");
  const [aiWorkflow, setAiWorkflow] = useState("");
  const [aiSecurityAccuracy, setAiSecurityAccuracy] = useState("");
  const [peerLearning, setPeerLearning] = useState("");
  const [designChallenge, setDesignChallenge] = useState("");
  const [funVsAccuracy, setFunVsAccuracy] = useState("");
  const [knowledgeBefore, setKnowledgeBefore] = useState(0);
  const [knowledgeAfter, setKnowledgeAfter] = useState(0);
  const [aiRelianceLogic, setAiRelianceLogic] = useState(0);
  const [aiRelianceUi, setAiRelianceUi] = useState(0);
  const [aiRelianceSecurity, setAiRelianceSecurity] = useState(0);
  const [aiRelianceTesting, setAiRelianceTesting] = useState(0);
  const [recommendAssignment, setRecommendAssignment] = useState(0);
  const [additionalComments, setAdditionalComments] = useState("");

  const requiredFilled = name && gameSlug && conceptChoice && learningImpact
    && aiToolsUsed && knowledgeBefore > 0 && knowledgeAfter > 0
    && aiRelianceLogic > 0 && aiRelianceUi > 0 && aiRelianceSecurity > 0
    && aiRelianceTesting > 0 && recommendAssignment > 0;

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "cs450") {
      setAuthed(true);
      setLoginError("");
    } else {
      setLoginError("Wrong password");
    }
  };

  const handleSubmit = async () => {
    if (!requiredFilled) return;
    try {
      const res = await fetch("/api/research/creator-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password, name, gameSlug, teamSize: Number(teamSize) || null,
          conceptChoice, conceptTranslation, learningImpact, learningExample,
          aiToolsUsed, aiWorkflow, aiSecurityAccuracy, peerLearning,
          designChallenge, funVsAccuracy, knowledgeBefore, knowledgeAfter,
          aiRelianceLogic, aiRelianceUi, aiRelianceSecurity, aiRelianceTesting,
          recommendAssignment, additionalComments,
        }),
      });
      if (!res.ok) {
        setLoginError("Submission failed");
        return;
      }
    } catch (err) {
      console.error("Creator survey error:", err);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="creator-survey-page">
        <div className="creator-thanks">
          <h2>// THANK YOU</h2>
          <p>Your responses have been recorded. Your input is invaluable to this research.</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="creator-survey-page">
        <div className="creator-gate">
          <h2>// Creator Survey</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textAlign: "center", maxWidth: 400 }}>
            This survey is for CS450 students who built the CyberBeanGames. Enter the password provided by your instructor.
          </p>
          <form className="creator-gate-form" onSubmit={handleLogin}>
            <input type="password" placeholder="Creator password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <button type="submit">ENTER</button>
          </form>
          {loginError && <div className="creator-gate-error">{loginError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="creator-survey-page">
      <h1 className="creator-heading">// Creator Survey</h1>
      <p className="creator-desc">
        Thank you for building a CyberBeanGame! This survey helps us understand how creating
        security games impacts your own learning. Takes about 10 minutes. All responses are
        used for research purposes only.
      </p>

      {/* Identity */}
      <div className="creator-section">
        <div className="creator-section-title">About You</div>
        <div className="creator-field">
          <label className="creator-label">Your name (or initials)</label>
          <input className="creator-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., J.D." />
        </div>
        <div className="creator-field">
          <label className="creator-label">Which game did you build?</label>
          <select className="creator-select" value={gameSlug} onChange={(e) => setGameSlug(e.target.value)}>
            <option value="">Select your game</option>
            {games.map((g) => <option key={g.slug} value={g.slug}>{g.title}</option>)}
          </select>
        </div>
        <div className="creator-field">
          <label className="creator-label">How many people were on your team?</label>
          <input className="creator-input" type="number" min="1" max="10" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="e.g., 2" />
        </div>
      </div>

      {/* Game Design */}
      <div className="creator-section">
        <div className="creator-section-title">Game Design Decisions</div>
        <div className="creator-field">
          <label className="creator-label">What cybersecurity concept did you choose to teach, and why?</label>
          <textarea className="creator-textarea" value={conceptChoice} onChange={(e) => setConceptChoice(e.target.value)} placeholder="What topic did you pick and what drew you to it?" />
        </div>
        <div className="creator-field">
          <label className="creator-label">How did you translate that concept into gameplay?</label>
          <span className="creator-hint">What game mechanics did you use to make the concept interactive?</span>
          <textarea className="creator-textarea" value={conceptTranslation} onChange={(e) => setConceptTranslation(e.target.value)} placeholder="e.g., We turned phishing detection into a sorting game where..." />
        </div>
        <div className="creator-field">
          <label className="creator-label">What was the hardest part about making security education fun?</label>
          <textarea className="creator-textarea" value={designChallenge} onChange={(e) => setDesignChallenge(e.target.value)} placeholder="What tradeoffs did you face?" />
        </div>
        <div className="creator-field">
          <label className="creator-label">Did you ever have to sacrifice technical accuracy for fun gameplay, or vice versa?</label>
          <textarea className="creator-textarea" value={funVsAccuracy} onChange={(e) => setFunVsAccuracy(e.target.value)} placeholder="Give an example if you can" />
        </div>
      </div>

      {/* Learning Impact */}
      <div className="creator-section">
        <div className="creator-section-title">Learning Impact</div>
        <div className="creator-field">
          <label className="creator-label">Did building this game change how you understand the cybersecurity concept you taught?</label>
          <textarea className="creator-textarea" value={learningImpact} onChange={(e) => setLearningImpact(e.target.value)} placeholder="How did the process of building a teaching tool affect your own understanding?" />
        </div>
        <div className="creator-field">
          <label className="creator-label">Can you give a specific example of something you learned or understood more deeply through building the game?</label>
          <textarea className="creator-textarea" value={learningExample} onChange={(e) => setLearningExample(e.target.value)} placeholder="e.g., I didn't realize how many variations of phishing URLs exist until I had to generate realistic ones..." />
        </div>
        <div className="creator-field">
          <label className="creator-label">Did you playtest other teams' games? What did you learn from them?</label>
          <textarea className="creator-textarea" value={peerLearning} onChange={(e) => setPeerLearning(e.target.value)} placeholder="What security concepts did you pick up from other games?" />
        </div>
        <div className="creator-field">
          <label className="creator-label">Rate your cybersecurity knowledge BEFORE this project</label>
          <LikertScale name="kb" value={knowledgeBefore} onChange={setKnowledgeBefore} low="Novice" high="Expert" />
        </div>
        <div className="creator-field">
          <label className="creator-label">Rate your cybersecurity knowledge AFTER this project</label>
          <LikertScale name="ka" value={knowledgeAfter} onChange={setKnowledgeAfter} low="Novice" high="Expert" />
        </div>
      </div>

      {/* AI Usage */}
      <div className="creator-section">
        <div className="creator-section-title">AI Tool Usage</div>
        <div className="creator-field">
          <label className="creator-label">Which AI tools did you use? (e.g., Claude, GitHub Copilot, ChatGPT, none)</label>
          <input className="creator-input" value={aiToolsUsed} onChange={(e) => setAiToolsUsed(e.target.value)} placeholder="e.g., Claude and GitHub Copilot" />
        </div>
        <div className="creator-field">
          <label className="creator-label">Walk us through your AI workflow. What did you write yourself vs. what did AI generate?</label>
          <textarea className="creator-textarea" value={aiWorkflow} onChange={(e) => setAiWorkflow(e.target.value)} placeholder="e.g., I designed the game mechanics and wrote pseudocode, then used Claude to help with the React components..." />
        </div>
        <div className="creator-field">
          <label className="creator-label">Did AI ever get the security concepts wrong? How did you handle it?</label>
          <textarea className="creator-textarea" value={aiSecurityAccuracy} onChange={(e) => setAiSecurityAccuracy(e.target.value)} placeholder="e.g., It suggested a weak encryption example that I had to correct..." />
        </div>

        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
          Rate how much you relied on AI for each area (1 = did it all myself, 5 = AI did most of it):
        </p>
        <div className="creator-field">
          <label className="creator-label">Game logic and mechanics</label>
          <LikertScale name="ai-logic" value={aiRelianceLogic} onChange={setAiRelianceLogic} low="All myself" high="Mostly AI" />
        </div>
        <div className="creator-field">
          <label className="creator-label">UI and visual design</label>
          <LikertScale name="ai-ui" value={aiRelianceUi} onChange={setAiRelianceUi} low="All myself" high="Mostly AI" />
        </div>
        <div className="creator-field">
          <label className="creator-label">Security content accuracy</label>
          <LikertScale name="ai-sec" value={aiRelianceSecurity} onChange={setAiRelianceSecurity} low="All myself" high="Mostly AI" />
        </div>
        <div className="creator-field">
          <label className="creator-label">Testing and debugging</label>
          <LikertScale name="ai-test" value={aiRelianceTesting} onChange={setAiRelianceTesting} low="All myself" high="Mostly AI" />
        </div>
      </div>

      {/* Overall */}
      <div className="creator-section">
        <div className="creator-section-title">Overall</div>
        <div className="creator-field">
          <label className="creator-label">Would you recommend this type of assignment (building security games) to future students?</label>
          <LikertScale name="rec" value={recommendAssignment} onChange={setRecommendAssignment} low="Definitely not" high="Absolutely" />
        </div>
        <div className="creator-field">
          <label className="creator-label">Anything else you'd like to share?</label>
          <textarea className="creator-textarea" value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)} placeholder="Optional — any thoughts on the experience, the platform, suggestions, etc." />
        </div>
      </div>

      <button className="creator-submit" disabled={!requiredFilled} onClick={handleSubmit}>
        SUBMIT CREATOR SURVEY
      </button>
    </div>
  );
}

export default CreatorSurvey;
