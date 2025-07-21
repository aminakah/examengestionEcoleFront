import { api } from './api';

/**
 * Service d'authentification
 * Gère la connexion, l'inscription et la gestion des comptes utilisateurs
 */
export class AuthService {
  
  // 🔐 AUTHENTIFICATION

  /**
   * Connexion utilisateur
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);

    if (response.access_token) {
      api.setToken(response.access_token);
       console.log("sdfcv" )

    }
    console.log()

    return response;
  }

  /**
   * Inscription nouvel utilisateur
   * @param {Object} userData - Données du nouvel utilisateur
   */
  async register(userData) {
    return api.post('/auth/register', userData);
  }

  /**
   * Déconnexion
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      api.setToken(null);
    }
  }

  /**
   * Rafraîchir le token JWT
   */
  async refreshToken() {
    const response = await api.post('/auth/refresh');
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async getProfile() {
    return api.get('/auth/me');
  }

  /**
   * Changer le mot de passe
   * @param {Object} passwordData - { current_password, new_password, new_password_confirmation }
   */
  async changePassword(passwordData) {
    return api.post('/auth/change-password', passwordData);
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    return api.isAuthenticated();
  }

  /**
   * Récupérer le profil (alias de /auth/me)
   */
  async getProfil() {
    return api.get('/profil');
  }
}

export const authService = new AuthService();
