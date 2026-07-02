import React, { useState } from 'react';
import AnalysisResult from './AnalysisResult';

export default function AnalysisPage({ title, subtitle, placeholder, buttonLabel, onSubmit, renderResult }) {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await onSubmit(idea);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '56px 0 96px' }} className="fade-in">
      <div className="page">

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p className="label" style={{ marginBottom: 10 }}>{subtitle}</p>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>
            {title}
          </h1>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={idea}
              onChange={e => setIdea(e.target.value)}
              placeholder={placeholder}
              className="input"
              style={{ flex: 1 }}
              required
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flexShrink: 0, padding: '10px 20px' }}
            >
              {loading ? <span className="spinner" style={{
                borderColor: 'rgba(255,255,255,0.3)',
                borderTopColor: 'white',
              }} /> : (buttonLabel || 'Analyze')}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 16,
            padding: '12px 16px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}>
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{
            marginTop: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            color: 'var(--text-tertiary)',
          }}>
            <div style={{
              width: 32,
              height: 32,
              border: '1.5px solid var(--border-strong)',
              borderTopColor: 'var(--text-primary)',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
                Running 4-step analysis pipeline
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                Market categorization → SWOT → Competitors → Pitch narrative
              </p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          renderResult ? renderResult(result) : <AnalysisResult data={result} />
        )}
      </div>
    </div>
  );
}
