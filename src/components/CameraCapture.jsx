import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCamera, FiX, FiRotateCcw, FiCheck, FiUpload } = FiIcons;

function CameraCapture({ onCapture, onClose }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Caméra arrière par défaut
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Erreur accès caméra:', err);
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Définir la taille du canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image de la vidéo sur le canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir en blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  }, [stopCamera]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    onClose();
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black text-white">
        <h2 className="text-lg font-semibold">Prendre une photo</h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiX} className="text-xl" />
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 relative bg-black">
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg z-10">
            <p className="text-sm">{error}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 bg-white text-red-500 px-3 py-1 rounded text-sm font-medium"
            >
              Choisir depuis la galerie
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!capturedImage ? (
            <motion.div
              key="camera"
              className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <img
                src={capturedImage}
                alt="Photo capturée"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay de guidage */}
        {!capturedImage && !error && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Cadre de guidage */}
            <div className="absolute inset-x-8 top-1/2 transform -translate-y-1/2 h-64 border-2 border-white border-dashed rounded-lg opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
              <p className="text-sm opacity-75 mb-2">Centrez votre produit dans le cadre</p>
            </div>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="p-6 bg-black">
        {!capturedImage ? (
          <div className="flex items-center justify-center space-x-8">
            {/* Bouton galerie */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
            >
              <SafeIcon icon={FiUpload} className="text-lg" />
            </button>

            {/* Bouton capture */}
            <motion.button
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
              whileTap={{ scale: 0.9 }}
              disabled={error}
            >
              <SafeIcon icon={FiCamera} className="text-2xl text-black" />
            </motion.button>

            {/* Espace pour symétrie */}
            <div className="w-12 h-12"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-6">
            {/* Reprendre */}
            <motion.button
              onClick={retakePhoto}
              className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiRotateCcw} className="mr-2" />
              Reprendre
            </motion.button>

            {/* Utiliser */}
            <motion.button
              onClick={confirmPhoto}
              className="flex items-center px-6 py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiCheck} className="mr-2" />
              Utiliser cette photo
            </motion.button>
          </div>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  );
}

export default CameraCapture;