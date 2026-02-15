import TutorialWrapper from "./TutorialWrapper";

function PhishTankTutorial({ game, onStart }) {
  return (
    <TutorialWrapper game={game} onStart={onStart}>
      <div className="tutorial-phone">
        <div className="tutorial-phone-screen">
          <div className="tutorial-phone-header">
            <span>9:41 AM</span>
            <span>PhishTank OS</span>
          </div>
          <div className="tutorial-phone-messages">
            <div className="tutorial-message-bubble incoming">
              Hey! Just wanted to check — are you coming to the meeting at 3pm?
            </div>
            <div className="tutorial-message-bubble suspicious">
              🚨 URGENT: Your bank account has been compromised! Click here to verify: bit.ly/s3cur3
            </div>
            <div className="tutorial-message-bubble incoming">
              Mom: Don't forget to call Grandma for her birthday! 🎂
            </div>
            <div className="tutorial-message-bubble suspicious">
              Congratulations! You've won a $500 Amazon gift card. Claim now → amaz0n-prizes.net
            </div>
          </div>
          <div className="tutorial-phone-stats">
            <div>
              <span className="tutorial-phone-stat-label">REP</span>
              <span className="tutorial-phone-stat-value">100</span>
            </div>
            <div>
              <span className="tutorial-phone-stat-label">CASH</span>
              <span className="tutorial-phone-stat-value">$500</span>
            </div>
            <div>
              <span className="tutorial-phone-stat-label">DAY</span>
              <span className="tutorial-phone-stat-value">1</span>
            </div>
          </div>
        </div>
      </div>
    </TutorialWrapper>
  );
}

export default PhishTankTutorial;
