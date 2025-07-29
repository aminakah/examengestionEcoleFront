import React from 'react';
import { Clock, AlertTriangle, LogOut, RefreshCw, X } from 'lucide-react';

/**
 * Modal d'avertissement d'expiration de session - Amélioration pour l'audit
 */
export const SessionExpirationModal = ({ 
  isOpen, 
  timeRemaining, 
  onExtend, 
  onLogout 
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(timeRemaining / (60 * 1000));
  const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Session bientôt expirée
            </h3>
            <p className="text-sm text-gray-600">
              Votre session expire dans :
            </p>
          </div>
        </div>

        {/* Compteur */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-2xl font-mono font-bold text-orange-700">
              {minutes.toString().padStart(2, '0')}:
              {seconds.toString().padStart(2, '0')}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Votre session sera automatiquement fermée pour votre sécurité.
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onExtend}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Prolonger la session</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>

        {/* Note de sécurité */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-700">
            💡 <strong>Pourquoi cette notification ?</strong><br />
            Pour protéger vos données, nous déconnectons automatiquement les sessions inactives.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Notification discrète d'avertissement de session - Amélioration pour l'audit
 */
export const SessionWarningToast = ({ 
  isVisible, 
  timeRemaining, 
  onExtend, 
  onDismiss 
}) => {
  if (!isVisible) return null;

  const minutes = Math.ceil(timeRemaining / (60 * 1000));

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white border border-orange-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Session bientôt expirée
            </p>
            <p className="text-sm text-gray-600">
              Expire dans {minutes} minute{minutes > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onExtend}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Prolonger
            </button>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Indicateur de session dans la barre de navigation - Amélioration pour l'audit
 */
export const SessionIndicator = ({ sessionInfo, onExtend }) => {
  if (!sessionInfo?.isActive) return null;

  const { timeUntilExpiration, inWarningPeriod } = sessionInfo;
  const minutes = Math.ceil(timeUntilExpiration / (60 * 1000));

  if (!inWarningPeriod) return null;

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs">
      <Clock className="w-3 h-3 text-orange-600" />
      <span className="text-orange-700">
        Session : {minutes}min
      </span>
      <button
        onClick={onExtend}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Prolonger
      </button>
    </div>
  );
};

/**
 * Hook pour gérer l'affichage des notifications de session
 */
export const useSessionNotifications = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  const showWarning = React.useCallback((minutes, timeLeft) => {
    setTimeRemaining(timeLeft);
    
    // Afficher toast pour avertissements légers (> 2 minutes)
    // Afficher modal pour avertissements urgents (≤ 2 minutes)
    if (minutes > 2) {
      setShowToast(true);
    } else {
      setShowModal(true);
      setShowToast(false);
    }
  }, []);

  const hideWarnings = React.useCallback(() => {
    setShowModal(false);
    setShowToast(false);
  }, []);

  return {
    showModal,
    showToast,
    timeRemaining,
    showWarning,
    hideWarnings,
    setShowModal,
    setShowToast
  };
};

export default SessionExpirationModal;