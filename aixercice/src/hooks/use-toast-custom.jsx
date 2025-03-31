import React, { createContext, useContext, useState, useCallback } from 'react';

// Types de toast
const TOAST_TYPES = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Context pour les toasts
const ToastContext = createContext({
  toasts: [],
  toast: () => {},
  dismissToast: () => {},
});

// Composant Toast
export const Toast = ({ id, title, description, type, onDismiss }) => {
  const getBgColor = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return 'bg-green-100 border-green-500';
      case TOAST_TYPES.ERROR:
        return 'bg-red-100 border-red-500';
      case TOAST_TYPES.WARNING:
        return 'bg-yellow-100 border-yellow-500';
      case TOAST_TYPES.INFO:
        return 'bg-blue-100 border-blue-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };
  
  const getTextColor = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return 'text-green-800';
      case TOAST_TYPES.ERROR:
        return 'text-red-800';
      case TOAST_TYPES.WARNING:
        return 'text-yellow-800';
      case TOAST_TYPES.INFO:
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };
  
  return (
    <div 
      className={`${getBgColor()} border-l-4 p-4 rounded shadow-md ${getTextColor()} relative mb-3`}
      role="alert"
    >
      {title && <p className="font-bold">{title}</p>}
      {description && <p>{description}</p>}
      <button 
        onClick={() => onDismiss(id)} 
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        aria-label="Fermer"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

// Composant qui affichera tous les toasts
export const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          {...toast} 
          onDismiss={dismissToast} 
        />
      ))}
    </div>
  );
};

// Provider pour les toasts
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const toast = useCallback(({ title, description, type = TOAST_TYPES.DEFAULT, duration = 5000, variant }) => {
    // Si variant est "destructive", on considère ça comme une erreur
    if (variant === "destructive") type = TOAST_TYPES.ERROR;
    
    const id = Date.now().toString();
    const newToast = { id, title, description, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-dismiss
    if (duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    
    return id;
  }, [dismissToast]);
  
  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Hook pour utiliser les toasts
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}; 