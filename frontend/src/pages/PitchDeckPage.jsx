import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import AnalysisPage from '../components/AnalysisPage';

const Slide = ({ number, title, children }) => (
  <div style={{
    paddingTop: 28,
    paddingBottom: 28,
    borderTop: '1px solid var(--border)',
  }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
      <span style={{
        fontSize: '0.7rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
        flexShrink: 0,
        width: 20,
      }}>
        {String(number).padStart(2, '0')}
      </span>
      <span style={{
        fontSize: '0.9375rem',
        fontWeight: 500,
        color: 'var(--text-primary)',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </span>
    </div>
    <div style={{ paddingLeft: 36 }}>
      {children}
    </div>
  </div>
);

const SlideText = ({ children }) => (
  <p style={{
    fontSize: '0.9375rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    letterSpacing: '-0.01em',
    marginBottom: 8,
  }}>
    {children}
  </p>
);

const SlideList = ({ items }) => {
  if (!items?.length) return null;
  const arr = Array.isArray(items) ? items : [items];
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {arr.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{
            width: 4, height: 4, borderRadius: '50%',
            background: 'var(--text-tertiary)', flexShrink: 0, marginTop: 8,
          }} />
          <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
};

function PitchResult({ pitch }) {
  if (!pitch) return null;
  return (
    <div className="fade-in" style={{ marginTop: 32 }}>
      <div style={{
        padding: '20px 24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        marginBottom: 8,
      }}>
        <p style={{
          fontSize: '1.125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.4,
          marginBottom: 4,
        }}>
          {pitch.slide_1_title?.title}
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', letterSpacing: '-0.01em' }}>
          "{pitch.slide_1_title?.tagline}"
        </p>
      </div>

      <div>
        <Slide number={2} title="The Problem">
          <SlideText>{pitch.slide_2_problem?.market_gap}</SlideText>
          <SlideList items={pitch.slide_2_problem?.pain_points} />
        </Slide>

        <Slide number={3} title="Our Solution">
          <SlideText>{pitch.slide_3_solution?.description}</SlideText>
          <SlideList items={pitch.slide_3_solution?.key_features} />
        </Slide>

        <Slide number={4} title="Market Opportunity">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {pitch.slide_4_market?.market_size && (
              <SlideText><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Market size</strong> - {pitch.slide_4_market.market_size}</SlideText>
            )}
            {pitch.slide_4_market?.growth_rate && (
              <SlideText><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Growth</strong> - {pitch.slide_4_market.growth_rate}</SlideText>
            )}
            {pitch.slide_4_market?.target_segment && (
              <SlideText><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Target</strong> - {pitch.slide_4_market.target_segment}</SlideText>
            )}
          </div>
        </Slide>

        <Slide number={5} title="Traction">
          <SlideList items={pitch.slide_5_traction?.milestones} />
        </Slide>

        <Slide number={6} title="Competitive Landscape">
          {pitch.slide_6_competition?.competitors && (
            <SlideText><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Competitors</strong> - {pitch.slide_6_competition.competitors}</SlideText>
          )}
          <SlideList items={pitch.slide_6_competition?.differentiators} />
          {pitch.slide_6_competition?.moat && (
            <SlideText style={{ marginTop: 8 }}><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Moat</strong> - {pitch.slide_6_competition.moat}</SlideText>
          )}
        </Slide>

        <Slide number={7} title="Business Model">
          <SlideText><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Revenue</strong> - {pitch.slide_7_business_model?.revenue_streams}</SlideText>
          <SlideText><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Pricing</strong> - {pitch.slide_7_business_model?.pricing}</SlideText>
          <SlideText><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Unit economics</strong> - {pitch.slide_7_business_model?.unit_economics}</SlideText>
        </Slide>

        <Slide number={8} title="Team">
          <SlideText>{pitch.slide_8_team?.structure}</SlideText>
          <SlideList items={pitch.slide_8_team?.key_roles} />
        </Slide>

        <Slide number={9} title="Financial Projections">
          <SlideText><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Runway</strong> - {pitch.slide_9_financials?.startup_costs}</SlideText>
          <SlideText><strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Path</strong> - {pitch.slide_9_financials?.projections}</SlideText>
        </Slide>

        <Slide number={10} title="The Ask">
          <p style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            {pitch.slide_10_ask?.funding_amount}
          </p>
          <SlideList items={pitch.slide_10_ask?.use_of_funds} />
          {pitch.slide_10_ask?.vision && (
            <p style={{
              marginTop: 16,
              fontSize: '0.875rem',
              color: 'var(--text-tertiary)',
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
              lineHeight: 1.6,
            }}>
              {pitch.slide_10_ask.vision}
            </p>
          )}
        </Slide>
      </div>
    </div>
  );
}

export default function PitchDeckPage() {
  const { user } = useAuth();

  const handleSubmit = async (idea) => {
    const response = await axios.post('/api/generate-pitch', { idea }, {
      headers: { Authorization: user?.token ? `Bearer ${user.token}` : '' }
    });
    return response.data;
  };

  return (
    <AnalysisPage
      title="Generate a pitch deck"
      subtitle="Pitch Deck"
      placeholder="Describe your startup idea..."
      buttonLabel="Generate"
      onSubmit={handleSubmit}
      renderResult={(data) => <PitchResult pitch={data} />}
    />
  );
}
