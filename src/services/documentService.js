import { api } from './api';

/**
 * Service de gestion des documents
 */
export class DocumentService {

  // 📄 DOCUMENTS

  /**
   * Récupérer la liste des documents
   * @param {Object} params - Paramètres de filtrage et pagination
   */
  async getDocuments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/documents${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Upload d'un document
   * @param {FormData} documentData - Données du document (fichier + métadonnées)
   */
  async uploadDocument(documentData) {
    return api.post('/documents', documentData);
  }

  /**
   * Récupérer les détails d'un document
   * @param {number} id - ID du document
   */
  async getDocument(id) {
    return api.get(`/documents/${id}`);
  }

  /**
   * Supprimer un document
   * @param {number} id - ID du document
   */
  async deleteDocument(id) {
    return api.delete(`/documents/${id}`);
  }

  /**
   * Télécharger un document
   * @param {number} id - ID du document
   */
  async downloadDocument(id) {
    const response = await fetch(`/api/documents/${id}/telecharger`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du document');
    }

    // Retourner le blob pour téléchargement
    return response.blob();
  }
}

export const documentService = new DocumentService();
