import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const dbPath = process.env.DB_PATH ?? resolve(process.cwd(), '..', 'data', 'tracking.sqlite');
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

// WAL gives us much better write throughput for concurrent ingest, with no
// real downside for a single-node SQLite deployment.
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id            TEXT PRIMARY KEY,
    started_at    INTEGER NOT NULL,
    last_seen_at  INTEGER NOT NULL,
    ended_at      INTEGER,
    length_ms     INTEGER,
    device        TEXT NOT NULL,
    viewport_w    INTEGER,
    viewport_h    INTEGER,
    user_agent    TEXT,
    referrer      TEXT
  );

  CREATE TABLE IF NOT EXISTS section_views (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    section     TEXT NOT NULL,
    entered_at  INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS heatmap_points (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    section     TEXT NOT NULL,
    x_norm      REAL NOT NULL,
    y_norm      REAL NOT NULL,
    recorded_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_heatmap_section ON heatmap_points(section);
  CREATE INDEX IF NOT EXISTS idx_section_views_section ON section_views(section);
  CREATE INDEX IF NOT EXISTS idx_section_views_session ON section_views(session_id);
`);

export type SessionRow = {
  id: string;
  started_at: number;
  last_seen_at: number;
  ended_at: number | null;
  length_ms: number | null;
  device: string;
  viewport_w: number | null;
  viewport_h: number | null;
  user_agent: string | null;
  referrer: string | null;
};
