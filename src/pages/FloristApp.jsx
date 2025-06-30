import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { FloristProvider } from '../context/FloristContext';
import FloristCustomerView from './FloristCustomerView';
import FloristLogin from './FloristLogin';
import FloristDashboard from './FloristDashboard';
import CreatePromotion from './CreatePromotion';
import PromotionHistory from './PromotionHistory';
import Navigation from '../components/Navigation';

function FloristApp() {
  const { slug } = useParams();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [floristId, setFloristId] = React.useState(null);

  React.useEffect(() => {
    // Vérifier l'authentification pour ce fleuriste spécifique
    const savedAuth = localStorage.getItem(`florist_auth_${slug}`);
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setFloristId(authData.floristId);
    }
  }, [slug]);

  const handleLogin = (floristData) => {
    localStorage.setItem(`florist_auth_${slug}`, JSON.stringify({
      floristId: floristData.id,
      slug: floristData.slug,
      loginTime: new Date().toISOString()
    }));
    setIsAuthenticated(true);
    setFloristId(floristData.id);
  };

  return (
    <FloristProvider floristId={floristId}>
      <div className="min-h-screen">
        <Routes>
          {/* Vue publique du fleuriste */}
          <Route path="/" element={<FloristCustomerView slug={slug} />} />
          
          {/* Login du fleuriste */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <FloristLogin onLogin={handleLogin} slug={slug} />
              ) : (
                <Navigate to={`/florist/${slug}/dashboard`} replace />
              )
            }
          />
          
          {/* Dashboard du fleuriste */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <FloristDashboard />
              ) : (
                <Navigate to={`/florist/${slug}/login`} replace />
              )
            }
          />
          
          {/* Créer une promotion */}
          <Route
            path="/create-promotion"
            element={
              isAuthenticated ? (
                <CreatePromotion />
              ) : (
                <Navigate to={`/florist/${slug}/login`} replace />
              )
            }
          />
          
          {/* Historique */}
          <Route
            path="/history"
            element={
              isAuthenticated ? (
                <PromotionHistory />
              ) : (
                <Navigate to={`/florist/${slug}/login`} replace />
              )
            }
          />
        </Routes>
        
        {isAuthenticated && <Navigation floristSlug={slug} />}
      </div>
    </FloristProvider>
  );
}

export default FloristApp;