import { api } from './api';

/**
 * Service de gestion des parents
 */
export class ParentService {

  // 👪 PARENTS

  /**
   * Récupérer la liste des parents
   * @param {Object} params - Paramètres de filtrage et pagination
   */
  async getParents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/parents${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Récupérer les détails d'un parent
   * @param {number} id - ID du parent
   */
  async getParent(id) {
    return api.get(`/parents/${id}`);
  }

  /**
   * Modifier les informations d'un parent
   * @param {number} id - ID du parent
   * @param {Object} parentData - Nouvelles données
   */
  async updateParent(id, parentData) {
    return api.put(`/parents/${id}`, parentData);
  }

  /**
   * Récupérer la liste des enfants d'un parent
   * @param {number} id - ID du parent
   */
  async getParentChildren(id) {
    return api.get(`/parents/${id}/enfants`);
  }

  /**
   * Ajouter un enfant à un parent
   * @param {number} parentId - ID du parent
   * @param {Object} childData - Données de l'enfant (eleve_id, etc.)
   */
  async addChildToParent(parentId, childData) {
    return api.post(`/parents/${parentId}/ajouter-enfant`, childData);
  }

  /**
   * Retirer un enfant d'un parent
   * @param {number} parentId - ID du parent
   * @param {number} studentId - ID de l'élève
   */
  async removeChildFromParent(parentId, studentId) {
    return api.delete(`/parents/${parentId}/retirer-enfant/${studentId}`);
  }

  /**
   * Récupérer les bulletins de tous les enfants d'un parent
   * @param {number} id - ID du parent
   * @param {Object} params - Paramètres de filtrage
   */
  async getChildrenBulletins(id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/parents/${id}/bulletins-enfants${queryString ? `?${queryString}` : ''}`);
  }

  // 👪 ROUTES SPÉCIFIQUES PARENT

  /**
   * Récupérer la liste des enfants du parent connecté
   */
  async getMyChildren() {
    return api.get('/parent/mes-enfants');
  }

  /**
   * Récupérer les bulletins d'un enfant spécifique
   * @param {number} studentId - ID de l'élève
   * @param {Object} params - Paramètres de filtrage
   */
  async getChildBulletins(studentId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/parent/enfant/${studentId}/bulletin${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Récupérer les notes d'un enfant spécifique
   * @param {number} studentId - ID de l'élève
   * @param {Object} params - Paramètres de filtrage
   */
  async getChildGrades(studentId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/parent/enfant/${studentId}/notes${queryString ? `?${queryString}` : ''}`);
  }
}

export const parentService = new ParentService();
