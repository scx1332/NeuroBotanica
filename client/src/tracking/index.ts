import { createSession, endSession } from './session';
import { startSectionTracking, drainSections } from './sections';
import { startHeatmap, drainPoints, isDesktopPointer } from './heatmap';
import { startTransport, flushNow, sendBeaconFlush } from './transport';

let started = false;

export function initTracking(): void {
  if (started) return;
  started = true;

  if (typeof window === 'undefined') return;

  // Honour the user's wish to opt out via Do Not Track.
  if (navigator.doNotTrack === '1') return;

  const desktop = isDesktopPointer();

  createSession(desktop ? 'desktop' : 'mobile').then(() => {
    startSectionTracking();
    if (desktop) startHeatmap();
    startTransport(() => ({
      sections: drainSections(),
      points: desktop ? drainPoints() : []
    }));
  });

  // Flush on tab hide / unload — sendBeacon is reliable here.
  const onHide = () => {
    if (document.visibilityState === 'hidden') {
      sendBeaconFlush({ sections: drainSections(), points: drainPoints() });
      endSession();
    }
  };
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', onHide);

  // Best-effort immediate flush whenever the page becomes visible again,
  // in case the previous flush was throttled.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') flushNow();
  });
}
