# NeuroBotanica

Vite, React, and TypeScript landing page for NeuroBotanica with a small Express backend that serves the built app and stores anonymous engagement tracking in SQLite.

## What is tracked

The client creates an anonymous per-tab session id in `sessionStorage`. It does not send names, email addresses, IP addresses, cookies, user-agent strings, or form data.

- Session id, device type, start time, latest seen time, final time, and session duration.
- Section dwell events with section id, section label, start/end timestamps, and duration.
- Desktop heatmap points sampled once per second and uploaded in 10 second batches.
- Mobile only sends session and section dwell events.

## Local development

Install dependencies:

```sh
npm install
```

Run the frontend and backend together:

```sh
npm run dev:full
```

The Vite dev server proxies `/api` to the backend on port `3000`.

## Production build

```sh
npm run build
npm start
```

The Express server serves `dist/` and writes SQLite data to `data/tracking.sqlite` by default.

Useful environment variables:

- `PORT`: HTTP port for the backend. Defaults to `3000`.
- `DATABASE_PATH`: SQLite database path. Defaults to `data/tracking.sqlite`.

## Database tables

- `sessions`: one row per anonymous tab session.
- `section_dwell_events`: append-only section timing events for section-level reporting.
- `heatmap_points`: desktop mouse samples with viewport, document, scroll, page, and section context for heatmap generation.
