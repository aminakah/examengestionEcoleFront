import { api } from './api';

/**
 * Service de gestion des périodes
 */
export class PeriodService {

  // 🗓️ PÉRIODES

  /**
   * Récupérer la liste des périodes
   * @param {Object} params - Paramètres de filtrage
   */
  async getPeriods(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/periodes${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Créer une période
   * @param {Object} periodData - Données de la période
   */
  async createPeriod(periodData) {
    return api.post('/periodes', periodData);
  }

  /**
   * Récupérer les détails d'une période
   * @param {number} id - ID de la période
   */
  async getPeriod(id) {
    return api.get(`/periodes/${id}`);
  }

  /**
   * Modifier une période
   * @param {number} id - ID de la période
   * @param {Object} periodData - Nouvelles données
   */
  async updatePeriod(id, periodData) {
    return api.put(`/periodes/${id}`, periodData);
  }

  /**
   * Supprimer une période
   * @param {number} id - ID de la période
   */
  async deletePeriod(id) {
    return api.delete(`/periodes/${id}`);
  }

  /**
   * Définir la période actuelle
   * @param {number} id - ID de la période
   */
  async setCurrentPeriod(id) {
    return api.post(`/periodes/${id}/set-actuelle`);
  }

  /**
   * Récupérer les statistiques de la période
   * @param {number} id - ID de la période
   */
  async getPeriodStats(id) {
    return api.get(`/periodes/${id}/statistiques`);
  }
}

export const periodService = new PeriodService();
