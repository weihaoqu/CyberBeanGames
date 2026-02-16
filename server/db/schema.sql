CREATE TABLE IF NOT EXISTS participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT UNIQUE NOT NULL,
  consent_status TEXT NOT NULL,
  consent_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  participant_id TEXT NOT NULL,
  game_slug TEXT NOT NULL,
  viewed_tutorial BOOLEAN DEFAULT 0,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,
  time_spent_seconds INTEGER
);

CREATE TABLE IF NOT EXISTS game_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS demographics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT UNIQUE NOT NULL,
  age_range TEXT NOT NULL,
  field TEXT NOT NULL,
  cyber_knowledge INTEGER CHECK(cyber_knowledge BETWEEN 1 AND 5),
  prior_training INTEGER DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT NOT NULL,
  game_slug TEXT NOT NULL,
  phase TEXT NOT NULL CHECK(phase IN ('pre', 'post')),
  question_id TEXT NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exit_survey (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT UNIQUE NOT NULL,
  sus_1 INTEGER, sus_2 INTEGER, sus_3 INTEGER, sus_4 INTEGER, sus_5 INTEGER,
  sus_6 INTEGER, sus_7 INTEGER, sus_8 INTEGER, sus_9 INTEGER, sus_10 INTEGER,
  most_educational TEXT,
  most_enjoyable TEXT,
  would_recommend INTEGER CHECK(would_recommend BETWEEN 1 AND 5),
  improvement_comment TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS creator_survey (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  game_slug TEXT NOT NULL,
  team_size INTEGER,
  concept_choice TEXT,
  concept_translation TEXT,
  learning_impact TEXT,
  learning_example TEXT,
  ai_tools_used TEXT,
  ai_workflow TEXT,
  ai_security_accuracy TEXT,
  peer_learning TEXT,
  design_challenge TEXT,
  fun_vs_accuracy TEXT,
  knowledge_before INTEGER CHECK(knowledge_before BETWEEN 1 AND 5),
  knowledge_after INTEGER CHECK(knowledge_after BETWEEN 1 AND 5),
  ai_reliance_logic INTEGER CHECK(ai_reliance_logic BETWEEN 1 AND 5),
  ai_reliance_ui INTEGER CHECK(ai_reliance_ui BETWEEN 1 AND 5),
  ai_reliance_security INTEGER CHECK(ai_reliance_security BETWEEN 1 AND 5),
  ai_reliance_testing INTEGER CHECK(ai_reliance_testing BETWEEN 1 AND 5),
  recommend_assignment INTEGER CHECK(recommend_assignment BETWEEN 1 AND 5),
  additional_comments TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
