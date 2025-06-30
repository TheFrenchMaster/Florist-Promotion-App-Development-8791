import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useAdmin } from '../context/AdminContext';
import QRCodeGenerator from './QRCodeGenerator';
import * as FiIcons from 'react-icons/fi';

const { FiStore, FiUsers, FiBell, FiEye, FiEdit3, FiTrash2, FiExternalLink, FiToggleLeft, FiToggleRight } = FiIcons;

function FloristCard({ florist, index, onRefresh }) {
  const { updateFlorist, deleteFlorist } = useAdmin();
  const [showQR, setShowQR] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: florist.name,
    email: florist.email,
    phone: florist.phone,
    address: florist.address
  });

  const floristUrl = `${window.location.origin}${window.location.pathname}#/florist/${florist.slug}`;

  const handleToggleActive = async () => {
    try {
      await updateFlorist(florist.id, { is_active: !florist.is_active });
      onRefresh();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${florist.name} ?`)) {
      try {
        await deleteFlorist(florist.id);
        onRefresh();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateFlorist(florist.id, editData);
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
        florist.is_active ? 'border-emerald-200' : 'border-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
              florist.is_active ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              <SafeIcon icon={FiStore} className={`text-xl ${
                florist.is_active ? 'text-emerald-600' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{florist.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                florist.is_active
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {florist.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleActive}
              className={`p-1 rounded transition-colors ${
                florist.is_active ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray-400 hover:text-gray-600'
              }`}
              title={florist.is_active ? 'Désactiver' : 'Activer'}
            >
              <SafeIcon icon={florist.is_active ? FiToggleRight : FiToggleLeft} className="text-lg" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
              title="Modifier"
            >
              <SafeIcon icon={FiEdit3} className="text-lg" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-red-600 hover:text-red-700 transition-colors"
              title="Supprimer"
            >
              <SafeIcon icon={FiTrash2} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Contenu modifiable */}
        {isEditing ? (
          <div className="space-y-3 mb-4">
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="Nom du fleuriste"
            />
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="Email"
            />
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="Téléphone"
            />
            <input
              type="text"
              value={editData.address}
              onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="Adresse"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <p><strong>Email:</strong> {florist.email}</p>
            <p><strong>Téléphone:</strong> {florist.phone}</p>
            <p><strong>Adresse:</strong> {florist.address}</p>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <SafeIcon icon={FiUsers} className="text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">{florist.subscribers_count || 0}</p>
            <p className="text-xs text-gray-600">Abonnés</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <SafeIcon icon={FiBell} className="text-purple-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-800">{florist.promotions_count || 0}</p>
            <p className="text-xs text-gray-600">Promotions</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => setShowQR(!showQR)}
            className="flex-1 bg-emerald-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiEye} className="inline mr-1" />
            QR Code
          </motion.button>
          <motion.a
            href={floristUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={FiExternalLink} className="inline mr-1" />
            Voir l'app
          </motion.a>
        </div>

        {/* QR Code */}
        {showQR && (
          <motion.div
            className="mt-4 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <QRCodeGenerator
              url={floristUrl}
              title={`QR Code pour ${florist.name}`}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default FloristCard;