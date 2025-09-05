import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { User } from './types';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import IdeaInput from './pages/IdeaInput';
import IdeaValidation from './pages/IdeaValidation';
import IdeaValidator from './pages/dashboard/IdeaValidator';
import BusinessModel from './pages/dashboard/BusinessModel';
import PitchCreator from './pages/dashboard/PitchCreator';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home onLogin={() => {}} />} />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={login} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/auth" />} 
          />
          <Route path="/idea-input" element={<IdeaInput />} />
          <Route path="/idea-validation" element={<IdeaValidation />} />
          <Route path="/business-plan" element={<BusinessModel user={user || { id: '1', email: 'guest@example.com' }} onLogout={logout} />} />
          <Route path="/pitch-deck" element={<PitchCreator user={user || { id: '1', email: 'guest@example.com' }} onLogout={logout} />} />
          <Route 
            path="/dashboard/idea-validator" 
            element={user ? <IdeaValidator user={user} onLogout={logout} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/dashboard/business-model" 
            element={user ? <BusinessModel user={user} onLogout={logout} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/dashboard/pitch-creator" 
            element={user ? <PitchCreator user={user} onLogout={logout} /> : <Navigate to="/auth" />} 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
