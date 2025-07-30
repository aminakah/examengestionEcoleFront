/**
 * Service API principal pour l'application de gestion scolaire
 * Intègre tous les endpoints du backend Laravel
 */

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api';
    this.token = localStorage.getItem('authToken');
    
    // Debug: afficher le token
  }

  // Configuration des headers par défaut - Correction pour l'audit
  getHeaders(skipAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Ne pas inclure le token pour les routes de connexion/inscription
    if (!skipAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Méthode générique pour les requêtes HTTP - Correction pour l'audit
  async request(method, endpoint, data = null, options = {}) {
    // Identifier les routes publiques qui n'ont pas besoin d'authentification
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    const isPublicRoute = publicRoutes.some(route => endpoint.includes(route));
    
    // Pour les routes publiques, ne pas vérifier le token
    if (!isPublicRoute && !this.token) {
      throw new Error('Aucun token d\'authentification. Veuillez vous connecter.');
    }

    const config = {
      method,
      headers: { ...this.getHeaders(isPublicRoute), ...options.headers },
    };

    if (data && method !== 'GET') {
      if (data instanceof FormData) {
        delete config.headers['Content-Type']; // Laisse le navigateur définir le Content-Type pour FormData
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Gestion spécifique des erreurs d'authentification
        if (response.status === 401) {
          // Pour les routes publiques, ne pas supprimer le token automatiquement
          if (!isPublicRoute) {
            this.setToken(null); // Supprimer le token invalide
            throw new Error('Session expirée. Veuillez vous reconnecter.');
          } else {
            // Pour la connexion, renvoyer l'erreur spécifique
            throw new Error(errorData.message || 'Identifiants incorrects.');
          }
        }
        
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`❌ API Error - ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  // Méthodes HTTP raccourcies
  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  async put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  // Méthode pour mettre à jour le token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Méthode pour vérifier le statut de connexion
  isAuthenticated() {
    const hasToken = !!this.token;
    return hasToken;
  }

  // Méthode pour rafraîchir le token depuis localStorage
  refreshToken() {
    this.token = localStorage.getItem('authToken');
    return this.token;
  }
}

export const api = new ApiService();
