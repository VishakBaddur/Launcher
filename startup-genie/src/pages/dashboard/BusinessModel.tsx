import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mcpService } from '../../services/mcpService';
import type { User, BusinessModel } from '../../types';

interface BusinessModelProps {
  user: User;
  onLogout: () => void;
}

const BusinessModel = ({ user, onLogout }: BusinessModelProps) => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BusinessModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!companyName.trim() || !businessDescription.trim()) {
      setError('Please fill in both company name and business description');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const businessModel = await mcpService.generateBusinessModel({
        name: companyName,
        description: businessDescription
      });
      setResult(businessModel);
    } catch (err) {
      setError('Failed to generate business model. Please try again.');
      console.error('Business model generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🚀 Launcher - Business Model Generator
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Model Generator</h2>
          <p className="text-gray-600 mb-8">
            Create a comprehensive business model canvas with AI-powered insights.
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your company name..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your business..."
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Business Model'}
            </button>
          </div>

          {result && (
            <div className="mt-8 space-y-6">
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Model Canvas</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Key Partners */}
                    {result.keyPartnerships && result.keyPartnerships.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-blue-800 mb-3">🤝 Key Partnerships</h4>
                        <ul className="space-y-2">
                          {result.keyPartnerships.map((partner, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              <span className="text-blue-700">{partner}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Activities */}
                    {result.keyActivities && result.keyActivities.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-green-800 mb-3">⚡ Key Activities</h4>
                        <ul className="space-y-2">
                          {result.keyActivities.map((activity, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              <span className="text-green-700">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Resources */}
                    {result.keyResources && result.keyResources.length > 0 && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-purple-800 mb-3">🔧 Key Resources</h4>
                        <ul className="space-y-2">
                          {result.keyResources.map((resource, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span className="text-purple-700">{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Value Propositions */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-3">💎 Value Propositions</h4>
                      {result.valuePropositions && result.valuePropositions.length > 0 ? (
                        <ul className="space-y-2">
                          {result.valuePropositions.map((value, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-600 mr-2">•</span>
                              <span className="text-yellow-700">{value}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-yellow-700">{result.valueProposition || 'Value proposition not available'}</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Customer Relationships */}
                    {result.customerRelationships && result.customerRelationships.length > 0 && (
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-pink-800 mb-3">❤️ Customer Relationships</h4>
                        <ul className="space-y-2">
                          {result.customerRelationships.map((relationship, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-pink-600 mr-2">•</span>
                              <span className="text-pink-700">{relationship}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Channels */}
                    {result.channels && result.channels.length > 0 && (
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-indigo-800 mb-3">📡 Channels</h4>
                        <ul className="space-y-2">
                          {result.channels.map((channel, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-indigo-600 mr-2">•</span>
                              <span className="text-indigo-700">{channel}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Customer Segments */}
                    {result.customerSegments && result.customerSegments.length > 0 && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-orange-800 mb-3">👥 Customer Segments</h4>
                        <ul className="space-y-2">
                          {result.customerSegments.map((segment, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-orange-600 mr-2">•</span>
                              <span className="text-orange-700">{segment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cost Structure */}
                    {result.costStructure && result.costStructure.length > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="text-lg font-semibold text-red-800 mb-3">💰 Cost Structure</h4>
                        <ul className="space-y-2">
                          {result.costStructure.map((cost, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-600 mr-2">•</span>
                              <span className="text-red-700">{cost}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Revenue Streams - Full Width */}
                {result.revenueStreams && result.revenueStreams.length > 0 && (
                  <div className="mt-6 bg-emerald-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-emerald-800 mb-3">💵 Revenue Streams</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {result.revenueStreams.map((stream, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-emerald-200">
                          <span className="text-emerald-700">{stream}</span>
                        </div>
                      ))}
                    </div>
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

export default BusinessModel; 