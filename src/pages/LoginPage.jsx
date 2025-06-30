import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../context/AuthContext';
import { questConfig } from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiStar, FiShield, FiUsers } = FiIcons;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = ({ userId, token, newUser }) => {
    const userData = {
      userId,
      token,
      isNewUser: newUser,
      loginTime: new Date().toISOString()
    };

    login(userData);

    if (newUser) {
      navigate('/onboarding');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4">
                Bienvenue sur
                <span className="block text-emerald-200">FleurNotif</span>
              </h1>
              <p className="text-xl text-emerald-100 leading-relaxed">
                La plateforme complète pour gérer vos fleuristes et leurs applications 
                de notifications de promotions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mr-4">
                  <SafeIcon icon={FiUsers} className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gestion centralisée</h3>
                  <p className="text-emerald-200">Gérez tous vos fleuristes depuis un seul endroit</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mr-4">
                  <SafeIcon icon={FiStar} className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Applications personnalisées</h3>
                  <p className="text-emerald-200">Chaque fleuriste a sa propre app dédiée</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mr-4">
                  <SafeIcon icon={FiShield} className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sécurisé et fiable</h3>
                  <p className="text-emerald-200">Authentification sécurisée avec Quest SDK</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Authentication */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">FleurNotif</h1>
            <p className="text-gray-600">Connectez-vous pour commencer</p>
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors mb-6"
          >
            <SafeIcon icon={FiArrowLeft} className="mr-2" />
            Retour à l'accueil
          </button>

          {/* Login component container */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Connexion</h2>
              <p className="text-gray-600">Accédez à votre espace de gestion</p>
            </div>

            {/* Quest Login Component */}
            <div className="quest-login-container">
              <QuestLogin
                onSubmit={handleLogin}
                email={true}
                google={false}
                accent={questConfig.PRIMARY_COLOR}
                apiKey={questConfig.APIKEY}
                entityId={questConfig.ENTITYID}
                apiType="PRODUCTION"
              />
            </div>
          </motion.div>

          {/* Additional info */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-gray-500">
              Première connexion ? Un processus d'accueil vous guidera.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;