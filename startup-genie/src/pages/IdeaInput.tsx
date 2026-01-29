import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
      const keywords: ExtractedKeywords = {
        industry: [],
        technology: [],
        complexity: [],
        market: []
      };

      const text = description.toLowerCase();
      
      if (text.includes('ai') || text.includes('artificial intelligence')) keywords.industry.push('AI');
      if (text.includes('blockchain') || text.includes('crypto')) keywords.industry.push('Blockchain');
      if (text.includes('saas') || text.includes('software')) keywords.industry.push('SaaS');
      if (text.includes('healthcare') || text.includes('medical')) keywords.industry.push('Healthcare');
      if (text.includes('fintech') || text.includes('financial')) keywords.industry.push('Fintech');
      if (text.includes('ecommerce') || text.includes('marketplace')) keywords.industry.push('E-commerce');
      if (text.includes('edtech') || text.includes('education')) keywords.industry.push('EdTech');

      if (text.includes('machine learning') || text.includes('ml')) keywords.technology.push('Machine Learning');
      if (text.includes('api') || text.includes('integration')) keywords.technology.push('API Integration');
      if (text.includes('mobile') || text.includes('app')) keywords.technology.push('Mobile');
      if (text.includes('web') || text.includes('platform')) keywords.technology.push('Web Platform');
      if (text.includes('cloud') || text.includes('aws')) keywords.technology.push('Cloud');

      if (text.includes('fda') || text.includes('regulation') || text.includes('compliance')) keywords.complexity.push('Regulatory');
      if (text.includes('infrastructure') || text.includes('scalable')) keywords.complexity.push('Infrastructure');
      if (text.includes('simple') || text.includes('basic')) keywords.complexity.push('Simple');
      if (text.includes('complex') || text.includes('advanced')) keywords.complexity.push('Complex');

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

    const ideaData = {
      title: ideaTitle || 'Untitled Idea',
      description: ideaDescription,
      founderBackground,
      extractedKeywords,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('ideaData', JSON.stringify(ideaData));
    navigate('/idea-validation');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-6">
          <Link to="/" className="text-xl font-light tracking-tight">Launcher</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="heading-1 mb-4">Validate Your Startup Idea</h1>
          <p className="body-text text-xl">Describe your idea and we'll analyze feasibility, market size, and risks.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-10">
          {/* Idea Title */}
          <div>
            <label htmlFor="title" className="block text-sm text-white/70 uppercase tracking-wider mb-3">
              Idea Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={ideaTitle}
              onChange={(e) => setIdeaTitle(e.target.value)}
              placeholder="e.g., AI-powered laundry scheduling app"
              className="input"
            />
          </div>

          {/* Idea Description */}
          <div>
            <label htmlFor="description" className="block text-sm text-white/70 uppercase tracking-wider mb-3">
              Describe Your Startup Idea *
            </label>
            <textarea
              id="description"
              value={ideaDescription}
              onChange={handleDescriptionChange}
              placeholder="Describe your startup idea in detail. Include the problem you're solving, your solution, target market, and any key technologies or approaches..."
              rows={10}
              className="textarea"
              required
            />
            {isAnalyzing && (
              <p className="mt-3 text-sm text-white/50">Analyzing keywords...</p>
            )}
          </div>

          {/* Extracted Keywords */}
          {extractedKeywords && (
            <div className="card p-6">
              <div className="text-sm text-white/70 uppercase tracking-wider mb-4">Detected Keywords</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                {extractedKeywords.industry.length > 0 && (
                  <div>
                    <div className="text-white/50 mb-2 uppercase tracking-wider text-xs">Industry</div>
                    <div className="flex flex-wrap gap-2">
                      {extractedKeywords.industry.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 border border-white/10 text-white/70 text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {extractedKeywords.technology.length > 0 && (
                  <div>
                    <div className="text-white/50 mb-2 uppercase tracking-wider text-xs">Technology</div>
                    <div className="flex flex-wrap gap-2">
                      {extractedKeywords.technology.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 border border-white/10 text-white/70 text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {extractedKeywords.complexity.length > 0 && (
                  <div>
                    <div className="text-white/50 mb-2 uppercase tracking-wider text-xs">Complexity</div>
                    <div className="flex flex-wrap gap-2">
                      {extractedKeywords.complexity.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 border border-white/10 text-white/70 text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {extractedKeywords.market.length > 0 && (
                  <div>
                    <div className="text-white/50 mb-2 uppercase tracking-wider text-xs">Market</div>
                    <div className="flex flex-wrap gap-2">
                      {extractedKeywords.market.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 border border-white/10 text-white/70 text-xs">
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
          <div className="card p-8">
            <div className="text-sm text-white/70 uppercase tracking-wider mb-6">Founder Background (Optional)</div>
            <p className="body-text mb-6">This helps us provide more accurate feasibility scoring.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="domain" className="block text-sm text-white/70 uppercase tracking-wider mb-3">
                  Domain Expertise
                </label>
                <input
                  type="text"
                  id="domain"
                  value={founderBackground.domain_expertise}
                  onChange={(e) => setFounderBackground(prev => ({ ...prev, domain_expertise: e.target.value }))}
                  placeholder="e.g., Healthcare, Fintech"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="technical" className="block text-sm text-white/70 uppercase tracking-wider mb-3">
                  Technical Expertise
                </label>
                <select
                  id="technical"
                  value={founderBackground.technical_expertise}
                  onChange={(e) => setFounderBackground(prev => ({ ...prev, technical_expertise: e.target.value as any }))}
                  className="input"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm text-white/70 uppercase tracking-wider mb-3">
                  Startup Experience
                </label>
                <select
                  id="experience"
                  value={founderBackground.startup_experience}
                  onChange={(e) => setFounderBackground(prev => ({ ...prev, startup_experience: e.target.value as any }))}
                  className="input"
                >
                  <option value="None">None</option>
                  <option value="Some">Some</option>
                  <option value="Extensive">Extensive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-6">
            <button
              type="submit"
              disabled={!ideaDescription.trim()}
              className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Generate Analysis
            </button>
            {ideaDescription.trim() && (
              <span className="text-sm text-white/50">This will take 5-10 seconds</span>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default IdeaInput;
