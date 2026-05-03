import express from 'express';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { trackingRouter } from './routes/tracking.js';
import { statsRouter } from './routes/stats.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

// 1MB is more than enough for a tracking batch (5000 points + 500 sections fits comfortably).
app.use(express.json({ limit: '1mb', type: ['application/json', 'text/plain'] }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.use('/api', trackingRouter);
app.use('/api', statsRouter);

// Admin: simple static heatmap viewer.
const adminDir = resolve(__dirname, '..', 'src', 'admin');
const adminDistDir = resolve(__dirname, 'admin');
app.use('/admin', express.static(existsSync(adminDistDir) ? adminDistDir : adminDir));

// In production, serve the built React client from the same origin so deployment
// is "one node process + one sqlite file".
const clientDist = resolve(__dirname, '..', '..', 'client', 'dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api|\/admin).*/, (_req, res) => {
    res.sendFile(resolve(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[neurobotanica] api listening on http://localhost:${PORT}`);
  if (existsSync(clientDist)) {
    console.log(`[neurobotanica] serving client bundle from ${clientDist}`);
  } else {
    console.log(`[neurobotanica] no client bundle found — run "npm run build" or use vite dev (proxy)`);
  }
});
