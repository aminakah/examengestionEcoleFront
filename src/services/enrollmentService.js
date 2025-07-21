import { api } from './api';

/**
 * Service de gestion des inscriptions
 */
export class EnrollmentService {

  // 📑 INSCRIPTIONS

  /**
   * Récupérer la liste des inscriptions
   * @param {Object} params - Paramètres de filtrage et pagination
   */
  async getEnrollments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/inscriptions${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Créer une inscription
   * @param {Object} enrollmentData - Données de l'inscription
   */
  async createEnrollment(enrollmentData) {
    return api.post('/inscriptions', enrollmentData);
  }

  /**
   * Récupérer les détails d'une inscription
   * @param {number} id - ID de l'inscription
   */
  async getEnrollment(id) {
    return api.get(`/inscriptions/${id}`);
  }

  /**
   * Modifier une inscription
   * @param {number} id - ID de l'inscription
   * @param {Object} enrollmentData - Nouvelles données
   */
  async updateEnrollment(id, enrollmentData) {
    return api.put(`/inscriptions/${id}`, enrollmentData);
  }

  /**
   * Supprimer une inscription
   * @param {number} id - ID de l'inscription
   */
  async deleteEnrollment(id) {
    return api.delete(`/inscriptions/${id}`);
  }

  /**
   * Terminer une inscription
   * @param {number} id - ID de l'inscription
   */
  async completeEnrollment(id) {
    return api.post(`/inscriptions/${id}/terminer`);
  }

  /**
   * Récupérer les statistiques d'inscription d'une classe
   * @param {number} classId - ID de la classe
   */
  async getClassEnrollmentStats(classId) {
    return api.get(`/inscriptions/statistiques/classe/${classId}`);
  }
}

export const enrollmentService = new EnrollmentService();
