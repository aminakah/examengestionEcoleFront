import { api } from './api';

/**
 * Service de gestion des utilisateurs
 * Accessible uniquement aux administrateurs
 */
export class UserService {

  // 👥 GESTION DES UTILISATEURS

  /**
   * Récupérer la liste paginée des utilisateurs
   * @param {Object} params - Paramètres de pagination et filtres
   */
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/users${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Créer un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   */
  async createUser(userData) {
    return api.post('/users', userData);
  }

  /**
   * Récupérer les détails d'un utilisateur
   * @param {number} id - ID de l'utilisateur
   */
  async getUser(id) {
    return api.get(`/users/${id}`);
  }

  /**
   * Modifier un utilisateur
   * @param {number} id - ID de l'utilisateur
   * @param {Object} userData - Nouvelles données
   */
  async updateUser(id, userData) {
    return api.put(`/users/${id}`, userData);
  }

  /**
   * Supprimer un utilisateur (soft delete)
   * @param {number} id - ID de l'utilisateur
   */
  async deleteUser(id) {
    return api.delete(`/users/${id}`);
  }

  /**
   * Activer/Désactiver un utilisateur
   * @param {number} id - ID de l'utilisateur
   */
  async toggleUserStatus(id) {
    return api.post(`/users/${id}/toggle-status`);
  }

  /**
   * Réinitialiser le mot de passe d'un utilisateur
   * @param {number} id - ID de l'utilisateur
   */
  async resetUserPassword(id) {
    return api.post(`/users/${id}/reset-password`);
  }
}

export const userService = new UserService();
