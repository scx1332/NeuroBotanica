export default function How() {
  return (
    <section id="how" className="section how" data-track-section="how">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow"><span className="dot"></span> How it works</span>
          <h2>Three steps. No setup ritual.</h2>
          <p>
            Open the app, plant something, close the app. That's the whole loop.
            It works on a Tuesday at 2pm and on a Sunday at midnight.
          </p>
        </div>

        <div className="steps">
          <div className="step">
            <span className="step-num">Step one</span>
            <div className="step-title"><span className="dot"></span>Plant</div>
            <p>
              Drop in whatever's on your mind — a task, a thought, a half-formed worry.
              Type it once. We'll hold it for you.
            </p>
          </div>

          <div className="step">
            <span className="step-num">Step two</span>
            <div className="step-title"><span className="dot"></span>Tend</div>
            <p>
              Pick one thing for today. Just one. The rest waits, quietly, without
              flashing a number at you from a tab you never asked to count.
            </p>
          </div>

          <div className="step">
            <span className="step-num">Step three</span>
            <div className="step-title"><span className="dot"></span>Bloom</div>
            <p>
              Mark it done when it's done. No celebration animation, no confetti.
              Just a soft check, and the rest of your evening back.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
