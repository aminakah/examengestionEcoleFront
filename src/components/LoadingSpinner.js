import React from 'react';
import { Loader2, GraduationCap } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  message = 'Chargement...', 
  fullScreen = false,
  color = 'blue',
  showLogo = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    gray: 'text-gray-500'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white z-50'
    : 'flex flex-col items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      {showLogo && fullScreen && (
        <div className="mb-8 flex items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">École Moderne</h1>
            <p className="text-gray-600">Portail Scolaire</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-4">
        <Loader2 
          className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        />
        
        {message && (
          <p className="text-gray-600 text-center max-w-sm">
            {message}
          </p>
        )}
      </div>
      
      {fullScreen && (
        <div className="absolute bottom-8 text-center">
          <p className="text-sm text-gray-400">
            Chargement en cours...
          </p>
        </div>
      )}
    </div>
  );
};

// Composant de skeleton loading pour les listes
export const SkeletonLoader = ({ rows = 3, cols = 1 }) => {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mt-2"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Composant de loading pour les cartes
export const CardLoader = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hook personnalisé pour gérer les états de chargement
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);
  const [error, setError] = React.useState(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setLoadingError = (errorMessage) => {
    setLoading(false);
    setError(errorMessage);
  };

  const executeAsync = async (asyncFunction) => {
    try {
      startLoading();
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (err) {
      setLoadingError(err.message || 'Une erreur est survenue');
      throw err;
    }
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    executeAsync
  };
};

export default LoadingSpinner;
