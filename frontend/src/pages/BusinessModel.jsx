import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BusinessModel = () => {
  const [idea, setIdea] = useState('');
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setModel(null);
    try {
      const response = await axios.post(
        '/api/generate-business-model',
        { idea },
        { headers: { Authorization: user && user.token ? `Bearer ${user.token}` : '' } }
      );
      setModel(response.data);
    } catch (err) {
      setError('Failed to load business model. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderCharts = (data) => {
    if (!data || !data.charts) return null;
    const charts = data.charts;

    // Monthly Growth Chart
    const renderMonthlyGrowthChart = () => {
      if (charts.monthly_growth && charts.monthly_growth.length > 0) {
        const chartData = {
          labels: charts.monthly_growth.map(item => item.month),
          datasets: [{
            label: 'Monthly Growth',
            data: charts.monthly_growth.map(item => item.value),
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Monthly Growth</h4>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    // Market Share Chart
    const renderMarketShareChart = () => {
      if (charts.market_share && charts.market_share.length > 0) {
        const chartData = {
          labels: charts.market_share.map(item => item.company),
          datasets: [{
            label: 'Market Share',
            data: charts.market_share.map(item => item.value),
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Market Share Distribution</h4>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    // User Demographics Chart
    const renderUserDemographicsChart = () => {
      if (charts.user_demographics && charts.user_demographics.length > 0) {
        const chartData = {
          labels: charts.user_demographics.map(item => item.age),
          datasets: [{
            label: 'User Demographics',
            data: charts.user_demographics.map(item => item.value),
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">User Demographics</h4>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    // Order Distribution Chart
    const renderOrderDistributionChart = () => {
      if (charts.order_distribution && charts.order_distribution.length > 0) {
        const chartData = {
          labels: charts.order_distribution.map(item => item.type),
          datasets: [{
            label: 'Order Distribution',
            data: charts.order_distribution.map(item => item.value),
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Order Distribution</h4>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    // Category Distribution Chart
    const renderCategoryDistributionChart = () => {
      if (charts.category_distribution && charts.category_distribution.length > 0) {
        const chartData = {
          labels: charts.category_distribution.map(item => item.category),
          datasets: [{
            label: 'Category Distribution',
            data: charts.category_distribution.map(item => item.value),
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Category Distribution</h4>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Market Charts</h3>
        <div className="space-y-6">
          {renderMonthlyGrowthChart()}
          {renderMarketShareChart()}
          {renderUserDemographicsChart()}
          {renderOrderDistributionChart()}
          {renderCategoryDistributionChart()}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Business Model Generator</h1>
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
          {loading ? 'Generating...' : 'Generate Business Model'}
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="flex justify-center items-center h-32">Loading...</div>}
      {model && (
        <>
          {renderCharts(model)}
          <div className="bg-white shadow-md rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold mb-2">Value Proposition</h2>
            <p className="mb-4">{model.value_proposition || 'No value proposition data available.'}</p>
            <h2 className="text-xl font-semibold mb-2">Customer Segments</h2>
            <p className="mb-4">{Array.isArray(model.customer_segments) && model.customer_segments.length > 0 ? model.customer_segments.join(', ') : 'No customer segments data available.'}</p>
            <h2 className="text-xl font-semibold mb-2">Channels</h2>
            <p className="mb-4">{Array.isArray(model.channels) && model.channels.length > 0 ? model.channels.join(', ') : 'No channels data available.'}</p>
            <h2 className="text-xl font-semibold mb-2">Customer Relationships</h2>
            <p className="mb-4">{Array.isArray(model.customer_relationships) && model.customer_relationships.length > 0 ? model.customer_relationships.join(', ') : 'No customer relationships data available.'}</p>
            <h2 className="text-xl font-semibold mb-2">Revenue Streams</h2>
            <p className="mb-4">{Array.isArray(model.revenue_streams) && model.revenue_streams.length > 0 ? model.revenue_streams.join(', ') : 'No revenue streams data available.'}</p>
            <h2 className="text-xl font-semibold mb-2">Key Resources</h2>
            <p className="mb-4">{Array.isArray(model.key_resources) && model.key_resources.length > 0 ? model.key_resources.join(', ') : 'No key resources data available.'}</p>
            <h2 className="text-xl font-semibold mb-2">Key Activities</h2>
            <p className="mb-4">{Array.isArray(model.key_activities) && model.key_activities.length > 0 ? model.key_activities.join(', ') : 'No key activities data available.'}</p>
            <h2 className="text-xl font-semibold mb-2">Key Partners</h2>
            <p className="mb-4">{Array.isArray(model.key_partners) && model.key_partners.length > 0 ? model.key_partners.join(', ') : 'No key partners data available.'}</p>
            <h2 className="text-xl font-semibold mb-2">Cost Structure</h2>
            <p className="mb-4">{Array.isArray(model.cost_structure) && model.cost_structure.length > 0 ? model.cost_structure.join(', ') : 'No cost structure data available.'}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessModel; 