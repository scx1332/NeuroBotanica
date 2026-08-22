import bilateralSproutUrl from '../images/bilateral-sprout.svg';
import nodeTreeUrl from '../images/node-tree.svg';
import petalClusterUrl from '../images/petal-cluster.svg';
import synapseLeafUrl from '../images/synapse-leaf.svg';
import { useAnonymousTracking } from './tracking';

const promiseCards = [
  {
    number: '01 - Focus',
    title: 'One thing at a time.',
    icon: petalClusterUrl,
    body:
      'Pick a single intention for today. Everything else fades back. No badges, no streaks, no shame loops if you skip a day.',
  },
  {
    number: '02 - Calm',
    title: 'Visually quiet.',
    icon: bilateralSproutUrl,
    body:
      'Warm neutral palette. Generous whitespace. One sage accent that only appears when something matters. Designed not to compete for attention.',
  },
  {
    number: '03 - Growth',
    title: 'Small, real progress.',
    icon: nodeTreeUrl,
    body:
      'We measure tiny finishes, not arbitrary productivity. A planted thought, a tended task, a quiet bloom. Slow growth counts here.',
  },
];

const steps = [
  {
    number: 'Step one',
    title: 'Plant',
    body:
      "Drop in whatever's on your mind - a task, a thought, a half-formed worry. Type it once. We'll hold it for you.",
  },
  {
    number: 'Step two',
    title: 'Tend',
    body:
      'Pick one thing for today. Just one. The rest waits, quietly, without flashing a number at you from a tab you never asked to count.',
  },
  {
    number: 'Step three',
    title: 'Bloom',
    body:
      "Mark it done when it's done. No celebration animation, no confetti. Just a soft check, and the rest of your evening back.",
  },
];

function App() {
  useAnonymousTracking();

  return (
    <>
      <nav className="nav" id="nav">
        <div className="container">
          <a href="#top" className="brand" aria-label="NeuroBotanica home">
            <img className="mark" src={synapseLeafUrl} alt="" aria-hidden="true" />
            <span className="wordmark">
              neuro<span className="accent">botanica</span>
            </span>
          </a>
          <div className="nav-links">
            <a href="#promise" className="hide-sm">
              Why
            </a>
            <a href="#how" className="hide-sm">
              How
            </a>
            <a href="#start" className="hide-sm">
              Contact
            </a>
            <a href="#start" className="btn btn-primary btn-sm">
              Try the beta
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section
          id="top"
          className="section hero"
          data-track-section="top"
          data-section-label="Hero"
        >
          <div className="container">
            <div className="hero-inner">
              <img className="mark-lg" src={synapseLeafUrl} alt="" aria-hidden="true" />

              <h1>
                Quiet tools
                <br />
                for a <span className="accent">busy mind.</span>
              </h1>

              <p className="lead">
                Simple, low-stimulation tools to help you organize life with ADHD or AuDHD. No
                overwhelming dashboards. No streaks to break.
              </p>

              <div className="cta-row">
                <a href="#start" className="btn btn-primary">
                  Try the beta
                </a>
                <a href="#promise" className="btn btn-ghost">
                  See how it feels
                </a>
              </div>

              <div className="tagline">organize gently</div>
            </div>
          </div>

          <div className="scroll-hint" aria-hidden="true">
            <span>scroll</span>
            <span className="line" />
          </div>
        </section>

        <section
          id="promise"
          className="section promise"
          data-track-section="promise"
          data-section-label="The promise"
        >
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">
                <span className="dot" /> The promise
              </span>
              <h2>Built for the way your brain actually works.</h2>
              <p>
                Most productivity apps were designed for people who already feel organized.
                NeuroBotanica starts from the opposite assumption - that your day is loud, your
                tabs are open, and you only need one thing to be quiet: this.
              </p>
            </div>

            <div className="cards">
              {promiseCards.map((card) => (
                <article className="card" key={card.number}>
                  <img className="icon" src={card.icon} alt="" aria-hidden="true" />
                  <span className="num">{card.number}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how"
          className="section how"
          data-track-section="how"
          data-section-label="How it works"
        >
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">
                <span className="dot" /> How it works
              </span>
              <h2>Three steps. No setup ritual.</h2>
              <p>
                Open the app, plant something, close the app. That's the whole loop. It works on a
                Tuesday at 2pm and on a Sunday at midnight.
              </p>
            </div>

            <div className="steps">
              {steps.map((step) => (
                <div className="step" key={step.number}>
                  <span className="step-num">{step.number}</span>
                  <div className="step-title">
                    <span className="dot" />
                    {step.title}
                  </div>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="start"
          className="section closing"
          data-track-section="start"
          data-section-label="Start small"
        >
          <div className="closing-cta">
            <span className="eyebrow eyebrow-reverse">
              <span className="dot" /> Start small
            </span>
            <h2>
              Plan one thing
              <br />
              today.
            </h2>
            <p>
              The beta is free, private, and arrives once a week - on Tuesdays - with a single new
              build. No marketing emails. We promise.
            </p>
            <a
              href="mailto:hello@neurobotanica.app?subject=Beta%20access"
              className="btn btn-primary"
            >
              Request beta access
            </a>
          </div>

          <footer className="footer">
            <div className="container">
              <div className="footer-brand">
                <span className="wordmark">
                  neuro<span className="accent">botanica</span>
                </span>
                <p>
                  Quiet tools for a busy mind. Made carefully, with neurodivergent users, for
                  neurodivergent users.
                </p>
              </div>

              <div>
                <h4>Product</h4>
                <ul>
                  <li>
                    <a href="#promise">The promise</a>
                  </li>
                  <li>
                    <a href="#how">How it works</a>
                  </li>
                  <li>
                    <a href="#start">Beta access</a>
                  </li>
                  <li>
                    <a href="#top">Roadmap</a>
                  </li>
                </ul>
              </div>

              <div>
                <h4>Company</h4>
                <ul>
                  <li>
                    <a href="#top">About</a>
                  </li>
                  <li>
                    <a href="#top">Research</a>
                  </li>
                  <li>
                    <a href="#top">Press kit</a>
                  </li>
                  <li>
                    <a href="mailto:hello@neurobotanica.app">Contact</a>
                  </li>
                </ul>
              </div>

              <div>
                <h4>Connect</h4>
                <ul>
                  <li>
                    <a href="https://twitter.com/neurobotanica" rel="noopener noreferrer">
                      Twitter / X
                    </a>
                  </li>
                  <li>
                    <a href="https://instagram.com/neurobotanica" rel="noopener noreferrer">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://mastodon.social/@neurobotanica" rel="noopener noreferrer">
                      Mastodon
                    </a>
                  </li>
                  <li>
                    <a href="mailto:hello@neurobotanica.app">hello@neurobotanica.app</a>
                  </li>
                </ul>
              </div>

              <div className="footer-bottom">
                <span>(c) 2026 NeuroBotanica - Made carefully in Warsaw, PL</span>
                <span className="meta">
                  <a href="#top">Privacy</a>
                  <a href="#top">Terms</a>
                  <a href="#top">Accessibility</a>
                </span>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}

export default App;
