import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.02em' }}>Launcher</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.875rem', padding: '6px 12px' }}>Sign in</Link>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '6px 14px' }}>Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>

          <div className="label" style={{ marginBottom: 24 }}>AI-Powered Startup Analysis</div>

          <h1 className="display" style={{ marginBottom: 24, color: 'var(--text-primary)' }}>
            From idea to investor-ready in minutes
          </h1>

          <p className="body-lg" style={{ marginBottom: 48, maxWidth: 480, margin: '0 auto 48px' }}>
            Launcher runs a 4-step AI pipeline on your startup idea — market validation, SWOT analysis, competitor positioning, and pitch narrative.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Analyze your idea
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign in
            </Link>
          </div>
        </div>

        {/* Feature strip */}
        <div style={{
          marginTop: 96,
          maxWidth: 720,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 1,
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {[
            { label: 'Market Validation', desc: 'Size, trends, and timing' },
            { label: 'SWOT Analysis', desc: 'Strengths and blind spots' },
            { label: 'Competitor Map', desc: 'Positioning and moat' },
            { label: 'Pitch Deck', desc: '10 investor-ready slides' },
          ].map((f, i) => (
            <div key={i} style={{
              background: 'var(--surface)',
              padding: '24px 20px',
            }}>
              <div style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: 4,
                letterSpacing: '-0.01em',
              }}>{f.label}</div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-tertiary)',
              }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Pipeline note */}
        <div style={{
          marginTop: 80,
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
            Powered by Zephyr-7B with ChromaDB RAG — each analysis improves with every query as past results are embedded and retrieved via cosine similarity.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', letterSpacing: '-0.01em' }}>
          © {new Date().getFullYear()} Launcher
        </span>
        
          href="https://github.com/VishakBaddur/Launcher"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}
        >
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;
