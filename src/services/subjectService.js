import { api } from './api';

/**
 * Service de gestion des matières
 */
export class SubjectService {

  // 📖 MATIÈRES

  /**
   * Récupérer la liste des matières
   * @param {Object} params - Paramètres de filtrage
   */
  async getSubjects(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/matieres${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Créer une matière
   * @param {Object} subjectData - Données de la matière
   */
  async createSubject(subjectData) {
    return api.post('/matieres', subjectData);
  }

  /**
   * Récupérer les détails d'une matière
   * @param {number} id - ID de la matière
   */
  async getSubject(id) {
    return api.get(`/matieres/${id}`);
  }

  /**
   * Modifier une matière
   * @param {number} id - ID de la matière
   * @param {Object} subjectData - Nouvelles données
   */
  async updateSubject(id, subjectData) {
    return api.put(`/matieres/${id}`, subjectData);
  }

  /**
   * Supprimer une matière
   * @param {number} id - ID de la matière
   */
  async deleteSubject(id) {
    return api.delete(`/matieres/${id}`);
  }

  /**
   * Activer/Désactiver une matière
   * @param {number} id - ID de la matière
   */
  async toggleSubjectStatus(id) {
    return api.post(`/matieres/${id}/toggle-status`);
  }

  /**
   * Récupérer les enseignants d'une matière
   * @param {number} id - ID de la matière
   */
  async getSubjectTeachers(id) {
    return api.get(`/matieres/${id}/enseignants`);
  }

  /**
   * Assigner un enseignant à une matière
   * @param {number} subjectId - ID de la matière
   * @param {Object} assignmentData - Données d'affectation (enseignant_id, etc.)
   */
  async assignTeacher(subjectId, assignmentData) {
    return api.post(`/matieres/${subjectId}/assigner-enseignant`, assignmentData);
  }
}

export const subjectService = new SubjectService();
