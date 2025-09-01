import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            🚀 Launcher
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 font-medium">Welcome, {user.email}</span>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Dashboard
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Ready to build your startup? Choose a tool to get started.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* AI Idea Validator */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-gray-900/70 card-anime">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Idea Validator</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Validate your startup idea with AI-powered market analysis
                </p>
                <button 
                  onClick={() => handleNavigate('/dashboard/idea-validator')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 btn-anime"
                >
                  Validate Idea
                </button>
              </div>
            </div>
            
            {/* Business Model Generator */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-gray-900/70 card-anime">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Business Model Generator</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Create comprehensive business model canvases
                </p>
                <button 
                  onClick={() => handleNavigate('/dashboard/business-model')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 btn-anime"
                >
                  Generate Model
                </button>
              </div>
            </div>
            
            {/* Pitch Creator */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-pink-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-gray-900/70 card-anime">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Pitch Creator</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Generate professional investor pitch decks
                </p>
                <button 
                  onClick={() => handleNavigate('/dashboard/pitch-creator')}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 btn-anime"
                >
                  Create Pitch
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Ideas Validated', value: '12', color: 'from-purple-500 to-pink-500' },
              { label: 'Models Created', value: '8', color: 'from-blue-500 to-cyan-500' },
              { label: 'Pitches Generated', value: '5', color: 'from-pink-500 to-purple-500' },
              { label: 'Success Rate', value: '92%', color: 'from-green-500 to-emerald-500' }
            ].map((stat, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gray-900/30 backdrop-blur-sm border border-gray-800/30 hover:border-gray-700/50 hover:bg-gray-900/50 transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-lg">{stat.value}</span>
                </div>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 