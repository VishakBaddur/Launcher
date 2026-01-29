import { Link } from 'react-router-dom';

interface HomeProps {
  onLogin: () => void;
}

const Home = ({ onLogin: _onLogin }: HomeProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="text-xl font-light tracking-tight">Launcher</div>
            <nav className="flex items-center gap-8">
              <Link to="/idea-input" className="text-sm text-white/70 hover:text-white transition-colors">
                Validate Idea
              </Link>
              <Link to="/idea-input" className="text-sm text-white/70 hover:text-white transition-colors">
                Business Plan
              </Link>
              <Link to="/idea-input" className="text-sm text-white/70 hover:text-white transition-colors">
                Pitch Deck
              </Link>
              <Link to="/auth" className="text-sm text-white/70 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/idea-input" className="btn-primary text-sm">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Hero Section */}
        <div className="mb-32">
          <h1 className="heading-1 mb-6 max-w-4xl">
            Validate startup ideas with data
          </h1>
          <p className="body-text mb-10 max-w-2xl text-xl">
            Get feasibility scores, market analysis, and actionable insights for your startup idea. No fluff, just metrics.
          </p>
          <Link to="/idea-input" className="btn-primary inline-block">
            Validate Your Idea
          </Link>
        </div>

        {/* Example Validation */}
        <div className="mb-32">
          <div className="text-sm text-white/50 uppercase tracking-wider mb-8">Example Validation</div>
          <div className="card p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-light text-white mb-2">AI-powered laundry scheduling app</h3>
                <p className="text-sm text-white/50">Market size: $2.3B TAM | Competition: Moderate</p>
              </div>
              <div className="text-right">
                <div className="metric">72</div>
                <div className="metric-label">Feasibility</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/10">
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Market Size</div>
                <div className="text-xl font-light text-white">$2.3B</div>
              </div>
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Time to MVP</div>
                <div className="text-xl font-light text-white">3-6 months</div>
              </div>
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Risk Level</div>
                <div className="text-xl font-light text-white">Medium</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-32">
          <div className="text-sm text-white/50 uppercase tracking-wider mb-12">What you get</div>
          <ul className="space-y-6 text-lg text-white/70 max-w-3xl">
            <li className="flex items-start">
              <span className="text-white mr-4">—</span>
              <span>Feasibility scoring based on market data, competition, and technical complexity</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-4">—</span>
              <span>Market analysis with TAM, SAM, and competition assessment</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-4">—</span>
              <span>Founder fit analysis based on your background and expertise</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-4">—</span>
              <span>Risk assessment with mitigation strategies</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-4">—</span>
              <span>Business model canvas and unit economics</span>
            </li>
            <li className="flex items-start">
              <span className="text-white mr-4">—</span>
              <span>Investor-ready pitch deck generation</span>
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="section-divider pt-12">
          <p className="body-text mb-8 text-xl">
            Start validating your idea. No signup required for the first validation.
          </p>
          <Link to="/idea-input" className="btn-primary inline-block">
            Validate Your Idea
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-32 grid md:grid-cols-2 gap-8">
          <div className="card p-10">
            <h2 className="heading-2 mb-4">Business Model</h2>
            <p className="body-text mb-6">
              Generate comprehensive business model canvas with revenue streams, unit economics, and scalability analysis.
            </p>
            <Link to="/idea-input" className="btn-secondary inline-block">
              Generate Business Plan
            </Link>
          </div>

          <div className="card p-10">
            <h2 className="heading-2 mb-4">Pitch Deck</h2>
            <p className="body-text mb-6">
              Create investor-ready pitch decks with AI-generated slides, presenter notes, and investor fit analysis.
            </p>
            <Link to="/idea-input" className="btn-secondary inline-block">
              Create Pitch Deck
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="section-divider mt-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="flex items-center justify-between text-sm text-white/50">
            <div>© 2024 Launcher</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
