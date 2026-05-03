import { useEffect, useRef } from 'react';

type DeviceType = 'desktop' | 'mobile';

type SectionState = {
  id: string;
  label: string;
};

type SectionDwellEvent = {
  sectionId: string;
  sectionLabel: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
};

type HeatmapPoint = {
  sectionId: string | null;
  sampledAt: string;
  x: number;
  y: number;
  pageX: number;
  pageY: number;
  scrollX: number;
  scrollY: number;
  viewportWidth: number;
  viewportHeight: number;
  documentWidth: number;
  documentHeight: number;
};

type TrackingPayload = {
  sessionId: string;
  deviceType: DeviceType;
  sessionStartedAt: string;
  sessionDurationMs: number;
  sentAt: string;
  final?: boolean;
  sectionEvents: SectionDwellEvent[];
  heatmapPoints: HeatmapPoint[];
};

const SESSION_KEY = 'neurobotanica.sessionId';
const FLUSH_INTERVAL_MS = 10_000;
const MOUSE_SAMPLE_INTERVAL_MS = 1_000;
const MIN_SECTION_DURATION_MS = 250;

function nowIso() {
  return new Date().toISOString();
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

function getSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const next = createSessionId();
  window.sessionStorage.setItem(SESSION_KEY, next);
  return next;
}

function getDeviceType(): DeviceType {
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const touchCapable = navigator.maxTouchPoints > 0;
  return coarsePointer || touchCapable || window.innerWidth < 768 ? 'mobile' : 'desktop';
}

function sectionFromElement(element: Element): SectionState {
  return {
    id: element.id || element.getAttribute('data-track-section') || 'unknown',
    label: element.getAttribute('data-section-label') || element.id || 'Unknown section',
  };
}

function findSectionAtPoint(x: number, y: number): string | null {
  const element = document.elementFromPoint(x, y);
  const section = element?.closest<HTMLElement>('[data-track-section]');
  return section?.id || section?.getAttribute('data-track-section') || null;
}

function sendTrackingPayload(payload: TrackingPayload) {
  const body = JSON.stringify(payload);

  if (payload.final && navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon('/api/tracking/batch', blob)) return;
  }

  void fetch('/api/tracking/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: payload.final,
  }).catch(() => {
    // Analytics is intentionally best-effort so it never interrupts the site.
  });
}

export function useAnonymousTracking() {
  const sessionIdRef = useRef<string | null>(null);
  const deviceTypeRef = useRef<DeviceType>('desktop');
  const sessionStartedAtRef = useRef('');
  const sessionStartMsRef = useRef(0);
  const activeSectionRef = useRef<SectionState | null>(null);
  const activeSectionStartedMsRef = useRef(0);
  const sectionQueueRef = useRef<SectionDwellEvent[]>([]);
  const heatmapQueueRef = useRef<HeatmapPoint[]>([]);
  const latestMouseRef = useRef<{ x: number; y: number } | null>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    sessionIdRef.current = getSessionId();
    deviceTypeRef.current = getDeviceType();
    sessionStartedAtRef.current = nowIso();
    sessionStartMsRef.current = Date.now();
    visibleRef.current = !document.hidden;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-track-section]'));
    if (sections.length === 0) return undefined;

    const visibleSections = new Map<Element, number>();

    const recordActiveSection = (endedAtMs: number) => {
      const active = activeSectionRef.current;
      if (!active) return;

      const durationMs = endedAtMs - activeSectionStartedMsRef.current;
      if (durationMs < MIN_SECTION_DURATION_MS) return;

      sectionQueueRef.current.push({
        sectionId: active.id,
        sectionLabel: active.label,
        startedAt: new Date(activeSectionStartedMsRef.current).toISOString(),
        endedAt: new Date(endedAtMs).toISOString(),
        durationMs,
      });
    };

    const activateSection = (section: SectionState | null, startedAtMs = Date.now()) => {
      const current = activeSectionRef.current;
      if (current?.id === section?.id) return;

      recordActiveSection(startedAtMs);
      activeSectionRef.current = section;
      activeSectionStartedMsRef.current = startedAtMs;
    };

    const pickMostVisibleSection = () => {
      let selected: Element | null = null;
      let selectedRatio = 0;

      visibleSections.forEach((ratio, element) => {
        if (ratio > selectedRatio) {
          selected = element;
          selectedRatio = ratio;
        }
      });

      return selected ? sectionFromElement(selected) : null;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleSections.set(entry.target, entry.intersectionRatio);
          else visibleSections.delete(entry.target);
        }

        if (visibleRef.current) activateSection(pickMostVisibleSection());
      },
      {
        threshold: [0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
      },
    );

    sections.forEach((section) => observer.observe(section));
    activateSection(sectionFromElement(sections[0]), Date.now());

    const flush = (final = false) => {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return;

      if (final && visibleRef.current) {
        recordActiveSection(Date.now());
        activeSectionStartedMsRef.current = Date.now();
      }

      const sectionEvents = sectionQueueRef.current.splice(0);
      const heatmapPoints = heatmapQueueRef.current.splice(0);

      if (!final && sectionEvents.length === 0 && heatmapPoints.length === 0) return;

      sendTrackingPayload({
        sessionId,
        deviceType: deviceTypeRef.current,
        sessionStartedAt: sessionStartedAtRef.current,
        sessionDurationMs: Date.now() - sessionStartMsRef.current,
        sentAt: nowIso(),
        final,
        sectionEvents,
        heatmapPoints,
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      latestMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const sampleMouse = () => {
      if (deviceTypeRef.current !== 'desktop' || document.hidden) return;
      const latest = latestMouseRef.current;
      if (!latest) return;

      const x = Math.round(latest.x);
      const y = Math.round(latest.y);
      const scrollX = Math.round(window.scrollX);
      const scrollY = Math.round(window.scrollY);

      heatmapQueueRef.current.push({
        sectionId: findSectionAtPoint(x, y),
        sampledAt: nowIso(),
        x,
        y,
        pageX: x + scrollX,
        pageY: y + scrollY,
        scrollX,
        scrollY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
      });
    };

    const onVisibilityChange = () => {
      const isVisible = !document.hidden;
      if (isVisible === visibleRef.current) return;

      const changedAtMs = Date.now();
      if (!isVisible) {
        recordActiveSection(changedAtMs);
        activeSectionRef.current = null;
        flush(true);
      } else {
        visibleRef.current = true;
        activateSection(pickMostVisibleSection(), changedAtMs);
        return;
      }

      visibleRef.current = isVisible;
    };

    const onPageHide = () => flush(true);
    const flushTimer = window.setInterval(() => flush(false), FLUSH_INTERVAL_MS);
    const mouseTimer = window.setInterval(sampleMouse, MOUSE_SAMPLE_INTERVAL_MS);

    if (deviceTypeRef.current === 'desktop') {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    flush(false);

    return () => {
      flush(true);
      observer.disconnect();
      window.clearInterval(flushTimer);
      window.clearInterval(mouseTimer);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, []);
}
