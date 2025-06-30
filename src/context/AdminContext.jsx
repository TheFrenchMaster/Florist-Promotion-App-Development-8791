import React, { createContext, useContext, useReducer, useEffect } from 'react';
import supabase from '../lib/supabase';

const AdminContext = createContext();

const initialState = {
  florists: [],
  admin: null,
  selectedFlorist: null,
  loading: false,
  error: null
};

function adminReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ADMIN':
      return { ...state, admin: action.payload };
    case 'SET_FLORISTS':
      return { ...state, florists: action.payload };
    case 'ADD_FLORIST':
      return { ...state, florists: [...state.florists, action.payload] };
    case 'UPDATE_FLORIST':
      return {
        ...state,
        florists: state.florists.map(florist =>
          florist.id === action.payload.id ? { ...florist, ...action.payload } : florist
        )
      };
    case 'DELETE_FLORIST':
      return {
        ...state,
        florists: state.florists.filter(florist => florist.id !== action.payload)
      };
    case 'SET_SELECTED_FLORIST':
      return { ...state, selectedFlorist: action.payload };
    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Charger les fleuristes
  const loadFlorists = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase
        .from('florists_admin_2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      dispatch({ type: 'SET_FLORISTS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Créer un fleuriste
  const createFlorist = async (floristData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase
        .from('florists_admin_2024')
        .insert([{
          ...floristData,
          slug: floristData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          is_active: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: 'ADD_FLORIST', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Mettre à jour un fleuriste
  const updateFlorist = async (id, updates) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase
        .from('florists_admin_2024')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: 'UPDATE_FLORIST', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Supprimer un fleuriste
  const deleteFlorist = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { error } = await supabase
        .from('florists_admin_2024')
        .delete()
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'DELETE_FLORIST', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Obtenir les statistiques d'un fleuriste
  const getFloristStats = async (floristId) => {
    try {
      const [promotionsResult, subscribersResult] = await Promise.all([
        supabase
          .from('promotions_admin_2024')
          .select('*')
          .eq('florist_id', floristId),
        supabase
          .from('subscribers_admin_2024')
          .select('*')
          .eq('florist_id', floristId)
      ]);

      return {
        promotions: promotionsResult.data || [],
        subscribers: subscribersResult.data || []
      };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { promotions: [], subscribers: [] };
    }
  };

  useEffect(() => {
    loadFlorists();
  }, []);

  const value = {
    ...state,
    createFlorist,
    updateFlorist,
    deleteFlorist,
    loadFlorists,
    getFloristStats,
    dispatch
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}