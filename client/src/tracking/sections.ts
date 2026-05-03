export type SectionView = {
  name: string;
  enteredAt: number;
  durationMs: number;
};

type Active = { name: string; enteredAt: number };

let buffer: SectionView[] = [];
let currentVisible: Active | null = null;
let observer: IntersectionObserver | null = null;

function close(active: Active) {
  const durationMs = Date.now() - active.enteredAt;
  // Discard noise — anything under 250ms is almost certainly a fast scroll-through.
  if (durationMs >= 250) {
    buffer.push({ name: active.name, enteredAt: active.enteredAt, durationMs });
  }
}

export function startSectionTracking(): void {
  if (observer) return;

  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('[data-track-section]')
  );

  observer = new IntersectionObserver(
    entries => {
      // Find the entry with the largest visible ratio in this batch.
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      const name = visible?.target.getAttribute('data-track-section') ?? null;

      if (name === currentVisible?.name) return;

      if (currentVisible) close(currentVisible);
      currentVisible = name ? { name, enteredAt: Date.now() } : null;
    },
    { threshold: [0.25, 0.5, 0.75] }
  );

  for (const el of sections) observer.observe(el);
}

export function getCurrentSectionName(): string | null {
  return currentVisible?.name ?? null;
}

export function getCurrentSectionRect(): DOMRect | null {
  if (!currentVisible) return null;
  const el = document.querySelector<HTMLElement>(
    `[data-track-section="${currentVisible.name}"]`
  );
  return el?.getBoundingClientRect() ?? null;
}

export function drainSections(): SectionView[] {
  // Flush the *current* section's accumulated time too, then restart its timer
  // — otherwise a long visit to a single section would never report.
  if (currentVisible) {
    close(currentVisible);
    currentVisible = { name: currentVisible.name, enteredAt: Date.now() };
  }
  const out = buffer;
  buffer = [];
  return out;
}
