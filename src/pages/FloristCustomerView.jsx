import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useFlorist } from '../context/FloristContext';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import NotificationService from '../services/NotificationService';
import * as FiIcons from 'react-icons/fi';

const { FiBell, FiMail, FiPhone, FiMapPin, FiClock, FiTag, FiSettings, FiDownload, FiShare, FiArrowLeft } = FiIcons;

function FloristCustomerView({ slug }) {
  const { florist, promotions, addSubscriber, loading } = useFlorist();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);

  useEffect(() => {
    const savedSubscription = localStorage.getItem(`customer_subscription_${slug}`);
    if (savedSubscription) {
      setIsSubscribed(true);
    }
  }, [slug]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const hasPermission = await NotificationService.requestPermission();
    if (!hasPermission) {
      alert('Veuillez autoriser les notifications pour recevoir les promotions!');
      return;
    }

    try {
      await addSubscriber({ email, name });
      localStorage.setItem(`customer_subscription_${slug}`, JSON.stringify({ email, name }));
      setIsSubscribed(true);
      setShowSubscriptionForm(false);

      // Notification de bienvenue
      NotificationService.sendNotification(
        `🌸 Bienvenue chez ${florist?.name || 'votre fleuriste'}!`,
        { body: 'Vous recevrez maintenant toutes nos promotions exclusives!', tag: 'welcome' }
      );
    } catch (error) {
      alert('Erreur lors de l\'inscription');
    }
  };

  const activePromotions = promotions.filter(promo =>
    promo.is_active && new Date(promo.end_date) > new Date()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!florist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Fleuriste non trouvé</h1>
          <Link to="/" className="text-emerald-600 hover:text-emerald-700">
            <SafeIcon icon={FiArrowLeft} className="inline mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🌸 {florist.name}</h1>
              <p className="text-gray-600 mt-1">{florist.description || 'Promotions exclusives'}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/florist/${slug}/login`}
                className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                title="Espace fleuriste"
              >
                <SafeIcon icon={FiSettings} className="text-xl" />
              </Link>
            </div>
          </div>
          
          {/* Informations du fleuriste */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            {florist.phone && (
              <div className="flex items-center">
                <SafeIcon icon={FiPhone} className="mr-2 text-blue-500" />
                <span>{florist.phone}</span>
              </div>
            )}
            {florist.email && (
              <div className="flex items-center">
                <SafeIcon icon={FiMail} className="mr-2 text-purple-500" />
                <span>{florist.email}</span>
              </div>
            )}
            {florist.address && (
              <div className="flex items-center">
                <SafeIcon icon={FiMapPin} className="mr-2 text-red-500" />
                <span>{florist.address}</span>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Section d'abonnement */}
        {!isSubscribed && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-100"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              <SafeIcon icon={FiBell} className="text-4xl text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ne ratez aucune promotion de {florist.name}!
              </h2>
              <p className="text-gray-600 mb-6">
                Recevez des notifications en temps réel pour toutes nos offres spéciales
              </p>
              {!showSubscriptionForm ? (
                <motion.button
                  onClick={() => setShowSubscriptionForm(true)}
                  className="bg-emerald-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-600 transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  S'abonner aux notifications
                </motion.button>
              ) : (
                <motion.form
                  onSubmit={handleSubscribe}
                  className="space-y-4 max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      S'abonner
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSubscriptionForm(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        )}

        {/* Statut d'abonnement */}
        {isSubscribed && (
          <motion.div
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SafeIcon icon={FiBell} className="text-2xl text-emerald-600 mr-3" />
                <div>
                  <p className="font-semibold text-emerald-800">Notifications activées!</p>
                  <p className="text-emerald-600 text-sm">Vous recevrez toutes les promotions de {florist.name}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Promotions actives */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <SafeIcon icon={FiTag} className="mr-3 text-emerald-500" />
            Promotions actuelles
          </h2>

          <AnimatePresence>
            {activePromotions.length === 0 ? (
              <motion.div
                className="bg-white rounded-xl p-8 text-center shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-500 text-lg">Aucune promotion en cours</p>
                <p className="text-gray-400 mt-2">Abonnez-vous pour être notifié des prochaines offres!</p>
              </motion.div>
            ) : (
              <div className="grid gap-6">
                {activePromotions.map((promotion, index) => (
                  <motion.div
                    key={promotion.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {promotion.image && (
                      <div className="h-48 bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center">
                        <img
                          src={promotion.image}
                          alt={promotion.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {promotion.title}
                          </h3>
                          <p className="text-gray-600">{promotion.description}</p>
                        </div>
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          -{promotion.discount}%
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <SafeIcon icon={FiTag} className="mr-2 text-emerald-500" />
                          <span>
                            Prix: {promotion.original_price}€ →{' '}
                            <strong className="text-emerald-600">{promotion.final_price}€</strong>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <SafeIcon icon={FiClock} className="mr-2 text-orange-500" />
                          <span>
                            Jusqu'au {new Date(promotion.end_date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

export default FloristCustomerView;