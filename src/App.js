import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import GestionEleves from './pages/GestionEleves';
import GestionEnseignants from './pages/GestionEnseignants';
import GestionClasses from './pages/GestionClasses';
import GestionMatieres from './pages/GestionMatieres';
import GestionEmploiDuTemps from './pages/GestionEmploiDuTemps';
import SaisieNotesAmelioree from './pages/SaisieNotesAmelioree';
import BulletinsAdmin from './pages/BulletinsAdmin';
import BulletinsParentAmélioré from './pages/BulletinsParentAmélioré';
import GestionDocuments from './pages/GestionDocuments';
import './styles/designSystem';

// Composant pour les routes protégées
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Chargement de l'application...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  return children;
};

// Composant pour l'accès refusé
const AccessDenied = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Accès non autorisé</h3>
      <p className="text-gray-500">Vous n'avez pas les permissions pour accéder à cette page.</p>
    </div>
  </div>
);

// Composant principal des routes authentifiées
const AuthenticatedApp = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <Routes>
        {/* Route par défaut */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard - Accessible à tous les rôles */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'enseignant', 'parent']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Routes Admin uniquement */}
        <Route 
          path="/eleves" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GestionEleves />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/enseignants" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GestionEnseignants />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/classes" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GestionClasses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/matieres" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GestionMatieres />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/emploi-du-temps" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GestionEmploiDuTemps />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/documents" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GestionDocuments />
            </ProtectedRoute>
          } 
        />

        {/* Routes Admin + Enseignant */}
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'enseignant']}>
              <SaisieNotesAmelioree />
            </ProtectedRoute>
          } 
        />

        {/* Bulletins - Différents composants selon le rôle */}
        <Route 
          path="/bulletins" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'enseignant', 'parent']}>
              {user?.role === 'parent' ? <BulletinsParentAmélioré /> : <BulletinsAdmin />}
            </ProtectedRoute>
          } 
        />

        {/* Route 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

// Composant racine avec Router
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Chargement de l'application...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/*" element={user ? <AuthenticatedApp /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;