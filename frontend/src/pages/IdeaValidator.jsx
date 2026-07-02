import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import AnalysisPage from '../components/AnalysisPage';
import AnalysisResult from '../components/AnalysisResult';

export default function IdeaValidator() {
  const { user } = useAuth();

  const handleSubmit = async (idea) => {
    const response = await axios.post('/api/validate-idea', { idea }, {
      headers: { Authorization: user?.token ? `Bearer ${user.token}` : '' }
    });
    return response.data;
  };

  return (
    <AnalysisPage
      title="Validate your idea"
      subtitle="Idea Validation"
      placeholder="Describe your startup idea..."
      buttonLabel="Validate"
      onSubmit={handleSubmit}
      renderResult={(data) => <AnalysisResult data={data} />}
    />
  );
}
