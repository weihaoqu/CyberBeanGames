import { Router } from "express";
import crypto from "crypto";
import db from "../db/index.js";

const router = Router();

// Helper: generate UUID
const uuid = () => crypto.randomUUID();

// ── Admin Auth ──
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cyberbeans2026";
const TOKEN_SECRET = process.env.TOKEN_SECRET || crypto.randomBytes(32).toString("hex");

function createToken() {
  const payload = Date.now().toString();
  const hmac = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

function verifyToken(token) {
  if (!token) return false;
  const [payload, hmac] = token.split(".");
  if (!payload || !hmac) return false;
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expected, "hex"));
}

function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    if (!verifyToken(auth.slice(7))) {
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
  next();
}

// ── POST /admin/login ──
router.post("/admin/login", (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }
  res.json({ token: createToken() });
});

// ── GET /admin/stats ──
router.get("/admin/stats", adminAuth, (req, res) => {
  const participants = db.prepare("SELECT COUNT(*) AS count FROM participants").get().count;
  const sessions = db.prepare("SELECT COUNT(*) AS count FROM game_sessions").get().count;
  const events = db.prepare("SELECT COUNT(*) AS count FROM game_events").get().count;
  const feedbackCount = db.prepare("SELECT COUNT(*) AS count FROM feedback").get().count;
  const avgRow = db.prepare("SELECT AVG(rating) AS avg FROM feedback WHERE rating IS NOT NULL").get();
  const avgRating = avgRow.avg ? Math.round(avgRow.avg * 10) / 10 : null;
  const demographics = db.prepare("SELECT COUNT(*) AS count FROM demographics").get().count;
  const quizResponses = db.prepare("SELECT COUNT(*) AS count FROM quiz_responses").get().count;
  const exitSurveys = db.prepare("SELECT COUNT(*) AS count FROM exit_survey").get().count;
  res.json({ participants, sessions, events, feedback: feedbackCount, avgRating, demographics, quizResponses, exitSurveys });
});

// ── GET /admin/participants ──
router.get("/admin/participants", adminAuth, (req, res) => {
  res.json(db.prepare("SELECT * FROM participants ORDER BY id DESC").all());
});

// ── GET /admin/sessions ──
router.get("/admin/sessions", adminAuth, (req, res) => {
  res.json(db.prepare("SELECT * FROM game_sessions ORDER BY id DESC").all());
});

// ── GET /admin/events ──
router.get("/admin/events", adminAuth, (req, res) => {
  res.json(db.prepare("SELECT * FROM game_events ORDER BY id DESC").all());
});

// ── GET /admin/feedback ──
router.get("/admin/feedback", adminAuth, (req, res) => {
  res.json(db.prepare("SELECT * FROM feedback ORDER BY id DESC").all());
});

// ── GET /admin/demographics ──
router.get("/admin/demographics", adminAuth, (req, res) => {
  res.json(db.prepare("SELECT * FROM demographics ORDER BY id DESC").all());
});

// ── GET /admin/quiz_responses ──
router.get("/admin/quiz_responses", adminAuth, (req, res) => {
  res.json(db.prepare("SELECT * FROM quiz_responses ORDER BY id DESC").all());
});

// ── GET /admin/exit_survey ──
router.get("/admin/exit_survey", adminAuth, (req, res) => {
  res.json(db.prepare("SELECT * FROM exit_survey ORDER BY id DESC").all());
});

// Cookie options
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  path: "/",
};

// ── GET /player-progress ──
// Returns how many games this participant has completed + exit survey status
router.get("/player-progress", (req, res) => {
  const participantId = req.cookies.research_participant;
  if (!participantId) return res.json({ gamesPlayed: 0, exitSurveyDone: false });

  const gamesPlayed = db.prepare(
    "SELECT COUNT(DISTINCT game_slug) AS c FROM game_sessions WHERE participant_id = ? AND ended_at IS NOT NULL"
  ).get(participantId).c;
  const exitDone = !!db.prepare(
    "SELECT id FROM exit_survey WHERE participant_id = ?"
  ).get(participantId);

  res.json({ gamesPlayed, exitSurveyDone: exitDone });
});

