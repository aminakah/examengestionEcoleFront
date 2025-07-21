import { api } from './api';

/**
 * Service de gestion des élèves
 */
export class StudentService {

  // 🎓 ÉLÈVES

  /**
   * Récupérer la liste des élèves
   * @param {Object} params - Paramètres de filtrage et pagination
   */
  async getStudents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/eleves${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Inscrire un nouvel élève
   * @param {Object} studentData - Données de l'élève
   */
  async createStudent(studentData) {
    return api.post('/eleves', studentData);
  }

  /**
   * Récupérer les détails d'un élève
   * @param {number} id - ID de l'élève
   */
  async getStudent(id) {
    return api.get(`/eleves/${id}`);
  }

  /**
   * Modifier les informations d'un élève
   * @param {number} id - ID de l'élève
   * @param {Object} studentData - Nouvelles données
   */
  async updateStudent(id, studentData) {
    return api.put(`/eleves/${id}`, studentData);
  }

  /**
   * Supprimer un élève
   * @param {number} id - ID de l'élève
   */
  async deleteStudent(id) {
    return api.delete(`/eleves/${id}`);
  }

  /**
   * Récupérer les notes d'un élève
   * @param {number} id - ID de l'élève
   * @param {Object} params - Paramètres de filtrage (matiere, periode, etc.)
   */
  async getStudentGrades(id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/eleves/${id}/notes${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Récupérer les bulletins d'un élève
   * @param {number} id - ID de l'élève
   * @param {Object} params - Paramètres de filtrage (annee_scolaire, periode, etc.)
   */
  async getStudentBulletins(id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/eleves/${id}/bulletins${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Changer un élève de classe
   * @param {number} id - ID de l'élève
   * @param {Object} changeData - Données du changement (nouvelle_classe_id, etc.)
   */
  async changeStudentClass(id, changeData) {
    return api.post(`/eleves/${id}/changer-classe`, changeData);
  }

  /**
   * Récupérer les documents d'un élève
   * @param {number} id - ID de l'élève
   */
  async getStudentDocuments(id) {
    return api.get(`/eleves/${id}/documents`);
  }

  /**
   * Upload document pour un élève
   * @param {number} id - ID de l'élève
   * @param {FormData} documentData - Données du document
   */
  async uploadStudentDocument(id, documentData) {
    return api.post(`/eleves/${id}/documents`, documentData);
  }

  // 🎓 ROUTES SPÉCIFIQUES ÉLÈVE

  /**
   * Récupérer les notes de l'élève connecté
   */
  async getMyGrades() {
    return api.get('/eleve/mes-notes');
  }

  /**
   * Récupérer les bulletins de l'élève connecté
   */
  async getMyBulletins() {
    return api.get('/eleve/mes-bulletins');
  }
}

export const studentService = new StudentService();
