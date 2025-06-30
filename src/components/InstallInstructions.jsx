import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSmartphone, FiChevronDown, FiChevronUp } = FiIcons;

function InstallInstructions() {
  const [activeTab, setActiveTab] = useState('ios');
  const [showDetails, setShowDetails] = useState(false);

  const instructions = {
    ios: {
      title: '📱 iPhone / iPad',
      steps: [
        'Ouvrez le lien dans Safari',
        'Appuyez sur le bouton "Partager" 📤',
        'Sélectionnez "Sur l\'écran d\'accueil"',
        'Confirmez en appuyant sur "Ajouter"',
        'L\'application apparaît sur votre écran d\'accueil ! 🎉'
      ]
    },
    android: {
      title: '🤖 Android',
      steps: [
        'Ouvrez le lien dans Chrome',
        'Appuyez sur le menu (⋮) en haut à droite',
        'Sélectionnez "Ajouter à l\'écran d\'accueil"',
        'Ou cherchez la bannière "Installer l\'app"',
        'Confirmez l\'installation',
        'L\'application apparaît sur votre écran d\'accueil ! 🎉'
      ]
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <SafeIcon icon={FiSmartphone} className="mr-2 text-emerald-500" />
          Instructions d'installation
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <SafeIcon icon={showDetails ? FiChevronUp : FiChevronDown} />
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Onglets */}
            <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
              {Object.entries(instructions).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                    activeTab === key
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {data.title}
                </button>
              ))}
            </div>

            {/* Contenu des instructions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-3">
                  {instructions[activeTab].steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 text-sm">{step}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    <strong>✨ Avantages de l'installation:</strong>
                  </p>
                  <ul className="text-xs text-emerald-700 mt-2 space-y-1">
                    <li>• Notifications push instantanées</li>
                    <li>• Accès hors-ligne</li>
                    <li>• Lancement rapide depuis l'écran d'accueil</li>
                    <li>• Expérience native comme une vraie app</li>
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default InstallInstructions;