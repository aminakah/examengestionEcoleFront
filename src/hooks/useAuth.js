import { useState, useEffect } from 'react';

// Hook personnalisé pour gérer l'authentification
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const token = localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_KEY || 'authToken');
    if (token) {
      setIsAuthenticated(true);
      // Ici vous pourriez faire un appel API pour récupérer les infos utilisateur
      // getUserInfo(token).then(setUser);
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem(process.env.REACT_APP_JWT_TOKEN_KEY || 'authToken', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN_KEY || 'authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
};

// Hook pour gérer les erreurs API
export const useApiError = () => {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Erreur de réponse du serveur
      const status = error.response.status;
      const message = error.response.data?.message || 'Une erreur est survenue';
      
      if (status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        // Redirection vers login si nécessaire
      } else if (status === 403) {
        setError('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      } else if (status === 422) {
        // Erreurs de validation
        const errors = error.response.data?.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(message);
        }
      } else if (status >= 500) {
        setError('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        setError(message);
      }
    } else if (error.request) {
      // Erreur de réseau
      setError('Erreur de connexion. Vérifiez votre connexion internet.');
    } else {
      // Erreur autre
      setError('Une erreur inattendue est survenue.');
    }
  };

  const clearError = () => setError(null);

  return {
    error,
    handleError,
    clearError
  };
};

export default { useAuth, useApiError };
