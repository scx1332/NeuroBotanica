const SESSION_KEY = 'nb_session_id';
const STARTED_KEY = 'nb_session_started';

let sessionId: string | null = null;
let startedAt = 0;
let device: 'desktop' | 'mobile' = 'desktop';

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function createSession(deviceKind: 'desktop' | 'mobile'): Promise<string> {
  device = deviceKind;
  const stored = sessionStorage.getItem(SESSION_KEY);
  const storedStarted = Number(sessionStorage.getItem(STARTED_KEY));

  if (stored && storedStarted) {
    sessionId = stored;
    startedAt = storedStarted;
  } else {
    sessionId = uuid();
    startedAt = Date.now();
    sessionStorage.setItem(SESSION_KEY, sessionId);
    sessionStorage.setItem(STARTED_KEY, String(startedAt));
  }

  try {
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        startedAt,
        device,
        viewport: { w: window.innerWidth, h: window.innerHeight },
        userAgent: navigator.userAgent.slice(0, 256),
        referrer: document.referrer.slice(0, 512)
      }),
      keepalive: true
    });
  } catch {
    // network failures are fine; the next /api/track call will still register the session
  }
  return sessionId;
}

export function getSessionId(): string | null {
  return sessionId;
}

export function endSession(): void {
  if (!sessionId) return;
  const lengthMs = Date.now() - startedAt;
  const payload = JSON.stringify({ sessionId, lengthMs });
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/session/end', blob);
  }
}
