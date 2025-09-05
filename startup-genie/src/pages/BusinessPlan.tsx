import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface BusinessPlanData {
  businessModelFitScore: number;
  revenueStreams: Array<{
    stream: string;
    priority: string;
    projectedPercentage: number;
    description: string;
    unitEconomics: {
      arpu: number;
      churnRate: number;
      ltv: number;
      cac: number;
    };
  }>;
  costStructure: string[];
  customerSegments: string[];
  keyPartnerships: string[];
  unitEconomics: {
    contributionMargin: number;
    paybackPeriod: number;
    ltvCacRatio: number;
    profitabilityAssessment: string;
    recommendations: string[];
  };
  scalabilityAnalysis: {
    scalabilityLevel: string;
    reasoning: string;
    challenges: string[];
    recommendations: string[];
  };
  partnershipViability: {
    overallViability: string;
    partnerships: Array<{
      partner: string;
      viability: string;
      reasoning: string;
      effort: string;
      timeline: string;
      recommendations: string[];
    }>;
  };
}

const BusinessPlan: React.FC = () => {
  const navigate = useNavigate();
  const [businessPlanData, setBusinessPlanData] = useState<BusinessPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ideaData, setIdeaData] = useState<any>(null);

  useEffect(() => {
    // Get idea data from localStorage
    const stored = localStorage.getItem('ideaData');
    if (stored) {
      setIdeaData(JSON.parse(stored));
      generateBusinessPlan(JSON.parse(stored));
    } else {
      navigate('/idea-input');
    }
  }, [navigate]);

  const generateBusinessPlan = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://launcher-backend-cxxk.onrender.com/api/generate_business_model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_info: {
            description: data.description
          },
          founder_context: data.founderBackground
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setBusinessPlanData(result);
      } else {
        console.error('Business plan generation failed');
      }
    } catch (error) {
      console.error('Error generating business plan:', error);
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

  const getViabilityColor = (viability: string) => {
    switch (viability.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Generating Business Plan</h2>
          <p className="text-gray-300">Analyzing revenue streams, unit economics, and scalability...</p>
        </div>
      </div>
    );
  }

  if (!businessPlanData || !ideaData) {
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
            <span className="text-gradient-animate">📊 Business Plan</span>
          </h1>
          <h2 className="text-2xl text-gray-300 mb-2">{ideaData.title}</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">{ideaData.description}</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Business Model Fit Score */}
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Business Model Fit Score</h2>
              <div className={`text-6xl font-bold ${getScoreColor(businessPlanData.businessModelFitScore)}`}>
                {businessPlanData.businessModelFitScore}/100
              </div>
              <div className={`text-xl font-semibold ${getScoreColor(businessPlanData.businessModelFitScore)}`}>
                {getScoreLabel(businessPlanData.businessModelFitScore)}
              </div>
            </div>

            {/* Confidence Radar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-green-400">Revenue</div>
                <div className="text-sm text-gray-300">Potential</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">Cost</div>
                <div className="text-sm text-gray-300">Structure</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">Market</div>
                <div className="text-sm text-gray-300">Size</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">Scalability</div>
                <div className="text-sm text-gray-300">
                  {businessPlanData.scalabilityAnalysis.scalabilityLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Streams */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">💰 Revenue Streams</h2>
            <div className="space-y-6">
              {businessPlanData.revenueStreams.map((stream, index) => (
                <div key={index} className="p-6 bg-slate-800/30 rounded-lg border border-slate-600">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{stream.stream}</h3>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        stream.priority === 'Primary' ? 'bg-green-500/20 text-green-400' :
                        stream.priority === 'Secondary' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {stream.priority} ({stream.projectedPercentage}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{stream.projectedPercentage}%</div>
                      <div className="text-sm text-gray-400">Projected Share</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{stream.description}</p>
                  
                  {/* Unit Economics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-sm text-gray-400">ARPU</div>
                      <div className="text-lg font-semibold text-white">${stream.unitEconomics.arpu}</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-sm text-gray-400">Churn Rate</div>
                      <div className="text-lg font-semibold text-white">{stream.unitEconomics.churnRate}%</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-sm text-gray-400">LTV</div>
                      <div className="text-lg font-semibold text-white">${stream.unitEconomics.ltv}</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="text-sm text-gray-400">CAC</div>
                      <div className="text-lg font-semibold text-white">${stream.unitEconomics.cac}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unit Economics Analysis */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">📈 Unit Economics & Profitability</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Contribution Margin</h3>
                <div className="text-3xl font-bold text-white">{businessPlanData.unitEconomics.contributionMargin}%</div>
                <div className="text-sm text-gray-300">After variable costs</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Payback Period</h3>
                <div className="text-3xl font-bold text-white">{businessPlanData.unitEconomics.paybackPeriod} months</div>
                <div className="text-sm text-gray-300">CAC recovery time</div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">LTV:CAC Ratio</h3>
                <div className="text-3xl font-bold text-white">{businessPlanData.unitEconomics.ltvCacRatio}:1</div>
                <div className="text-sm text-gray-300">Lifetime value ratio</div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Profitability Assessment</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                businessPlanData.unitEconomics.profitabilityAssessment === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                businessPlanData.unitEconomics.profitabilityAssessment === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                businessPlanData.unitEconomics.profitabilityAssessment === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {businessPlanData.unitEconomics.profitabilityAssessment}
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Recommendations:</h4>
                <ul className="space-y-1">
                  {businessPlanData.unitEconomics.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-300">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">👥 Customer Segments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessPlanData.customerSegments.map((segment, index) => (
                <div key={index} className="p-4 bg-slate-800/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Segment {index + 1}</h3>
                  <p className="text-gray-300">{segment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scalability Analysis */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🚀 Scalability & Growth Considerations</h2>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Scalability Level</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  businessPlanData.scalabilityAnalysis.scalabilityLevel === 'High' ? 'bg-green-500/20 text-green-400' :
                  businessPlanData.scalabilityAnalysis.scalabilityLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {businessPlanData.scalabilityAnalysis.scalabilityLevel}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{businessPlanData.scalabilityAnalysis.reasoning}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-orange-400 mb-3">Challenges</h4>
                <ul className="space-y-2">
                  {businessPlanData.scalabilityAnalysis.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-300">
                      <span className="text-red-400 mr-2">⚠</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {businessPlanData.scalabilityAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Partnership Viability */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🤝 Key Partnerships</h2>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Overall Partnership Viability</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getViabilityColor(businessPlanData.partnershipViability.overallViability)}`}>
                  {businessPlanData.partnershipViability.overallViability}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {businessPlanData.partnershipViability.partnerships.map((partnership, index) => (
                <div key={index} className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">{partnership.partner}</h4>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getViabilityColor(partnership.viability)}`}>
                        {partnership.viability}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">{partnership.effort} • {partnership.timeline}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3">{partnership.reasoning}</p>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-300 mb-2">Recommendations:</h5>
                    <ul className="space-y-1">
                      {partnership.recommendations.map((rec, rIndex) => (
                        <li key={rIndex} className="flex items-start text-sm text-gray-300">
                          <span className="text-blue-400 mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Structure */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">💸 Cost Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessPlanData.costStructure.map((cost, index) => (
                <div key={index} className="p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-orange-400 mr-3">💰</span>
                    <span className="text-gray-300">{cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🚀 Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate('/pitch-deck')}
                className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-lg">Pitch Deck</div>
                <div className="text-sm opacity-80">Create VC-ready presentation</div>
              </button>
              <button
                onClick={() => navigate('/idea-validation')}
                className="p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-white font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="text-lg">Back to Validation</div>
                <div className="text-sm opacity-80">Review market analysis</div>
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

export default BusinessPlan;
