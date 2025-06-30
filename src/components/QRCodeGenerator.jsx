import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiQrCode, FiCopy, FiShare2, FiCheck, FiAlertTriangle, FiEdit3 } = FiIcons;

function QRCodeGenerator({ url, title = "Scanner pour télécharger" }) {
  const canvasRef = useRef(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [showCustomUrl, setShowCustomUrl] = useState(false);

  // Construire l'URL correcte avec fallback
  const getCorrectUrl = () => {
    // Si une URL personnalisée est définie, l'utiliser
    if (customUrl.trim()) {
      return customUrl.trim();
    }

    // Si une URL est passée en props et qu'elle ne contient pas de proxy, l'utiliser
    if (url && !url.includes('proxy') && !url.includes('addons.questprotocol.xyz')) {
      return url;
    }

    const currentUrl = window.location.href;
    
    // Si on est dans le proxy Quest, essayer de construire une URL utilisable
    if (currentUrl.includes('addons.questprotocol.xyz/api/greta/ai/proxy')) {
      // URL de fallback - utiliser une URL générique pour la démo
      return 'https://your-app-url.com'; // L'utilisateur devra remplacer cela
    }
    
    // Pour les autres cas, utiliser l'URL actuelle nettoyée
    const baseUrl = window.location.origin;
    const pathname = window.location.pathname.split('#')[0];
    return `${baseUrl}${pathname}`;
  };

  const finalUrl = getCorrectUrl();

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setError('');
        
        // Vérifier que l'URL est valide
        if (!finalUrl || finalUrl === 'https://your-app-url.com') {
          setError('URL non configurée - Veuillez saisir votre URL d\'application');
          generatePlaceholderQR();
          return;
        }

        console.log('Génération QR code pour URL:', finalUrl);

        // Import dynamique de qrcode
        const QRCode = await import('qrcode');
        
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, finalUrl, {
            width: 220,
            margin: 3,
            color: {
              dark: '#000000',
              light: '#ffffff'
            },
            errorCorrectionLevel: 'H'
          });
          setQrGenerated(true);
          console.log('QR code généré avec succès');
        }
      } catch (error) {
        console.error('Erreur génération QR code:', error);
        setError('Erreur lors de la génération du QR code');
        generatePlaceholderQR();
      }
    };

    generateQRCode();
  }, [finalUrl]);

  const generatePlaceholderQR = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 220;

    canvas.width = size;
    canvas.height = size;

    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Message placeholder
    ctx.fillStyle = '#6b7280';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', size / 2, size / 2 - 20);
    ctx.font = '12px Arial';
    ctx.fillText('Configurez votre URL', size / 2, size / 2);
    ctx.fillText('ci-dessous', size / 2, size / 2 + 15);

    // Bordure
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, size - 20, size - 20);

    setQrGenerated(true);
  };

  const handleCustomUrlSubmit = () => {
    if (customUrl.trim()) {
      // Valider l'URL
      try {
        new URL(customUrl.trim());
        setShowCustomUrl(false);
      } catch (err) {
        alert('Veuillez saisir une URL valide (ex: https://votre-site.com)');
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = finalUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FleurNotif - App Notifications Fleuriste',
          text: 'Téléchargez FleurNotif pour recevoir toutes nos promotions !',
          url: finalUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Erreur lors du partage:', err);
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-center mb-4">
        <SafeIcon icon={FiQrCode} className="text-2xl text-emerald-500 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>

      {error && (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-lg mb-4 text-sm">
          <SafeIcon icon={FiAlertTriangle} className="inline mr-2" />
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-4 inline-block">
        {!qrGenerated && (
          <div className="w-[220px] h-[220px] flex items-center justify-center border border-gray-200 rounded">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`border border-gray-200 rounded ${!qrGenerated ? 'hidden' : ''}`}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Configuration URL personnalisée */}
      {(finalUrl === 'https://your-app-url.com' || showCustomUrl) && (
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <h4 className="font-semibold text-blue-800 mb-2">🔧 Configurer l'URL de votre application</h4>
          <div className="space-y-3">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://votre-application.com"
              className="w-full px-3 py-2 border border-blue-300 rounded text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCustomUrlSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Générer QR Code
              </button>
              {!error && (
                <button
                  onClick={() => setShowCustomUrl(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* URL actuelle */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs">
        <p className="text-gray-800 font-medium mb-1">URL du QR Code:</p>
        <div className="flex items-center gap-2">
          <p className="text-gray-600 font-mono break-all flex-1">{finalUrl}</p>
          <button
            onClick={() => setShowCustomUrl(true)}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="Modifier l'URL"
          >
            <SafeIcon icon={FiEdit3} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Scannez ce QR code avec l'appareil photo de votre smartphone pour accéder à l'application
      </p>

      <div className="flex gap-3 justify-center">
        <motion.button
          onClick={handleCopyLink}
          disabled={finalUrl === 'https://your-app-url.com'}
          className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            copied
              ? 'bg-green-100 text-green-700'
              : finalUrl === 'https://your-app-url.com'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          whileHover={{ scale: finalUrl === 'https://your-app-url.com' ? 1 : 1.05 }}
          whileTap={{ scale: finalUrl === 'https://your-app-url.com' ? 1 : 0.95 }}
        >
          <SafeIcon icon={copied ? FiCheck : FiCopy} className="mr-2" />
          {copied ? 'Copié !' : 'Copier le lien'}
        </motion.button>

        <motion.button
          onClick={handleShare}
          disabled={finalUrl === 'https://your-app-url.com'}
          className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            finalUrl === 'https://your-app-url.com'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
          whileHover={{ scale: finalUrl === 'https://your-app-url.com' ? 1 : 1.05 }}
          whileTap={{ scale: finalUrl === 'https://your-app-url.com' ? 1 : 0.95 }}
        >
          <SafeIcon icon={FiShare2} className="mr-2" />
          Partager
        </motion.button>
      </div>

      {/* Instructions avec exemples d'URLs */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg text-left">
        <p className="text-xs text-green-800 font-medium mb-2">💡 Exemples d'URLs valides:</p>
        <ul className="text-xs text-green-700 space-y-1">
          <li>• <code>https://votre-site.com</code></li>
          <li>• <code>https://app.votre-domaine.fr</code></li>
          <li>• <code>https://mon-fleuriste.github.io/app</code></li>
          <li>• <code>https://netlify-app-name.netlify.app</code></li>
        </ul>
      </div>

      {/* Debug info condensée */}
      <details className="mt-4 text-left">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
          🔍 Informations de debug
        </summary>
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs space-y-1">
          <p><strong>URL actuelle:</strong> {window.location.href}</p>
          <p><strong>Est un proxy:</strong> {window.location.href.includes('proxy') ? 'Oui' : 'Non'}</p>
          <p><strong>URL générée:</strong> {finalUrl}</p>
        </div>
      </details>
    </motion.div>
  );
}

export default QRCodeGenerator;