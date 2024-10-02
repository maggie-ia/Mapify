import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Home from './pages/Home';
import OperationSelection from './components/OperationSelection';
import Results from './pages/Results';
import Settings from './pages/Settings';
import WritingAssistant from './components/WritingAssistant';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-secondary">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/operation-selection" element={<OperationSelection />} />
                <Route path="/results" element={<Results />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/writing-assistant" element={<WritingAssistant />} />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;