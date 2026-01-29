import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { safeMap, safeAccess, fallbackData, logFallbackUsage } from '../utils/safeData';

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
  const [enrichment, setEnrichment] = useState<{ key?: string; statusUrl?: string; resultUrl?: string; status?: string; confidence?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ideaData, setIdeaData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ideaData');
    if (stored) {
      setIdeaData(JSON.parse(stored));
      validateIdea(JSON.parse(stored));
    } else {
      navigate('/idea-input');
    }
  }, [navigate]);

  const baseUrl = 'https://launcher-backend-cxxk.onrender.com';

  const pollEnrichment = async (key: string, statusUrl?: string, resultUrl?: string) => {
    if (!statusUrl || !resultUrl) return;
    const absStatus = statusUrl.startsWith('http') ? statusUrl : `${baseUrl}${statusUrl}`;
    const absResult = resultUrl.startsWith('http') ? resultUrl : `${baseUrl}${resultUrl}`;
    let attempts = 0;
    const maxAttempts = 10;
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
    while (attempts < maxAttempts) {
      try {
        const st = await fetch(absStatus);
        if (st.ok) {
          const s = await st.json();
          setEnrichment(prev => ({ ...(prev || {}), status: s.status, confidence: s.confidence, key }));
          if (s.status === 'completed') {
            const rr = await fetch(absResult);
            if (rr.ok) {
              const rj = await rr.json();
              setValidationData(prev => {
                if (!prev) return prev;
                const enrichedTrends = rj?.data?.trends ? Object.keys(rj.data.trends).slice(0, 5) : prev.marketInsights.trends;
                return {
                  ...prev,
                  marketInsights: {
                    ...prev.marketInsights,
                    trends: enrichedTrends
                  }
                } as ValidationData;
              });
              setEnrichment(prev => ({ ...(prev || {}), status: 'completed', confidence: rj.confidence, key }));
            }
            break;
          }
        }
      } catch {}
      attempts++;
      await delay(1500);
    }
  };

  const validateIdea = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/validate_idea`, {
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
        const safeResult = {
          feasibilityScore: safeAccess(result, 'feasibilityScore', fallbackData.ideaValidation.feasibilityScore),
          marketSize: safeAccess(result, 'marketAnalysis.marketSize', fallbackData.ideaValidation.marketSize),
          competitionLevel: safeAccess(result, 'marketAnalysis.competitionLevel', fallbackData.ideaValidation.competitionLevel),
          trends: safeAccess(result, 'marketInsights.trends', fallbackData.ideaValidation.trends),
          opportunities: safeAccess(result, 'opportunities', fallbackData.ideaValidation.opportunities),
          risks: safeAccess(result, 'risks', fallbackData.ideaValidation.risks),
          recommendations: safeAccess(result, 'recommendations', fallbackData.ideaValidation.recommendations),
          marketInsights: safeAccess(result, 'marketInsights', fallbackData.ideaValidation.marketInsights),
          founderFit: safeAccess(result, 'founderFit', fallbackData.ideaValidation.founderFit),
          executionDifficulty: safeAccess(result, 'executionDifficulty', fallbackData.ideaValidation.executionDifficulty),
          timeToMVP: safeAccess(result, 'timeToMVP', fallbackData.ideaValidation.timeToMVP),
          riskAnalysis: safeAccess(result, 'riskAnalysis', fallbackData.ideaValidation.riskAnalysis)
        };
        setValidationData(safeResult);

        const enrichmentKey = result?.enrichmentKey;
        const statusUrl = result?.enrichment?.statusUrl;
        const resultUrl = result?.enrichment?.resultUrl;
        if (enrichmentKey && statusUrl && resultUrl) {
          setEnrichment({ key: enrichmentKey, statusUrl, resultUrl, status: 'pending' });
          pollEnrichment(enrichmentKey, statusUrl, resultUrl);
        }
      } else {
        console.error('Validation failed');
        logFallbackUsage('IdeaValidation', 'complete dataset');
        setValidationData(fallbackData.ideaValidation);
      }
    } catch (error) {
      console.error('Error validating idea:', error);
      logFallbackUsage('IdeaValidation', 'complete dataset (network error)');
      setValidationData(fallbackData.ideaValidation);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/70 mb-2">Analyzing your idea...</div>
          <div className="text-sm text-white/50">This takes 5-10 seconds</div>
        </div>
      </div>
    );
  }

  if (!validationData || !ideaData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="heading-2 mb-6">No Idea Data Found</h2>
          <Link to="/idea-input" className="btn-primary">
            Start Over
          </Link>
        </div>
      </div>
    );
  }

  const getRiskBadge = (level: string) => {
    if (!level) return { color: 'border-white/10 text-white/50', label: 'Unknown' };
    const l = level.toLowerCase();
    if (l === 'low') return { color: 'border-white/20 text-white/70', label: 'Low' };
    if (l === 'medium') return { color: 'border-white/20 text-white/70', label: 'Medium' };
    if (l === 'high') return { color: 'border-white/30 text-white', label: 'High' };
    if (l === 'critical') return { color: 'border-white/40 text-white', label: 'Critical' };
    return { color: 'border-white/10 text-white/50', label: level };
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-light tracking-tight">Launcher</Link>
            <div className="flex items-center gap-6">
              {enrichment?.status === 'completed' && (
                <span className="text-xs text-white/50 uppercase tracking-wider">
                  Data quality: {Math.round((enrichment.confidence || 0.7) * 100)}%
                </span>
              )}
              <Link to="/business-plan" className="text-sm text-white/70 hover:text-white transition-colors">
                Business Plan
              </Link>
              <Link to="/pitch-deck" className="text-sm text-white/70 hover:text-white transition-colors">
                Pitch Deck
              </Link>
              <Link to="/idea-input" className="text-sm text-white/70 hover:text-white transition-colors">
                New Idea
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Idea Header */}
        <div className="mb-16">
          <h1 className="heading-1 mb-4">{ideaData.title || 'Untitled Idea'}</h1>
          <p className="body-text text-xl max-w-3xl">{ideaData.description}</p>
        </div>

        {/* Feasibility Score - Large Card */}
        <div className="card p-10 mb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="heading-2 mb-3">Feasibility Score</h2>
              <p className="text-sm text-white/50 uppercase tracking-wider">Overall viability assessment</p>
            </div>
            <div className="text-right">
              <div className="metric">
                {validationData.feasibilityScore}
              </div>
              <div className="metric-label">out of 100</div>
            </div>
          </div>
          
          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Market Size</div>
              <div className="text-xl font-light text-white">{validationData.marketSize}</div>
            </div>
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Competition</div>
              <div className="text-xl font-light text-white">{validationData.competitionLevel}</div>
            </div>
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Founder Fit</div>
              <div className="text-xl font-light text-white">{validationData.founderFit?.label || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Time to MVP</div>
              <div className="text-xl font-light text-white">{validationData.timeToMVP?.timeframe || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Market Analysis */}
        <div className="card p-10 mb-12">
          <h2 className="heading-2 mb-8">Market Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Market Size</div>
              <div className="text-3xl font-light text-white mb-1">{validationData.marketSize}</div>
              <div className="text-xs text-white/50">Total Addressable Market</div>
            </div>
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Growth Rate</div>
              <div className="text-3xl font-light text-white mb-1">{validationData.marketInsights.growthRate}</div>
              <div className="text-xs text-white/50">Annual Growth</div>
            </div>
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Competition Level</div>
              <div className="text-3xl font-light text-white mb-1">{validationData.competitionLevel}</div>
              <div className="text-xs text-white/50">Market Competition</div>
            </div>
          </div>
          
          {validationData.trends.length > 0 && (
            <div className="pt-8 border-t border-white/10">
              <div className="text-sm text-white/70 uppercase tracking-wider mb-4">Market Trends</div>
              <div className="flex flex-wrap gap-3">
                {safeMap(validationData.trends, (trend, index) => (
                  <span key={index} className="px-4 py-2 border border-white/10 text-white/70 text-sm">
                    {trend}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Opportunities & Risks - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card p-10">
            <h2 className="heading-2 mb-6">Opportunities</h2>
            <ul className="space-y-4">
              {safeMap(validationData.opportunities, (opportunity, index) => (
                <li key={index} className="flex items-start text-base text-white/70">
                  <span className="text-white mr-4">—</span>
                  <span>{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-10">
            <h2 className="heading-2 mb-6">Risks</h2>
            <ul className="space-y-4">
              {safeMap(validationData.risks, (risk, index) => (
                <li key={index} className="flex items-start text-base text-white/70">
                  <span className="text-white mr-4">—</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Founder Fit & Execution */}
        {(validationData.founderFit || validationData.executionDifficulty || validationData.timeToMVP) && (
          <div className="card p-10 mb-12">
            <h2 className="heading-2 mb-8">Founder & Execution Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {validationData.founderFit && (
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Founder Fit</div>
                  <div className="text-xl font-light text-white mb-2">{validationData.founderFit.label}</div>
                  <div className="text-xs text-white/50">Score: {validationData.founderFit.score}/100</div>
                </div>
              )}
              {validationData.executionDifficulty && (
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Execution Difficulty</div>
                  <div className="text-xl font-light text-white mb-2">{validationData.executionDifficulty.level}</div>
                  <div className="text-xs text-white/50">{validationData.executionDifficulty.reasoning}</div>
                </div>
              )}
              {validationData.timeToMVP && (
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Time to MVP</div>
                  <div className="text-xl font-light text-white mb-2">{validationData.timeToMVP.timeframe}</div>
                  <div className="text-xs text-white/50">{validationData.timeToMVP.phases?.join(', ') || ''}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Risk Analysis */}
        {validationData.riskAnalysis && validationData.riskAnalysis.topRisks.length > 0 && (
          <div className="card p-10 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-2">Risk Analysis</h2>
              <span className={`px-4 py-2 border text-xs uppercase tracking-wider ${getRiskBadge(validationData.riskAnalysis.overallRiskLevel).color}`}>
                {getRiskBadge(validationData.riskAnalysis.overallRiskLevel).label} Risk
              </span>
            </div>
            <div className="space-y-6">
              {validationData.riskAnalysis.topRisks.slice(0, 5).map((risk, index) => (
                <div key={index} className="border-l border-white/10 pl-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-lg font-light text-white">{risk.risk}</div>
                    <span className={`px-3 py-1 border text-xs uppercase tracking-wider ${getRiskBadge(risk.severity).color}`}>
                      {risk.severity}
                    </span>
                  </div>
                  <div className="text-sm text-white/50 mb-3">{risk.category}</div>
                  {risk.mitigations.length > 0 && (
                    <div className="text-xs text-white/50">
                      Mitigation: {risk.mitigations[0].action}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {validationData.recommendations.length > 0 && (
          <div className="card p-10 mb-12">
            <h2 className="heading-2 mb-6">Recommendations</h2>
            <ul className="space-y-4">
              {safeMap(validationData.recommendations, (rec, index) => (
                <li key={index} className="flex items-start text-base text-white/70">
                  <span className="text-white mr-4">—</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions - Prominent Section */}
        <div className="section-divider pt-12 mt-16">
          <div className="mb-8">
            <h2 className="heading-2 mb-4">Next Steps</h2>
            <p className="body-text">Continue building your startup plan with detailed business model and pitch deck.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link to="/business-plan" className="btn-primary">
              Generate Business Plan
            </Link>
            <Link to="/pitch-deck" className="btn-secondary">
              Create Pitch Deck
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IdeaValidation;
