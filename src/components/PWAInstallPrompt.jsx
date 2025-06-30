import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiX, FiSmartphone, FiShare } = FiIcons;

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone || 
                           document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Afficher le prompt après un délai pour une meilleure UX
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Ne plus afficher pendant cette session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Ne pas afficher si déjà installé ou déjà refusé cette session
  if (isStandalone || !showInstallPrompt || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-20 left-4 right-4 bg-white rounded-xl shadow-lg border border-emerald-200 p-4 z-40"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <SafeIcon icon={FiSmartphone} className="text-emerald-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Installer FleurNotif</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Installez l'app pour recevoir les notifications instantanément et accéder hors-ligne !
            </p>
            <div className="flex gap-3">
              <motion.button
                onClick={handleInstallClick}
                className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium text-sm hover:bg-emerald-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiDownload} className="mr-2" />
                Installer
              </motion.button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors ml-2"
          >
            <SafeIcon icon={FiX} className="text-lg" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PWAInstallPrompt;