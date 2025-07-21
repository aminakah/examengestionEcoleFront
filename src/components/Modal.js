import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'lg',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl'
  };

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Empêcher le scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      {/* Overlay avec animation */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"></div>
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`
            relative w-full ${sizeClasses[size]} 
            bg-white rounded-2xl shadow-2xl 
            transform transition-all duration-300 
            animate-in slide-in-from-bottom-4 zoom-in-95
            border border-gray-100
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header avec gradient */}
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl">
            <div className="flex items-center justify-between p-6 text-white">
              <h3 className="text-xl font-bold flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📝</span>
                </div>
                <span>{title}</span>
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
            
            {/* Décoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 to-indigo-300"></div>
          </div>
          
          {/* Body avec padding amélioré pour les boutons sticky */}
          <div className="px-8 pt-6 pb-2 max-h-[85vh] overflow-y-auto">
            <div className="space-y-1">
              {children}
            </div>
          </div>
          
          {/* Footer décoratif */}
          <div className="h-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Modal;