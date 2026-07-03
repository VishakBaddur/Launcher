import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    label: 'AI-Powered Startup Intelligence',
    heading: 'From idea to\ninvestor-ready.',
    sub: "You have a startup idea. You need to know if it's brilliant or delusional. Launcher runs a 4-step AI pipeline and tells you — in minutes, not months.",
    cta: true,
  },
  {
    label: '01 — Market Categorization',
    heading: 'Who actually\nwants this?',
    sub: "We figure out your industry, market size, and target customer before you waste six months building for the wrong person. Turns out 'everyone' is not a target market.",
  },
  {
    label: '02 — SWOT Analysis',
    heading: 'Your honest\nmirror.',
    sub: "Strengths, weaknesses, opportunities, threats — laid out without the cheerleading. Most founders know their strengths. They pay us for the part they're avoiding.",
  },
  {
    label: '03 — Competitor Positioning',
    heading: "You're not\nalone.",
    sub: "Someone else is already doing something similar. We find them, map where they sit, and help you figure out why customers should pick you anyway. This is where moats are built.",
  },
  {
    label: '04 — Pitch Narrative',
    heading: 'Make investors\nlean in.',
    sub: "A 10-slide pitch deck synthesized from your full analysis. Opening hook, problem, solution, market, traction, team, and the ask — structured the way investors actually read decks.",
  },
  {
    label: 'Ready',
    heading: 'Your idea\nis waiting.',
    sub: "Every analysis gets smarter. Past results are embedded as vectors — so the more ideas flow through Launcher, the sharper the output gets. Start now, get better answers forever.",
    cta: true,
    final: true,
  },
];

export default function LandingPage() {
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const slideRefs = useRef([]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const totalSlides = slides.length;
      const scrollDistance = (totalSlides - 1) * window.innerHeight;
      const fadeDuration = 0.25;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          pin: panelRef.current,
          scrub: 1,
        },
      });

      slides.forEach((_, i) => {
        const el = slideRefs.current[i];
        if (!el) return;
        if (i === 0) {
          tl.to(el, { opacity: 0, y: -20, duration: fadeDuration, ease: 'power2.in' }, i + 1 - fadeDuration);
        } else if (i === slides.length - 1) {
          tl.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: fadeDuration, ease: 'power2.out' }, i - fadeDuration);
        } else {
          tl.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: fadeDuration, ease: 'power2.out' }, i - fadeDuration)
            .to(el, { opacity: 0, y: -20, duration: fadeDuration, ease: 'power2.in' }, i + 1 - fadeDuration);
        }
      });
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div style={{ background: 'var(--bg)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');
        .lp-nav-link { color: var(--text-secondary); font-size: 0.875rem; text-decoration: none; transition: color 0.2s; }
        .lp-nav-link:hover { color: var(--text-primary); }
        .lp-cta { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text-primary); font-size: 0.8125rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid var(--border-strong); padding-bottom: 3px; transition: gap 0.3s ease; }
        .lp-cta:hover { gap: 18px; }
        .lp-slide { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 80px 48px; pointer-events: none; }
        .lp-slide.is-active { pointer-events: auto; }
      `}</style>

      {/* Fixed nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 64, padding: '0 64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.0625rem', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
          Launcher
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/login" className="lp-nav-link">Sign in</Link>
          <Link to="/register" style={{
            display: 'inline-block', textDecoration: 'none',
            fontSize: '0.8125rem', fontWeight: 500, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--accent-fg)',
            background: 'var(--accent)', padding: '8px 18px', borderRadius: 4,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Scroll container */}
      <div
        ref={containerRef}
        style={{ height: `${slides.length * 100}vh`, position: 'relative' }}
      >
        {/* Sticky panel */}
        <div
          ref={panelRef}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            background: 'var(--bg)',
          }}
        >
          {/* Slide counter */}
          <div style={{
            position: 'absolute',
            bottom: 40,
            right: 64,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            {slides.map((_, i) => (
              <div key={i} ref={el => {
                // We track active slide via scroll but show dots
              }} style={{
                width: 1,
                height: 20,
                background: 'var(--border-strong)',
                borderRadius: 1,
              }} />
            ))}
          </div>

          {/* Slides */}
          {slides.map((slide, i) => (
            <div
              key={i}
              ref={el => slideRefs.current[i] = el}
              className={`lp-slide${(i === 0 || i === slides.length - 1) ? ' is-active' : ''}`}
              style={{
                opacity: i === 0 ? 1 : 0,
                paddingTop: 64,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '64px 48px 80px',
              }}
            >
              <div style={{ maxWidth: 680, width: '100%' }}>
                <p style={{
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: 28,
                }}>
                  {slide.label}
                </p>

                <h1 style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: 36,
                  whiteSpace: 'pre-line',
                }}>
                  {slide.heading}
                </h1>

                <p style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  maxWidth: 480, margin: '0 auto',
                  marginBottom: slide.cta ? 40 : 0,
                  letterSpacing: '-0.01em',
                  textAlign: 'center',
                }}>
                  {slide.sub}
                </p>

                {slide.cta && (
                  <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
                    <Link to="/register" className="lp-cta">
                      {slide.final ? 'Start free' : 'Analyze your idea'}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                    {!slide.final && (
                      <Link to="/login" style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}>
                        Sign in
                      </Link>
                    )}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 64px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg)',
      }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
          © {new Date().getFullYear()} Launcher
        </span>
        
        <a
          href="https://github.com/VishakBaddur/Launcher"
          target="_blank"
          rel="noopener noreferrer"
          className="lp-nav-link"
          style={{ fontSize: '0.8125rem' }}
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
