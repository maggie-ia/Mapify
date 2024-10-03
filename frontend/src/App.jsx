import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import Home from './pages/Home';
import FileUpload from './pages/FileUpload';
import OperationSelection from './components/OperationSelection';
import Results from './pages/Results';
import Settings from './pages/Settings';
import Login from './components/Login';
import Register from './components/Register';
import useErrorHandler from './hooks/useErrorHandler';

const queryClient = new QueryClient();

function App() {
    const { error, clearError } = useErrorHandler();

    return (
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <Router>
                            <div className="min-h-screen bg-secondary">
                                <Header />
                                <main className="container mx-auto px-4 py-8">
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/upload" element={<FileUpload />} />
                                        <Route path="/operation" element={<OperationSelection />} />
                                        <Route path="/results" element={<Results />} />
                                        <Route path="/settings" element={<Settings />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                    </Routes>
                                </main>
                            </div>
                        </Router>
                    </NotificationProvider>
                </AuthProvider>
            </LanguageProvider>
        </QueryClientProvider>
    );
}

export default App;