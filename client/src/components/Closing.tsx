export default function Closing() {
  return (
    <section id="start" className="section closing" data-track-section="start">
      <div className="closing-cta">
        <span className="eyebrow" style={{ color: 'rgba(245,241,234,0.6)' }}>
          <span className="dot"></span> Start small
        </span>
        <h2>Plan one thing<br />today.</h2>
        <p>
          The beta is free, private, and arrives once a week — on Tuesdays —
          with a single new build. No marketing emails. We promise.
        </p>
        <a href="mailto:hello@neurobotanica.app?subject=Beta%20access" className="btn btn-primary">
          Request beta access
        </a>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-brand">
            <span className="wordmark">neuro<span className="accent">botanica</span></span>
            <p>
              Quiet tools for a busy mind. Made carefully, with neurodivergent users,
              for neurodivergent users.
            </p>
          </div>

          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="#promise">The promise</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#start">Beta access</a></li>
              <li><a href="#">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Research</a></li>
              <li><a href="#">Press kit</a></li>
              <li><a href="mailto:hello@neurobotanica.app">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4>Connect</h4>
            <ul>
              <li><a href="https://twitter.com/neurobotanica" rel="noopener">Twitter / X</a></li>
              <li><a href="https://instagram.com/neurobotanica" rel="noopener">Instagram</a></li>
              <li><a href="https://mastodon.social/@neurobotanica" rel="noopener">Mastodon</a></li>
              <li><a href="mailto:hello@neurobotanica.app">hello@neurobotanica.app</a></li>
            </ul>
          </div>

          <div className="footer-bottom" style={{ gridColumn: '1 / -1' }}>
            <span>© 2026 NeuroBotanica · Made carefully in Warsaw, PL</span>
            <span className="meta">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Accessibility</a>
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
}
