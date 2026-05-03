import { getSessionId } from './session';
import type { SectionView } from './sections';
import type { HeatPoint } from './heatmap';

type Drain = () => { sections: SectionView[]; points: HeatPoint[] };

const FLUSH_MS = 10_000;

let drainFn: Drain | null = null;
let timer: number | null = null;

async function flush() {
  const sessionId = getSessionId();
  if (!sessionId || !drainFn) return;
  const { sections, points } = drainFn();
  if (sections.length === 0 && points.length === 0) return;

  const body = JSON.stringify({ sessionId, sections, points });
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true
    });
  } catch {
    // Network blip — drop the batch rather than retry-spam. Heatmap is statistical;
    // a few lost samples don't matter and keeping a retry queue would risk duplicates.
  }
}

export function startTransport(drain: Drain): void {
  drainFn = drain;
  if (timer !== null) return;
  timer = window.setInterval(flush, FLUSH_MS);
}

export function flushNow(): void {
  void flush();
}

export function sendBeaconFlush(payload: { sections: SectionView[]; points: HeatPoint[] }): void {
  const sessionId = getSessionId();
  if (!sessionId) return;
  if (payload.sections.length === 0 && payload.points.length === 0) return;
  const body = JSON.stringify({ sessionId, ...payload });
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/track', blob);
  }
}
