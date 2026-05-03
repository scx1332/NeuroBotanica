export default function Hero() {
  return (
    <section id="top" className="section hero" data-track-section="hero">
      <div className="container">
        <div className="hero-inner">
          <img className="mark-lg" src="/images/synapse-leaf.svg" alt="" aria-hidden="true" />

          <h1>Quiet tools<br />for a <span className="accent">busy mind.</span></h1>

          <p className="lead">
            Simple, low-stimulation tools to help you organize life with ADHD or AuDHD.
            No overwhelming dashboards. No streaks to break.
          </p>

          <div className="cta-row">
            <a href="#start" className="btn btn-primary">Try the beta</a>
            <a href="#promise" className="btn btn-ghost">See how it feels</a>
          </div>

          <div className="tagline">organize · gently</div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>scroll</span>
        <span className="line"></span>
      </div>
    </section>
  );
}
