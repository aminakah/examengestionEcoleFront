import { api } from './api';

// Service pour l'emploi du temps
export const emploiTempsService = {
  // Récupérer tous les emplois du temps
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.jour) params.append('jour', filters.jour);
      if (filters.classe) params.append('classe', filters.classe);
      if (filters.professeur) params.append('professeur', filters.professeur);
      if (filters.statut) params.append('statut', filters.statut);

      const response = await api.get(`/emploi-temps?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des emplois du temps:', error);
      throw error;
    }
  },

  // Récupérer l'emploi du temps par semaine
  getEmploiSemaine: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.classe) params.append('classe', filters.classe);
      if (filters.professeur) params.append('professeur', filters.professeur);

      const response = await api.get(`/emploi-temps-semaine?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'emploi du temps de la semaine:', error);
      throw error;
    }
  },

  // Créer un nouvel emploi du temps
  create: async (data) => {
    try {
      const response = await api.post('/emploi-temps', data);
      return response;
    } catch (error) {
      console.error('Erreur lors de la création de l\'emploi du temps:', error);
      throw error;
    }
  },

  // Mettre à jour un emploi du temps
  update: async (id, data) => {
    try {
      const response = await api.put(`/emploi-temps/${id}`, data);
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'emploi du temps:', error);
      throw error;
    }
  },

  // Supprimer un emploi du temps
  delete: async (id) => {
    try {
      const response = await api.delete(`/emploi-temps/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'emploi du temps:', error);
      throw error;
    }
  },

  // Récupérer un emploi du temps spécifique
  getById: async (id) => {
    try {
      const response = await api.get(`/emploi-temps/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'emploi du temps:', error);
      throw error;
    }
  }
};

// Service pour les classes
export const classeService = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.niveau_id) params.append('niveau_id', filters.niveau_id);
      if (filters.annee_scolaire_id) params.append('annee_scolaire_id', filters.annee_scolaire_id);
      if (filters.actif !== undefined) params.append('actif', filters.actif);

      const response = await api.get(`/classes?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      throw error;
    }
  }
};

// Service pour les enseignants
export const enseignantService = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.matiere_id) params.append('matiere_id', filters.matiere_id);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/enseignants?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des enseignants:', error);
      throw error;
    }
  }
};

// Service pour les matières
export const matiereService = {
  getAll: async () => {
    try {
      const response = await api.get('/matieres');
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
      throw error;
    }
  }
};

export default { emploiTempsService, classeService, enseignantService, matiereService };
