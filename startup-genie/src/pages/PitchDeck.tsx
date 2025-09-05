import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PitchDeckData {
  pitchReadinessScore: number;
  slides: Array<{
    id: string;
    title: string;
    content: string;
    presenterNotes: string;
    visualAid?: string;
  }>;
  investorFit: {
    suggestedInvestorTypes: string[];
    nextSteps: string[];
  };
}

const PitchDeck: React.FC = () => {
  const navigate = useNavigate();
  const [pitchDeckData, setPitchDeckData] = useState<PitchDeckData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ideaData, setIdeaData] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Get idea data from localStorage
    const stored = localStorage.getItem('ideaData');
    if (stored) {
      setIdeaData(JSON.parse(stored));
      generatePitchDeck(JSON.parse(stored));
    } else {
      navigate('/idea-input');
    }
  }, [navigate]);

  const generatePitchDeck = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://launcher-backend-cxxk.onrender.com/api/create_pitch_deck', {
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
        // Ensure all required fields exist with fallback values
        const safeResult = {
          pitchReadinessScore: result.pitchReadinessScore || 75,
          slides: result.slides || [
            {
              id: '1',
              title: 'Problem Statement',
              content: 'The current market faces significant challenges in efficiency and cost-effectiveness. Our solution addresses these pain points directly.',
              presenterNotes: 'Start with a compelling problem that resonates with your audience. Use data and examples to make it tangible.',
              visualAid: 'Problem-solution diagram showing market gap'
            },
            {
              id: '2',
              title: 'Solution',
              content: 'Our innovative platform leverages cutting-edge technology to solve the identified problems with a scalable, user-friendly approach.',
              presenterNotes: 'Clearly articulate your unique value proposition. Focus on benefits, not just features.',
              visualAid: 'Product mockup or architecture diagram'
            }
          ],
          investorFit: result.investorFit || {
            suggestedInvestorTypes: ['Early-stage VCs', 'Angel investors', 'Industry-specific funds'],
            nextSteps: ['Prepare financial projections', 'Build MVP', 'Gather customer feedback']
          }
        };
        setPitchDeckData(safeResult);
      } else {
        console.error('Pitch deck generation failed');
        // Set fallback data if API fails
        setPitchDeckData({
          pitchReadinessScore: 75,
          slides: [
            {
              id: '1',
              title: 'Problem Statement',
              content: 'The current market faces significant challenges in efficiency and cost-effectiveness. Our solution addresses these pain points directly.',
              presenterNotes: 'Start with a compelling problem that resonates with your audience. Use data and examples to make it tangible.',
              visualAid: 'Problem-solution diagram showing market gap'
            },
            {
              id: '2',
              title: 'Solution',
              content: 'Our innovative platform leverages cutting-edge technology to solve the identified problems with a scalable, user-friendly approach.',
              presenterNotes: 'Clearly articulate your unique value proposition. Focus on benefits, not just features.',
              visualAid: 'Product mockup or architecture diagram'
            }
          ],
          investorFit: {
            suggestedInvestorTypes: ['Early-stage VCs', 'Angel investors', 'Industry-specific funds'],
            nextSteps: ['Prepare financial projections', 'Build MVP', 'Gather customer feedback']
          }
        });
      }
    } catch (error) {
      console.error('Error generating pitch deck:', error);
      // Set fallback data if network error
      setPitchDeckData({
        pitchReadinessScore: 75,
        slides: [
          {
            id: '1',
            title: 'Problem Statement',
            content: 'The current market faces significant challenges in efficiency and cost-effectiveness. Our solution addresses these pain points directly.',
            presenterNotes: 'Start with a compelling problem that resonates with your audience. Use data and examples to make it tangible.',
            visualAid: 'Problem-solution diagram showing market gap'
          },
          {
            id: '2',
            title: 'Solution',
            content: 'Our innovative platform leverages cutting-edge technology to solve the identified problems with a scalable, user-friendly approach.',
            presenterNotes: 'Clearly articulate your unique value proposition. Focus on benefits, not just features.',
            visualAid: 'Product mockup or architecture diagram'
          }
        ],
        investorFit: {
          suggestedInvestorTypes: ['Early-stage VCs', 'Angel investors', 'Industry-specific funds'],
          nextSteps: ['Prepare financial projections', 'Build MVP', 'Gather customer feedback']
        }
      });
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
    if (score >= 80) return 'Ready';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  const nextSlide = () => {
    if (pitchDeckData && currentSlide < pitchDeckData.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Creating Pitch Deck</h2>
          <p className="text-gray-300">Generating VC-ready slides and narrative flow...</p>
        </div>
      </div>
    );
  }

  if (!pitchDeckData || !ideaData) {
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
            <span className="text-gradient-animate">🎯 Pitch Deck</span>
          </h1>
          <h2 className="text-2xl text-gray-300 mb-2">{ideaData.title}</h2>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Pitch Readiness Score */}
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Pitch Readiness Score</h2>
              <div className={`text-6xl font-bold ${getScoreColor(pitchDeckData.pitchReadinessScore)}`}>
                {pitchDeckData.pitchReadinessScore}/100
              </div>
              <div className={`text-xl font-semibold ${getScoreColor(pitchDeckData.pitchReadinessScore)}`}>
                {getScoreLabel(pitchDeckData.pitchReadinessScore)}
              </div>
            </div>

            {/* Confidence Radar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-green-400">Market</div>
                <div className="text-sm text-gray-300">Opportunity</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">Problem</div>
                <div className="text-sm text-gray-300">Fit</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">Competition</div>
                <div className="text-sm text-gray-300">Analysis</div>
              </div>
              <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">Solution</div>
                <div className="text-sm text-gray-300">Clarity</div>
              </div>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Pitch Deck Slides</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-gray-300">
                  {currentSlide + 1} of {pitchDeckData.slides.length}
                </span>
                <button
                  onClick={nextSlide}
                  disabled={currentSlide === pitchDeckData.slides.length - 1}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Slide Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / pitchDeckData.slides.length) * 100}%` }}
              ></div>
            </div>

            {/* Slide Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {pitchDeckData.slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex-shrink-0 p-3 rounded-lg text-sm font-medium transition-all ${
                    currentSlide === index
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {index + 1}. {slide.title}
                </button>
              ))}
            </div>
          </div>

          {/* Current Slide */}
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Slide Content */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {pitchDeckData.slides[currentSlide].title}
                  </h2>
                  
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                      {pitchDeckData.slides[currentSlide].content}
                    </div>
                  </div>

                  {pitchDeckData.slides[currentSlide].visualAid && (
                    <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-2">Visual Aid</h4>
                      <div className="text-gray-300">{pitchDeckData.slides[currentSlide].visualAid}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Presenter Notes */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <h3 className="text-xl font-bold text-white mb-4">Presenter Notes</h3>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {pitchDeckData.slides[currentSlide].presenterNotes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investor Fit */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🎯 Investor Fit & Recommendations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">Suggested Investor Types</h3>
                <div className="space-y-2">
                  {pitchDeckData.investorFit.suggestedInvestorTypes.map((type, index) => (
                    <div key={index} className="flex items-center p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-green-400 mr-3">🎯</span>
                      <span className="text-gray-300">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Next Actionable Steps</h3>
                <div className="space-y-2">
                  {pitchDeckData.investorFit.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-blue-400 mr-3 mt-1">→</span>
                      <span className="text-gray-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">📤 Export & Share</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="p-6 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg text-white font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300">
                <div className="text-2xl mb-2">📄</div>
                <div className="text-lg">Export PDF</div>
                <div className="text-sm opacity-80">Download presentation</div>
              </button>
              <button className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300">
                <div className="text-2xl mb-2">🔗</div>
                <div className="text-lg">Share Link</div>
                <div className="text-sm opacity-80">Generate shareable URL</div>
              </button>
              <button className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                <div className="text-2xl mb-2">📧</div>
                <div className="text-lg">Email Deck</div>
                <div className="text-sm opacity-80">Send to investors</div>
              </button>
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
                <div className="text-lg">Back to Business Plan</div>
                <div className="text-sm opacity-80">Review financial model</div>
              </button>
              <button
                onClick={() => navigate('/idea-validation')}
                className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <div className="text-2xl mb-2">📈</div>
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

export default PitchDeck;
