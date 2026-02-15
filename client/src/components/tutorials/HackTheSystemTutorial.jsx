import TutorialWrapper from "./TutorialWrapper";

function HackTheSystemTutorial({ game, onStart }) {
  return (
    <TutorialWrapper game={game} onStart={onStart}>
      <div className="tutorial-timer-mockup">
        <div className="tutorial-timer-bar">
          <div className="tutorial-timer-fill" />
        </div>
        <div className="tutorial-scenario-preview">
          <strong style={{ color: "#fff", display: "block", marginBottom: 8 }}>
            SCENARIO: Ransomware Detected
          </strong>
          A workstation has been encrypted by ransomware. The attacker demands Bitcoin payment.
          What is the FIRST action you should take?
        </div>
        <div className="tutorial-score-preview">
          <div className="tutorial-score-item correct">✓ Correct: +10 pts</div>
          <div className="tutorial-score-item wrong">✗ Wrong: −5 pts</div>
        </div>
      </div>
    </TutorialWrapper>
  );
}

export default HackTheSystemTutorial;