// ── GET /consent-status ──
// Check if user already has a consent cookie
router.get("/consent-status", (req, res) => {
  const participantId = req.cookies.research_participant;
  const consent = req.cookies.research_consent;

  if (participantId && consent) {
    return res.json({ consented: true, participantId, status: consent });
  }
  res.json({ consented: false });
});

// ── POST /consent ──
// Record consent choice, set cookies
router.post("/consent", (req, res) => {
  const { status } = req.body; // 'accepted' | 'declined'
  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid consent status" });
  }

  // Reuse existing participant ID if cookie exists, otherwise create new
  let participantId = req.cookies.research_participant || uuid();

  const stmt = db.prepare(`
    INSERT INTO participants (participant_id, consent_status, user_agent)
    VALUES (?, ?, ?)
    ON CONFLICT(participant_id) DO UPDATE SET
      consent_status = excluded.consent_status,
      consent_timestamp = CURRENT_TIMESTAMP
  `);
  stmt.run(participantId, status, req.headers["user-agent"] || "");

  res.cookie("research_participant", participantId, COOKIE_OPTS);
  res.cookie("research_consent", status, COOKIE_OPTS);

  res.json({ participantId, status });
});

// ── POST /session/start ──
// Begin a game session
router.post("/session/start", (req, res) => {
  const { gameSlug, viewedTutorial } = req.body;
  const participantId = req.cookies.research_participant;

  if (!participantId) {
    return res.status(400).json({ error: "No participant ID" });
  }
  if (!gameSlug) {
    return res.status(400).json({ error: "Missing gameSlug" });
  }

  const sessionId = uuid();
  const stmt = db.prepare(`
    INSERT INTO game_sessions (session_id, participant_id, game_slug, viewed_tutorial)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(sessionId, participantId, gameSlug, viewedTutorial ? 1 : 0);

  res.json({ sessionId });
});

// ── POST /session/end ──
// End a game session, calculate duration
router.post("/session/end", (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  const stmt = db.prepare(`
    UPDATE game_sessions
    SET ended_at = CURRENT_TIMESTAMP,
        time_spent_seconds = CAST((julianday(CURRENT_TIMESTAMP) - julianday(started_at)) * 86400 AS INTEGER)
    WHERE session_id = ?
  `);
  const result = stmt.run(sessionId);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Session not found" });
  }
  res.json({ success: true });
});

// ── POST /game-event ──
// Store a game event (score, completion, etc.)
router.post("/game-event", (req, res) => {
  const { sessionId, eventType, eventData } = req.body;
  if (!sessionId || !eventType) {
    return res.status(400).json({ error: "Missing sessionId or eventType" });
  }

  const stmt = db.prepare(`
    INSERT INTO game_events (session_id, event_type, event_data)
    VALUES (?, ?, ?)
  `);
  stmt.run(sessionId, eventType, JSON.stringify(eventData || {}));

  res.json({ success: true });
});

// ── POST /feedback ──
// Store feedback rating + comment
router.post("/feedback", (req, res) => {
  const { sessionId, rating, comment } = req.body;
  const participantId = req.cookies.research_participant;

  if (!sessionId || !participantId) {
    return res.status(400).json({ error: "Missing sessionId or participant" });
  }
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: "Rating must be 1-5" });
  }

  const stmt = db.prepare(`
    INSERT INTO feedback (session_id, participant_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(sessionId, participantId, rating || null, comment || null);

  res.json({ success: true });
});

// ── GET /demographics-status ──
router.get("/demographics-status", (req, res) => {
  const participantId = req.cookies.research_participant;
  if (!participantId) return res.json({ completed: false });
  const row = db.prepare("SELECT id FROM demographics WHERE participant_id = ?").get(participantId);
  res.json({ completed: !!row });
});

// ── POST /demographics ──
router.post("/demographics", (req, res) => {
  const participantId = req.cookies.research_participant;
  if (!participantId) return res.status(400).json({ error: "No participant ID" });

  const { ageRange, field, cyberKnowledge, priorTraining } = req.body;
  if (!ageRange || !field || !cyberKnowledge) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const stmt = db.prepare(`
    INSERT INTO demographics (participant_id, age_range, field, cyber_knowledge, prior_training)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(participant_id) DO UPDATE SET
      age_range = excluded.age_range, field = excluded.field,
      cyber_knowledge = excluded.cyber_knowledge, prior_training = excluded.prior_training
  `);
  stmt.run(participantId, ageRange, field, cyberKnowledge, priorTraining ? 1 : 0);
  res.json({ success: true });
});

// ── GET /quiz-status/:gameSlug ──
router.get("/quiz-status/:gameSlug", (req, res) => {
  const participantId = req.cookies.research_participant;
  if (!participantId) return res.json({ pre: false, post: false });

  const pre = db.prepare(
    "SELECT COUNT(*) AS c FROM quiz_responses WHERE participant_id = ? AND game_slug = ? AND phase = 'pre'"
  ).get(participantId, req.params.gameSlug);
  const post = db.prepare(
    "SELECT COUNT(*) AS c FROM quiz_responses WHERE participant_id = ? AND game_slug = ? AND phase = 'post'"
  ).get(participantId, req.params.gameSlug);

  res.json({ pre: pre.c > 0, post: post.c > 0 });
});

// ── POST /quiz ──
router.post("/quiz", (req, res) => {
  const participantId = req.cookies.research_participant;
  if (!participantId) return res.status(400).json({ error: "No participant ID" });

  const { gameSlug, phase, answers } = req.body;
  if (!gameSlug || !phase || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const stmt = db.prepare(`
    INSERT INTO quiz_responses (participant_id, game_slug, phase, question_id, selected_answer, is_correct)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertAll = db.transaction((rows) => {
    for (const a of rows) {
      stmt.run(participantId, gameSlug, phase, a.questionId, a.selectedAnswer, a.isCorrect ? 1 : 0);
    }
  });
  insertAll(answers);

  res.json({ success: true });
});

// ── GET /exit-survey-status ──
router.get("/exit-survey-status", (req, res) => {
  const participantId = req.cookies.research_participant;
  if (!participantId) return res.json({ completed: false });
  const row = db.prepare("SELECT id FROM exit_survey WHERE participant_id = ?").get(participantId);
  res.json({ completed: !!row });
});

// ── POST /exit-survey ──
router.post("/exit-survey", (req, res) => {
  const participantId = req.cookies.research_participant;
  if (!participantId) return res.status(400).json({ error: "No participant ID" });

  const { sus, mostEducational, mostEnjoyable, wouldRecommend, improvementComment } = req.body;
  if (!sus || sus.length !== 10) {
    return res.status(400).json({ error: "SUS must have 10 responses" });
  }

  const stmt = db.prepare(`
    INSERT INTO exit_survey (participant_id, sus_1, sus_2, sus_3, sus_4, sus_5,
      sus_6, sus_7, sus_8, sus_9, sus_10, most_educational, most_enjoyable,
      would_recommend, improvement_comment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(participant_id) DO UPDATE SET
      sus_1=excluded.sus_1, sus_2=excluded.sus_2, sus_3=excluded.sus_3,
      sus_4=excluded.sus_4, sus_5=excluded.sus_5, sus_6=excluded.sus_6,
      sus_7=excluded.sus_7, sus_8=excluded.sus_8, sus_9=excluded.sus_9,
      sus_10=excluded.sus_10, most_educational=excluded.most_educational,
      most_enjoyable=excluded.most_enjoyable, would_recommend=excluded.would_recommend,
      improvement_comment=excluded.improvement_comment
  `);
  stmt.run(
    participantId, ...sus,
    mostEducational || null, mostEnjoyable || null,
    wouldRecommend || null, improvementComment || null
  );
  res.json({ success: true });
});

export default router;
