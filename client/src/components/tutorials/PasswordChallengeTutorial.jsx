import TutorialWrapper from "./TutorialWrapper";

function PasswordChallengeTutorial({ game, onStart }) {
  return (
    <TutorialWrapper game={game} onStart={onStart}>
      <div className="tutorial-profile-mockup">
        <div className="tutorial-profile-header">
          <div className="tutorial-profile-avatar">👤</div>
          <div className="tutorial-profile-name">@jessicam_2003</div>
          <div className="tutorial-profile-bio">Dog mom 🐕 | Lakers fan 💜💛 | Born July 4th</div>
        </div>
        <div className="tutorial-profile-posts">
          <div className="tutorial-profile-post">
            Happy birthday to my baby <span className="clue">Biscuit</span>! 🐕 Best dog ever 🎂
          </div>
          <div className="tutorial-profile-post">
            <span className="clue">Lakers</span> game tonight!! Let's gooo 💜💛 #LakeShow
          </div>
          <div className="tutorial-profile-post">
            Throwback to my graduation from <span className="clue">Riverside High</span>, class of <span className="clue">2021</span>! 🎓
          </div>
        </div>
      </div>
    </TutorialWrapper>
  );
}

export default PasswordChallengeTutorial;
