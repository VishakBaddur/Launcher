import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BusinessPlanGenerator = () => {
  const [idea, setIdea] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const response = await axios.post(
        '/api/generate-plan',
        { idea },
        { headers: { Authorization: user && user.token ? `Bearer ${user.token}` : '' } }
      );
      setPlan(response.data);
    } catch (err) {
      setError('Failed to load business plan. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Business Plan Generator</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Enter your business idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 w-full"
          required
        />
        <button type="submit" className="mt-2 bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="flex justify-center items-center h-32">Loading...</div>}
      {plan && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-4">
          <h2 className="text-xl font-semibold mb-2">{plan.executive_summary}</h2>
          <p className="mb-4">{plan.company_description}</p>
          <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
          <p>{plan.market_analysis && plan.market_analysis.market_size ? plan.market_analysis.market_size : 'No market size data available.'}</p>
          <p>{plan.market_analysis && plan.market_analysis.growth_rate ? plan.market_analysis.growth_rate : 'No growth rate data available.'}</p>
          <h3 className="text-lg font-semibold mb-2">Organization & Team</h3>
          <p>{plan.organization_team || 'No organization/team data available.'}</p>
          <h3 className="text-lg font-semibold mb-2">Product & Service</h3>
          <p>{plan.product_service || 'No product/service data available.'}</p>
          <h3 className="text-lg font-semibold mb-2">Marketing & Sales</h3>
          <p>{plan.marketing_sales || 'No marketing/sales data available.'}</p>
          <h3 className="text-lg font-semibold mb-2">Financials</h3>
          <p>{plan.financials && plan.financials.revenue_model ? plan.financials.revenue_model : 'No financials data available.'}</p>
          <h3 className="text-lg font-semibold mb-2">Funding Request</h3>
          <p>{plan.funding_request || 'No funding request data available.'}</p>
          <h3 className="text-lg font-semibold mb-2">Appendix</h3>
          <p>{plan.appendix || 'No appendix data available.'}</p>
        </div>
      )}
    </div>
  );
};

export default BusinessPlanGenerator; 