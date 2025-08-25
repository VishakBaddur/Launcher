import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import IdeaValidator from './pages/IdeaValidator';
import BusinessPlanGenerator from './pages/BusinessPlanGenerator';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/validate" element={<IdeaValidator />} />
          <Route path="/generate" element={<BusinessPlanGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
