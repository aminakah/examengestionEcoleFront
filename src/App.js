import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastNotifications';
import { 
  ProtectedRoute, 
  RoleProtectedRoute, 
  PermissionProtectedRoute, 
  GuestRoute 
} from './components/common/RouteProtection';

// Composants de pages
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import SmartDashboard from './components/dashboard/SmartDashboard';
import GradeManager from './components/GradeManager';

// Pages existantes
import GestionEleves from './pages/GestionEleves';
import GestionEnseignants from './pages/GestionEnseignants';
import GestionClasses from './pages/GestionClasses';
import GestionMatieres from './pages/GestionMatieres';
import GestionEmploiDuTemps from './pages/GestionEmploiDuTemps';
import SaisieNotesAmelioree from './pages/SaisieNotesAmelioree';
import BulletinsAdmin from './pages/BulletinsAdmin';
import BulletinsParentAmélioré from './pages/BulletinsParentAmélioré';
import GestionDocuments from './pages/GestionDocuments';

// Services et hooks
import { configureServices, setupAPIInterceptors } from './services';
import { usePermission } from './components/common/RouteProtection';

// Styles
import './styles/designSystem';

/**
 * Configuration globale de l'application
 */
const initializeApp = () => {
  // Configurer les services API
  configureServices({
    baseURL: process.env.REACT_APP_API_URL || '/api',
    token: localStorage.getItem('authToken')
  });

  // Configurer les intercepteurs pour la gestion automatique des erreurs
  setupAPIInterceptors();

 
};

/**
 * Composant de loading global
 */
const GlobalLoader = ({ message = "Chargement..." }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
    <div className="text-center">
      {/* Logo ou icône */}
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      
      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
      
      {/* Message */}
      <p className="text-gray-700 text-lg font-medium">{message}</p>
      <p className="text-gray-500 text-sm mt-2">Portail de Gestion Scolaire</p>
    </div>
  </div>
);

/**
 * Composant principal des routes authentifiées
 */
const AuthenticatedApp = () => {
  const { user } = useAuth();
  const { isAdmin, isTeacher, isParent, isStudent } = usePermission();

  return (
    <MainLayout>
      <Routes>
        {/* Route par défaut - Redirection vers dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard intelligent - Accessible à tous les rôles authentifiés */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <SmartDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Routes spécifiques aux ADMINISTRATEURS */}
        <Route 
          path="/admin/*" 
          element={
            <RoleProtectedRoute allowedRoles={['administrateur']}>
              <Routes>
                <Route path="eleves" element={<GestionEleves />} />
                <Route path="enseignants" element={<GestionEnseignants />} />
                <Route path="classes" element={<GestionClasses />} />
                <Route path="matieres" element={<GestionMatieres />} />
                <Route path="emploi-du-temps" element={<GestionEmploiDuTemps />} />
                <Route path="documents" element={<GestionDocuments />} />
                <Route path="bulletins" element={<BulletinsAdmin />} />
              </Routes>
            </RoleProtectedRoute>
          } 
        />

        {/* Routes pour ENSEIGNANTS */}
        <Route 
          path="/enseignant/*" 
          element={
            <RoleProtectedRoute allowedRoles={['enseignant']}>
              <Routes>
                <Route path="notes" element={<GradeManager />} />
                <Route path="notes-legacy" element={<SaisieNotesAmelioree />} />
                <Route path="mes-classes" element={<div>Mes Classes</div>} />
                <Route path="bulletins" element={<BulletinsAdmin />} />
              </Routes>
            </RoleProtectedRoute>
          } 
        />

        {/* Routes pour PARENTS */}
        <Route 
          path="/parent/*" 
          element={
            <RoleProtectedRoute allowedRoles={['parent']}>
              <Routes>
                <Route path="enfants" element={<div>Mes Enfants</div>} />
                <Route path="bulletins" element={<BulletinsParentAmélioré />} />
                <Route path="notes" element={<div>Notes des Enfants</div>} />
                <Route path="rendez-vous" element={<div>Rendez-vous</div>} />
              </Routes>
            </RoleProtectedRoute>
          } 
        />

        {/* Routes pour ÉLÈVES */}
        <Route 
          path="/eleve/*" 
          element={
            <RoleProtectedRoute allowedRoles={['eleve']}>
              <Routes>
                <Route path="notes" element={<div>Mes Notes</div>} />
                <Route path="bulletins" element={<div>Mes Bulletins</div>} />
                <Route path="planning" element={<div>Mon Planning</div>} />
              </Routes>
            </RoleProtectedRoute>
          } 
        />

        {/* Routes avec permissions granulaires */}
        <Route 
          path="/gestion/*" 
          element={
            <Routes>
              <Route 
                path="eleves" 
                element={
                  <PermissionProtectedRoute resource="students" action="read">
                    <GestionEleves />
                  </PermissionProtectedRoute>
                } 
              />
              <Route 
                path="notes" 
                element={
                  <PermissionProtectedRoute resource="grades" action="write">
                    <GradeManager />
                  </PermissionProtectedRoute>
                } 
              />
            </Routes>
          } 
        />

        {/* Routes compatibilité (anciennes routes) */}
        <Route path="/eleves" element={<Navigate to="/admin/eleves" replace />} />
        <Route path="/enseignants" element={<Navigate to="/admin/enseignants" replace />} />
        <Route path="/classes" element={<Navigate to="/admin/classes" replace />} />
        <Route path="/matieres" element={<Navigate to="/admin/matieres" replace />} />
        <Route path="/notes" element={<Navigate to={
          isTeacher ? "/enseignant/notes" :
          isAdmin ? "/gestion/notes" :
          "/dashboard"
        } replace />} />
        <Route path="/bulletins" element={<Navigate to={
          isParent ? "/parent/bulletins" :
          isStudent ? "/eleve/bulletins" :
          "/admin/bulletins"
        } replace />} />

        {/* Route catch-all - Redirection vers dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

/**
 * Composant de contenu principal avec gestion des états d'authentification
 */
const AppContent = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // Affichage du loader pendant l'initialisation
  if (loading) {
    return <GlobalLoader message="Initialisation de l'application..." />;
  }

  return (
    <Routes>
      {/* Route de connexion - Uniquement pour les utilisateurs non connectés */}
      <Route 
        path="/login" 
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } 
      />
      
      {/* Routes authentifiées */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? 
            <AuthenticatedApp /> : 
            <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

/**
 * Composant racine de l'application
 */
const App = () => {
  // Initialiser l'application au montage
  React.useEffect(() => {
    initializeApp();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="App">
            <AppContent />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

/**
 * Configuration d'environnement et constantes
 */
export const APP_CONFIG = {
  name: 'Portail de Gestion Scolaire',
  version: '2.0.0',
  description: 'Système complet de gestion scolaire avec 104 endpoints API',
  apiEndpoints: 104,
  supportedRoles: ['admin', 'enseignant', 'parent', 'eleve'],
  features: [
    'Authentification sécurisée',
    'Gestion des utilisateurs',
    'Saisie de notes',
    'Génération de bulletins',
    'Tableaux de bord personnalisés',
    'Notifications en temps réel',
    'Protection des routes par rôle',
    'Permissions granulaires'
  ]
};

export default App;
