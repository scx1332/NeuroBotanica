import { Router } from 'express';
import { db } from '../db.js';

export const statsRouter: Router = Router();

const totalsStmt = db.prepare(`
  SELECT
    COUNT(*) AS sessions,
    COALESCE(SUM(CASE WHEN device = 'desktop' THEN 1 ELSE 0 END), 0) AS desktop,
    COALESCE(SUM(CASE WHEN device = 'mobile'  THEN 1 ELSE 0 END), 0) AS mobile,
    COALESCE(AVG(length_ms), 0) AS avg_length_ms
  FROM sessions
`);

const perSectionStmt = db.prepare(`
  SELECT
    section,
    COUNT(*) AS visits,
    SUM(duration_ms) AS total_ms,
    AVG(duration_ms) AS avg_ms
  FROM section_views
  GROUP BY section
  ORDER BY total_ms DESC
`);

const heatmapStmt = db.prepare(`
  SELECT x_norm AS x, y_norm AS y
  FROM heatmap_points
  WHERE section = ?
  ORDER BY recorded_at DESC
  LIMIT ?
`);

const sectionListStmt = db.prepare(`
  SELECT DISTINCT section FROM heatmap_points
`);

statsRouter.get('/stats', (_req, res) => {
  const totals = totalsStmt.get() as {
    sessions: number;
    desktop: number;
    mobile: number;
    avg_length_ms: number;
  };
  const perSection = perSectionStmt.all() as Array<{
    section: string;
    visits: number;
    total_ms: number;
    avg_ms: number;
  }>;
  const sections = (sectionListStmt.all() as Array<{ section: string }>).map(r => r.section);
  res.json({
    sessions: totals.sessions,
    devices: { desktop: totals.desktop, mobile: totals.mobile },
    avgSessionMs: Math.round(totals.avg_length_ms),
    sections: perSection.map(s => ({
      section: s.section,
      visits: s.visits,
      totalMs: s.total_ms ?? 0,
      avgMs: Math.round(s.avg_ms ?? 0)
    })),
    heatmapSections: sections
  });
});

statsRouter.get('/heatmap/:section', (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20000) || 20000, 100000);
  const rows = heatmapStmt.all(req.params.section, limit) as Array<{ x: number; y: number }>;
  res.json({ section: req.params.section, points: rows });
});
