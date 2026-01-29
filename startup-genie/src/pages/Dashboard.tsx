import { Link } from 'react-router-dom';
import type { User } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="text-xl font-light tracking-tight">Launcher</div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-white/70">{user.email}</span>
              <button
                onClick={onLogout}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="heading-1 mb-4">Dashboard</h1>
          <p className="body-text text-xl">Validate ideas, generate business models, and create pitch decks.</p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card p-10">
            <h2 className="heading-2 mb-4">Idea Validator</h2>
            <p className="body-text mb-6">
              Get feasibility scores and market analysis for your startup idea.
            </p>
            <Link to="/dashboard/idea-validator" className="btn-primary">
              Validate Idea
            </Link>
          </div>

          <div className="card p-10">
            <h2 className="heading-2 mb-4">Business Model</h2>
            <p className="body-text mb-6">
              Generate business model canvas and unit economics.
            </p>
            <Link to="/dashboard/business-model" className="btn-primary">
              Generate Model
            </Link>
          </div>

          <div className="card p-10">
            <h2 className="heading-2 mb-4">Pitch Creator</h2>
            <p className="body-text mb-6">
              Create investor-ready pitch decks with AI-generated content.
            </p>
            <Link to="/dashboard/pitch-creator" className="btn-primary">
              Create Pitch
            </Link>
          </div>
        </div>

        {/* Quick Access */}
        <div className="section-divider pt-12">
          <h2 className="heading-2 mb-6">Quick Access</h2>
          <div className="flex flex-wrap gap-6">
            <Link to="/idea-input" className="text-sm text-white/70 hover:text-white transition-colors">
              Validate New Idea
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/analytics" className="text-sm text-white/70 hover:text-white transition-colors">
              View Analytics
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
