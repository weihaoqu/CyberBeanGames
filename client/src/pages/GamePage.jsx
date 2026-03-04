import { useParams, Link, useNavigate } from "react-router-dom";
import { useRef, useState, useCallback, useEffect, lazy, Suspense } from "react";
import games from "../data/games";
import postQuizzes, { generalPreQuiz } from "../data/quizData";
import DemographicsModal from "../components/DemographicsModal";
import QuizScreen from "../components/QuizScreen";
import PostGameSurvey from "../components/PostGameSurvey";
import "./GamePage.css";

function StepIndicator({ current, total, gameColor }) {
  return (
    <div className="step-indicator" style={{ "--game-color": gameColor }}>
      <span className="step-text">Step {current} of {total}</span>
      <div className="step-bar">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`step-dot${i < current ? " filled" : ""}`} />
        ))}
      </div>
    </div>
  );
}

// Lazy-load tutorial components
const tutorialComponents = {
  CyberAnalystTutorial: lazy(() => import("../components/tutorials/CyberAnalystTutorial")),
  PasswordChallengeTutorial: lazy(() => import("../components/tutorials/PasswordChallengeTutorial")),
  HackTheSystemTutorial: lazy(() => import("../components/tutorials/HackTheSystemTutorial")),
  AccessControlTutorial: lazy(() => import("../components/tutorials/AccessControlTutorial")),
  LabEscapeTutorial: lazy(() => import("../components/tutorials/LabEscapeTutorial")),
  PhishTankTutorial: lazy(() => import("../components/tutorials/PhishTankTutorial")),
};

