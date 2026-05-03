import Database from 'better-sqlite3';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distPath = path.join(projectRoot, 'dist');
const port = Number(process.env.PORT || 3000);
const databasePath = process.env.DATABASE_PATH || path.join(projectRoot, 'data', 'tracking.sqlite');

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    device_type TEXT NOT NULL CHECK(device_type IN ('desktop', 'mobile')),
    started_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    ended_at TEXT,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS section_dwell_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL,
    section_label TEXT NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT NOT NULL,
    duration_ms INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_section_dwell_session
    ON section_dwell_events(session_id);

  CREATE INDEX IF NOT EXISTS idx_section_dwell_section
    ON section_dwell_events(section_id);

  CREATE TABLE IF NOT EXISTS heatmap_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    section_id TEXT,
    sampled_at TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    page_x INTEGER NOT NULL,
    page_y INTEGER NOT NULL,
    scroll_x INTEGER NOT NULL,
    scroll_y INTEGER NOT NULL,
    viewport_width INTEGER NOT NULL,
    viewport_height INTEGER NOT NULL,
    document_width INTEGER NOT NULL,
    document_height INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_heatmap_session
    ON heatmap_points(session_id);

  CREATE INDEX IF NOT EXISTS idx_heatmap_section
    ON heatmap_points(section_id);
`);

const nonEmptyString = z.string().trim().min(1).max(200);
const isoDateString = z.string().datetime();
const boundedInteger = z.number().int().min(0).max(86_400_000);
const coordinate = z.number().int().min(0).max(1_000_000);

const sectionEventSchema = z.object({
  sectionId: nonEmptyString,
  sectionLabel: nonEmptyString,
  startedAt: isoDateString,
  endedAt: isoDateString,
  durationMs: boundedInteger,
});

const heatmapPointSchema = z.object({
  sectionId: z.string().trim().min(1).max(200).nullable(),
  sampledAt: isoDateString,
  x: coordinate,
  y: coordinate,
  pageX: coordinate,
  pageY: coordinate,
  scrollX: coordinate,
  scrollY: coordinate,
  viewportWidth: z.number().int().min(1).max(20_000),
  viewportHeight: z.number().int().min(1).max(20_000),
  documentWidth: z.number().int().min(1).max(200_000),
  documentHeight: z.number().int().min(1).max(200_000),
});

const trackingPayloadSchema = z.object({
  sessionId: z.string().trim().min(8).max(120),
  deviceType: z.enum(['desktop', 'mobile']),
  sessionStartedAt: isoDateString,
  sessionDurationMs: boundedInteger,
  sentAt: isoDateString,
  final: z.boolean().optional(),
  sectionEvents: z.array(sectionEventSchema).max(100).default([]),
  heatmapPoints: z.array(heatmapPointSchema).max(100).default([]),
});

const upsertSession = db.prepare(`
  INSERT INTO sessions (id, device_type, started_at, last_seen_at, ended_at, duration_ms, updated_at)
  VALUES (@id, @deviceType, @startedAt, @lastSeenAt, @endedAt, @durationMs, CURRENT_TIMESTAMP)
  ON CONFLICT(id) DO UPDATE SET
    device_type = excluded.device_type,
    last_seen_at = excluded.last_seen_at,
    ended_at = COALESCE(excluded.ended_at, sessions.ended_at),
    duration_ms = MAX(sessions.duration_ms, excluded.duration_ms),
    updated_at = CURRENT_TIMESTAMP
`);

const insertSectionEvent = db.prepare(`
  INSERT INTO section_dwell_events (
    session_id,
    section_id,
    section_label,
    started_at,
    ended_at,
    duration_ms
  )
  VALUES (@sessionId, @sectionId, @sectionLabel, @startedAt, @endedAt, @durationMs)
`);

const insertHeatmapPoint = db.prepare(`
  INSERT INTO heatmap_points (
    session_id,
    section_id,
    sampled_at,
    x,
    y,
    page_x,
    page_y,
    scroll_x,
    scroll_y,
    viewport_width,
    viewport_height,
    document_width,
    document_height
  )
  VALUES (
    @sessionId,
    @sectionId,
    @sampledAt,
    @x,
    @y,
    @pageX,
    @pageY,
    @scrollX,
    @scrollY,
    @viewportWidth,
    @viewportHeight,
    @documentWidth,
    @documentHeight
  )
`);

const storeTrackingBatch = db.transaction((payload: z.infer<typeof trackingPayloadSchema>) => {
  upsertSession.run({
    id: payload.sessionId,
    deviceType: payload.deviceType,
    startedAt: payload.sessionStartedAt,
    lastSeenAt: payload.sentAt,
    endedAt: payload.final ? payload.sentAt : null,
    durationMs: payload.sessionDurationMs,
  });

  for (const event of payload.sectionEvents) {
    insertSectionEvent.run({
      sessionId: payload.sessionId,
      ...event,
    });
  }

  if (payload.deviceType !== 'desktop') return;

  for (const point of payload.heatmapPoints) {
    insertHeatmapPoint.run({
      sessionId: payload.sessionId,
      ...point,
    });
  }
});

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/api/tracking/batch', (request, response) => {
  const result = trackingPayloadSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({
      error: 'Invalid tracking payload',
      details: result.error.flatten(),
    });
    return;
  }

  storeTrackingBatch(result.data);
  response.status(204).end();
});

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_request, response) => {
    response.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`NeuroBotanica server listening on http://localhost:${port}`);
  console.log(`Tracking database: ${databasePath}`);
});
