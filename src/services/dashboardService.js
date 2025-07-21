import { api } from './api';

/**
 * Service de gestion des tableaux de bord
 */
export class DashboardService {

  // 📊 TABLEAUX DE BORD

  /**
   * Récupérer le tableau de bord personnalisé selon le rôle
   */
  async getMyDashboard() {
    return api.get('/dashboard/mon-tableau-bord');
  }

  /**
   * Récupérer les statistiques générales de l'école
   * Accessible aux administrateurs
   */
  async getGeneralStats() {
    return api.get('/dashboard/statistiques-generales');
  }

  /**
   * Récupérer les statistiques de l'enseignant connecté
   * Accessible aux enseignants
   */
  async getTeacherStats() {
    return api.get('/dashboard/statistiques-enseignant');
  }

  /**
   * Récupérer les statistiques de l'élève connecté
   * Accessible aux élèves
   */
  async getStudentStats() {
    return api.get('/dashboard/statistiques-eleve');
  }

  /**
   * Récupérer les statistiques du parent connecté
   * Accessible aux parents
   */
  async getParentStats() {
    return api.get('/dashboard/statistiques-parent');
  }
}

export const dashboardService = new DashboardService();
