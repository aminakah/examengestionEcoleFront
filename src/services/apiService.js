/**
 * Service API legacy - Maintient la compatibilité avec l'ancien code
 * Utilise les nouveaux services en arrière-plan
 */

import { 
  classService, 
  subjectService, 
  teacherService, 
  studentService, 
  gradeService, 
  bulletinService 
} from './index';

class ApiService {
  
  /**
   * Méthode GET générique avec mapping vers les nouveaux services
   */
  async get(endpoint) {
    try {
      switch(endpoint) {
        case '/classes':
          const classesResponse = await classService.getClasses();
          return { data: classesResponse.data || classesResponse };
          
        case '/matieres':
          const matieresResponse = await subjectService.getSubjects();
          return { data: matieresResponse.data || matieresResponse };
          
        case '/enseignants':
          const enseignantsResponse = await teacherService.getTeachers();
          return { data: enseignantsResponse.data || enseignantsResponse };
          
        case '/eleves':
          const elevesResponse = await studentService.getStudents();
          return { data: elevesResponse.data || elevesResponse };
          
        case '/notes':
          const notesResponse = await gradeService.getGrades();
          return { data: notesResponse.data || notesResponse };
          
        case '/bulletins':
          const bulletinsResponse = await bulletinService.getBulletins();
          return { data: bulletinsResponse.data || bulletinsResponse };
          
        default:
          throw new Error(`Endpoint ${endpoint} not found`);
      }
    } catch (error) {
      console.warn(`Falling back to mock data for ${endpoint}:`, error);
      
      // Fallback vers les données mockées en cas d'erreur
      const { 
        mockClasses, 
        mockMatieres, 
        mockEnseignants, 
        mockEleves, 
        mockNotes, 
        mockBulletins 
      } = await import('../utils/mockData');
      
      switch(endpoint) {
        case '/classes':
          return { data: mockClasses };
        case '/matieres':
          return { data: mockMatieres };
        case '/enseignants':
          return { data: mockEnseignants };
        case '/eleves':
          return { data: mockEleves };
        case '/notes':
          return { data: mockNotes };
        case '/bulletins':
          return { data: mockBulletins };
        default:
          throw error;
      }
    }
  }

  /**
   * Méthode POST avec mapping vers les nouveaux services
   */
  async post(endpoint, data) {
    try {
      if (endpoint.startsWith('/classes')) {
        return await classService.createClass(data);
      } else if (endpoint.startsWith('/matieres')) {
        return await subjectService.createSubject(data);
      } else if (endpoint.startsWith('/enseignants')) {
        return await teacherService.createTeacher(data);
      } else if (endpoint.startsWith('/eleves')) {
        return await studentService.createStudent(data);
      } else if (endpoint.startsWith('/notes')) {
        return await gradeService.createGrade(data);
      } else {
        // Fallback générique
        const newId = Date.now();
        return { 
          data: { 
            id: newId, 
            ...data, 
            created_at: new Date().toISOString() 
          } 
        };
      }
    } catch (error) {
      console.warn(`Error in POST ${endpoint}:`, error);
      // Fallback générique
      const newId = Date.now();
      return { 
        data: { 
          id: newId, 
          ...data, 
          created_at: new Date().toISOString() 
        } 
      };
    }
  }

  /**
   * Méthode PUT avec mapping vers les nouveaux services
   */
  async put(endpoint, data) {
    try {
      const pathParts = endpoint.split('/');
      const id = pathParts[pathParts.length - 1];
      
      if (endpoint.includes('/classes/')) {
        return await classService.updateClass(id, data);
      } else if (endpoint.includes('/matieres/')) {
        return await subjectService.updateSubject(id, data);
      } else if (endpoint.includes('/enseignants/')) {
        return await teacherService.updateTeacher(id, data);
      } else if (endpoint.includes('/eleves/')) {
        return await studentService.updateStudent(id, data);
      } else if (endpoint.includes('/notes/')) {
        return await gradeService.updateGrade(id, data);
      } else {
        // Fallback générique
        return { 
          data: { 
            ...data, 
            updated_at: new Date().toISOString() 
          } 
        };
      }
    } catch (error) {
      console.warn(`Error in PUT ${endpoint}:`, error);
      // Fallback générique
      return { 
        data: { 
          ...data, 
          updated_at: new Date().toISOString() 
        } 
      };
    }
  }

  /**
   * Méthode DELETE avec mapping vers les nouveaux services
   */
  async delete(endpoint) {
    try {
      const pathParts = endpoint.split('/');
      const id = pathParts[pathParts.length - 1];
      
      if (endpoint.includes('/classes/')) {
        return await classService.deleteClass(id);
      } else if (endpoint.includes('/matieres/')) {
        return await subjectService.deleteSubject(id);
      } else if (endpoint.includes('/enseignants/')) {
        return await teacherService.deleteTeacher(id);
      } else if (endpoint.includes('/eleves/')) {
        return await studentService.deleteStudent(id);
      } else {
        // Fallback générique
        return { success: true };
      }
    } catch (error) {
      console.warn(`Error in DELETE ${endpoint}:`, error);
      // Fallback générique
      return { success: true };
    }
  }
}

export const apiService = new ApiService();
