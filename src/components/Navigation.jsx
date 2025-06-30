import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import GetStartedModal from './GetStartedModal';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiPlus, FiClock, FiLogOut, FiPlay } = FiIcons;

function Navigation({ floristSlug }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showGetStarted, setShowGetStarted] = useState(false);

  const handleLogout = () => {
    if (floristSlug) {
      localStorage.removeItem(`florist_auth_${floristSlug}`);
      navigate(`/florist/${floristSlug}`);
    } else {
      localStorage.removeItem('admin_auth');
      navigate('/admin/login');
    }
    window.location.reload();
  };

  const basePath = floristSlug ? `/florist/${floristSlug}` : '/admin';

  const navItems = [
    { path: `${basePath}/dashboard`, icon: FiHome, label: 'Accueil' },
    { path: `${basePath}/create-promotion`, icon: FiPlus, label: 'Créer' },
    { path: `${basePath}/history`, icon: FiClock, label: 'Historique' }
  ];

  // Only show GetStarted button for admin users
  const showGetStartedButton = !floristSlug;

  return (
    <>
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-500 hover:text-emerald-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={item.icon} className="text-xl mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            </Link>
          ))}

          {/* GetStarted button for admin */}
          {showGetStartedButton && (
            <motion.button
              onClick={() => setShowGetStarted(true)}
              className="flex flex-col items-center p-3 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiPlay} className="text-xl mb-1" />
              <span className="text-xs font-medium">Guide</span>
            </motion.button>
          )}

          <motion.button
            onClick={handleLogout}
            className="flex flex-col items-center p-3 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiLogOut} className="text-xl mb-1" />
            <span className="text-xs font-medium">Sortir</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* GetStarted Modal */}
      <AnimatePresence>
        {showGetStarted && (
          <GetStartedModal
            isOpen={showGetStarted}
            onClose={() => setShowGetStarted(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;