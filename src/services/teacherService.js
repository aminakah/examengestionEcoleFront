import { api } from './api';

/**
 * Service de gestion des enseignants
 */
export class TeacherService {

  // 👨‍🏫 ENSEIGNANTS

  /**
   * Récupérer la liste des enseignants
   * @param {Object} params - Paramètres de filtrage et pagination
   */
  async getTeachers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/enseignants${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Créer un enseignant
   * @param {Object} teacherData - Données de l'enseignant
   */
  async createTeacher(teacherData) {
    return api.post('/enseignants', teacherData);
  }

  /**
   * Récupérer les détails d'un enseignant
   * @param {number} id - ID de l'enseignant
   */
  async getTeacher(id) {
    return api.get(`/enseignants/${id}`);
  }

  /**
   * Modifier un enseignant
   * @param {number} id - ID de l'enseignant
   * @param {Object} teacherData - Nouvelles données
   */
  async updateTeacher(id, teacherData) {
    return api.put(`/enseignants/${id}`, teacherData);
  }

  /**
   * Supprimer un enseignant
   * @param {number} id - ID de l'enseignant
   */
  async deleteTeacher(id) {
    return api.delete(`/enseignants/${id}`);
  }

  /**
   * Assigner une matière à un enseignant
   * @param {number} teacherId - ID de l'enseignant
   * @param {Object} assignmentData - Données d'affectation (matiere_id, etc.)
   */
  async assignSubject(teacherId, assignmentData) {
    return api.post(`/enseignants/${teacherId}/assigner-matiere`, assignmentData);
  }

  /**
   * Retirer une matière d'un enseignant
   * @param {number} teacherId - ID de l'enseignant
   * @param {Object} removalData - Données de retrait (matiere_id, etc.)
   */
  async removeSubject(teacherId, removalData) {
    return api.post(`/enseignants/${teacherId}/retirer-matiere`, removalData);
  }

  /**
   * Assigner une classe à un enseignant
   * @param {number} teacherId - ID de l'enseignant
   * @param {Object} assignmentData - Données d'affectation (classe_id, matiere_id, etc.)
   */
  async assignClass(teacherId, assignmentData) {
    return api.post(`/enseignants/${teacherId}/assigner-classe`, assignmentData);
  }

  // 👨‍🏫 ROUTES SPÉCIFIQUES ENSEIGNANT

  /**
   * Récupérer les classes de l'enseignant connecté
   */
  async getMyClasses() {
    return api.get('/enseignant/mes-classes');
  }
}

export const teacherService = new TeacherService();
