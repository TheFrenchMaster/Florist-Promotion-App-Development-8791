import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useApp } from '../context/AppContext';
import { format, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiClock, FiTag, FiTrash2, FiEdit3, FiEye, FiEyeOff } = FiIcons;

function PromotionHistory() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const getPromotionStatus = (promotion) => {
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    
    if (isAfter(endDate, now)) {
      return 'active';
    }
    return 'expired';
  };

  const filteredPromotions = state.promotions.filter(promotion => {
    if (filter === 'active') return getPromotionStatus(promotion) === 'active';
    if (filter === 'expired') return getPromotionStatus(promotion) === 'expired';
    return true;
  });

  const handleDeletePromotion = (promotionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      dispatch({ type: 'DELETE_PROMOTION', payload: promotionId });
    }
  };

  const togglePromotionStatus = (promotion) => {
    dispatch({
      type: 'UPDATE_PROMOTION',
      payload: {
        id: promotion.id,
        isActive: !promotion.isActive
      }
    });
  };

  const getStatusBadge = (promotion) => {
    const status = getPromotionStatus(promotion);
    if (status === 'active') {
      return (
        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
          Active
        </span>
      );
    }
    return (
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
        Expirée
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-20">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/florist/dashboard')}
                className="mr-4 p-2 text-gray-500 hover:text-emerald-600 transition-colors"
              >
                <SafeIcon icon={FiArrowLeft} className="text-xl" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Historique</h1>
                <p className="text-gray-600 mt-1">Toutes vos promotions créées</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filtres */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Toutes ({state.promotions.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Actives ({state.promotions.filter(p => getPromotionStatus(p) === 'active').length})
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'expired'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Expirées ({state.promotions.filter(p => getPromotionStatus(p) === 'expired').length})
            </button>
          </div>
        </motion.div>

        {/* Liste des promotions */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPromotions.length === 0 ? (
              <motion.div
                className="bg-white rounded-xl p-8 text-center shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SafeIcon icon={FiTag} className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {filter === 'all' 
                    ? 'Aucune promotion créée'
                    : filter === 'active'
                    ? 'Aucune promotion active'
                    : 'Aucune promotion expirée'
                  }
                </p>
              </motion.div>
            ) : (
              filteredPromotions.map((promotion, index) => (
                <motion.div
                  key={promotion.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{promotion.title}</h3>
                          {getStatusBadge(promotion)}
                        </div>
                        {promotion.description && (
                          <p className="text-gray-600">{promotion.description}</p>
                        )}
                      </div>
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold ml-4">
                        -{promotion.discount}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="text-gray-500">Prix original:</span>
                        <p className="font-semibold">{promotion.originalPrice}€</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Prix final:</span>
                        <p className="font-semibold text-emerald-600">{promotion.finalPrice}€</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Créée le:</span>
                        <p className="font-semibold">
                          {format(new Date(promotion.createdAt), 'dd/MM/yyyy', { locale: fr })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Expire le:</span>
                        <p className="font-semibold">
                          {format(new Date(promotion.endDate), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>

                    {promotion.image && (
                      <div className="mb-4">
                        <img
                          src={promotion.image}
                          alt={promotion.title}
                          className="h-32 w-full object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => togglePromotionStatus(promotion)}
                          className={`p-2 rounded-lg transition-colors ${
                            promotion.isActive
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={promotion.isActive ? 'Masquer' : 'Afficher'}
                        >
                          <SafeIcon icon={promotion.isActive ? FiEyeOff : FiEye} className="text-lg" />
                        </motion.button>

                        <motion.button
                          onClick={() => handleDeletePromotion(promotion.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Supprimer"
                        >
                          <SafeIcon icon={FiTrash2} className="text-lg" />
                        </motion.button>
                      </div>

                      <div className="text-sm text-gray-500">
                        <SafeIcon icon={FiClock} className="inline mr-1" />
                        {getPromotionStatus(promotion) === 'active' 
                          ? 'En cours' 
                          : 'Terminée'
                        }
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Statistiques */}
        {state.promotions.length > 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Statistiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{state.promotions.length}</p>
                <p className="text-sm text-gray-600">Total créées</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {state.promotions.filter(p => getPromotionStatus(p) === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Actives</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {state.promotions.filter(p => getPromotionStatus(p) === 'expired').length}
                </p>
                <p className="text-sm text-gray-600">Expirées</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{state.subscribers.length}</p>
                <p className="text-sm text-gray-600">Abonnés</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PromotionHistory;