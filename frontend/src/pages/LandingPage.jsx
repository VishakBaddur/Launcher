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
    sub: 'A 4-step LLM reasoning pipeline backed by ChromaDB RAG — built for founders who need signal, not noise.',
    cta: true,
  },
  {
    label: '01 — Market Categorization',
    heading: 'Understand\nyour market.',
    sub: 'Industry classification, market size estimation, target customer profiling, and timing analysis — all conditioned on your specific idea.',
  },
  {
    label: '02 — SWOT Analysis',
    heading: 'Know your\nstrengths.',
    sub: 'A structured strengths, weaknesses, opportunities, and threats analysis conditioned on the market categorization from step one.',
  },
  {
    label: '03 — Competitor Positioning',
    heading: 'Find your\nmoat.',
    sub: 'Competitive landscape mapping, differentiation analysis, and positioning statement — conditioned on steps one and two.',
  },
  {
    label: '04 — Pitch Narrative',
    heading: 'Tell your\nstory.',
    sub: 'Investor hook, value proposition, and a 10-slide pitch deck synthesized from the full pipeline output.',
  },
  {
    label: 'Ready',
    heading: 'Analyze your\nfirst idea.',
    sub: 'Each analysis is embedded into a ChromaDB vector store. Future queries on similar ideas benefit from past results via cosine similarity.',
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

      // Pin the panel while scrolling through totalSlides * 100vh
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${(totalSlides - 1) * 100}vh`,
        pin: panelRef.current,
        pinSpacing: false,
        scrub: true,
      });

      // Animate each slide in/out
      slides.forEach((_, i) => {
        const el = slideRefs.current[i];
        if (!el) return;

        const startPct = i / totalSlides;
        const endPct = (i + 1) / totalSlides;
        const midPct = (startPct + endPct) / 2;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: `+=${(totalSlides - 1) * 100}vh`,
            scrub: 0.5,
          },
        });

        if (i === 0) {
          // First slide: visible at start, fade out at midPct
          tl.to(el, { opacity: 0, y: -24, ease: 'power2.in' }, midPct);
        } else if (i === slides.length - 1) {
          // Last slide: fade in at prev midPct, stay visible
          const prevMid = ((i - 1) / totalSlides + i / totalSlides) / 2;
          tl.fromTo(el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, ease: 'power2.out' },
            prevMid
          );
        } else {
          // Middle slides: fade in then fade out
          const prevMid = ((i - 1) / totalSlides + i / totalSlides) / 2;
          tl.fromTo(el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, ease: 'power2.out' },
            prevMid
          )
          .to(el, { opacity: 0, y: -24, ease: 'power2.in' }, midPct);
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
        .lp-slide { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 64px 80px; pointer-events: none; }
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
              className={`lp-slide${i === 0 ? ' is-active' : ''}`}
              style={{
                opacity: i === 0 ? 1 : 0,
                paddingTop: 64,
              }}
            >
              <div style={{ maxWidth: 820 }}>
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
                  maxWidth: 480,
                  marginBottom: slide.cta ? 40 : 0,
                  letterSpacing: '-0.01em',
                }}>
                  {slide.sub}
                </p>

                {slide.cta && (
                  <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
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

              {/* Slide number */}
              <div style={{
                position: 'absolute',
                top: 80,
                right: 64,
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(6rem, 15vw, 12rem)',
                fontWeight: 400,
                color: 'var(--border)',
                lineHeight: 1,
                userSelect: 'none',
                letterSpacing: '-0.04em',
              }}>
                {String(i + 1).padStart(2, '0')}
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
