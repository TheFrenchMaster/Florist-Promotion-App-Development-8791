import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiPlay, FiCheckCircle, FiArrowRight } = FiIcons;

function GetStartedModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Bienvenue sur FleurNotif",
      description: "Votre plateforme de gestion de fleuristes avec notifications",
      icon: FiPlay,
      content: (
        <div className="text-center">
          <div className="text-6xl mb-4">🌸</div>
          <p className="text-gray-600 mb-6">
            FleurNotif vous permet de gérer plusieurs fleuristes et leurs applications de notifications
            de promotions de manière centralisée.
          </p>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-emerald-800 font-medium">
              ✨ Créez des applications personnalisées pour chaque fleuriste
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Créer votre premier fleuriste",
      description: "Ajoutez un fleuriste avec ses informations détaillées",
      icon: FiPlay,
      content: (
        <div>
          <div className="text-5xl mb-4 text-center">🏪</div>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Informations requises :</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Nom du fleuriste</li>
                <li>• Email de contact</li>
                <li>• Numéro de téléphone</li>
                <li>• Adresse physique</li>
              </ul>
            </div>
            <p className="text-gray-600 text-sm">
              Chaque fleuriste aura sa propre application avec une URL unique et un QR code personnalisé.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Configuration Supabase",
      description: "Connectez votre base de données pour la persistance",
      icon: FiPlay,
      content: (
        <div>
          <div className="text-5xl mb-4 text-center">🗄️</div>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Étapes :</h4>
              <ol className="text-purple-700 text-sm space-y-1 list-decimal list-inside">
                <li>Créez un projet Supabase gratuit</li>
                <li>Récupérez votre URL et clé API</li>
                <li>Connectez le projet dans les paramètres</li>
                <li>Les tables seront créées automatiquement</li>
              </ol>
            </div>
            <p className="text-gray-600 text-sm">
              Sans Supabase, les données ne sont stockées que localement.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Applications personnalisées",
      description: "Chaque fleuriste a son application dédiée",
      icon: FiPlay,
      content: (
        <div>
          <div className="text-5xl mb-4 text-center">📱</div>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Fonctionnalités par fleuriste :</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Page client personnalisée</li>
                <li>• Abonnements aux notifications</li>
                <li>• Gestion des promotions</li>
                <li>• QR code unique</li>
                <li>• Dashboard de statistiques</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-yellow-800 text-sm">
                💡 URL d'exemple : /florist/fleurs-de-marie
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Prêt à commencer !",
      description: "Tout est configuré pour gérer vos fleuristes",
      icon: FiCheckCircle,
      content: (
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-gray-600 mb-6">
            Vous êtes maintenant prêt à créer votre premier fleuriste et à commencer 
            à gérer leurs applications de notifications !
          </p>
          <div className="bg-emerald-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-emerald-800 mb-2">Actions suivantes :</h4>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>1. Cliquez sur "Nouveau fleuriste"</li>
              <li>2. Remplissez les informations</li>
              <li>3. Générez le QR code</li>
              <li>4. Partagez l'application !</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-emerald-50">
            <div className="flex items-center">
              <SafeIcon icon={currentStepData.icon} className="text-2xl text-emerald-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{currentStepData.title}</h2>
                <p className="text-sm text-gray-600">{currentStepData.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Étape {currentStep + 1} sur {steps.length}</span>
              <span className="text-sm text-emerald-600 font-medium">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                Commencer
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center"
              >
                Suivant
                <SafeIcon icon={FiArrowRight} className="ml-2" />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default GetStartedModal;