/**
 * Index des services API
 * Point d'entrée centralisé pour tous les services de l'application
 */

import { api } from './api';
import { authService } from './authService';

// Service API de base

// Services spécialisés
export { authService } from './authService';
export { userService } from './userService';
export { schoolService } from './schoolService';
export { classService } from './classService';
export { subjectService } from './subjectService';
export { studentService } from './studentService';
export { parentService } from './parentService';
export { teacherService } from './teacherService';
export { enrollmentService } from './enrollmentService';
export { periodService } from './periodService';
export { gradeService } from './gradeService';
export { bulletinService } from './bulletinService';
export { dashboardService } from './dashboardService';
export { documentService } from './documentService';


// Réexport des classes pour usage avancé
export { AuthService} from './authService';
export { UserService } from './userService';
export { SchoolService } from './schoolService';
export { ClassService } from './classService';
export { SubjectService } from './subjectService';
export { StudentService } from './studentService';
export { ParentService } from './parentService';
export { TeacherService } from './teacherService';
export { EnrollmentService } from './enrollmentService';
export { PeriodService } from './periodService';
export { GradeService } from './gradeService';
export { BulletinService } from './bulletinService';
export { DashboardService } from './dashboardService';
export { DocumentService } from './documentService';

/**
 * Configuration globale des services
 */
export const configureServices = (config) => {
  if (config.baseURL) {
    api.baseURL = config.baseURL;
  }
  if (config.token) {
    api.setToken(config.token);
  }
};

/**
 * Utilitaires pour la gestion des erreurs API
 */
export const handleAPIError = (error) => {
  console.error('Erreur API:', error);
  
  if (error.message.includes('401')) {
    // Token expiré, rediriger vers la connexion
    authService.logout();
    window.location.href = '/login';
  }
  
  return {
    message: error.message || 'Une erreur est survenue',
    type: 'error'
  };
};

/**
 * Intercepteur pour traiter automatiquement les erreurs d'authentification
 */
export const setupAPIInterceptors = () => {
  const originalRequest = api.request;
  
  api.request = async function(method, endpoint, data, options) {
    try {
      return await originalRequest.call(this, method, endpoint, data, options);
    } catch (error) {
      if (error.message.includes('401') && endpoint !== '/auth/login') {
        // Tentative de rafraîchissement du token
        try {
          await authService.refreshToken();
          // Retry de la requête originale
          return await originalRequest.call(this, method, endpoint, data, options);
        } catch (refreshError) {
          // Échec du rafraîchissement, déconnexion
          authService.logout();
          throw refreshError;
        }
      }
      throw error;
    }
  };
};
