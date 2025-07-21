/**
 * Service API principal pour l'application de gestion scolaire
 * Intègre tous les endpoints du backend Laravel
 */

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api'; // Le proxy est configuré dans package.json
    this.token = localStorage.getItem('authToken');
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

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error - ${method} ${endpoint}:`, error);
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
    return !!this.token;
  }
}

export const api = new ApiService();
