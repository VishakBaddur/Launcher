import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Hero text reveal
    const heroLines = heroTextRef.current?.querySelectorAll('.reveal-line');
    if (heroLines) {
      gsap.fromTo(heroLines,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
      );
    }

    // Feature cards stagger
    const cards = featuresRef.current?.querySelectorAll('.feature-card');
    if (cards) {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 75%' }
        }
      );
    }

    // Steps
    const steps = stepsRef.current?.querySelectorAll('.step-item');
    if (steps) {
      gsap.fromTo(steps,
        { x: -24, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 75%' }
        }
      );
    }

    // CTA
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' }
        }
      );
    }

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Google Fonts - Fragment Serif + Inter */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        .reveal-line { will-change: transform, opacity; }
        .nav-link { position: relative; text-decoration: none; color: var(--text-secondary); font-size: 0.875rem; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: var(--text-primary); transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: var(--text-primary); }
        .feature-card { will-change: transform, opacity; }
        .step-item { will-change: transform, opacity; }
        .hero-cta { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text-primary); font-size: 0.875rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; border-bottom: 1px solid var(--border-strong); padding-bottom: 2px; transition: gap 0.3s ease, border-color 0.3s ease; }
        .hero-cta:hover { gap: 16px; border-color: var(--text-primary); }
        .divider-line { height: 1px; background: var(--border); }
      `}</style>

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.125rem', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
          Launcher
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/login" className="nav-link">Sign in</Link>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: '0.8125rem', fontWeight: 500, letterSpacing: '0.06em',
            textTransform: 'uppercase', textDecoration: 'none',
            color: 'var(--accent-fg)', background: 'var(--accent)',
            padding: '9px 20px', borderRadius: 4, transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 48px 80px',
        paddingTop: 64,
      }}>
        <div ref={heroTextRef} style={{ maxWidth: 900 }}>
          <div className="reveal-line" style={{ marginBottom: 32 }}>
            <span style={{
              fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--text-tertiary)',
            }}>
              AI-Powered Startup Intelligence
            </span>
          </div>
          <h1 className="reveal-line serif" style={{
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', marginBottom: 48,
          }}>
            From idea to investor-ready<br />
            <em style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>in minutes.</em>
          </h1>
          <div className="reveal-line" style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            <Link to="/register" className="hero-cta">
              Analyze your idea
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-tertiary)', maxWidth: 400, lineHeight: 1.6 }}>
              A 4-step LLM reasoning pipeline backed by ChromaDB RAG — built for founders who need signal, not noise.
            </p>
          </div>
        </div>
      </section>

      <div className="divider-line" />

      {/* Pipeline steps */}
      <section ref={stepsRef} style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 48 }}>
            The Pipeline
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            {[
              { n: '01', title: 'Market Categorization', desc: 'Industry, market size, target customers, and timing.' },
              { n: '02', title: 'SWOT Analysis', desc: 'Strengths, weaknesses, opportunities, and threats — conditioned on step one.' },
              { n: '03', title: 'Competitor Positioning', desc: 'Competitive landscape, moat, and differentiation — conditioned on steps one and two.' },
              { n: '04', title: 'Pitch Narrative', desc: 'Investor hook, recommendations, and value proposition synthesis.' },
            ].map((step) => (
              <div key={step.n} className="step-item" style={{ background: 'var(--surface)', padding: '36px 28px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: 16 }}>{step.n}</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 10 }}>{step.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-line" />

      {/* Features */}
      <section ref={featuresRef} style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 64, flexWrap: 'wrap', gap: 32 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              What You Get
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: 400, lineHeight: 1.7 }}>
              Each analysis is embedded into a ChromaDB vector store. Future queries on similar ideas benefit from past results via cosine similarity retrieval.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { title: 'Idea Validation', desc: 'Market viability, timing analysis, and feasibility scoring for any startup concept.', link: '/validate-idea' },
              { title: 'Business Plan', desc: 'Structured plan with market analysis, competitive landscape, strategy, and projections.', link: '/generate-plan' },
              { title: 'Business Model', desc: 'Lean canvas covering value proposition, customer segments, channels, and revenue.', link: '/business-model' },
              { title: 'Pitch Deck', desc: '10 investor-ready slides — problem, solution, market, traction, team, and the ask.', link: '/pitch-deck' },
            ].map((f) => (
              <Link key={f.title} to="/register" className="feature-card" style={{
                textDecoration: 'none', display: 'block',
                padding: '32px 28px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 12 }}>{f.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-line" />

      {/* CTA */}
      <section ref={ctaRef} style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 48 }}>
          <h2 className="serif" style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 400, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', lineHeight: 1.1, maxWidth: 500,
          }}>
            Ready to validate your next idea?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link to="/register" className="hero-cta">
              Start for free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>No credit card required.</p>
          </div>
        </div>
      </section>

      <div className="divider-line" />

      {/* Footer */}
      <footer style={{ padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>© {new Date().getFullYear()} Launcher</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="https://github.com/VishakBaddur/Launcher" target="_blank" rel="noopener noreferrer" className="nav-link" style={{ fontSize: '0.8125rem' }}>GitHub</a>
          <Link to="/login" className="nav-link" style={{ fontSize: '0.8125rem' }}>Sign in</Link>
        </div>
      </footer>
    </div>
  );
}
