import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

const initialState = {
  promotions: [],
  subscribers: [],
  florist: {
    name: '',
    address: '',
    phone: '',
    email: ''
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    case 'ADD_PROMOTION':
      const newPromotion = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        isActive: true
      };
      return {
        ...state,
        promotions: [newPromotion, ...state.promotions]
      };
    
    case 'UPDATE_PROMOTION':
      return {
        ...state,
        promotions: state.promotions.map(promo =>
          promo.id === action.payload.id
            ? { ...promo, ...action.payload }
            : promo
        )
      };
    
    case 'DELETE_PROMOTION':
      return {
        ...state,
        promotions: state.promotions.filter(promo => promo.id !== action.payload)
      };
    
    case 'ADD_SUBSCRIBER':
      if (state.subscribers.find(sub => sub.email === action.payload.email)) {
        return state;
      }
      return {
        ...state,
        subscribers: [...state.subscribers, {
          ...action.payload,
          id: uuidv4(),
          subscribedAt: new Date().toISOString()
        }]
      };
    
    case 'UPDATE_FLORIST':
      return {
        ...state,
        florist: { ...state.florist, ...action.payload }
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Charger les données depuis localStorage
    const savedData = localStorage.getItem('florist_app_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Sauvegarder les données dans localStorage
    localStorage.setItem('florist_app_data', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé dans un AppProvider');
  }
  return context;
}