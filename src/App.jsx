import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import OperationSelection from './components/OperationSelection';
import Results from './components/Results';
import MembershipSelection from './components/MembershipSelection';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-secondary">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/operations" element={<OperationSelection />} />
              <Route path="/results" element={<Results />} />
              <Route path="/membership" element={<MembershipSelection />} />
            </Routes>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;