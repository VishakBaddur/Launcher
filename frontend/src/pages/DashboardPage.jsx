import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-2 sm:px-4">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-black">Welcome to StartupGenie</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <Link to="/validate-idea" className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center hover:bg-gray-100 transition">
            <span className="text-xl font-semibold text-black mb-2">Validate a Business Idea</span>
            <span className="text-gray-600 text-center">Get actionable insights and real-world references for your business idea.</span>
          </Link>
          <Link to="/generate-plan" className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center hover:bg-gray-100 transition">
            <span className="text-xl font-semibold text-black mb-2">Generate a Business Plan</span>
            <span className="text-gray-600 text-center">Create a beautiful, AI-powered business plan with charts and references.</span>
          </Link>
          <Link to="/business-model" className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center hover:bg-gray-100 transition">
            <span className="text-xl font-semibold text-black mb-2">Generate a Business Model</span>
            <span className="text-gray-600 text-center">Generate a business model canvas with real-world and AI-powered insights.</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 