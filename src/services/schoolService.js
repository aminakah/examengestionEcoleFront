import { api } from './api';

/**
 * Service de gestion scolaire
 * Gère les années scolaires, niveaux et classes
 */
export class SchoolService {

  // 📅 ANNÉES SCOLAIRES

  /**
   * Récupérer la liste des années scolaires
   */
  async getAnneesScolaires() {
    return api.get('/annees-scolaires');
  }

  /**
   * Créer une année scolaire
   * @param {Object} anneeData - Données de l'année scolaire
   */
  async createAnneeScolaire(anneeData) {
    return api.post('/annees-scolaires', anneeData);
  }

  /**
   * Récupérer les détails d'une année scolaire
   * @param {number} id - ID de l'année scolaire
   */
  async getAnneeScolaire(id) {
    return api.get(`/annees-scolaires/${id}`);
  }

  /**
   * Modifier une année scolaire
   * @param {number} id - ID de l'année scolaire
   * @param {Object} anneeData - Nouvelles données
   */
  async updateAnneeScolaire(id, anneeData) {
    return api.put(`/annees-scolaires/${id}`, anneeData);
  }

  /**
   * Supprimer une année scolaire
   * @param {number} id - ID de l'année scolaire
   */
  async deleteAnneeScolaire(id) {
    return api.delete(`/annees-scolaires/${id}`);
  }

  /**
   * Définir l'année scolaire actuelle
   * @param {number} id - ID de l'année scolaire
   */
  async setAnneeScolaireActuelle(id) {
    return api.post(`/annees-scolaires/${id}/set-actuelle`);
  }

  /**
   * Récupérer les statistiques de l'année scolaire
   * @param {number} id - ID de l'année scolaire
   */
  async getStatistiquesAnneeScolaire(id) {
    return api.get(`/annees-scolaires/${id}/statistiques`);
  }

  // 📚 NIVEAUX

  /**
   * Récupérer la liste des niveaux scolaires
   */
  async getNiveaux() {
    return api.get('/niveaux');
  }

  /**
   * Créer un niveau
   * @param {Object} niveauData - Données du niveau
   */
  async createNiveau(niveauData) {
    return api.post('/niveaux', niveauData);
  }

  /**
   * Récupérer les détails d'un niveau
   * @param {number} id - ID du niveau
   */
  async getNiveau(id) {
    return api.get(`/niveaux/${id}`);
  }

  /**
   * Modifier un niveau
   * @param {number} id - ID du niveau
   * @param {Object} niveauData - Nouvelles données
   */
  async updateNiveau(id, niveauData) {
    return api.put(`/niveaux/${id}`, niveauData);
  }

  /**
   * Supprimer un niveau
   * @param {number} id - ID du niveau
   */
  async deleteNiveau(id) {
    return api.delete(`/niveaux/${id}`);
  }

  /**
   * Récupérer les matières d'un niveau
   * @param {number} id - ID du niveau
   */
  async getMatieresNiveau(id) {
    return api.get(`/niveaux/${id}/matieres`);
  }

  /**
   * Récupérer les classes d'un niveau
   * @param {number} id - ID du niveau
   */
  async getClassesNiveau(id) {
    return api.get(`/niveaux/${id}/classes`);
  }
}

export const schoolService = new SchoolService();
