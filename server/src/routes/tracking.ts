import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';

export const trackingRouter: Router = Router();

const SessionInit = z.object({
  sessionId: z.string().min(8).max(64),
  startedAt: z.number().int().positive(),
  device: z.enum(['desktop', 'mobile']),
  viewport: z.object({ w: z.number().int().nonnegative(), h: z.number().int().nonnegative() }),
  userAgent: z.string().max(512).optional().default(''),
  referrer: z.string().max(1024).optional().default('')
});

const SectionView = z.object({
  name: z.string().min(1).max(64),
  enteredAt: z.number().int().positive(),
  durationMs: z.number().int().nonnegative().max(24 * 3600 * 1000)
});

const HeatPoint = z.object({
  section: z.string().min(1).max(64),
  xNorm: z.number().min(-0.05).max(1.05),
  yNorm: z.number().min(-0.05).max(1.05),
  t: z.number().int().positive()
});

const TrackBatch = z.object({
  sessionId: z.string().min(8).max(64),
  sections: z.array(SectionView).max(500).default([]),
  points: z.array(HeatPoint).max(5000).default([])
});

const SessionEnd = z.object({
  sessionId: z.string().min(8).max(64),
  lengthMs: z.number().int().nonnegative().max(24 * 3600 * 1000)
});

// Prepared statements — keep them at module scope so we don't re-prepare per request.
const upsertSession = db.prepare(`
  INSERT INTO sessions (id, started_at, last_seen_at, device, viewport_w, viewport_h, user_agent, referrer)
  VALUES (@id, @started_at, @last_seen_at, @device, @viewport_w, @viewport_h, @user_agent, @referrer)
  ON CONFLICT(id) DO UPDATE SET last_seen_at = excluded.last_seen_at
`);

const touchSession = db.prepare(`UPDATE sessions SET last_seen_at = ? WHERE id = ?`);

const insertSectionView = db.prepare(`
  INSERT INTO section_views (session_id, section, entered_at, duration_ms)
  VALUES (?, ?, ?, ?)
`);

const insertHeatPoint = db.prepare(`
  INSERT INTO heatmap_points (session_id, section, x_norm, y_norm, recorded_at)
  VALUES (?, ?, ?, ?, ?)
`);

const finishSession = db.prepare(`
  UPDATE sessions SET ended_at = ?, length_ms = ?, last_seen_at = ? WHERE id = ?
`);

const sessionExists = db.prepare(`SELECT 1 AS x FROM sessions WHERE id = ?`);

trackingRouter.post('/session', (req, res) => {
  const parsed = SessionInit.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_payload' });
  }
  const p = parsed.data;
  upsertSession.run({
    id: p.sessionId,
    started_at: p.startedAt,
    last_seen_at: Date.now(),
    device: p.device,
    viewport_w: p.viewport.w,
    viewport_h: p.viewport.h,
    user_agent: p.userAgent,
    referrer: p.referrer
  });
  res.json({ ok: true, id: p.sessionId });
});

trackingRouter.post('/session/end', (req, res) => {
  const parsed = SessionEnd.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_payload' });
  const { sessionId, lengthMs } = parsed.data;
  const now = Date.now();
  finishSession.run(now, lengthMs, now, sessionId);
  res.json({ ok: true });
});

trackingRouter.post('/track', (req, res) => {
  const parsed = TrackBatch.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_payload', issues: parsed.error.issues });
  }
  const { sessionId, sections, points } = parsed.data;

  const exists = sessionExists.get(sessionId) as { x: number } | undefined;
  if (!exists) {
    // Sometimes /api/track lands before /api/session (e.g. sendBeacon ordering on unload).
    // Insert a placeholder row so the FK doesn't blow up.
    upsertSession.run({
      id: sessionId,
      started_at: Date.now(),
      last_seen_at: Date.now(),
      device: 'unknown',
      viewport_w: null,
      viewport_h: null,
      user_agent: null,
      referrer: null
    });
  }

  const now = Date.now();
  const writeAll = db.transaction(() => {
    touchSession.run(now, sessionId);
    for (const s of sections) {
      insertSectionView.run(sessionId, s.name, s.enteredAt, s.durationMs);
    }
    for (const pt of points) {
      insertHeatPoint.run(sessionId, pt.section, pt.xNorm, pt.yNorm, pt.t);
    }
  });
  writeAll();

  res.json({ ok: true, accepted: { sections: sections.length, points: points.length } });
});
