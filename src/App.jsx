import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';

import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { AppProvider } from './context/AppContext';
import { questConfig } from './config/questConfig';
import NotificationService from './services/NotificationService';
import ProtectedRoute from './components/ProtectedRoute';

// Import des pages
import CustomerView from './pages/CustomerView';
import DownloadPage from './pages/DownloadPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import AdminDashboard from './pages/AdminDashboard';
import FloristApp from './pages/FloristApp';
import './App.css';

function App() {
  useEffect(() => {
    // Initialiser le service de notifications
    NotificationService.init();
  }, []);

  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <AuthProvider>
        <AppProvider>
          <AdminProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
                <AnimatePresence mode="wait">
                  <Routes>
                    {/* Page d'accueil générale */}
                    <Route path="/" element={<CustomerView />} />
                    
                    {/* Page de téléchargement */}
                    <Route path="/download" element={<DownloadPage />} />
                    
                    {/* Authentification */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                      path="/onboarding" 
                      element={
                        <ProtectedRoute>
                          <OnboardingPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Administration */}
                    <Route 
                      path="/admin/dashboard" 
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Applications des fleuristes */}
                    <Route path="/florist/:slug/*" element={<FloristApp />} />
                    
                    {/* Redirections pour compatibilité */}
                    <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                    <Route path="/florist/login" element={<Navigate to="/login" replace />} />
                    <Route path="/florist/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </AnimatePresence>
              </div>
            </Router>
          </AdminProvider>
        </AppProvider>
      </AuthProvider>
    </QuestProvider>
  );
}

export default App;