import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

// Composant Modal de base
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        {/* Modal */}
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]}`}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {title && (
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de confirmation
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmer l\'action', 
  message = 'Êtes-vous sûr de vouloir continuer ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning',
  loading = false
}) => {
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      confirmColor: 'bg-yellow-600 hover:bg-yellow-700'
    },
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      confirmColor: 'bg-red-600 hover:bg-red-700'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      confirmColor: 'bg-blue-600 hover:bg-blue-700'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      confirmColor: 'bg-green-600 hover:bg-green-700'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" closeOnOverlayClick={!loading}>
      <div className="text-center">
        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4`}>
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-6">
          {message}
        </p>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${config.confirmColor}`}
          >
            {loading ? 'En cours...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Composant Toast pour les notifications
export const Toast = ({ toast, onRemove }) => {
  const typeConfig = {
    success: {
      bgColor: 'bg-green-500',
      icon: CheckCircle,
      iconColor: 'text-white'
    },
    error: {
      bgColor: 'bg-red-500',
      icon: AlertCircle,
      iconColor: 'text-white'
    },
    warning: {
      bgColor: 'bg-yellow-500',
      icon: AlertTriangle,
      iconColor: 'text-white'
    },
    info: {
      bgColor: 'bg-blue-500',
      icon: Info,
      iconColor: 'text-white'
    }
  };

  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-80 max-w-md`}>
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Container pour les toasts
export const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Modal de formulaire
export const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  children, 
  submitText = 'Enregistrer',
  cancelText = 'Annuler',
  loading = false,
  disabled = false 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && !loading) {
      onSubmit(e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} closeOnOverlayClick={!loading}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {children}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={disabled || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Modal d'information avec image/icône
export const InfoModal = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  icon: IconComponent,
  iconColor = 'text-blue-500',
  actionButton
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="text-center">
        {IconComponent && (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <IconComponent className={`h-6 w-6 ${iconColor}`} />
          </div>
        )}
        
        {title && (
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {title}
          </h3>
        )}
        
        <div className="text-sm text-gray-600 mb-6">
          {content}
        </div>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Fermer
          </button>
          {actionButton}
        </div>
      </div>
    </Modal>
  );
};

export default {
  Modal,
  ConfirmModal,
  FormModal,
  InfoModal,
  Toast,
  ToastContainer
};
