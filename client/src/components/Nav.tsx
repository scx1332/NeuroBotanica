import { useEffect, useState } from 'react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="container">
        <a href="#top" className="brand" aria-label="NeuroBotanica home">
          <img className="mark" src="/images/synapse-leaf.svg" alt="" aria-hidden="true" />
          <span className="wordmark">neuro<span className="accent">botanica</span></span>
        </a>
        <div className="nav-links">
          <a href="#promise" className="hide-sm">Why</a>
          <a href="#how" className="hide-sm">How</a>
          <a href="#start" className="hide-sm">Contact</a>
          <a href="#start" className="btn btn-primary btn-sm">Try the beta</a>
        </div>
      </div>
    </nav>
  );
}
