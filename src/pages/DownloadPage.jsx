import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import QRCodeGenerator from '../components/QRCodeGenerator';
import InstallInstructions from '../components/InstallInstructions';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiDownload, FiSmartphone, FiBell, FiWifi, FiExternalLink, FiAlertTriangle } = FiIcons;

function DownloadPage() {
  const [manualUrl, setManualUrl] = useState('');

  const features = [
    {
      icon: FiBell,
      title: 'Notifications instantanées',
      description: 'Recevez toutes les promotions en temps réel'
    },
    {
      icon: FiSmartphone,
      title: 'Application native',
      description: 'Expérience fluide comme une vraie app mobile'
    },
    {
      icon: FiWifi,
      title: 'Accès hors-ligne',
      description: 'Consultez vos promotions même sans internet'
    }
  ];

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-4 p-2 text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📱 Télécharger FleurNotif</h1>
              <p className="text-gray-600 mt-1">Installez l'application sur votre smartphone</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Alerte pour configuration URL */}
        <motion.div
          className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-start">
            <SafeIcon icon={FiAlertTriangle} className="text-orange-500 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">⚙️ Configuration requise</h4>
              <p className="text-sm text-orange-700 mb-3">
                Pour que le QR code fonctionne, vous devez configurer l'URL de votre application déployée.
              </p>
              <div className="bg-orange-100 p-3 rounded text-sm">
                <p className="font-medium text-orange-800 mb-2">Options de déploiement :</p>
                <ul className="text-orange-700 space-y-1">
                  <li>• <strong>Netlify :</strong> netlify.app (gratuit)</li>
                  <li>• <strong>Vercel :</strong> vercel.app (gratuit)</li>
                  <li>• <strong>GitHub Pages :</strong> github.io (gratuit)</li>
                  <li>• <strong>Votre propre domaine</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* QR Code avec configuration */}
          <QRCodeGenerator 
            title="🔍 Scanner pour accéder à l'app"
          />

          {/* Instructions */}
          <InstallInstructions />
        </div>

        {/* URL manuelle de partage */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            🔗 Partage manuel
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Si vous avez déjà déployé votre application, saisissez l'URL ici pour la partager :
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://votre-app.netlify.app"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleCopyUrl(manualUrl)}
                disabled={!manualUrl}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Copier
              </button>
              {manualUrl && (
                <a
                  href={manualUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                >
                  Tester
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Guide de déploiement */}
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-blue-800 mb-4">🚀 Comment déployer votre application</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">1. Netlify (Recommandé - Gratuit)</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside ml-4">
                <li>Allez sur <a href="https://netlify.com" className="underline" target="_blank" rel="noopener noreferrer">netlify.com</a></li>
                <li>Connectez votre compte GitHub</li>
                <li>Sélectionnez votre repository</li>
                <li>Build command: <code className="bg-blue-100 px-1 rounded">npm run build</code></li>
                <li>Publish directory: <code className="bg-blue-100 px-1 rounded">dist</code></li>
                <li>Déployez et récupérez l'URL (ex: mon-app.netlify.app)</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">2. GitHub Pages</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside ml-4">
                <li>Commitez votre code sur GitHub</li>
                <li>Allez dans Settings → Pages</li>
                <li>Source: GitHub Actions</li>
                <li>Utilisez le workflow Vite</li>
                <li>URL: votre-username.github.io/nom-repo</li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Fonctionnalités */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <SafeIcon icon={FiDownload} className="mr-3 text-emerald-500" />
            ✨ Pourquoi installer l'application ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={feature.icon} className="text-2xl text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instructions détaillées */}
        <motion.div
          className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            📋 Guide d'installation rapide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">📱 iPhone / iPad :</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Scanner le QR code avec l'appareil photo</li>
                <li>Appuyer sur la notification qui apparaît</li>
                <li>Dans Safari, appuyer sur <strong>Partager 📤</strong></li>
                <li>Sélectionner <strong>"Sur l'écran d'accueil"</strong></li>
                <li>Confirmer avec <strong>"Ajouter"</strong></li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🤖 Android :</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Scanner le QR code avec l'appareil photo</li>
                <li>Ouvrir le lien dans Chrome</li>
                <li>Chercher la bannière <strong>"Installer l'app"</strong></li>
                <li>Ou menu <strong>(⋮) → "Ajouter à l'écran d'accueil"</strong></li>
                <li>Confirmer l'installation</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DownloadPage;