function GamePage() {
  const { gameSlug } = useParams();
  const navigate = useNavigate();
  const game = games.find((g) => g.slug === gameSlug);
  const iframeContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Consent state
  const [consentLoading, setConsentLoading] = useState(true);
  const [consentAnswered, setConsentAnswered] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [participantId, setParticipantId] = useState(null);

  // Survey flow state
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [demoLoading, setDemoLoading] = useState(true);
  const [preQuizDone, setPreQuizDone] = useState(false);
  const [preQuizLoading, setPreQuizLoading] = useState(true);
  const [postQuizDone, setPostQuizDone] = useState(false);

  // Tutorial + game state
  const [showTutorial, setShowTutorial] = useState(true);
  const [viewedTutorial, setViewedTutorial] = useState(false);

  // Session tracking
  const [sessionId, setSessionId] = useState(null);
  const sessionIdRef = useRef(null);

  // Post-game survey
  const [showPostSurvey, setShowPostSurvey] = useState(false);

  // Iframe loading (#5)
  const [iframeLoading, setIframeLoading] = useState(true);

  const postQuestions = postQuizzes[gameSlug] || [];

  // ── Check consent status on mount ──
  useEffect(() => {
    fetch("/api/research/consent-status", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.consented) {
          setConsentAnswered(true);
          setParticipantId(data.participantId);
        }
      })
      .catch(() => {})
      .finally(() => setConsentLoading(false));
  }, []);

  // ── Check demographics + quiz status after consent ──
  useEffect(() => {
    if (!consentAnswered) return;

    fetch("/api/research/demographics-status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setDemoCompleted(d.completed))
      .catch(() => {})
      .finally(() => setDemoLoading(false));

    // Pre-quiz is general (once), post-quiz is per-game
    Promise.all([
      fetch("/api/research/quiz-status/general", { credentials: "include" }).then((r) => r.json()),
      gameSlug
        ? fetch(`/api/research/quiz-status/${gameSlug}`, { credentials: "include" }).then((r) => r.json())
        : Promise.resolve({ post: false }),
    ])
      .then(([gen, game]) => {
        setPreQuizDone(gen.pre);
        setPostQuizDone(game.post);
      })
      .catch(() => {})
      .finally(() => setPreQuizLoading(false));
  }, [consentAnswered, gameSlug]);

  // ── Handle consent choice (#4: error handling) ──
  const handleConsent = async (status) => {
    setConsentError("");
    try {
      const res = await fetch("/api/research/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setParticipantId(data.participantId);
      setConsentAnswered(true);
    } catch (err) {
      console.error("Consent error:", err);
      setConsentError("Something went wrong. Please check your connection and try again.");
    }
  };

  // ── Start game session (#2: gate duplicate session creation) ──
  const startGame = useCallback(async () => {
    // If already playing (viewed tutorial), just hide the tutorial overlay
    if (viewedTutorial) {
      setShowTutorial(false);
      return;
    }

    setViewedTutorial(true);
    setShowTutorial(false);

    try {
      const res = await fetch("/api/research/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ gameSlug: game?.slug, viewedTutorial: true, participantId }),
      });
      const data = await res.json();
      setSessionId(data.sessionId);
      sessionIdRef.current = data.sessionId;
    } catch (err) {
      console.error("Session start error:", err);
    }
  }, [game?.slug, viewedTutorial, participantId]);

  // ── Manually finish playing ──
  const handleFinishPlaying = useCallback(async () => {
    if (sessionIdRef.current) {
      try {
        await fetch("/api/research/session/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sessionId: sessionIdRef.current, participantId }),
        });
      } catch (err) {
        console.error("Session end error:", err);
      }
    }
    setShowPostSurvey(true);
  }, [participantId]);

  // ── End session on unmount (#3: include participantId in sendBeacon) ──
  useEffect(() => {
    return () => {
      if (sessionId) {
        const body = JSON.stringify({ sessionId, participantId });
        navigator.sendBeacon("/api/research/session/end", new Blob([body], { type: "application/json" }));
      }
    };
  }, [sessionId, participantId]);

  // ── Listen for postMessage from game iframes ──
  useEffect(() => {
    const handleMessage = async (e) => {
      if (e.data && e.data.type === "gameComplete") {
        const sid = sessionIdRef.current;
        if (sid) {
          try {
            await fetch("/api/research/game-event", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                sessionId: sid,
                eventType: e.data.success ? "completion" : "score",
                eventData: e.data,
              }),
            });
          } catch (err) {
            console.error("Game event error:", err);
          }
        }
        setShowPostSurvey(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ── Fullscreen ──
  const toggleFullscreen = useCallback(() => {
    const container = iframeContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // ── Toggle mobile-game-active class on body when game iframe is showing ──
  const isGameActive = !showTutorial && viewedTutorial && consentAnswered && demoCompleted && preQuizDone;
  useEffect(() => {
    if (isGameActive) {
      document.body.classList.add("mobile-game-active");
    } else {
      document.body.classList.remove("mobile-game-active");
    }
    return () => document.body.classList.remove("mobile-game-active");
  }, [isGameActive]);

  // ── Not found ──
  if (!game) {
    return (
      <div className="game-page">
        <div className="game-not-found">
          <h2>Game not found</h2>
          <Link to="/" className="back-btn">&larr; BACK TO ARCADE</Link>
        </div>
      </div>
    );
  }

  // ── Loading consent check ──
  if (consentLoading) {
    return (
      <div className="game-page">
        <div className="game-not-found">
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // ── Screen: Informed Consent (#1: collapsible sections) ──
  if (!consentAnswered) {
    return (
      <div className="game-page">
        <div className="game-header">
          <Link to="/" className="back-btn">&larr; BACK</Link>
          <div className="game-header-right">
            <div className="game-info">
              <span className="game-icon">{game.icon}</span>
              <div>
                <h1 className="game-title">{game.title}</h1>
                <p className="game-creator">by {game.creator}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="consent-screen" style={{ "--game-color": game.color }}>
          <div className="consent-content">
            <StepIndicator current={1} total={4} gameColor={game.color} />
            <h2 className="consent-heading">INFORMED CONSENT FOR:</h2>
            <h3 className="consent-study-title">
              Improving Cybersecurity Awareness Through Security Gamification Modules
            </h3>

            <div className="consent-investigators">
              <p>
                <strong>Principal Investigator:</strong> Weihao Qu, phone: 732-571-5396,
                Email: wqu@monmouth.edu
              </p>
              <p>
                <strong>Co-Investigator:</strong> Brian Callahan, phone: 732-571-4451,
                Email: bcallaha@monmouth.edu
              </p>
            </div>

            <p>You are being asked to be a participant in a research study.</p>

            <details className="consent-details">
              <summary>What is the purpose of this study?</summary>
              <p>
                The purpose of this study is to examine how interactive security gamification
                modules can improve awareness of phishing, online scams, and other digital
                threats among members of a mid-sized college community. The goal of this
                project is to design and test short, mobile-friendly game scenarios and
                follow-up learning activities that help students, staff, and faculty better
                recognize suspicious messages and practice safe online behaviors.
              </p>
            </details>

            <details className="consent-details">
              <summary>What will you have to do, if you agree to be in the study?</summary>
              <p>If you agree to participate:</p>
              <ul>
                <li>Complete a short pre-survey (2–3 minutes) before beginning the game module</li>
                <li>
                  Play a brief security-awareness game that simulates phishing and scam
                  scenarios (2–5 minutes)
                </li>
                <li>
                  Receive a follow-up survey by email about one month later (2–3 minutes)
                </li>
              </ul>
              <p>Your total participation time will be about 6–11 minutes.</p>
            </details>

            <details className="consent-details">
              <summary>Are there any possible risks to being in this study?</summary>
              <p>
                If you agree to be in this study, there are no foreseeable risks to you,
                above those that you experience in your daily life.
              </p>
            </details>

            <details className="consent-details">
              <summary>Are there any possible benefits to being in this study?</summary>
              <p>There is no direct benefit to you by participating in this study.</p>
            </details>

            <details className="consent-details">
              <summary>How will your study information be protected?</summary>
              <p>
                Your name will not be linked in any way to the information you provide. IP
                addresses will not be collected. The registered email will be collected
                during the online pre-survey in order to contact the participants with the
                post survey, which will be hidden and stored as a sequential number.
              </p>
              <p>
                Data will be collected using the Internet; no guarantees can be made
                regarding the interception of data sent via the Internet by any third party.
                Confidentiality will be maintained to the degree permitted by the technology
                used.
              </p>
              <p>
                Your information will be viewed by the study team and other people within
                Monmouth University who help administer and oversee research. If information
                from this study is published or presented at scientific meetings, your name
                and other identifiable information will not be used.
              </p>
            </details>

            <details className="consent-details">
              <summary>Important Contact Information</summary>
              <p>
                Please contact Dr. Weihao Qu at [732-571-5396] or via e-mail at
                [wqu@monmouth.edu] if you have any questions about the study, or if you
                believe you have experienced harm or injury as a result of being in this
                study.
              </p>
              <p>
                If your participation in this research study has caused you to feel
                uncomfortable in any way, or if by participating in this research study it
                has prompted you to consider personal matters about which you are concerned,
                we encourage you to immediately stop participating in this research study and
                strongly encourage you to contact support services. If you are a Monmouth
                University student, you can contact Monmouth University's Counseling and
                Psychological Services (CPS) to schedule a confidential appointment to speak
                to a counselor at (732-571-7517). If you are a Monmouth University employee,
                you can contact Monmouth University's Employee Assistance Program (EAP) at
                their confidential intake number at (1-800-300-0628).
              </p>
              <p>
                In addition, for any questions about your rights as a research participant,
                please contact the Monmouth University Institutional Review Board via e-mail
                at IRB@monmouth.edu.
              </p>
            </details>

            <details className="consent-details" open>
              <summary>Your participation is voluntary!</summary>
              <p>
                Your participation in this study is voluntary. You may decide not to
                participate at all or, if you start the study, you may withdraw at any time
                without any penalty. Withdrawal or refusing to participate will not affect
                your relationship with Monmouth University in any way.
              </p>
              <p>
                If you click the <strong>'I Accept'</strong> button below, it means that you
                have (a) read this consent form, (b) you agree to be a participant in this
                study, and (c) you are over 18 years old.
              </p>
              <p>
                If you click <strong>'I Do Not Agree'</strong>, you will still go through
                the steps listed within the purpose of the study, but your data will not be
                used for research purposes.
              </p>
            </details>

            <p className="consent-print-note">
              You may print or save a copy of this consent form for your records.
            </p>
          </div>

          {consentError && (
            <div className="consent-error">{consentError}</div>
          )}

          <div className="consent-actions">
            <button
              className="consent-btn consent-accept"
              style={{ background: game.color }}
              onClick={() => handleConsent("accepted")}
            >
              I ACCEPT
            </button>
            <button
              className="consent-btn consent-decline"
              style={{ "--game-color": game.color }}
              onClick={() => handleConsent("declined")}
            >
              I DO NOT AGREE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading demographics/quiz status ──
  if (demoLoading || preQuizLoading) {
    return (
      <div className="game-page">
        <div className="game-not-found">
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // ── Screen: Demographics (one-time) ──
  if (!demoCompleted) {
    return (
      <>
        <div className="game-page" />
        <DemographicsModal onComplete={() => setDemoCompleted(true)} />
      </>
    );
  }

  // ── Screen: General Pre-Quiz (one-time) ──
  if (!preQuizDone) {
    return (
      <div className="game-page">
        <div className="game-header">
          <Link to="/" className="back-btn">&larr; BACK</Link>
          <div className="game-header-right">
            <div className="game-info">
              <span className="game-icon">{game.icon}</span>
              <div>
                <h1 className="game-title">{game.title}</h1>
                <p className="game-creator">by {game.creator}</p>
              </div>
            </div>
          </div>
        </div>
        <QuizScreen
          phase="pre"
          gameSlug="general"
          gameColor={game.color}
          questions={generalPreQuiz}
          onComplete={() => setPreQuizDone(true)}
          stepIndicator={<StepIndicator current={3} total={4} gameColor={game.color} />}
        />
      </div>
    );
  }

  // ── Resolve tutorial component ──
  const TutorialComponent = game.tutorialComponent
    ? tutorialComponents[game.tutorialComponent]
    : null;

  // ── Screen: Tutorial or Game ──
  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/" className="back-btn">
          &larr; BACK
        </Link>
        <div className="game-header-right">
          {!showTutorial && (
            <>
              <button
                className="finish-btn"
                onClick={handleFinishPlaying}
                style={{ "--game-color": game.color }}
              >
                DONE PLAYING
              </button>
              <button
                className="tutorial-toggle-btn"
                onClick={() => setShowTutorial(true)}
                style={{ "--game-color": game.color }}
              >
                VIEW TUTORIAL
              </button>
              <button
                className="fullscreen-btn"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                style={{ "--game-color": game.color }}
              >
                {isFullscreen ? "⛶" : "⛶"}<span className="btn-label"> {isFullscreen ? "EXIT FS" : "FULLSCREEN"}</span>
              </button>
            </>
          )}
          <div className="game-info">
            <span className="game-icon">{game.icon}</span>
            <div>
              <h1 className="game-title">{game.title}</h1>
              <p className="game-creator">by {game.creator}</p>
            </div>
          </div>
        </div>
      </div>

      {showTutorial && game.tutorial ? (
        <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>Loading tutorial...</div>}>
          {TutorialComponent ? (
            <div className="tutorial-wrapper">
              <button className="skip-tutorial-btn" onClick={startGame} style={{ "--game-color": game.color }}>
                SKIP &rarr;
              </button>
              <TutorialComponent game={game} onStart={startGame} />
            </div>
          ) : (
            <div className="tutorial-screen" style={{ "--game-color": game.color }}>
              <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Tutorial loading...</p>
            </div>
          )}
        </Suspense>
      ) : (
        <div
          className="iframe-container"
          style={{ "--game-color": game.color }}
          ref={iframeContainerRef}
        >
          {iframeLoading && (
            <div className="iframe-loading-overlay">
              <div className="iframe-spinner" />
              <span className="iframe-loading-text">Loading game...</span>
            </div>
          )}
          <iframe
            src={game.path}
            title={game.title}
            className="game-iframe"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => setIframeLoading(false)}
          />
        </div>
      )}

      {showPostSurvey && (
        <PostGameSurvey
          gameColor={game.color}
          gameSlug={gameSlug}
          sessionId={sessionId}
          questions={postQuestions}
          quizDone={postQuizDone}
          onClose={() => navigate("/")}
        />
      )}
    </div>
  );
}

export default GamePage;
