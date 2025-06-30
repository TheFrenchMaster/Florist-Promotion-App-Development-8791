import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiLock, FiEye, FiEyeOff, FiArrowLeft } = FiIcons;

function FloristLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulation d'authentification
    setTimeout(() => {
      if (username === 'fleuriste' && password === 'demo123') {
        localStorage.setItem('florist_auth', JSON.stringify({
          username,
          loginTime: new Date().toISOString()
        }));
        onLogin();
      } else {
        setError('Identifiants incorrects. Utilisez: fleuriste / demo123');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors mb-4">
            <SafeIcon icon={FiArrowLeft} className="mr-2" />
            Retour à l'accueil
          </Link>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🌸</h1>
            <h2 className="text-2xl font-bold text-gray-800">Espace Fleuriste</h2>
            <p className="text-gray-600 mt-2">Connectez-vous pour gérer vos promotions</p>
          </motion.div>
        </div>

        {/* Formulaire de connexion */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ nom d'utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiUser} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                />
              </div>
            </div>

            {/* Champ mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiLock} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Bouton de connexion */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </motion.button>
          </form>

          {/* Informations de démonstration */}
          <motion.div
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-blue-800 font-medium mb-2">Démonstration:</p>
            <p className="text-sm text-blue-600">
              <strong>Utilisateur:</strong> fleuriste<br />
              <strong>Mot de passe:</strong> demo123
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default FloristLogin;