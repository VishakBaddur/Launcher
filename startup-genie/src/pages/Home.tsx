import { Link } from 'react-router-dom';
import { Lightbulb, FileText, Presentation, CheckCircle, ArrowRight, Sparkles, Zap, Target } from 'lucide-react';

interface HomeProps {
  onLogin: () => void;
}

const Home = ({ onLogin: _onLogin }: HomeProps) => {
  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Animated Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-1 mb-6 animate-pulse">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-6 leading-tight">
              Launcher
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
              AI-Powered Startup Assistant Platform
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Validate your ideas, build business models, and create investor pitches with AI-powered insights
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/idea-input">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold text-lg text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                  <span className="flex items-center">
                    Start AI Analysis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                </button>
              </Link>
              <Link to="/auth">
                <button className="group relative px-8 py-4 bg-transparent border-2 border-gray-600 rounded-xl font-semibold text-lg text-gray-300 hover:border-purple-500 hover:text-white transition-all duration-300">
                  <span className="flex items-center">
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </Link>
              
              <button className="group px-8 py-4 border-2 border-purple-500/50 text-purple-400 rounded-xl font-semibold text-lg hover:border-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-purple-500/10">
                <span className="flex items-center">
                  Watch Demo
                  <Zap className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Launch Your Startup
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From idea validation to investor pitch, our AI tools guide you through every step
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Idea Validator */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-gray-900/70">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Idea Validator</h3>
                <p className="text-gray-400 leading-relaxed">
                  Get instant feedback on your startup idea with AI-powered market analysis and feasibility scoring
                </p>
              </div>
            </div>
            
            {/* Business Model Generator */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-gray-900/70">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Business Model Generator</h3>
                <p className="text-gray-400 leading-relaxed">
                  Create comprehensive business model canvases with AI-generated insights and market data
                </p>
              </div>
            </div>
            
            {/* Investor Pitch Creator */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-pink-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-gray-900/70">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Presentation className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Investor Pitch Creator</h3>
                <p className="text-gray-400 leading-relaxed">
                  Generate professional pitch decks with AI-crafted slides and presenter notes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Launcher?
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Free Trial with Core AI Features",
                description: "Start validating ideas immediately with our powerful AI tools",
                icon: CheckCircle,
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "No Credit Card Required",
                description: "Sign up and start using our platform without any payment information",
                icon: Target,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Real-time Market Insights",
                description: "Get the latest startup data and market trends to inform your decisions",
                icon: Zap,
                color: "from-yellow-500 to-orange-500"
              },
              {
                title: "Professional Templates",
                description: "Access industry-standard templates for business models and pitch decks",
                icon: FileText,
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Export & Share",
                description: "Download your results and share them with your team or investors",
                icon: ArrowRight,
                color: "from-indigo-500 to-purple-500"
              },
              {
                title: "24/7 AI Support",
                description: "Get instant AI-powered guidance whenever you need it",
                icon: Sparkles,
                color: "from-pink-500 to-red-500"
              }
            ].map((benefit, index) => (
              <div key={index} className="group">
                <div className="flex items-start p-6 rounded-xl bg-gray-900/30 backdrop-blur-sm border border-gray-800/30 hover:border-gray-700/50 hover:bg-gray-900/50 transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2 text-lg">{benefit.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative p-12 rounded-3xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-xl border border-purple-500/20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Launch Your Startup?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of entrepreneurs who are using AI to build successful startups
              </p>
              <Link to="/auth">
                <button className="group relative px-10 py-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl font-bold text-xl text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                  <span className="flex items-center justify-center">
                    Get Started Free
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-16 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2024 Launcher. Built with ❤️ for entrepreneurs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 