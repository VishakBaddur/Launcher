import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { safeMap, safeAccess, fallbackData, logFallbackUsage } from '../utils/safeData';

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
          startup_info: {
            startupName: data.title || 'Your Startup',
            description: data.description
          },
          founder_context: data.founderBackground
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const safeResult = {
          pitchReadinessScore: 75,
          slides: safeAccess(result, 'slides', fallbackData.pitchDeck.slides),
          investorFit: {
            suggestedInvestorTypes: ['Early-stage VCs', 'Angel investors', 'Corporate VCs'],
            nextSteps: ['Prepare detailed financial projections', 'Build MVP', 'Secure pilot customers', 'Assemble advisory board']
          }
        };
        setPitchDeckData(safeResult);
      } else {
        console.error('Pitch deck generation failed');
        logFallbackUsage('PitchDeck', 'complete dataset');
        setPitchDeckData(fallbackData.pitchDeck);
      }
    } catch (error) {
      console.error('Error generating pitch deck:', error);
      logFallbackUsage('PitchDeck', 'complete dataset (network error)');
      setPitchDeckData(fallbackData.pitchDeck);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/70 mb-2">Creating pitch deck...</div>
          <div className="text-sm text-white/50">This takes 5-10 seconds</div>
        </div>
      </div>
    );
  }

  if (!pitchDeckData || !ideaData) {
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
            <Link to="/business-plan" className="text-sm text-white/70 hover:text-white transition-colors">
              Back to Business Plan
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="heading-1 mb-4">Pitch Deck</h1>
          <p className="body-text text-xl">{ideaData.title || 'Untitled Idea'}</p>
        </div>

        {/* Slide Navigation */}
        {pitchDeckData.slides && pitchDeckData.slides.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {safeMap(pitchDeckData.slides, (slide, index) => (
                <button
                  key={slide.id || index}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex-shrink-0 px-4 py-2 text-sm font-medium border transition-colors ${
                    currentSlide === index
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-white/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  {index + 1}. {slide.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Slide */}
        {pitchDeckData.slides && pitchDeckData.slides[currentSlide] && (
          <div className="card p-10 mb-12">
            <div className="mb-8">
              <div className="text-xs text-white/50 uppercase tracking-wider mb-4">
                Slide {currentSlide + 1} of {pitchDeckData.slides.length}
              </div>
              <h2 className="heading-2 mb-6">
                {pitchDeckData.slides[currentSlide].title}
              </h2>
              <div className="body-text text-lg whitespace-pre-line">
                {pitchDeckData.slides[currentSlide].content}
              </div>
            </div>

            {pitchDeckData.slides[currentSlide].presenterNotes && (
              <div className="pt-8 border-t border-white/10">
                <div className="text-sm text-white/70 uppercase tracking-wider mb-4">Presenter Notes</div>
                <div className="text-base text-white/70 bg-black border border-white/10 p-6">
                  {pitchDeckData.slides[currentSlide].presenterNotes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Controls */}
        {pitchDeckData.slides && pitchDeckData.slides.length > 1 && (
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentSlide(Math.min((pitchDeckData.slides?.length || 0) - 1, currentSlide + 1))}
              disabled={currentSlide === (pitchDeckData.slides?.length || 0) - 1}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Investor Fit */}
        <div className="card p-10 mb-12">
          <h2 className="heading-2 mb-8">Investor Fit</h2>
          <div className="mb-8">
            <div className="text-sm text-white/70 uppercase tracking-wider mb-4">Suggested Investor Types</div>
            <div className="flex flex-wrap gap-3">
              {safeMap(pitchDeckData.investorFit.suggestedInvestorTypes, (type, index) => (
                <span key={index} className="px-4 py-2 border border-white/10 text-white/70 text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-white/70 uppercase tracking-wider mb-4">Next Steps</div>
            <ul className="space-y-3">
              {safeMap(pitchDeckData.investorFit.nextSteps, (step, index) => (
                <li key={index} className="flex items-start text-base text-white/70">
                  <span className="text-white mr-4">—</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/business-plan" className="btn-secondary">
            Back to Business Plan
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-primary"
          >
            Export PDF
          </button>
        </div>
      </main>
    </div>
  );
};

export default PitchDeck;
