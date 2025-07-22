import { useState, useEffect, useCallback } from 'react';
import { 
  studentService, 
  gradeService, 
  bulletinService, 
  classService,
  subjectService,
  teacherService,
  dashboardService, 
  parentService
} from '../services';
import { useAuth } from '../context/AuthContext';

/**
 * Hook pour la gestion des élèves
 */
export const useStudents = (filters = {}) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentService.getStudents(filters);
      setStudents(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createStudent = useCallback(async (studentData) => {
    try {
      const response = await studentService.createStudent(studentData);
      setStudents(prev => [response.data || response, ...prev]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateStudent = useCallback(async (id, studentData) => {
    try {
      const response = await studentService.updateStudent(id, studentData);
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...response.data } : s));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteStudent = useCallback(async (id) => {
    try {
      await studentService.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const changeStudentClass = useCallback(async (studentId, newClassId) => {
    try {
      const response = await studentService.changeStudentClass(studentId, { nouvelle_classe_id: newClassId });
      await loadStudents(); // Recharger la liste
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadStudents]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    changeStudentClass,
    refresh: loadStudents
  };
};

/**
 * Hook pour la gestion des notes
 */
export const useGrades = (studentId = null, filters = {}) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  const loadGrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (studentId) {
        response = await gradeService.getStudentGrades(studentId, filters);
      } else {
        response = await gradeService.getGrades(filters);
      }
      
      setGrades(response.data || response);
      
      // Calculer les statistiques
      const gradesList = response.data || response;
      if (gradesList.length > 0) {
        const average = gradesList.reduce((sum, grade) => sum + parseFloat(grade.note || 0), 0) / gradesList.length;
        const min = Math.min(...gradesList.map(g => parseFloat(g.note || 0)));
        const max = Math.max(...gradesList.map(g => parseFloat(g.note || 0)));
        
        setStats({ average: average.toFixed(2), min, max, count: gradesList.length });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [studentId, filters]);

  const createGrade = useCallback(async (gradeData) => {
    try {
      const response = await gradeService.createGrade(gradeData);
      await loadGrades(); // Recharger pour recalculer les stats
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadGrades]);

  const createBulkGrades = useCallback(async (bulkData) => {
    try {
      const response = await gradeService.createBulkGrades(bulkData);
      await loadGrades();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadGrades]);

  const updateGrade = useCallback(async (gradeId, gradeData) => {
    try {
      const response = await gradeService.updateGrade(gradeId, gradeData);
      await loadGrades();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [loadGrades]);

  useEffect(() => {
    loadGrades();
  }, [loadGrades]);

  return {
    grades,
    loading,
    error,
    stats,
    createGrade,
    createBulkGrades,
    updateGrade,
    refresh: loadGrades
  };
};

/**
 * Hook pour la gestion des bulletins
 */
export const useBulletins = (filters = {}) => {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const loadBulletins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bulletinService.getBulletins(filters);
      setBulletins(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const generateBulletins = useCallback(async (generationData) => {
    try {
      setGenerating(true);
      setError(null);
      const response = await bulletinService.generateBulletins(generationData);
      await loadBulletins(); // Recharger la liste
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setGenerating(false);
    }
  }, [loadBulletins]);

  const downloadBulletin = useCallback(async (bulletinId, filename = `bulletin_${bulletinId}.pdf`) => {
    try {
      const blob = await bulletinService.downloadBulletin(bulletinId);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const downloadClassBulletins = useCallback(async (params, filename = 'bulletins_classe.zip') => {
    try {
      const blob = await bulletinService.downloadClassBulletins(params);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    loadBulletins();
  }, [loadBulletins]);

  return {
    bulletins,
    loading,
    error,
    generating,
    generateBulletins,
    downloadBulletin,
    downloadClassBulletins,
    refresh: loadBulletins
  };
};

/**
 * Hook pour le tableau de bord avec données spécifiques au rôle
 */
export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger le tableau de bord principal (disponible pour tous)
      const mainDashboard = await dashboardService.getMyDashboard();
      
      // Préparer les données avec la structure attendue
      let dashboardPayload = {
        main: mainDashboard.data || mainDashboard,
        roleSpecific: null
      };

      // Charger les statistiques spécifiques au rôle si administrateur
      if (user?.role === 'administrateur') {
        try {
          const adminStats = await dashboardService.getGeneralStats();
          dashboardPayload.adminStats = adminStats.data || adminStats;
        } catch (adminError) {
          console.warn('Statistiques admin non disponibles:', adminError.message);
          // Continuer sans les stats admin si l'endpoint n'existe pas encore
        }
      }

      // Charger les statistiques spécifiques aux autres rôles
      if (user) {
        try {
          switch (user.role) {
            case 'enseignant':
              const teacherStats = await dashboardService.getTeacherStats();
              dashboardPayload.roleSpecific = teacherStats.data || teacherStats;
              break;
            case 'eleve':
              const studentStats = await dashboardService.getStudentStats();
              dashboardPayload.roleSpecific = studentStats.data || studentStats;
              break;
            case 'parent':
              const parentStats = await dashboardService.getParentStats();
              dashboardPayload.roleSpecific = parentStats.data || parentStats;
              break;
          }
        } catch (roleError) {
          console.warn(`Statistiques ${user.role} non disponibles:`, roleError.message);
          // Continuer sans les stats spécifiques au rôle
        }
      }

      setDashboardData(dashboardPayload);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement du dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [loadDashboard, user]);

  return {
    dashboardData,
    loading,
    error,
    refresh: loadDashboard
  };
};

/**
 * Hook pour les données spécifiques aux enseignants
 */
export const useTeacherData = () => {
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMyClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherService.getMyClasses();
      setMyClasses(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getClassGradeForm = useCallback(async (classId, subjectId, periodId) => {
    try {
      const response = await gradeService.getClassGradeForm({
        classe_id: classId,
        matiere_id: subjectId,
        periode_id: periodId
      });
      return response.data || response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getClassStats = useCallback(async (classId, subjectId, periodId) => {
    try {
      const response = await gradeService.getClassGradeStats({
        classe_id: classId,
        matiere_id: subjectId,
        periode_id: periodId
      });
      return response.data || response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    loadMyClasses();
  }, [loadMyClasses]);

  return {
    myClasses,
    loading,
    error,
    getClassGradeForm,
    getClassStats,
    refresh: loadMyClasses
  };
};

/**
 * Hook pour les données spécifiques aux parents
 */
export const useParentData = () => {
  const [myChildren, setMyChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMyChildren = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await parentService.getMyChildren();
      setMyChildren(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getChildGrades = useCallback(async (childId, filters = {}) => {
    try {
      const response = await parentService.getChildGrades(childId, filters);
      return response.data || response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getChildBulletins = useCallback(async (childId, filters = {}) => {
    try {
      const response = await parentService.getChildBulletins(childId, filters);
      return response.data || response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    loadMyChildren();
  }, [loadMyChildren]);

  return {
    myChildren,
    loading,
    error,
    getChildGrades,
    getChildBulletins,
    refresh: loadMyChildren
  };
};

/**
 * Hook pour les données spécifiques aux élèves
 */
export const useStudentData = () => {
  const [myGrades, setMyGrades] = useState([]);
  const [myBulletins, setMyBulletins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [gradesResponse, bulletinsResponse] = await Promise.all([
        studentService.getMyGrades(),
        studentService.getMyBulletins()
      ]);

      setMyGrades(gradesResponse.data || gradesResponse);
      setMyBulletins(bulletinsResponse.data || bulletinsResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyData();
  }, [loadMyData]);

  return {
    myGrades,
    myBulletins,
    loading,
    error,
    refresh: loadMyData
  };
};
