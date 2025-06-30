import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useApp } from '../context/AppContext';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiUsers, FiTrendingUp, FiClock, FiBell, FiTag } = FiIcons;

function FloristDashboard() {
  const { state } = useApp();

  const activePromotions = state.promotions.filter(promo => 
    promo.isActive && new Date(promo.endDate) > new Date()
  );

  const expiredPromotions = state.promotions.filter(promo => 
    new Date(promo.endDate) <= new Date()
  );

  const stats = [
    {
      title: 'Abonnés',
      value: state.subscribers.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Promotions actives',
      value: activePromotions.length,
      icon: FiTag,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total promotions',
      value: state.promotions.length,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Expirées',
      value: expiredPromotions.length,
      icon: FiClock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

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
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">Gérez vos promotions et notifications</p>
            </div>
            <Link to="/florist/create-promotion">
              <motion.button
                className="bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition-colors shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiPlus} className="mr-2" />
                Nouvelle promotion
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`${stat.bgColor} rounded-xl p-4 border border-gray-100`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <SafeIcon icon={stat.icon} className="text-white text-xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions rapides */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/florist/create-promotion">
              <motion.div
                className="p-4 border-2 border-dashed border-emerald-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center">
                  <SafeIcon icon={FiPlus} className="text-2xl text-emerald-500 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Créer une promotion</h3>
                    <p className="text-sm text-gray-600">Nouvelle offre spéciale avec notification</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link to="/florist/history">
              <motion.div
                className="p-4 border-2 border-dashed border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center">
                  <SafeIcon icon={FiClock} className="text-2xl text-blue-500 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Voir l'historique</h3>
                    <p className="text-sm text-gray-600">Toutes vos promotions passées</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Promotions actives */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <SafeIcon icon={FiBell} className="mr-3 text-emerald-500" />
              Promotions actives
            </h2>
            {activePromotions.length > 0 && (
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                {activePromotions.length} active{activePromotions.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {activePromotions.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon icon={FiTag} className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune promotion active</p>
              <p className="text-gray-400 mt-2">Créez votre première promotion pour commencer!</p>
              <Link to="/florist/create-promotion">
                <motion.button
                  className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Créer une promotion
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activePromotions.slice(0, 3).map((promotion, index) => (
                <motion.div
                  key={promotion.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{promotion.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {promotion.discount}% de réduction • Expire le {new Date(promotion.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    -{promotion.discount}%
                  </div>
                </motion.div>
              ))}
              
              {activePromotions.length > 3 && (
                <Link to="/florist/history">
                  <div className="text-center py-2">
                    <span className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Voir toutes les promotions ({activePromotions.length - 3} de plus)
                    </span>
                  </div>
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default FloristDashboard;