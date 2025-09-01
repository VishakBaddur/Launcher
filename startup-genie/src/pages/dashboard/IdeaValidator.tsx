import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mcpService } from '../../services/mcpService';
import type { User, ValidationResult } from '../../types';

interface IdeaValidatorProps {
  user: User;
  onLogout: () => void;
}

const IdeaValidator = ({ user, onLogout }: IdeaValidatorProps) => {
  const navigate = useNavigate();
  const [ideaDescription, setIdeaDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!ideaDescription.trim()) {
      setError('Please describe your startup idea');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const validationResult = await mcpService.validateIdea(ideaDescription);
      setResult(validationResult);
    } catch (err) {
      setError('Failed to validate idea. Please try again.');
      console.error('Validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🚀 Launcher - AI Idea Validator
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <span className="text-gray-700">Welcome, {user.email}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Idea Validator</h2>
          <p className="text-gray-600 mb-8">
            Describe your startup idea and get instant AI-powered validation and insights.
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Startup Idea
              </label>
              <textarea
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your startup idea in detail..."
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <button 
              onClick={handleValidate}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Validating...' : 'Validate Idea with AI'}
            </button>
          </div>

          {result && (
            <div className="mt-8 space-y-6">
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Validation Results</h3>
                
                {/* Feasibility Score */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">Feasibility Score</span>
                                    <span className={`text-2xl font-bold ${getScoreColor(result.feasibilityScore)}`}>
                  {result.feasibilityScore}/100
                </span>
                  </div>
                </div>

                {/* Opportunities */}
                {result.opportunities && result.opportunities.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-green-700 mb-3">✅ Opportunities</h4>
                    <ul className="space-y-2">
                      {result.opportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span className="text-gray-700">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risks */}
                {result.risks && result.risks.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-red-700 mb-3">⚠️ Risks</h4>
                    <ul className="space-y-2">
                      {result.risks.map((risk, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span className="text-gray-700">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Similar Startups */}
                {result.similarStartups && result.similarStartups.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-blue-700 mb-3">🏢 Similar Startups</h4>
                    <ul className="space-y-2">
                      {result.similarStartups.map((startup, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-gray-700">
                            {typeof startup === 'string' ? startup : `${startup.name} - ${startup.description}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Market Analysis */}
                {result.marketInsights && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-purple-700 mb-3">📊 Market Analysis</h4>
                    <p className="text-gray-700">
                      Market Size: {result.marketInsights.marketSize}. Growth Rate: {result.marketInsights.growthRate}. {result.marketInsights.trends.join('. ')}
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-indigo-700 mb-3">💡 Recommendations</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span className="text-gray-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaValidator; 