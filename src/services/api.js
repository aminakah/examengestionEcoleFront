/**
 * Service API principal pour l'application de gestion scolaire
 * Intègre tous les endpoints du backend Laravel
 */

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api';
    this.token = localStorage.getItem('authToken');
    
    // Debug: afficher le token
    console.log('Token actuel:', this.token ? 'Token présent' : 'Aucun token');
  }

  // Configuration des headers par défaut
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Méthode générique pour les requêtes HTTP
  async request(method, endpoint, data = null, options = {}) {
    // Vérifier si on a un token pour les routes protégées
    if (!this.token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      throw new Error('Aucun token d\'authentification. Veuillez vous connecter.');
    }

    const config = {
      method,
      headers: { ...this.getHeaders(), ...options.headers },
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
    console.log(`📡 ${method} ${url}`, data ? { data } : '');

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Gestion spécifique des erreurs d'authentification
        if (response.status === 401) {
          this.setToken(null); // Supprimer le token invalide
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ ${method} ${url} - Success:`, result);
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
      console.log('✅ Token mis à jour');
    } else {
      localStorage.removeItem('authToken');
      console.log('🗑️ Token supprimé');
    }
  }

  // Méthode pour vérifier le statut de connexion
  isAuthenticated() {
    const hasToken = !!this.token;
    console.log('🔐 Statut authentification:', hasToken ? 'Connecté' : 'Non connecté');
    return hasToken;
  }

  // Méthode pour rafraîchir le token depuis localStorage
  refreshToken() {
    this.token = localStorage.getItem('authToken');
    console.log('🔄 Token rafraîchi:', this.token ? 'Token présent' : 'Aucun token');
    return this.token;
  }
}

export const api = new ApiService();
