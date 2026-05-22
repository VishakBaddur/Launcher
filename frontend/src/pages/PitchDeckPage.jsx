import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const SlideCard = ({ number, title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-4 border-l-4 border-black">
    <div className="flex items-center mb-3">
      <span className="bg-black text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center mr-3">
        {number}
      </span>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <div className="text-gray-600 text-sm space-y-2">{children}</div>
  </div>
);

const BulletList = ({ items }) => (
  <ul className="list-disc list-inside space-y-1">
    {(Array.isArray(items) ? items : [items]).map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const PitchDeckPage = () => {
  const [idea, setIdea] = useState('');
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPitch(null);
    try {
      const response = await axios.post(
        '/api/generate-pitch',
        { idea },
        { headers: { Authorization: user?.token ? `Bearer ${user.token}` : '' } }
      );
      setPitch(response.data);
    } catch (err) {
      setError('Failed to generate pitch deck. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Pitch Deck Generator</h1>
      <p className="text-gray-500 mb-6">Generate an investor-ready 10-slide pitch deck for your startup idea.</p>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter your startup idea (e.g. AI healthcare assistant)..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 flex-1"
          required
        />
        <button
          type="submit"
          className="bg-black text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}
      {loading && (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-3"></div>
          Building your pitch deck...
        </div>
      )}

      {pitch && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your 10-Slide Pitch Deck</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Investor Ready</span>
          </div>

          <SlideCard number={1} title={pitch.slide_1_title?.title || idea}>
            <p className="italic">"{pitch.slide_1_title?.tagline}"</p>
            <p className="text-gray-400">{pitch.slide_1_title?.presenter}</p>
          </SlideCard>

          <SlideCard number={2} title="The Problem">
            <p className="font-medium mb-1">{pitch.slide_2_problem?.market_gap}</p>
            <BulletList items={pitch.slide_2_problem?.pain_points || []} />
          </SlideCard>

          <SlideCard number={3} title="Our Solution">
            <p className="font-medium mb-1">{pitch.slide_3_solution?.description}</p>
            <BulletList items={pitch.slide_3_solution?.key_features || []} />
          </SlideCard>

          <SlideCard number={4} title="Market Opportunity">
            <p><span className="font-semibold">Market Size:</span> {pitch.slide_4_market?.market_size}</p>
            <p><span className="font-semibold">Growth:</span> {pitch.slide_4_market?.growth_rate}</p>
            <p><span className="font-semibold">Target:</span> {pitch.slide_4_market?.target_segment}</p>
          </SlideCard>

          <SlideCard number={5} title="Traction & Validation">
            <BulletList items={pitch.slide_5_traction?.milestones || []} />
          </SlideCard>

          <SlideCard number={6} title="Competitive Landscape">
            <p><span className="font-semibold">Competitors:</span> {pitch.slide_6_competition?.competitors}</p>
            <p className="font-semibold mt-1">Our Differentiators:</p>
            <BulletList items={pitch.slide_6_competition?.differentiators || []} />
            <p className="mt-1"><span className="font-semibold">Moat:</span> {pitch.slide_6_competition?.moat}</p>
          </SlideCard>

          <SlideCard number={7} title="Business Model">
            <p><span className="font-semibold">Revenue:</span> {pitch.slide_7_business_model?.revenue_streams}</p>
            <p><span className="font-semibold">Pricing:</span> {pitch.slide_7_business_model?.pricing}</p>
            <p><span className="font-semibold">Unit Economics:</span> {pitch.slide_7_business_model?.unit_economics}</p>
          </SlideCard>

          <SlideCard number={8} title="The Team">
            <p>{pitch.slide_8_team?.structure}</p>
            <BulletList items={pitch.slide_8_team?.key_roles || []} />
            <p className="text-gray-400 mt-1">Advisors: {pitch.slide_8_team?.advisors}</p>
          </SlideCard>

          <SlideCard number={9} title="Financial Projections">
            <p><span className="font-semibold">Costs:</span> {pitch.slide_9_financials?.startup_costs}</p>
            <p><span className="font-semibold">Projections:</span> {pitch.slide_9_financials?.projections}</p>
            <p><span className="font-semibold">Ask:</span> {pitch.slide_9_financials?.funding_ask}</p>
          </SlideCard>

          <SlideCard number={10} title="The Ask">
            <p className="text-2xl font-bold text-black mb-2">{pitch.slide_10_ask?.funding_amount}</p>
            <BulletList items={pitch.slide_10_ask?.use_of_funds || []} />
            <p className="mt-2 italic text-gray-500">{pitch.slide_10_ask?.vision}</p>
          </SlideCard>
        </div>
      )}
    </div>
  );
};

export default PitchDeckPage;
