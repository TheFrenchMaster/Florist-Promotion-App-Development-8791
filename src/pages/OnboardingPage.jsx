import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnBoarding } from '@questlabs/react-sdk';
import { useAuth } from '../context/AuthContext';
import { questConfig } from '../config/questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle, FiArrowRight, FiStar } = FiIcons;

function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});

  const getAnswers = () => {
    // Mark onboarding as completed
    localStorage.setItem('quest_onboarding_completed', 'true');
    
    // Navigate to main application
    navigate('/admin/dashboard');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-100 flex">
      {/* Left Section - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-32 left-16 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white bg-opacity-5 rounded-full blur-lg"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mb-6">
                <SafeIcon icon={FiStar} className="text-2xl text-white" />
              </div>
              
              <h1 className="text-4xl font-bold mb-4">
                Configurons votre
                <span className="block text-blue-200">espace FleurNotif</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Quelques questions rapides pour personnaliser votre expérience 
                et optimiser la gestion de vos fleuristes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <SafeIcon icon={FiCheckCircle} className="text-blue-300 mr-3" />
                <span className="text-blue-100">Configuration personnalisée</span>
              </div>
              <div className="flex items-center">
                <SafeIcon icon={FiCheckCircle} className="text-blue-300 mr-3" />
                <span className="text-blue-100">Recommandations adaptées</span>
              </div>
              <div className="flex items-center">
                <SafeIcon icon={FiCheckCircle} className="text-blue-300 mr-3" />
                <span className="text-blue-100">Accès rapide aux fonctionnalités</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Onboarding Component */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuration</h1>
            <p className="text-gray-600">Personnalisez votre expérience</p>
          </div>

          {/* Onboarding component container */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ height: '400px' }}
          >
            <div className="h-full">
              <OnBoarding
                userId={user.userId}
                token={user.token}
                questId={questConfig.QUEST_ONBOARDING_QUESTID}
                answer={answers}
                setAnswer={setAnswers}
                getAnswers={getAnswers}
                accent={questConfig.PRIMARY_COLOR}
                singleChoose="modal1"
                multiChoice="modal2"
                apiKey={questConfig.APIKEY}
                entityId={questConfig.ENTITYID}
                apiType="PRODUCTION"
              >
                <OnBoarding.Header />
                <OnBoarding.Content />
                <OnBoarding.Footer />
              </OnBoarding>
            </div>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-gray-500 mb-2">
              Étape finale avant d'accéder à votre tableau de bord
            </p>
            <div className="flex items-center justify-center">
              <SafeIcon icon={FiArrowRight} className="text-emerald-500 mr-2" />
              <span className="text-sm text-emerald-600 font-medium">
                Presque terminé !
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;