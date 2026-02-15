import { useState } from "react";
import QuizScreen from "./QuizScreen";
import "./PostGameSurvey.css";

function PostGameSurvey({ gameColor, gameSlug, sessionId, questions, quizDone, onClose }) {
  const [phase, setPhase] = useState(quizDone ? "feedback" : "quiz");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Phase 1: Post-game quiz (same questions as pre)
  if (phase === "quiz") {
    return (
      <div className="pgs-overlay">
        <div className="pgs-modal" style={{ "--game-color": gameColor, maxWidth: 720, padding: 0 }}>
          <QuizScreen
            phase="post"
            gameSlug={gameSlug}
            gameColor={gameColor}
            questions={questions}
            onComplete={() => setPhase("feedback")}
          />
        </div>
      </div>
    );
  }

  // Phase 2: Engagement feedback
  const handleSubmit = async () => {
    try {
      await fetch("/api/research/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId, rating, comment }),
      });
    } catch (err) {
      console.error("Feedback error:", err);
    }
    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  if (submitted) {
    return (
      <div className="pgs-overlay">
        <div className="pgs-modal" style={{ "--game-color": gameColor }}>
          <div className="pgs-thanks">
            <div className="pgs-title">THANKS!</div>
            <div className="pgs-subtitle">Your responses have been recorded.</div>
            <div className="pgs-survey-link" style={{ borderTop: "none", paddingTop: 12 }}>
              <a href="/survey">Take the full exit survey to help us even more →</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pgs-overlay">
      <div className="pgs-modal" style={{ "--game-color": gameColor }}>
        <div className="pgs-title">HOW WAS THE GAME?</div>
        <div className="pgs-subtitle">Your feedback helps us improve</div>

        <div className="pgs-section-label">Engagement Rating</div>
        <div className="pgs-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`pgs-star${star <= rating ? " active" : ""}${star <= hoverRating && star > rating ? " hover" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="pgs-comment"
          placeholder="Any comments about this game? (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
        />

        <div className="pgs-actions">
          <button className="pgs-submit" onClick={handleSubmit} disabled={!rating}>
            SUBMIT
          </button>
          <button className="pgs-skip" onClick={onClose}>SKIP</button>
        </div>
      </div>
    </div>
  );
}

export default PostGameSurvey;
