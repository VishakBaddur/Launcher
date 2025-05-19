import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              StartupGenie
            </Link>
            <p className="mt-4 text-gray-500 text-sm">
              Your AI-powered business idea validation and planning platform.
              Transform your ideas into successful ventures with data-driven insights.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Features
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/validate-idea" className="text-base text-gray-500 hover:text-gray-900">
                  Idea Validation
                </Link>
              </li>
              <li>
                <Link to="/generate-plan" className="text-base text-gray-500 hover:text-gray-900">
                  Business Planning
                </Link>
              </li>
              <li>
                <Link to="/business-model" className="text-base text-gray-500 hover:text-gray-900">
                  Business Model Generator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} StartupGenie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 