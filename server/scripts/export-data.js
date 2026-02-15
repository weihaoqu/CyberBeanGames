/**
 * Export research data to CSV files.
 * Only includes data from participants who accepted consent.
 *
 * Usage: node server/scripts/export-data.js [output-dir]
 */

import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = process.env.NODE_ENV === "production"
  ? "/app/data"
  : path.join(__dirname, "..", "data");

const dbPath = path.join(dataDir, "research.db");

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found at ${dbPath}`);
  process.exit(1);
}

const db = new Database(dbPath, { readonly: true });

const outputDir = process.argv[2] || path.join(dataDir, "exports");
fs.mkdirSync(outputDir, { recursive: true });

function toCsv(rows) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      headers.map((h) => {
        const val = row[h];
        if (val == null) return "";
        const str = String(val);
        // Escape fields containing commas, quotes, or newlines
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(",")
    );
  }
  return lines.join("\n") + "\n";
}

// Only export consented participants
const consentedIds = db
  .prepare("SELECT participant_id FROM participants WHERE consent_status = 'accepted'")
  .all()
  .map((r) => r.participant_id);

if (consentedIds.length === 0) {
  console.log("No consented participants found. Nothing to export.");
  process.exit(0);
}

const placeholders = consentedIds.map(() => "?").join(",");

// 1. Participants
const participants = db
  .prepare(`SELECT * FROM participants WHERE consent_status = 'accepted'`)
  .all();
fs.writeFileSync(path.join(outputDir, "participants.csv"), toCsv(participants));
console.log(`participants.csv: ${participants.length} rows`);

// 2. Sessions (only for consented participants)
const sessions = db
  .prepare(`SELECT * FROM game_sessions WHERE participant_id IN (${placeholders})`)
  .all(...consentedIds);
fs.writeFileSync(path.join(outputDir, "sessions.csv"), toCsv(sessions));
console.log(`sessions.csv: ${sessions.length} rows`);

// 3. Events (only for sessions belonging to consented participants)
const sessionIds = sessions.map((s) => s.session_id);
let events = [];
if (sessionIds.length > 0) {
  const ePlaceholders = sessionIds.map(() => "?").join(",");
  events = db
    .prepare(`SELECT * FROM game_events WHERE session_id IN (${ePlaceholders})`)
    .all(...sessionIds);
}
fs.writeFileSync(path.join(outputDir, "events.csv"), toCsv(events));
console.log(`events.csv: ${events.length} rows`);

// 4. Feedback (only for consented participants)
const feedback = db
  .prepare(`SELECT * FROM feedback WHERE participant_id IN (${placeholders})`)
  .all(...consentedIds);
fs.writeFileSync(path.join(outputDir, "feedback.csv"), toCsv(feedback));
console.log(`feedback.csv: ${feedback.length} rows`);

console.log(`\nExported to: ${outputDir}`);
db.close();
