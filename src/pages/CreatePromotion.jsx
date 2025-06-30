import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import CameraCapture from '../components/CameraCapture';
import { useApp } from '../context/AppContext';
import NotificationService from '../services/NotificationService';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiSave, FiImage, FiTag, FiClock, FiDollarSign, FiPhone, FiMail, FiMapPin, FiCamera } = FiIcons;

function CreatePromotion() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discount: '',
    endDate: '',
    image: '',
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateFinalPrice = () => {
    const original = parseFloat(formData.originalPrice) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return (original * (1 - discount / 100)).toFixed(2);
  };

  const handleCameraCapture = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const finalPrice = calculateFinalPrice();
      const promotion = {
        ...formData,
        finalPrice: parseFloat(finalPrice),
        originalPrice: parseFloat(formData.originalPrice),
        discount: parseFloat(formData.discount)
      };

      // Ajouter la promotion
      dispatch({ type: 'ADD_PROMOTION', payload: promotion });

      // Envoyer les notifications à tous les abonnés
      if (state.subscribers.length > 0) {
        await NotificationService.broadcastPromotion(promotion, state.subscribers);
      }

      // Rediriger vers le tableau de bord
      navigate('/florist/dashboard');
    } catch (error) {
      console.error('Erreur lors de la création de la promotion:', error);
      alert('Erreur lors de la création de la promotion');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedImages = [
    'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400'
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-20">
        {/* Header */}
        <motion.header
          className="bg-white shadow-sm"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/florist/dashboard')}
                className="mr-4 p-2 text-gray-500 hover:text-emerald-600 transition-colors"
              >
                <SafeIcon icon={FiArrowLeft} className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Nouvelle promotion</h1>
                <p className="text-gray-600 mt-1">Créez une offre spéciale avec notification automatique</p>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Informations de base */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <SafeIcon icon={FiTag} className="mr-3 text-emerald-500" />
                Informations de la promotion
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la promotion *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ex: Bouquet de roses spécial Saint-Valentin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Décrivez votre offre spéciale..."
                />
              </div>
            </div>

            {/* Prix et réduction */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <SafeIcon icon={FiDollarSign} className="mr-3 text-emerald-500" />
                Prix et réduction
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix original (€) *
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="25.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Réduction (%) *
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="1"
                    max="90"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix final (€)
                  </label>
                  <div className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg font-bold text-emerald-600">
                    {calculateFinalPrice()}
                  </div>
                </div>
              </div>
            </div>

            {/* Date d'expiration */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <SafeIcon icon={FiClock} className="mr-3 text-emerald-500" />
                Durée de la promotion
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de fin *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <SafeIcon icon={FiImage} className="mr-3 text-emerald-500" />
                Image de la promotion
              </h2>

              {/* Bouton Prendre une photo */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="flex items-center justify-center px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiCamera} className="mr-2" />
                  Prendre une photo
                </motion.button>

                <div className="text-center text-gray-500 flex items-center">
                  <span className="px-3">ou</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de l'image
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-3">Ou choisissez parmi nos suggestions:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {suggestedImages.map((url, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: url }))}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        formData.image === url
                          ? 'border-emerald-500 ring-2 ring-emerald-200'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={url}
                        alt={`Suggestion ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {formData.image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Aperçu:</p>
                  <div className="h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Informations de contact */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <SafeIcon icon={FiPhone} className="mr-3 text-emerald-500" />
                Informations de contact (optionnel)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiPhone} className="inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="contact.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="01 23 45 67 89"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiMail} className="inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="contact.email"
                    value={formData.contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="contact@fleuriste.fr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiMapPin} className="inline mr-1" />
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="contact.address"
                    value={formData.contactInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="123 Rue des Fleurs, Paris"
                  />
                </div>
              </div>
            </div>

            {/* Résumé */}
            {formData.title && formData.originalPrice && formData.discount && (
              <motion.div
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-semibold text-emerald-800 mb-2">Aperçu de la notification:</h3>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="font-medium text-gray-800">🌸 Promotion Flash - {formData.discount}% de réduction!</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.title || 'Votre promotion'}
                    {formData.endDate && (
                      <span className="block">
                        Valable jusqu'au {new Date(formData.endDate).toLocaleString('fr-FR')}
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                <SafeIcon icon={FiSave} className="mr-2" />
                {isLoading ? 'Création et envoi...' : `Créer et notifier ${state.subscribers.length} abonnés`}
              </motion.button>

              <button
                type="button"
                onClick={() => navigate('/florist/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Modal Caméra */}
      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default CreatePromotion;