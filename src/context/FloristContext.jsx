import React, { createContext, useContext, useReducer, useEffect } from 'react';
import supabase from '../lib/supabase';

const FloristContext = createContext();

const initialState = {
  promotions: [],
  subscribers: [],
  florist: null,
  loading: false,
  error: null
};

function floristReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FLORIST':
      return { ...state, florist: action.payload };
    case 'SET_PROMOTIONS':
      return { ...state, promotions: action.payload };
    case 'ADD_PROMOTION':
      return { ...state, promotions: [action.payload, ...state.promotions] };
    case 'UPDATE_PROMOTION':
      return {
        ...state,
        promotions: state.promotions.map(promo =>
          promo.id === action.payload.id ? { ...promo, ...action.payload } : promo
        )
      };
    case 'DELETE_PROMOTION':
      return {
        ...state,
        promotions: state.promotions.filter(promo => promo.id !== action.payload)
      };
    case 'SET_SUBSCRIBERS':
      return { ...state, subscribers: action.payload };
    case 'ADD_SUBSCRIBER':
      return { ...state, subscribers: [...state.subscribers, action.payload] };
    default:
      return state;
  }
}

export function FloristProvider({ children, floristId }) {
  const [state, dispatch] = useReducer(floristReducer, initialState);

  // Charger les données du fleuriste
  const loadFloristData = async () => {
    if (!floristId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [floristResult, promotionsResult, subscribersResult] = await Promise.all([
        supabase
          .from('florists_admin_2024')
          .select('*')
          .eq('id', floristId)
          .single(),
        supabase
          .from('promotions_admin_2024')
          .select('*')
          .eq('florist_id', floristId)
          .order('created_at', { ascending: false }),
        supabase
          .from('subscribers_admin_2024')
          .select('*')
          .eq('florist_id', floristId)
          .order('created_at', { ascending: false })
      ]);

      if (floristResult.error) throw floristResult.error;
      if (promotionsResult.error) throw promotionsResult.error;
      if (subscribersResult.error) throw subscribersResult.error;

      dispatch({ type: 'SET_FLORIST', payload: floristResult.data });
      dispatch({ type: 'SET_PROMOTIONS', payload: promotionsResult.data || [] });
      dispatch({ type: 'SET_SUBSCRIBERS', payload: subscribersResult.data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Créer une promotion
  const createPromotion = async (promotionData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase
        .from('promotions_admin_2024')
        .insert([{
          ...promotionData,
          florist_id: floristId,
          is_active: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: 'ADD_PROMOTION', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Ajouter un abonné
  const addSubscriber = async (subscriberData) => {
    try {
      const { data, error } = await supabase
        .from('subscribers_admin_2024')
        .insert([{
          ...subscriberData,
          florist_id: floristId,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: 'ADD_SUBSCRIBER', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  useEffect(() => {
    loadFloristData();
  }, [floristId]);

  const value = {
    ...state,
    createPromotion,
    addSubscriber,
    loadFloristData,
    dispatch
  };

  return (
    <FloristContext.Provider value={value}>
      {children}
    </FloristContext.Provider>
  );
}

export function useFlorist() {
  const context = useContext(FloristContext);
  if (!context) {
    throw new Error('useFlorist must be used within a FloristProvider');
  }
  return context;
}