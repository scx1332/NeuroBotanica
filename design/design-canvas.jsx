// NeuroBotanica logo canvas — composes 6 mark explorations + cover + system artboards.

const { useState } = React;

function Wordmark({ size = 38, dark = false }) {
  return (
    <div className="wordmark" style={{ fontSize: size, color: dark ? 'var(--cream)' : 'var(--ink)' }}>
      neuro<span className="accent">botanica</span>
    </div>
  );
}

function MarkArtboard({ markDef, idx }) {
  const M = markDef.Component;
  return (
    <div className="artboard">
      {/* HERO */}
      <div className="hero">
        <div className="lockup" style={{ alignItems: 'center' }}>
          <M className="mark" style={{ width: 96, height: 96, color: 'var(--ink)' }}
             accent="var(--accent-deep)" ink="var(--ink)" />
          <div>
            <Wordmark size={44} />
            <div className="tagline">organize · gently</div>
          </div>
        </div>

        {/* mark alone, larger */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 36 }}>
          <M style={{ width: 140, height: 140, color: 'var(--ink)' }}
             accent="var(--accent-deep)" ink="var(--ink)" />
          <div style={{ width: 1, height: 90, background: 'rgba(42,39,36,0.12)' }} />
          <M style={{ width: 140, height: 140, color: 'var(--accent-deep)' }}
             accent="var(--accent-deep)" ink="var(--accent-deep)" />
        </div>
      </div>

      {/* CONTEXT STRIP */}
      <div>
        <div className="strip">
          <div className="ctx cream">
            <span className="ctx-label">Mono · ink</span>
            <div className="lockup">
              <M className="mark sm" style={{ width: 36, height: 36, color: 'var(--ink)' }}
                 accent="var(--ink)" ink="var(--ink)" />
              <div className="wordmark" style={{ fontSize: 20 }}>
                neuro<span style={{ fontWeight: 500 }}>botanica</span>
              </div>
            </div>
          </div>

          <div className="ctx sand">
            <span className="ctx-label">Two-color</span>
            <div className="lockup">
              <M className="mark sm" style={{ width: 36, height: 36 }}
                 accent="var(--accent-deep)" ink="var(--ink)" />
              <Wordmark size={20} />
            </div>
          </div>

          <div className="ctx dark">
            <span className="ctx-label">Reverse</span>
            <div className="lockup">
              <M className="mark sm" style={{ width: 36, height: 36 }}
                 accent="oklch(0.78 0.09 145)" ink="var(--cream)" />
              <Wordmark size={20} dark />
            </div>
          </div>

          <div className="ctx cream" style={{ flexDirection: 'column' }}>
            <span className="ctx-label">App icon</span>
            <div className="ctx-favicon-frame">
              <M className="mark favicon" style={{ width: 34, height: 34 }}
                 accent="var(--cream)" ink="var(--cream)" />
            </div>
          </div>
        </div>

        <div className="notes">
          <div>
            <div className="name">{String(idx + 1).padStart(2,'0')} · {markDef.name}</div>
            <div className="desc">{markDef.desc}</div>
          </div>
          <div className="meta">
            96×96 GRID<br/>
            STROKE 5U · 1 ACCENT<br/>
            OKLCH(0.58 0.09 145)
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverArtboard() {
  return (
    <div className="cover">
      <div className="cover-top">
        <div className="cover-eyebrow">NeuroBotanica · Logo Exploration</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="cover-dot" />
          <div className="cover-eyebrow">v1 · 6 directions</div>
        </div>
      </div>

      <div className="cover-mid">
        <div className="cover-title">
          Quiet tools<br/>for a <span className="accent">busy mind.</span>
        </div>
        <div className="cover-sub">
          Six abstract botanical marks for NeuroBotanica — calm, geometric, low-stimulation.
          Built on a 96-unit grid in a single stroke weight, paired with a soft sage accent
          and warm neutral ground.
        </div>
      </div>

      <div className="cover-bot">
        <div className="cover-stat">
          <div className="k">For</div>
          <div className="v">Neurodivergent adults<br/>(ADHD · AuDHD)</div>
        </div>
        <div className="cover-stat">
          <div className="k">Tone</div>
          <div className="v">Scientific · precise<br/>Never overwhelming</div>
        </div>
        <div className="cover-stat">
          <div className="k">Form</div>
          <div className="v">Abstract geometric<br/>Botanical metaphor</div>
        </div>
        <div className="cover-stat">
          <div className="k">Palette</div>
          <div className="v">Warm neutrals<br/>+ one sage accent</div>
        </div>
      </div>
    </div>
  );
}

function SystemArtboard() {
  return (
    <div className="system">
      <div>
        <h2>Palette</h2>
        <div className="palette">
          <div className="swatch">
            <div className="chip" style={{ background: 'var(--cream)' }} />
            <div className="lab">Ground</div><div className="hex">#F5F1EA</div>
          </div>
          <div className="swatch">
            <div className="chip" style={{ background: 'var(--sand)' }} />
            <div className="lab">Sand</div><div className="hex">#E8E0D2</div>
          </div>
          <div className="swatch">
            <div className="chip" style={{ background: 'var(--ink)' }} />
            <div className="lab">Ink</div><div className="hex">#2A2724</div>
          </div>
          <div className="swatch">
            <div className="chip" style={{ background: 'var(--accent-deep)' }} />
            <div className="lab">Accent</div><div className="hex">oklch(.42 .08 145)</div>
          </div>
          <div className="swatch">
            <div className="chip" style={{ background: 'var(--accent-soft)' }} />
            <div className="lab">Accent · soft</div><div className="hex">oklch(.92 .03 145)</div>
          </div>
        </div>
      </div>

      <div>
        <h2>Type · Nunito</h2>
        <div className="typescale">
          <div>
            <div className="lvl">Display · 600</div>
            <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
              neuro<span style={{ color: 'var(--accent-deep)', fontWeight: 500 }}>botanica</span>
            </div>
          </div>
          <div>
            <div className="lvl">Heading · 600</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>Plan one thing today.</div>
          </div>
          <div>
            <div className="lvl">Body · 400</div>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-soft)', maxWidth: 420 }}>
              Simple, low-stimulation tools to help you organize life with ADHD or AuDHD.
              No overwhelming dashboards. No streaks to break.
            </div>
          </div>
          <div>
            <div className="lvl">Eyebrow · 600 · UPPER · +0.18em</div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              Organize · gently
            </div>
          </div>
        </div>
      </div>

      <div className="principles">
        <div className="item">
          <div className="num">01</div>
          <div className="title">Bilateral calm</div>
          <div className="desc">Symmetry where possible. Predictable shapes feel safer to a busy mind.</div>
        </div>
        <div className="item">
          <div className="num">02</div>
          <div className="title">One accent</div>
          <div className="desc">Color carries meaning. We use a single sage to mark the living, neural element.</div>
        </div>
        <div className="item">
          <div className="num">03</div>
          <div className="title">Generous space</div>
          <div className="desc">Marks breathe. Strokes are uniform. Nothing competes for attention.</div>
        </div>
        <div className="item">
          <div className="num">04</div>
          <div className="title">No noise</div>
          <div className="desc">No gradients, glows, or decorative flourishes. Quiet on every surface.</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const marks = window.MARKS;
  return (
    <DesignCanvas>
      <DCSection id="overview" title="Overview" subtitle="Brief, system, and surfaces">
        <DCArtboard id="cover" label="Cover" width={1280} height={800}>
          <CoverArtboard />
        </DCArtboard>
        <DCArtboard id="system" label="System · palette + type" width={1280} height={800}>
          <SystemArtboard />
        </DCArtboard>
      </DCSection>

      <DCSection id="marks" title="Logo directions" subtitle="Six abstract botanical marks — drag to reorder, double-click to focus">
        {marks.map((m, i) => (
          <DCArtboard
            key={m.id}
            id={m.id}
            label={`${String(i+1).padStart(2,'0')} · ${m.name}`}
            width={1280}
            height={800}
          >
            <MarkArtboard markDef={m} idx={i} />
          </DCArtboard>
        ))}
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
