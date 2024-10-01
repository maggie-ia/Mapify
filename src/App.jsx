import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Home from './pages/Home';
import OperationSelection from './pages/OperationSelection';
import Results from './pages/Results';
import Settings from './pages/Settings';
import Register from './components/Register';
import Login from './components/Login';

const queryClient = new QueryClient();

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-secondary text-primary">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                  path="/operation-selection"
                  element={isAuthenticated ? <OperationSelection /> : <Navigate to="/login" />}
                />
                <Route
                  path="/results"
                  element={isAuthenticated ? <Results /> : <Navigate to="/login" />}
                />
                <Route
                  path="/settings"
                  element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
                />
              </Routes>
            </main>
          </div>
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;