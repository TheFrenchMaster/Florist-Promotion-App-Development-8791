import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import FloristCard from '../components/FloristCard';
import CreateFloristModal from '../components/CreateFloristModal';
import GetStartedModal from '../components/GetStartedModal';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiUsers, FiStore, FiTrendingUp, FiBell, FiLogOut, FiPlay } = FiIcons;

function AdminDashboard() {
  const { florists, loading, error, loadFlorists } = useAdmin();
  const { logout, user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);

  const totalSubscribers = florists.reduce((sum, florist) => sum + (florist.subscribers_count || 0), 0);
  const totalPromotions = florists.reduce((sum, florist) => sum + (florist.promotions_count || 0), 0);
  const activeFlorists = florists.filter(f => f.is_active).length;

  const stats = [
    { title: 'Fleuristes', value: florists.length, icon: FiStore, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { title: 'Actifs', value: activeFlorists, icon: FiUsers, color: 'bg-emerald-500', bgColor: 'bg-emerald-50' },
    { title: 'Abonnés total', value: totalSubscribers, icon: FiBell, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
    { title: 'Promotions', value: totalPromotions, icon: FiTrendingUp, color: 'bg-orange-500', bgColor: 'bg-orange-50' }
  ];

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Administration FleurNotif</h1>
              <p className="text-gray-600 mt-1">
                Bienvenue {user?.email || 'Admin'} - Gérez vos fleuristes et leurs applications
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setShowGetStarted(true)}
                className="bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition-colors shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiPlay} className="mr-2" />
                Guide de démarrage
              </motion.button>
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiPlus} className="mr-2" />
                Nouveau fleuriste
              </motion.button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Déconnexion"
              >
                <SafeIcon icon={FiLogOut} className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-8">
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

        {/* Message d'erreur */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Liste des fleuristes */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Fleuristes enregistrés</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {florists.length} fleuriste{florists.length > 1 ? 's' : ''}
            </span>
          </div>

          {florists.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiStore} className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun fleuriste enregistré</p>
              <p className="text-gray-400 mt-2">Créez votre premier fleuriste pour commencer!</p>
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Créer un fleuriste
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {florists.map((florist, index) => (
                  <FloristCard
                    key={florist.id}
                    florist={florist}
                    index={index}
                    onRefresh={loadFlorists}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal de création */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateFloristModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadFlorists();
            }}
          />
        )}
      </AnimatePresence>

      {/* GetStarted Modal */}
      <AnimatePresence>
        {showGetStarted && (
          <GetStartedModal
            isOpen={showGetStarted}
            onClose={() => setShowGetStarted(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;