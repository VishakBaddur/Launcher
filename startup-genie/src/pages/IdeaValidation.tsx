import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ValidationData {
  feasibilityScore: number;
  marketSize: string;
  competitionLevel: string;
  trends: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  marketInsights: {
    marketSize: string;
    growthRate: string;
    trends: string[];
    opportunities: string[];
    threats: string[];
  };
  founderFit?: {
    score: number;
    label: string;
    breakdown: {
      domain: number;
      technical: number;
      startup: number;
    };
  };
  executionDifficulty?: {
    level: string;
    score: number;
    reasoning: string;
  };
  timeToMVP?: {
    timeframe: string;
    score: number;
    phases: string[];
  };
  riskAnalysis?: {
    topRisks: Array<{
      category: string;
      risk: string;
      severity: string;
      probability: string;
      weightedScore: number;
      isCritical: boolean;
      mitigations: Array<{
        action: string;
        priority: string;
        effort: string;
        timeline: string;
      }>;
    }>;
    overallRiskLevel: string;
    criticalRisks: number;
  };
}

const IdeaValidation: React.FC = () => {
  const navigate = useNavigate();
  const [validationData, setValidationData] = useState<ValidationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ideaData, setIdeaData] = useState<any>(null);

  useEffect(() => {
    // Get idea data from localStorage
    const stored = localStorage.getItem('ideaData');
    if (stored) {
      setIdeaData(JSON.parse(stored));
      validateIdea(JSON.parse(stored));
    } else {
      navigate('/idea-input');
    }
  }, [navigate]);

  const validateIdea = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://launcher-backend-cxxk.onrender.com/api/validate_idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea_description: data.description,
          founder_context: data.founderBackground
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setValidationData(result);
      } else {
        console.error('Validation failed');
      }
    } catch (error) {
      console.error('Error validating idea:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Moderate';
    return 'Weak';
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Idea</h2>
          <p className="text-gray-300">Running comprehensive validation...</p>
        </div>
      </div>
    );
  }

  if (!validationData || !ideaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Idea Data Found</h2>
          <button
            onClick={() => navigate('/idea-input')}
            className="btn-anime px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-gradient-animate">📊 Idea Validation</span>
          </h1>
          <h2 className="text-2xl text-gray-300 mb-2">{ideaData.title}</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">{ideaData.description}</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overall Feasibility Score */}
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Overall Feasibility Score</h2>
              <div className={`text-6xl font-bold ${getScoreColor(validationData.feasibilityScore)}`}>
                {validationData.feasibilityScore}/100
              </div>
              <div className={`text-xl font-semibold ${getScoreColor(validationData.feasibilityScore)}`}>
                {getScoreLabel(validationData.feasibilityScore)}
              </div>
            </div>

            {/* Confidence Radar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">Market</div>
                <div className="text-sm text-gray-300">Size & Growth</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-green-400">Competition</div>
                <div className="text-sm text-gray-300">{validationData.competitionLevel}</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">Sentiment</div>
                <div className="text-sm text-gray-300">Trending</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">Founder Fit</div>
                <div className="text-sm text-gray-300">
                  {validationData.founderFit?.label || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">📈 Market Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Market Size</h3>
                <div className="text-2xl font-bold text-white">{validationData.marketSize}</div>
                <div className="text-sm text-gray-300">Total Addressable Market</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Growth Rate</h3>
                <div className="text-2xl font-bold text-white">{validationData.marketInsights.growthRate}</div>
                <div className="text-sm text-gray-300">Annual Growth</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Competition</h3>
                <div className="text-2xl font-bold text-white">{validationData.competitionLevel}</div>
                <div className="text-sm text-gray-300">Market Competition</div>
              </div>
            </div>

            {/* Trends */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Market Trends</h3>
              <div className="flex flex-wrap gap-2">
                {validationData.trends.map((trend, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    {trend}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Product-Market Fit */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🎯 Product-Market Fit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Market Gap Analysis</h3>
                <div className="space-y-3">
                  {validationData.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Market Sentiment</h3>
                <div className="p-4 bg-slate-800/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <div className="text-lg font-semibold text-green-400">Positive Momentum</div>
                    <div className="text-sm text-gray-300">Market shows strong adoption potential</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Fit & Execution Context */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">👤 Founder Fit & Execution Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Founder Fit Score</h3>
                <div className="text-3xl font-bold text-white">
                  {validationData.founderFit?.score || 'N/A'}
                </div>
                <div className="text-sm text-gray-300">
                  {validationData.founderFit?.label || 'Not assessed'}
                </div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Execution Difficulty</h3>
                <div className="text-3xl font-bold text-white">
                  {validationData.executionDifficulty?.level || 'N/A'}
                </div>
                <div className="text-sm text-gray-300">Complexity Level</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Time to MVP</h3>
                <div className="text-3xl font-bold text-white">
                  {validationData.timeToMVP?.timeframe || 'N/A'}
                </div>
                <div className="text-sm text-gray-300">Development Timeline</div>
              </div>
            </div>
          </div>

          {/* Risk Analysis */}
          {validationData.riskAnalysis && (
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">⚠️ Risk Analysis</h2>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-white">Overall Risk Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(validationData.riskAnalysis.overallRiskLevel)}`}>
                    {validationData.riskAnalysis.overallRiskLevel}
                  </span>
                </div>
                {validationData.riskAnalysis.criticalRisks > 0 && (
                  <div className="text-red-400 text-sm">
                    {validationData.riskAnalysis.criticalRisks} critical risk(s) identified
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {validationData.riskAnalysis.topRisks.map((risk, index) => (
                  <div key={index} className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{risk.risk}</h4>
                        <div className="text-sm text-gray-400">{risk.category}</div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(risk.severity)}`}>
                          {risk.severity} / {risk.probability}
                        </div>
                        {risk.isCritical && (
                          <div className="text-red-400 text-xs mt-1">CRITICAL</div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="text-sm font-semibold text-gray-300 mb-2">Mitigations:</h5>
                      <div className="space-y-1">
                        {risk.mitigations.map((mitigation, mIndex) => (
                          <div key={mIndex} className="flex items-center text-sm text-gray-300">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>{mitigation.action}</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${getRiskColor(mitigation.priority)}`}>
                              {mitigation.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">💡 Recommendations</h2>
            <div className="space-y-3">
              {validationData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-blue-400 mr-3 mt-1">→</span>
                  <span className="text-gray-300">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🚀 Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/business-plan')}
                className="p-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-white font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="text-lg">Business Plan</div>
                <div className="text-sm opacity-80">Generate revenue model & unit economics</div>
              </button>
              <button
                onClick={() => navigate('/pitch-deck')}
                className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-lg">Pitch Deck</div>
                <div className="text-sm opacity-80">Create VC-ready presentation</div>
              </button>
              <button
                onClick={() => navigate('/idea-input')}
                className="p-6 bg-gradient-to-r from-gray-600 to-slate-600 rounded-lg text-white font-semibold hover:from-gray-700 hover:to-slate-700 transition-all duration-300"
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-lg">New Idea</div>
                <div className="text-sm opacity-80">Start with a different idea</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaValidation;
