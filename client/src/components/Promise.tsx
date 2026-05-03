export default function Promise() {
  return (
    <section id="promise" className="section promise" data-track-section="promise">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><span className="dot"></span> The promise</span>
          <h2>Built for the way your brain actually works.</h2>
          <p>
            Most productivity apps were designed for people who already feel organized.
            NeuroBotanica starts from the opposite assumption — that your day is loud,
            your tabs are open, and you only need one thing to be quiet: this.
          </p>
        </div>

        <div className="cards">
          <article className="card">
            <img className="icon" src="/images/petal-cluster.svg" alt="" aria-hidden="true" />
            <span className="num">01 · FOCUS</span>
            <h3>One thing at a time.</h3>
            <p>
              Pick a single intention for today. Everything else fades back. No badges,
              no streaks, no shame loops if you skip a day.
            </p>
          </article>

          <article className="card">
            <img className="icon" src="/images/bilateral-sprout.svg" alt="" aria-hidden="true" />
            <span className="num">02 · CALM</span>
            <h3>Visually quiet.</h3>
            <p>
              Warm neutral palette. Generous whitespace. One sage accent that only
              appears when something matters. Designed not to compete for attention.
            </p>
          </article>

          <article className="card">
            <img className="icon" src="/images/node-tree.svg" alt="" aria-hidden="true" />
            <span className="num">03 · GROWTH</span>
            <h3>Small, real progress.</h3>
            <p>
              We measure tiny finishes, not arbitrary productivity. A planted thought,
              a tended task, a quiet bloom. Slow growth counts here.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
