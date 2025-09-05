import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FounderBackground {
  domain_expertise: string;
  technical_expertise: 'Low' | 'Medium' | 'High';
  startup_experience: 'None' | 'Some' | 'Extensive';
}

interface ExtractedKeywords {
  industry: string[];
  technology: string[];
  complexity: string[];
  market: string[];
}

const IdeaInput: React.FC = () => {
  const navigate = useNavigate();
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [founderBackground, setFounderBackground] = useState<FounderBackground>({
    domain_expertise: '',
    technical_expertise: 'Medium',
    startup_experience: 'Some'
  });
  const [extractedKeywords, setExtractedKeywords] = useState<ExtractedKeywords | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const extractKeywords = async (description: string) => {
    if (!description.trim()) return;

    setIsAnalyzing(true);
    try {
      // Simulate keyword extraction (in real implementation, this would call the backend)
      const keywords: ExtractedKeywords = {
        industry: [],
        technology: [],
        complexity: [],
        market: []
      };

      const text = description.toLowerCase();
      
      // Industry keywords
      if (text.includes('ai') || text.includes('artificial intelligence')) keywords.industry.push('AI');
      if (text.includes('blockchain') || text.includes('crypto')) keywords.industry.push('Blockchain');
      if (text.includes('saas') || text.includes('software')) keywords.industry.push('SaaS');
      if (text.includes('healthcare') || text.includes('medical')) keywords.industry.push('Healthcare');
      if (text.includes('fintech') || text.includes('financial')) keywords.industry.push('Fintech');
      if (text.includes('ecommerce') || text.includes('marketplace')) keywords.industry.push('E-commerce');
      if (text.includes('edtech') || text.includes('education')) keywords.industry.push('EdTech');

      // Technology keywords
      if (text.includes('machine learning') || text.includes('ml')) keywords.technology.push('Machine Learning');
      if (text.includes('api') || text.includes('integration')) keywords.technology.push('API Integration');
      if (text.includes('mobile') || text.includes('app')) keywords.technology.push('Mobile');
      if (text.includes('web') || text.includes('platform')) keywords.technology.push('Web Platform');
      if (text.includes('cloud') || text.includes('aws')) keywords.technology.push('Cloud');

      // Complexity keywords
      if (text.includes('fda') || text.includes('regulation') || text.includes('compliance')) keywords.complexity.push('Regulatory');
      if (text.includes('infrastructure') || text.includes('scalable')) keywords.complexity.push('Infrastructure');
      if (text.includes('simple') || text.includes('basic')) keywords.complexity.push('Simple');
      if (text.includes('complex') || text.includes('advanced')) keywords.complexity.push('Complex');

      // Market keywords
      if (text.includes('b2b') || text.includes('enterprise')) keywords.market.push('B2B');
      if (text.includes('b2c') || text.includes('consumer')) keywords.market.push('B2C');
      if (text.includes('global') || text.includes('international')) keywords.market.push('Global');
      if (text.includes('local') || text.includes('regional')) keywords.market.push('Local');

      setExtractedKeywords(keywords);
    } catch (error) {
      console.error('Error extracting keywords:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setIdeaDescription(value);
    extractKeywords(value);
  };

  const handleSubmit = () => {
    if (!ideaDescription.trim()) return;

    // Store data in localStorage for the workflow
    const ideaData = {
      title: ideaTitle || 'Untitled Idea',
      description: ideaDescription,
      founderBackground,
      extractedKeywords,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('ideaData', JSON.stringify(ideaData));
    
    // Navigate to validation page
    navigate('/idea-validation');
  };

  const getNextSteps = () => {
    if (!ideaDescription.trim()) return [];
    
    const steps = ['Idea Validation'];
    
    if (extractedKeywords?.industry.includes('AI') || extractedKeywords?.technology.includes('Machine Learning')) {
      steps.push('AI-Specific Analysis');
    }
    
    steps.push('Business Plan Generation', 'Pitch Deck Creation');
    
    return steps;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-gradient-animate">🚀 AI Startup Cofounder</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Describe your startup idea and founder background to get comprehensive AI-powered analysis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Step 1: Idea Input</h2>
            
            {/* Idea Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Idea Title (Optional)
              </label>
              <input
                type="text"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="e.g., AI-Powered Insurance Claims Processing"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Idea Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe Your Startup Idea *
              </label>
              <textarea
                value={ideaDescription}
                onChange={handleDescriptionChange}
                placeholder="Describe your startup idea in detail. Include the problem you're solving, your solution, target market, and any key technologies or approaches..."
                rows={6}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
              {isAnalyzing && (
                <div className="mt-2 flex items-center text-purple-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 mr-2"></div>
                  Analyzing keywords...
                </div>
              )}
            </div>

            {/* Extracted Keywords */}
            {extractedKeywords && (
              <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-3">Extracted Keywords</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {extractedKeywords.industry.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-purple-400 mb-1">Industry</h4>
                      <div className="flex flex-wrap gap-1">
                        {extractedKeywords.industry.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {extractedKeywords.technology.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-400 mb-1">Technology</h4>
                      <div className="flex flex-wrap gap-1">
                        {extractedKeywords.technology.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {extractedKeywords.complexity.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-400 mb-1">Complexity</h4>
                      <div className="flex flex-wrap gap-1">
                        {extractedKeywords.complexity.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {extractedKeywords.market.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-green-400 mb-1">Market</h4>
                      <div className="flex flex-wrap gap-1">
                        {extractedKeywords.market.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Founder Background */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Founder Background (Optional for Enhanced Scoring)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Domain Expertise
                  </label>
                  <input
                    type="text"
                    value={founderBackground.domain_expertise}
                    onChange={(e) => setFounderBackground(prev => ({ ...prev, domain_expertise: e.target.value }))}
                    placeholder="e.g., Healthcare, Fintech, AI"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technical Expertise
                  </label>
                  <select
                    value={founderBackground.technical_expertise}
                    onChange={(e) => setFounderBackground(prev => ({ ...prev, technical_expertise: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Startup Experience
                  </label>
                  <select
                    value={founderBackground.startup_experience}
                    onChange={(e) => setFounderBackground(prev => ({ ...prev, startup_experience: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  >
                    <option value="None">None</option>
                    <option value="Some">Some</option>
                    <option value="Extensive">Extensive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Next Steps Preview */}
            {ideaDescription.trim() && (
              <div className="mb-8 p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-3">What Will Be Generated Next:</h3>
                <div className="flex flex-wrap gap-2">
                  {getNextSteps().map((step, index) => (
                    <div key={index} className="flex items-center">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-full">
                        {step}
                      </span>
                      {index < getNextSteps().length - 1 && (
                        <span className="mx-2 text-gray-400">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!ideaDescription.trim()}
              className="w-full btn-anime px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {ideaDescription.trim() ? 'Generate AI Analysis →' : 'Enter Your Idea to Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaInput;
