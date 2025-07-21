# Guide d'intégration des APIs - Système de Gestion Scolaire

## 📚 Vue d'ensemble

Ce guide explique comment utiliser les 104 endpoints APIs intégrés dans l'application frontend React pour le système de gestion scolaire.

## 🏗️ Architecture des Services

L'architecture suit une approche modulaire avec des services spécialisés pour chaque domaine métier :

```
src/services/
├── api.js                    # Service API de base
├── authService.js           # Authentification
├── userService.js           # Gestion des utilisateurs
├── schoolService.js         # Années scolaires et niveaux
├── classService.js          # Classes
├── subjectService.js        # Matières
├── studentService.js        # Élèves
├── parentService.js         # Parents
├── teacherService.js        # Enseignants
├── enrollmentService.js     # Inscriptions
├── periodService.js         # Périodes
├── gradeService.js          # Notes
├── bulletinService.js       # Bulletins
├── dashboardService.js      # Tableaux de bord
├── documentService.js       # Documents
├── apiService.js           # Service legacy (compatibilité)
└── index.js                # Point d'entrée centralisé
```

## 🔐 Configuration de l'authentification

### 1. Configuration initiale

```javascript
import { authService, setupAPIInterceptors } from '../services';

// Configurer les intercepteurs pour la gestion automatique des tokens
setupAPIInterceptors();
```

### 2. Utilisation du contexte d'authentification

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Redirection automatique après connexion
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };
}
```

## 🛡️ Protection des routes

### 1. Routes protégées par authentification

```javascript
import { ProtectedRoute } from '../components/common/RouteProtection';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### 2. Routes protégées par rôle

```javascript
import { RoleProtectedRoute } from '../components/common/RouteProtection';

<Route path="/admin" element={
  <RoleProtectedRoute allowedRoles={['admin']}>
    <AdminPanel />
  </RoleProtectedRoute>
} />
```

### 3. Routes protégées par permission

```javascript
import { PermissionProtectedRoute } from '../components/common/RouteProtection';

<Route path="/users" element={
  <PermissionProtectedRoute resource="users" action="read">
    <UsersList />
  </PermissionProtectedRoute>
} />
```

## 📊 Utilisation des services dans les composants

### 1. Gestion des élèves

```javascript
import { studentService } from '../services';
import { useDataManager } from '../hooks/customHooks';

function StudentsManager() {
  // Utilisation du hook pour la gestion automatique des données
  const {
    data: students,
    loading,
    error,
    create,
    update,
    remove,
    refresh
  } = useDataManager('/eleves');

  // Créer un nouvel élève
  const handleCreateStudent = async (studentData) => {
    try {
      await create(studentData);
      // Les données sont automatiquement mises à jour
    } catch (error) {
      console.error('Erreur création élève:', error);
    }
  };

  // Récupérer les notes d'un élève
  const handleGetStudentGrades = async (studentId) => {
    try {
      const grades = await studentService.getStudentGrades(studentId);
      return grades;
    } catch (error) {
      console.error('Erreur récupération notes:', error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {students.map(student => (
        <div key={student.id}>{student.nom}</div>
      ))}
    </div>
  );
}
```

### 2. Gestion des notes

```javascript
import { gradeService } from '../services';

function GradeManager() {
  const createGrade = async (gradeData) => {
    try {
      await gradeService.createGrade({
        eleve_id: gradeData.studentId,
        matiere_id: gradeData.subjectId,
        note: gradeData.grade,
        coefficient: gradeData.coefficient,
        periode_id: gradeData.periodId
      });
    } catch (error) {
      console.error('Erreur saisie note:', error);
    }
  };

  const createBulkGrades = async (classId, subjectId, grades) => {
    try {
      await gradeService.createBulkGrades({
        classe_id: classId,
        matiere_id: subjectId,
        notes: grades
      });
    } catch (error) {
      console.error('Erreur saisie groupée:', error);
    }
  };
}
```

### 3. Génération et téléchargement de bulletins

