import axios from 'axios';

// Configuration globale d'axios pour toute l'application
const setupAxiosConfig = () => {
  // Configuration de base
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Accept'] = 'application/json';

  // Intercepteur pour ajouter le token à chaque requête
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(process.env.REACT_APP_JWT_TOKEN_KEY || 'authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur pour gérer les réponses et erreurs globalement
  axios.interceptors.response.use(
    (response) => {
      // Vous pouvez ajouter ici des traitements globaux pour les réponses réussies
      return response;
    },
    (error) => {
      // Gestion globale des erreurs
      if (error.response?.status === 401) {
        // Token expiré ou invalide
        localStorage.removeItem(process.env.REACT_APP_JWT_TOKEN_KEY || 'authToken');
        
        // Rediriger vers la page de connexion
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
  );
};

export default setupAxiosConfig;
