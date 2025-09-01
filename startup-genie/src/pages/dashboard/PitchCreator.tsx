import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mcpService } from '../../services/mcpService';
import type { User, PitchDeck } from '../../types';

interface PitchCreatorProps {
  user: User;
  onLogout: () => void;
}

const PitchCreator = ({ user, onLogout }: PitchCreatorProps) => {
  const navigate = useNavigate();
  const [startupName, setStartupName] = useState('');
  const [pitchDescription, setPitchDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePitch = async () => {
    if (!startupName.trim() || !pitchDescription.trim()) {
      setError('Please fill in both startup name and pitch description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await mcpService.createPitchDeck({
        startupName,
        description: pitchDescription
      });
      
      console.log('Pitch deck result:', result); // Debug log
      console.log('Result type:', typeof result); // Debug log
      console.log('Result keys:', Object.keys(result || {})); // Debug log
      
      setPitchDeck(result);
    } catch (err) {
      setError('Failed to create pitch deck. Please try again.');
      console.error('Error creating pitch deck:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadPitchDeck = () => {
    if (!pitchDeck || !pitchDeck.slides) return;
    
    const content = `
# ${pitchDeck.startupName} - Investor Pitch Deck

${pitchDeck.slides.map((slide, index) => `
## Slide ${index + 1}: ${slide.title}

**Content:**
${slide.content}

**Presenter Notes:**
${slide.presenterNotes}
`).join('\n\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pitchDeck.startupName}-pitch-deck.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🚀 Launcher - Pitch Creator
          </h1>
          <div className="flex items-center space-x-4">
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
        {!pitchDeck ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Investor Pitch Creator</h2>
              <button
                onClick={handleBackToDashboard}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
            <p className="text-gray-600 mb-8">
              Generate professional pitch decks with AI-crafted slides and presenter notes.
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Name
                </label>
                <input
                  type="text"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your startup name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pitch Description
                </label>
                <textarea
                  value={pitchDescription}
                  onChange={(e) => setPitchDescription(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your startup idea, market opportunity, and value proposition..."
                />
              </div>
              
              <button 
                onClick={handleCreatePitch}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Pitch Deck...' : 'Create Pitch Deck'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {pitchDeck?.startupName || 'Startup'} - Pitch Deck
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={downloadPitchDeck}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => setPitchDeck(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Create New
                  </button>
                </div>
              </div>
              
              {!pitchDeck?.slides || pitchDeck.slides.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No slides generated. Please try again.</p>
                  <button
                    onClick={() => setPitchDeck(null)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create New Pitch Deck
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {pitchDeck.slides.map((slide, index) => (
                    <div key={slide.id || index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Slide {index + 1}: {slide.title}
                        </h3>
                        <button
                          onClick={() => copyToClipboard(`${slide.title}\n\n${slide.content}\n\nPresenter Notes:\n${slide.presenterNotes}`)}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          📋 Copy
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Content:</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-800 whitespace-pre-wrap">{slide.content}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Presenter Notes:</h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-800 text-sm whitespace-pre-wrap">{slide.presenterNotes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchCreator; 