import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center py-16 px-4">
        <div className="bg-white/90 shadow-2xl rounded-2xl p-10 max-w-2xl w-full flex flex-col items-center mb-12">
          <h1 className="text-5xl font-extrabold text-black mb-4 tracking-tight">StartupGenie</h1>
          <p className="text-xl text-gray-700 mb-8 text-center max-w-lg">
            AI-powered business idea validation and business plan generation. Get actionable insights, real-world references, and a beautiful plan in minutes.
          </p>
          <div className="flex gap-4 w-full justify-center">
            <Link to="/register" className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition">Register</Link>
            <Link to="/login" className="bg-gray-200 text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition">Login</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-black mb-8 text-center">Current Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-4xl mb-3">💡</span>
            <h3 className="text-lg font-semibold text-black mb-2">Validate Business Ideas</h3>
            <p className="text-gray-600 text-center">Instantly validate your business ideas with AI-powered analysis.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-4xl mb-3">📄</span>
            <h3 className="text-lg font-semibold text-black mb-2">Generate Business Plans</h3>
            <p className="text-gray-600 text-center">Create comprehensive, structured business plans with actionable recommendations.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-4xl mb-3">🧩</span>
            <h3 className="text-lg font-semibold text-black mb-2">Generate Business Models</h3>
            <p className="text-gray-600 text-center">Generate a business model canvas with real-world and AI-powered insights.</p>
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section className="w-full max-w-5xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-black mb-8 text-center">Upcoming Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🔍</span>
            <h3 className="text-lg font-semibold text-black mb-1">Real-World Insights & References</h3>
            <p className="text-gray-600 text-center">Get references to real companies, market trends, and competitor analysis for your ideas.</p>
          </div>
          <div className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">📊</span>
            <h3 className="text-lg font-semibold text-black mb-1">Investor Pitch Creator</h3>
            <p className="text-gray-600 text-center">Generate customized pitch decks for investors (VCs, angels, accelerators).</p>
          </div>
          <div className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">✉️</span>
            <h3 className="text-lg font-semibold text-black mb-1">Cold Outreach Automation</h3>
            <p className="text-gray-600 text-center">AI writes and automates outreach emails/messages for investors and potential customers.</p>
          </div>
          <div className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">⚡</span>
            <h3 className="text-lg font-semibold text-black mb-1">Early MVP Prototyping</h3>
            <p className="text-gray-600 text-center">AI assists in generating simple landing pages, product descriptions, and business logic.</p>
          </div>
          <div className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">📈</span>
            <h3 className="text-lg font-semibold text-black mb-1">Competitor & Market Research</h3>
            <p className="text-gray-600 text-center">AI scrapes and analyzes market data, trends, and funding rounds.</p>
          </div>
          <div className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">📝</span>
            <h3 className="text-lg font-semibold text-black mb-1">Execution Assistant</h3>
            <p className="text-gray-600 text-center">AI generates initial tasks, milestones, and basic workflows for early-stage startups.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full max-w-3xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Why StartupGenie?</h2>
        <p className="text-gray-700 text-center text-lg">
          StartupGenie is on a mission to empower entrepreneurs with actionable, data-driven insights and beautiful business plans. Whether you're validating your first idea or preparing to pitch investors, we help you move forward with confidence.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-black text-white text-center mt-auto">
        &copy; {new Date().getFullYear()} StartupGenie. All rights reserved.
      </footer>
    </div>
  );
} 