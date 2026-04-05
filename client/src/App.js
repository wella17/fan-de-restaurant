import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FanDeOrderingSite from './components/FanDeOrderingSite';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FanDeOrderingSite />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;