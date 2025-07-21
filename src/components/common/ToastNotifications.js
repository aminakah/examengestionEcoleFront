import React from 'react';
import { useToast } from '../../hooks/customHooks';

/**
 * Composant de conteneur pour les notifications toast
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

/**
 * Composant de notification individuelle
 */
function ToastNotification({ toast, onClose }) {
  const { id, message, type, duration } = toast;

  // Configuration des styles selon le type
  const getToastStyles = () => {
    const baseStyles = "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-l-4 border-green-500`;
      case 'error':
        return `${baseStyles} border-l-4 border-red-500`;
      case 'warning':
        return `${baseStyles} border-l-4 border-yellow-500`;
      case 'info':
      default:
        return `${baseStyles} border-l-4 border-blue-500`;
    }
  };

  const getIconComponent = () => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getTitleByType = () => {
    switch (type) {
      case 'success':
        return 'Succès';
      case 'error':
        return 'Erreur';
      case 'warning':
        return 'Attention';
      case 'info':
      default:
        return 'Information';
    }
  };

  // Auto-fermeture après la durée spécifiée
  React.useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={getToastStyles()}>
      <div className="p-4">
        <div className="flex items-start">
          {getIconComponent()}
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">
              {getTitleByType()}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Fermer</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Barre de progression pour le temps restant */}
      {duration && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className={`h-full ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            } transition-all ease-linear`}
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/**
 * Hook d'utilisation des toasts avec contexte global
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = React.useCallback((message, duration) => 
    addToast(message, 'success', duration), [addToast]);
  
  const error = React.useCallback((message, duration) => 
    addToast(message, 'error', duration), [addToast]);
  
  const warning = React.useCallback((message, duration) => 
    addToast(message, 'warning', duration), [addToast]);
  
  const info = React.useCallback((message, duration) => 
    addToast(message, 'info', duration), [addToast]);

  const clearAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = React.useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  }), [toasts, addToast, removeToast, success, error, warning, info, clearAll]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContext = React.createContext();

export const useToastContext = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

/**
 * Composant de test pour les toasts
 */
export function ToastDemo() {
  const { success, error, warning, info } = useToastContext();

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Test des Notifications</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => success('Opération réussie !')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Succès
        </button>
        
        <button
          onClick={() => error('Une erreur est survenue')}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Erreur
        </button>
        
        <button
          onClick={() => warning('Attention à cette action')}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Avertissement
        </button>
        
        <button
          onClick={() => info('Information importante')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Information
        </button>
      </div>
      
      <button
        onClick={() => {
          success('Note créée avec succès', 5000);
          setTimeout(() => warning('Pensez à valider le bulletin'), 1000);
          setTimeout(() => info('Nouveau message reçu'), 2000);
        }}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Test Multiple
      </button>
    </div>
  );
}
