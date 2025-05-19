import { useState } from 'react';
import axios from 'axios';

const BusinessPlanGenerator = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-plan', 
        { idea },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPlan(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Business Plan Generator</h1>
      
      <form onSubmit={generatePlan} className="mb-8">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your business idea..."
          className="w-full p-4 border rounded-lg h-32 mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>

      {plan && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Your Business Plan</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Executive Summary</h3>
              <p>{plan.executive_summary}</p>
            </div>
            <div>
              <h3 className="font-bold">Market Analysis</h3>
              <p>{plan.market_analysis}</p>
            </div>
            {/* Add more sections as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPlanGenerator;