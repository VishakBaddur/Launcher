import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import AnalysisPage from '../components/AnalysisPage';
import AnalysisResult from '../components/AnalysisResult';

export default function BusinessPlanGenerator() {
  const { user } = useAuth();

  const handleSubmit = async (idea) => {
    const response = await axios.post('/api/generate-plan', { idea }, {
      headers: { Authorization: user?.token ? `Bearer ${user.token}` : '' }
    });
    return response.data;
  };

  return (
    <AnalysisPage
      title="Generate a business plan"
      subtitle="Business Plan"
      placeholder="Describe your startup idea..."
      buttonLabel="Generate"
      onSubmit={handleSubmit}
      renderResult={(data) => <AnalysisResult data={data} />}
    />
  );
}
