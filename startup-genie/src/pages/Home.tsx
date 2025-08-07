import { Link } from 'react-router-dom';
import { Lightbulb, FileText, Presentation, CheckCircle, ArrowRight } from 'lucide-react';

interface HomeProps {
  onLogin: () => void;
}

const Home = ({ onLogin: _onLogin }: HomeProps) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🚀 Startup Genie
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              AI-Powered Startup Assistant Platform
            </p>
            <p className="text-lg text-purple-200 mb-12 max-w-2xl mx-auto">
              Validate your ideas, build business models, and create investor pitches with AI-powered insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                  Start Free Trial
                </button>
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Launch Your Startup
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea validation to investor pitch, our AI tools guide you through every step
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Idea Validator</h3>
              <p className="text-gray-600">
                Get instant feedback on your startup idea with AI-powered market analysis and feasibility scoring
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Model Generator</h3>
              <p className="text-gray-600">
                Create comprehensive business model canvases with AI-generated insights and market data
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Presentation className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Investor Pitch Creator</h3>
              <p className="text-gray-600">
                Generate professional pitch decks with AI-crafted slides and presenter notes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Startup Genie?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Trial with Core AI Features</h3>
                <p className="text-gray-600">Start validating ideas immediately with our powerful AI tools</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Credit Card Required</h3>
                <p className="text-gray-600">Sign up and start using our platform without any payment information</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Market Insights</h3>
                <p className="text-gray-600">Get the latest startup data and market trends to inform your decisions</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Templates</h3>
                <p className="text-gray-600">Access industry-standard templates for business models and pitch decks</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Export & Share</h3>
                <p className="text-gray-600">Download your results and share them with your team or investors</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">24/7 AI Support</h3>
                <p className="text-gray-600">Get instant AI-powered guidance whenever you need it</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Launch Your Startup?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who are using AI to build successful startups
          </p>
          <Link to="/auth">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center mx-auto">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 