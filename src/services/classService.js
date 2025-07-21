import { api } from './api';

/**
 * Service de gestion des classes
 */
export class ClassService {

  // 🏫 CLASSES

  /**
   * Récupérer la liste des classes
   * @param {Object} params - Paramètres de filtrage
   */
  async getClasses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/classes${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Créer une classe
   * @param {Object} classData - Données de la classe
   */
  async createClass(classData) {
    return api.post('/classes', classData);
  }

  /**
   * Récupérer les détails d'une classe
   * @param {number} id - ID de la classe
   */
  async getClass(id) {
    return api.get(`/classes/${id}`);
  }

  /**
   * Modifier une classe
   * @param {number} id - ID de la classe
   * @param {Object} classData - Nouvelles données
   */
  async updateClass(id, classData) {
    return api.put(`/classes/${id}`, classData);
  }

  /**
   * Supprimer une classe
   * @param {number} id - ID de la classe
   */
  async deleteClass(id) {
    return api.delete(`/classes/${id}`);
  }

  /**
   * Récupérer les élèves d'une classe
   * @param {number} id - ID de la classe
   */
  async getClassStudents(id) {
    return api.get(`/classes/${id}/eleves`);
  }

  /**
   * Récupérer les enseignants d'une classe
   * @param {number} id - ID de la classe
   */
  async getClassTeachers(id) {
    return api.get(`/classes/${id}/enseignants`);
  }

  /**
   * Assigner un enseignant à une classe
   * @param {number} classId - ID de la classe
   * @param {Object} assignmentData - Données d'affectation (enseignant_id, matiere_id, etc.)
   */
  async assignTeacher(classId, assignmentData) {
    return api.post(`/classes/${classId}/assigner-enseignant`, assignmentData);
  }

  /**
   * Retirer un enseignant d'une classe
   * @param {number} classId - ID de la classe
   * @param {Object} removalData - Données de retrait (enseignant_id, matiere_id, etc.)
   */
  async removeTeacher(classId, removalData) {
    return api.post(`/classes/${classId}/retirer-enseignant`, removalData);
  }
}

export const classService = new ClassService();