```javascript
import { bulletinService } from '../services';

function BulletinManager() {
  const generateBulletins = async (classId, periodId) => {
    try {
      await bulletinService.generateBulletins({
        classe_id: classId,
        periode_id: periodId
      });
    } catch (error) {
      console.error('Erreur génération bulletins:', error);
    }
  };

  const downloadBulletin = async (bulletinId) => {
    try {
      const blob = await bulletinService.downloadBulletin(bulletinId);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `bulletin_${bulletinId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement bulletin:', error);
    }
  };
}
```

## 📈 Tableaux de bord

### 1. Tableau de bord personnalisé par rôle

```javascript
import { dashboardService } from '../services';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getMyDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      }
    };

    loadDashboard();
  }, []);

  // Tableau de bord spécifique selon le rôle
  const loadRoleSpecificStats = async () => {
    try {
      let stats;
      switch (user.role) {
        case 'admin':
          stats = await dashboardService.getGeneralStats();
          break;
        case 'enseignant':
          stats = await dashboardService.getTeacherStats();
          break;
        case 'eleve':
          stats = await dashboardService.getStudentStats();
          break;
        case 'parent':
          stats = await dashboardService.getParentStats();
          break;
      }
      return stats;
    } catch (error) {
      console.error('Erreur stats spécifiques:', error);
    }
  };
}
```

## 🔍 Gestion des erreurs

### 1. Gestion globale des erreurs

```javascript
import { handleAPIError } from '../services';

try {
  const response = await studentService.getStudents();
} catch (error) {
  const errorInfo = handleAPIError(error);
  // Afficher une notification d'erreur
  showNotification(errorInfo.message, errorInfo.type);
}
```

### 2. Hook pour les notifications

```javascript
import { useToast } from '../hooks/customHooks';

function MyComponent() {
  const { success, error, warning } = useToast();

  const handleAction = async () => {
    try {
      await someAPICall();
      success('Action réussie !');
    } catch (err) {
      error('Erreur lors de l\'action');
    }
  };
}
```

## 📱 Exemples d'usage par rôle

### Administrateur

```javascript
// Gestion des utilisateurs
import { userService } from '../services';

const createUser = await userService.createUser(userData);
const users = await userService.getUsers({ page: 1, limit: 10 });
await userService.toggleUserStatus(userId);
```

### Enseignant

```javascript
// Mes classes et saisie de notes
import { teacherService, gradeService } from '../services';

const myClasses = await teacherService.getMyClasses();
const gradeForm = await gradeService.getClassGradeForm({
  classe_id: classId,
  matiere_id: subjectId
});
```

### Parent

```javascript
// Mes enfants et leurs résultats
import { parentService } from '../services';

const myChildren = await parentService.getMyChildren();
const childGrades = await parentService.getChildGrades(childId);
const childBulletins = await parentService.getChildBulletins(childId);
```

### Élève

```javascript
// Mes notes et bulletins
import { studentService } from '../services';

const myGrades = await studentService.getMyGrades();
const myBulletins = await studentService.getMyBulletins();
```

## 🔧 Configuration avancée

### 1. Configuration de l'URL de base

```javascript
import { configureServices } from '../services';

// Configuration pour le développement
configureServices({
  baseURL: 'http://localhost:8000/api',
  token: localStorage.getItem('authToken')
});
```

### 2. Intercepteurs personnalisés

```javascript
import { api } from '../services/api';

// Intercepteur pour logging
const originalRequest = api.request;
api.request = async function(method, endpoint, data, options) {
  console.log(`API Call: ${method} ${endpoint}`);
  const result = await originalRequest.call(this, method, endpoint, data, options);
  console.log(`API Response:`, result);
  return result;
};
```

## 📋 Checklist d'intégration

- [ ] Services API configurés
- [ ] Contexte d'authentification mis en place
- [ ] Routes protégées implémentées
- [ ] Gestion d'erreurs configurée
- [ ] Hooks personnalisés utilisés
- [ ] Tests des endpoints principaux
- [ ] Documentation des composants mise à jour

## 🚀 Endpoints disponibles par catégorie

### Authentification (7 endpoints)
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- POST /api/auth/refresh
- GET /api/auth/me
- POST /api/auth/change-password
- GET /api/profil

### Gestion (104 endpoints au total)
- **Utilisateurs** : 7 endpoints
- **Années scolaires** : 7 endpoints
- **Niveaux** : 7 endpoints
- **Classes** : 10 endpoints
- **Matières** : 8 endpoints
- **Élèves** : 10 endpoints
- **Parents** : 8 endpoints
- **Enseignants** : 8 endpoints
- **Inscriptions** : 7 endpoints
- **Périodes** : 7 endpoints
- **Notes** : 6 endpoints
- **Bulletins** : 6 endpoints
- **Tableaux de bord** : 5 endpoints
- **Documents** : 5 endpoints
- **Routes spécifiques** : 6 endpoints

Tous les endpoints sont maintenant intégrés et prêts à être utilisés dans votre application !
