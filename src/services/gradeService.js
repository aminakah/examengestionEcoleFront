import { api } from './api';

/**
 * Service de gestion des notes
 */
export class GradeService {

  // 📝 NOTES

  /**
   * Récupérer la liste des notes
   * @param {Object} params - Paramètres de filtrage (classe, matiere, periode, etc.)
   */
  async getGrades(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/notes${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Saisir une note
   * @param {Object} gradeData - Données de la note (eleve_id, matiere_id, note, coefficient, etc.)
   */
  async createGrade(gradeData) {
    return api.post('/notes', gradeData);
  }

  /**
   * Modifier une note
   * @param {number} id - ID de la note
   * @param {Object} gradeData - Nouvelles données
   */
  async updateGrade(id, gradeData) {
    return api.put(`/notes/${id}`, gradeData);
  }

  /**
   * Récupérer le formulaire de saisie par classe
   * @param {Object} params - Paramètres (classe_id, matiere_id, periode_id, etc.)
   */
  async getClassGradeForm(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/notes/saisie-par-classe${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Saisie groupée des notes
   * @param {Object} bulkGradeData - Données des notes multiples
   */
  async createBulkGrades(bulkGradeData) {
    return api.post('/notes/saisie-groupee', bulkGradeData);
  }

  /**
   * Récupérer les statistiques des notes par classe
   * @param {Object} params - Paramètres (classe_id, matiere_id, periode_id, etc.)
   */
  async getClassGradeStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/notes/statistiques-classe${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Récupérer les notes d'un élève spécifique
   * @param {number} studentId - ID de l'élève
   * @param {Object} params - Paramètres de filtrage
   */
  async getStudentGrades(studentId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/notes/eleve/${studentId}${queryString ? `?${queryString}` : ''}`);
  }
}

export const gradeService = new GradeService();
