import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IdeaValidator from './pages/IdeaValidator';
import BusinessPlanGenerator from './pages/BusinessPlanGenerator';
import BusinessModel from './pages/BusinessModel';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
          <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/validate-idea"
          element={
            <ProtectedRoute>
              <Layout>
                <IdeaValidator />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate-plan"
          element={
            <ProtectedRoute>
              <Layout>
                <BusinessPlanGenerator />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-model"
          element={
            <ProtectedRoute>
              <Layout>
                <BusinessModel />
              </Layout>
            </ProtectedRoute>
          }
        />
          </Routes>
    </Router>
  );
};

export default App;