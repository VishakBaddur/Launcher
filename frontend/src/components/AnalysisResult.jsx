import React from 'react';

const Section = ({ label, children }) => (
  <div style={{ paddingTop: 28, paddingBottom: 28, borderTop: '1px solid var(--border)' }}>
    <p className="label" style={{ marginBottom: 14 }}>{label}</p>
    {children}
  </div>
);

const Tag = ({ children }) => (
  <span style={{
    display: 'inline-block',
    padding: '4px 10px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    letterSpacing: '-0.01em',
    margin: '3px',
  }}>
    {children}
  </span>
);

const BulletList = ({ items }) => {
  if (!items || !items.length) return null;
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'var(--text-tertiary)',
            flexShrink: 0,
            marginTop: 8,
          }} />
          <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
            {typeof item === 'object' ? (item.name || item.description || JSON.stringify(item)) : item}
          </span>
        </li>
      ))}
    </ul>
  );
};

const SwotGrid = ({ swot }) => {
  if (!swot) return null;
  const quadrants = [
    { label: 'Strengths', items: swot.strengths, color: 'var(--text-primary)' },
    { label: 'Weaknesses', items: swot.weaknesses, color: 'var(--text-secondary)' },
    { label: 'Opportunities', items: swot.opportunities, color: 'var(--text-primary)' },
    { label: 'Threats', items: swot.threats, color: 'var(--text-secondary)' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 1,
      background: 'var(--border)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      {quadrants.map(q => (
        <div key={q.label} style={{ background: 'var(--surface)', padding: '20px' }}>
          <p style={{
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            marginBottom: 12,
          }}>{q.label}</p>
          <BulletList items={q.items} />
        </div>
      ))}
    </div>
  );
};

export default function AnalysisResult({ data, type }) {
  if (!data) return null;

  return (
    <div className="fade-in" style={{ marginTop: 32 }}>

      {/* Summary bar */}
      {data.summary && (
        <div style={{
          padding: '20px 24px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          marginBottom: 8,
        }}>
          <p style={{
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.5,
          }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Investor hook */}
      {data.investor_hook && (
        <div style={{
          padding: '16px 24px',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          marginBottom: 24,
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', letterSpacing: '-0.01em', lineHeight: 1.6 }}>
            "{data.investor_hook}"
          </p>
        </div>
      )}

      {/* Sections */}
      <div>
        {data.market_trends?.length > 0 && (
          <Section label="Market Trends">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {data.market_trends.map((t, i) => <Tag key={i}>{t}</Tag>)}
            </div>
          </Section>
        )}

        {data.swot && (Object.values(data.swot).some(v => v?.length > 0)) && (
          <Section label="SWOT Analysis">
            <SwotGrid swot={data.swot} />
          </Section>
        )}

        {data.competitive_advantage && (
          <Section label="Competitive Advantage">
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
              {data.competitive_advantage}
            </p>
          </Section>
        )}

        {data.positioning_statement && (
          <Section label="Positioning">
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
              {data.positioning_statement}
            </p>
          </Section>
        )}

        {data.challenges?.length > 0 && (
          <Section label="Key Challenges">
            <BulletList items={data.challenges} />
          </Section>
        )}

        {data.success_factors?.length > 0 && (
          <Section label="Success Factors">
            <BulletList items={data.success_factors} />
          </Section>
        )}

        {data.recommendations?.length > 0 && (
          <Section label="Recommendations">
            <BulletList items={data.recommendations} />
          </Section>
        )}

        {data.example_companies?.length > 0 && (
          <Section label="Comparable Companies">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {data.example_companies.map((c, i) => (
                <Tag key={i}>{typeof c === 'object' ? c.name : c}</Tag>
              ))}
            </div>
          </Section>
        )}

        {data.pipeline_steps_completed > 0 && (
          <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', letterSpacing: '-0.01em' }}>
              {data.pipeline_steps_completed} of 4 pipeline steps completed · Powered by Zephyr-7B + ChromaDB RAG
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
