import TutorialWrapper from "./TutorialWrapper";

function CyberAnalystTutorial({ game, onStart }) {
  return (
    <TutorialWrapper game={game} onStart={onStart}>
      <div className="tutorial-dashboard">
        <div className="tutorial-dashboard-header">
          <span>SOC Dashboard</span>
          <span>Live Feed</span>
        </div>
        <div className="tutorial-alert-feed">
          <div className="tutorial-alert critical">
            <span className="tutorial-alert-severity">CRITICAL</span>
            <span className="tutorial-alert-msg">Suspicious login from unknown IP — credential stuffing detected</span>
          </div>
          <div className="tutorial-alert warning">
            <span className="tutorial-alert-severity">WARNING</span>
            <span className="tutorial-alert-msg">Phishing email reported — spoofed sender domain detected</span>
          </div>
          <div className="tutorial-alert info">
            <span className="tutorial-alert-severity">INFO</span>
            <span className="tutorial-alert-msg">Routine firewall log — outbound traffic spike on port 443</span>
          </div>
          <div className="tutorial-alert critical">
            <span className="tutorial-alert-severity">CRITICAL</span>
            <span className="tutorial-alert-msg">Malware signature match — endpoint quarantine recommended</span>
          </div>
        </div>
      </div>
    </TutorialWrapper>
  );
}

export default CyberAnalystTutorial;
