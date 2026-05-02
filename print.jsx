<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>NeuroBotanica — Logo (Print)</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --cream: #F5F1EA;
    --cream-2: #EDE6D8;
    --sand: #E8E0D2;
    --ink: #2A2724;
    --ink-soft: #5A544C;
    --muted: #9A9286;
    --accent: oklch(0.58 0.09 145);
    --accent-soft: oklch(0.92 0.03 145);
    --accent-deep: oklch(0.42 0.08 145);
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #DCD4C4; font-family: 'Nunito', system-ui, sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .page {
    width: 1280px;
    height: 800px;
    margin: 24px auto;
    background: var(--cream);
    overflow: hidden;
    position: relative;
    page-break-after: always;
    break-after: page;
  }

  /* Artboard internals */
  .artboard {
    width: 100%; height: 100%;
    background: var(--cream);
    color: var(--ink);
    display: grid;
    grid-template-rows: 1fr auto;
    padding: 56px;
    gap: 40px;
  }
  .hero { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; }
  .lockup { display: flex; align-items: center; gap: 18px; }
  .wordmark { font-weight: 600; font-size: 38px; letter-spacing: -0.01em; color: var(--ink); line-height: 1; }
  .wordmark .accent { color: var(--accent-deep); font-weight: 500; }
  .tagline { font-size: 13px; color: var(--ink-soft); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; margin-top: 4px; }

  .strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .ctx { border-radius: 14px; padding: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; min-height: 130px; position: relative; }
  .ctx-label { position: absolute; top: 10px; left: 12px; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .ctx.cream { background: var(--cream-2); }
  .ctx.sand { background: var(--sand); }
  .ctx.dark { background: var(--ink); }
  .ctx.dark .ctx-label { color: #8A8278; }
  .ctx.dark .wordmark { color: var(--cream); }
  .ctx.dark .wordmark .accent { color: oklch(0.78 0.09 145); }
  .ctx-favicon-frame { width: 56px; height: 56px; background: var(--accent-deep); border-radius: 13px; display: flex; align-items: center; justify-content: center; }

  .notes { border-top: 1px solid rgba(42,39,36,0.08); padding-top: 18px; display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; font-size: 12px; color: var(--ink-soft); line-height: 1.55; }
  .notes .name { font-weight: 700; font-size: 13px; color: var(--ink); letter-spacing: 0.02em; margin-bottom: 4px; }
  .notes .desc { max-width: 480px; }
  .notes .meta { text-align: right; font-size: 11px; color: var(--muted); letter-spacing: 0.06em; }

  /* Cover */
  .cover { width: 100%; height: 100%; background: var(--cream); padding: 80px; display: grid; grid-template-rows: auto 1fr auto; gap: 40px; }
  .cover-top { display: flex; align-items: center; justify-content: space-between; }
  .cover-eyebrow { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink-soft); font-weight: 600; }
  .cover-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); }
  .cover-mid { display: flex; flex-direction: column; justify-content: center; gap: 24px; max-width: 720px; }
  .cover-title { font-size: 88px; font-weight: 600; line-height: 0.98; letter-spacing: -0.02em; color: var(--ink); }
  .cover-title .accent { color: var(--accent-deep); font-weight: 500; }
  .cover-sub { font-size: 19px; line-height: 1.5; color: var(--ink-soft); max-width: 560px; font-weight: 400; }
  .cover-bot { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; border-top: 1px solid rgba(42,39,36,0.1); padding-top: 28px; }
  .cover-stat .k { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-bottom: 6px; }
  .cover-stat .v { font-size: 14px; color: var(--ink); font-weight: 500; }

  /* System */
  .system { width: 100%; height: 100%; background: var(--cream); padding: 64px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto 1fr; gap: 40px; }
  .system h2 { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-soft); font-weight: 700; margin: 0 0 16px; }
  .palette { display: flex; gap: 12px; flex-wrap: wrap; }
  .swatch { width: 100px; }
  .swatch .chip { width: 100%; height: 100px; border-radius: 12px; border: 1px solid rgba(42,39,36,0.06); }
  .swatch .lab { font-size: 10px; color: var(--muted); margin-top: 8px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600; }
  .swatch .hex { font-size: 12px; color: var(--ink); font-weight: 500; margin-top: 2px; }
  .typescale > div { margin-bottom: 14px; color: var(--ink); }
  .typescale .lvl { font-size: 10px; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
  .principles { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; border-top: 1px solid rgba(42,39,36,0.08); padding-top: 24px; }
  .principles .item .num { font-size: 10px; color: var(--accent-deep); font-weight: 700; letter-spacing: 0.18em; margin-bottom: 6px; }
  .principles .item .title { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
  .principles .item .desc { font-size: 12px; color: var(--ink-soft); line-height: 1.5; }

  @page { size: 1280px 800px; margin: 0; }
  @media print {
    html, body { background: var(--cream); }
    .page { margin: 0; box-shadow: none; page-break-after: always; break-after: page; }
    .page:last-child { page-break-after: auto; break-after: auto; }
  }
</style>
</head>
<body>

<div id="root"></div>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

<script type="text/babel" src="marks.jsx"></script>
<script type="text/babel" src="print.jsx"></script>

</body>
</html>
