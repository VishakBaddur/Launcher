import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { safeMap, safeAccess, fallbackData, logFallbackUsage } from '../utils/safeData';

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
  const [enrichment, setEnrichment] = useState<{ key?: string; statusUrl?: string; resultUrl?: string; status?: string; confidence?: number } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ideaData');
    if (stored) {
      setIdeaData(JSON.parse(stored));
      generateBusinessPlan(JSON.parse(stored));
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
              setBusinessPlanData(prev => {
                if (!prev) return prev;
                const hasTrends = !!rj?.data?.trends;
                const delta = hasTrends ? 3 : 0;
                return {
                  ...prev,
                  businessModelFitScore: Math.min(95, (prev.businessModelFitScore || 70) + delta)
                } as BusinessPlanData;
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

  const generateBusinessPlan = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/generate_business_model`, {
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
        const safeResult = {
          businessModelFitScore: safeAccess(result, 'businessModelFitScore', 75),
          revenueStreams: safeAccess(result, 'businessModelCanvas.revenueStreams', fallbackData.businessPlan.revenueStreams),
          costStructure: safeAccess(result, 'businessModelCanvas.costStructure', fallbackData.businessPlan.costStructure),
          customerSegments: safeAccess(result, 'businessModelCanvas.customerSegments', fallbackData.businessPlan.customerSegments),
          keyPartnerships: safeAccess(result, 'businessModelCanvas.keyPartnerships', fallbackData.businessPlan.keyPartnerships),
          unitEconomics: safeAccess(result, 'unitEconomics', fallbackData.businessPlan.unitEconomics),
          scalabilityAnalysis: safeAccess(result, 'scalabilityAnalysis', fallbackData.businessPlan.scalabilityAnalysis),
          partnershipViability: safeAccess(result, 'partnershipViability', fallbackData.businessPlan.partnershipViability)
        };
        setBusinessPlanData(safeResult);

        const enrichmentKey = result?.enrichmentKey;
        const statusUrl = result?.enrichment?.statusUrl;
        const resultUrl = result?.enrichment?.resultUrl;
        if (enrichmentKey && statusUrl && resultUrl) {
          setEnrichment({ key: enrichmentKey, statusUrl, resultUrl, status: 'pending' });
          pollEnrichment(enrichmentKey, statusUrl, resultUrl);
        }
      } else {
        console.error('Business plan generation failed');
        logFallbackUsage('BusinessPlan', 'complete dataset');
        setBusinessPlanData(fallbackData.businessPlan);
      }
    } catch (error) {
      console.error('Error generating business plan:', error);
      logFallbackUsage('BusinessPlan', 'complete dataset (network error)');
      setBusinessPlanData(fallbackData.businessPlan);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/70 mb-2">Generating business plan...</div>
          <div className="text-sm text-white/50">This takes 5-10 seconds</div>
        </div>
      </div>
    );
  }

  if (!businessPlanData || !ideaData) {
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
              <Link to="/idea-validation" className="text-sm text-white/70 hover:text-white transition-colors">
                Back to Validation
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="heading-1 mb-4">Business Model</h1>
          <p className="body-text text-xl">{ideaData.title || 'Untitled Idea'}</p>
        </div>

        {/* Business Model Fit Score */}
        <div className="card p-10 mb-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="heading-2 mb-3">Business Model Fit</h2>
              <p className="text-sm text-white/50 uppercase tracking-wider">Overall viability of the business model</p>
            </div>
            <div className="text-right">
              <div className="metric">{businessPlanData.businessModelFitScore}</div>
              <div className="metric-label">out of 100</div>
            </div>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="card p-10 mb-12">
          <h2 className="heading-2 mb-8">Revenue Streams</h2>
          <div className="space-y-4">
              {safeMap(businessPlanData.revenueStreams, (stream, index) => (
                <div key={index} className="border-l border-white/10 pl-6 pb-8 last:pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-xl font-light text-white mb-2">{stream.stream}</div>
                      <div className="text-sm text-white/50">{stream.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light text-white">{stream.projectedPercentage}%</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">{stream.priority}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-6 mt-6 text-sm">
                    <div>
                      <div className="text-white/50 uppercase tracking-wider text-xs mb-1">ARPU</div>
                      <div className="text-lg font-light text-white">${stream.unitEconomics.arpu}</div>
                    </div>
                    <div>
                      <div className="text-white/50 uppercase tracking-wider text-xs mb-1">Churn</div>
                      <div className="text-lg font-light text-white">{stream.unitEconomics.churnRate}%</div>
                    </div>
                    <div>
                      <div className="text-white/50 uppercase tracking-wider text-xs mb-1">LTV</div>
                      <div className="text-lg font-light text-white">${stream.unitEconomics.ltv}</div>
                    </div>
                    <div>
                      <div className="text-white/50 uppercase tracking-wider text-xs mb-1">CAC</div>
                      <div className="text-lg font-light text-white">${stream.unitEconomics.cac}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Unit Economics */}
        <div className="card p-10 mb-12">
          <h2 className="heading-2 mb-8">Unit Economics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Contribution Margin</div>
              <div className="text-3xl font-light text-white">
                {safeAccess(businessPlanData, 'unitEconomics.contributionMargin', 60)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Payback Period</div>
              <div className="text-3xl font-light text-white">
                {safeAccess(businessPlanData, 'unitEconomics.paybackPeriod', 12)} months
              </div>
            </div>
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">LTV:CAC Ratio</div>
              <div className="text-3xl font-light text-white">
                {safeAccess(businessPlanData, 'unitEconomics.ltvCacRatio', 10)}:1
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Profitability Assessment</div>
            <div className="text-xl font-light text-white">
              {safeAccess(businessPlanData, 'unitEconomics.profitabilityAssessment', 'Good')}
            </div>
          </div>
        </div>

        {/* Business Model Canvas Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card p-10">
            <h2 className="heading-2 mb-6">Cost Structure</h2>
            <ul className="space-y-4">
              {safeMap(businessPlanData.costStructure, (cost, index) => (
                <li key={index} className="flex items-start text-base text-white/70">
                  <span className="text-white mr-4">—</span>
                  <span>{cost}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-10">
            <h2 className="heading-2 mb-6">Customer Segments</h2>
            <ul className="space-y-4">
              {safeMap(businessPlanData.customerSegments, (segment, index) => (
                <li key={index} className="flex items-start text-base text-white/70">
                  <span className="text-white mr-4">—</span>
                  <span>{segment}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Partnerships */}
        {businessPlanData.keyPartnerships.length > 0 && (
          <div className="card p-10 mb-12">
            <h2 className="heading-2 mb-6">Key Partnerships</h2>
            <ul className="space-y-4">
              {safeMap(businessPlanData.keyPartnerships, (partnership, index) => (
                <li key={index} className="flex items-start text-base text-white/70">
                  <span className="text-white mr-4">—</span>
                  <span>{partnership}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scalability Analysis */}
        {businessPlanData.scalabilityAnalysis && (
          <div className="card p-10 mb-12">
            <h2 className="heading-2 mb-8">Scalability Analysis</h2>
            <div className="mb-6">
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Scalability Level</div>
              <div className="text-xl font-light text-white">
                {safeAccess(businessPlanData, 'scalabilityAnalysis.scalabilityLevel', 'High')}
              </div>
            </div>
            <div className="text-base text-white/70 mb-6">
              {safeAccess(businessPlanData, 'scalabilityAnalysis.reasoning', '')}
            </div>
            {safeAccess(businessPlanData, 'scalabilityAnalysis.challenges', []).length > 0 && (
              <div className="mb-6">
                <div className="text-sm text-white/70 uppercase tracking-wider mb-4">Challenges</div>
                <ul className="space-y-2">
                  {safeMap(safeAccess(businessPlanData, 'scalabilityAnalysis.challenges', []), (challenge, index) => (
                    <li key={index} className="text-base text-white/70">— {challenge}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link to="/pitch-deck" className="btn-primary">
            Create Pitch Deck
          </Link>
          <Link to="/idea-validation" className="btn-secondary">
            Back to Validation
          </Link>
        </div>
      </main>
    </div>
  );
};

export default BusinessPlan;
