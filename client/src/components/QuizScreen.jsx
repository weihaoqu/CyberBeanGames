import { useState } from "react";
import "./QuizScreen.css";

function QuizScreen({ phase, gameSlug, gameColor, questions, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitted) return;

    const payload = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id],
      isCorrect: answers[q.id] === q.correct,
    }));

    try {
      await fetch("/api/research/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ gameSlug, phase, answers: payload }),
      });
    } catch (err) {
      console.error("Quiz submit error:", err);
    }

    setSubmitted(true);
  };

  const score = submitted
    ? questions.filter((q) => answers[q.id] === q.correct).length
    : 0;

  const isPre = phase === "pre";

  return (
    <div className="quiz-screen" style={{ "--game-color": gameColor }}>
      <div className="quiz-inner">
        <span className="quiz-badge">{isPre ? "KNOWLEDGE CHECK" : "POST-GAME QUIZ"}</span>
        <h2 className="quiz-heading">
          {isPre ? "Quick Knowledge Check" : "What Did You Learn?"}
        </h2>
        <p className="quiz-desc">
          {isPre
            ? "Before you start playing, let's see what you already know about cybersecurity. This only appears once."
            : "A couple of questions about what this game just covered."}
        </p>

        {questions.map((q, qi) => (
          <div className="quiz-question" key={q.id}>
            <div className="quiz-q-number">QUESTION {qi + 1} OF {questions.length}</div>
            <div className="quiz-q-text">{q.question}</div>
            <div className="quiz-options">
              {q.options.map((opt, oi) => {
                let cls = "quiz-option";
                if (answers[q.id] === oi) cls += " selected";
                if (submitted && oi === q.correct) cls += " correct";
                if (submitted && answers[q.id] === oi && oi !== q.correct) cls += " incorrect";
                return (
                  <div key={oi} className={cls} onClick={() => handleSelect(q.id, oi)}>
                    <div className="quiz-radio" />
                    <span className="quiz-option-text">{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!submitted ? (
          <button className="quiz-submit" disabled={!allAnswered} onClick={handleSubmit}>
            SUBMIT ANSWERS
          </button>
        ) : (
          <div className="quiz-result">
            <div className="quiz-score">
              You got {score} / {questions.length} correct
            </div>
            <p className="quiz-result-note">
              {isPre
                ? "Great — now let's see how the games change your answers!"
                : "Thanks for completing the quiz!"}
            </p>
            <button className="quiz-submit" onClick={() => onComplete(score)}>
              {isPre ? "START PLAYING" : "CONTINUE"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizScreen;
