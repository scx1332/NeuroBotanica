import { getCurrentSectionName, getCurrentSectionRect } from './sections';

export type HeatPoint = {
  section: string;
  xNorm: number;
  yNorm: number;
  t: number;
};

let lastX = -1;
let lastY = -1;
let buffer: HeatPoint[] = [];
let timer: number | null = null;

export function isDesktopPointer(): boolean {
  if (typeof window === 'undefined') return false;
  const finePointer = window.matchMedia?.('(pointer: fine)').matches ?? false;
  const wideEnough = window.innerWidth >= 768;
  return finePointer && wideEnough;
}

function onMouseMove(e: MouseEvent) {
  lastX = e.clientX;
  lastY = e.clientY;
}

function snapshot() {
  if (lastX < 0 || lastY < 0) return;
  if (document.visibilityState !== 'visible') return;

  const section = getCurrentSectionName();
  const rect = getCurrentSectionRect();
  if (!section || !rect || rect.width === 0 || rect.height === 0) return;

  // Only count samples that actually fall inside the visible section bounds.
  const localX = lastX - rect.left;
  const localY = lastY - rect.top;
  if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) return;

  buffer.push({
    section,
    xNorm: +(localX / rect.width).toFixed(4),
    yNorm: +(localY / rect.height).toFixed(4),
    t: Date.now()
  });

  // Hard cap to keep memory bounded if the network is slow.
  if (buffer.length > 5000) buffer.splice(0, buffer.length - 5000);
}

export function startHeatmap(): void {
  if (timer !== null) return;
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  timer = window.setInterval(snapshot, 1000);
}

export function drainPoints(): HeatPoint[] {
  const out = buffer;
  buffer = [];
  return out;
}
