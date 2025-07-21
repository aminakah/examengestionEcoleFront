import { api } from './api';

/**
 * Service de gestion des bulletins
 */
export class BulletinService {

  // 📋 BULLETINS

  /**
   * Récupérer la liste des bulletins
   * @param {Object} params - Paramètres de filtrage (classe, periode, annee_scolaire, etc.)
   */
  async getBulletins(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/bulletins${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Générer des bulletins
   * @param {Object} generationData - Données de génération (classe_id, periode_id, etc.)
   */
  async generateBulletins(generationData) {
    return api.post('/bulletins/generer', generationData);
  }

  /**
   * Voir un bulletin
   * @param {number} id - ID du bulletin
   */
  async getBulletin(id) {
    return api.get(`/bulletins/${id}`);
  }

  /**
   * Télécharger un bulletin PDF
   * @param {number} id - ID du bulletin
   */
  async downloadBulletin(id) {
    const response = await fetch(`/api/bulletins/${id}/telecharger`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du bulletin');
    }

    // Retourner le blob pour téléchargement
    return response.blob();
  }

  /**
   * Ajouter l'observation du conseil
   * @param {number} id - ID du bulletin
   * @param {Object} observationData - Données de l'observation
   */
  async addCouncilObservation(id, observationData) {
    return api.post(`/bulletins/${id}/observation-conseil`, observationData);
  }

  /**
   * Télécharger tous les bulletins d'une classe (ZIP)
   * @param {Object} params - Paramètres (classe_id, periode_id, etc.)
   */
  async downloadClassBulletins(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    
    const response = await fetch(`/api/bulletins/telecharger-groupe${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement des bulletins');
    }

    // Retourner le blob pour téléchargement
    return response.blob();
  }
}

export const bulletinService = new BulletinService();
