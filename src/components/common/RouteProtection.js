import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant de protection des routes qui nécessitent une authentification
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion en sauvegardant la page de destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Composant de protection des routes basé sur les rôles
 */
export const RoleProtectedRoute = ({ children, allowedRoles = [], fallback = null }) => {
  const { user, loading, hasAnyRole } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Accès non autorisé
            </h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * Composant de protection basé sur les permissions granulaires
 */
export const PermissionProtectedRoute = ({ 
  children, 
  resource, 
  action = 'read', 
  fallback = null 
}) => {
  const { user, loading, canAccess } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccess(resource, action)) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Permission requise
            </h3>
            <p className="text-gray-600 mb-4">
              Cette action nécessite des permissions spécifiques que vous ne possédez pas.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Permission requise: {resource}:{action}
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * Composant pour rediriger les utilisateurs déjà connectés
 */
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Debug: Surveiller les changements d'état
  React.useEffect(() => {
    console.log('🚪 [GuestRoute] État:', {
      isAuthenticated,
      loading,
      user: user?.email || 'Non connecté'
    });
  }, [isAuthenticated, loading, user]);

  if (loading) {
    console.log('⏳ [GuestRoute] Affichage du loading...');
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    console.log('🔄 [GuestRoute] Utilisateur connecté - Redirection vers dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ [GuestRoute] Affichage de la page de connexion');
  return children;
};

/**
 * Higher-Order Component pour protéger les composants
 */
export const withAuth = (Component, options = {}) => {
  return (props) => {
    const { allowedRoles = [], resource, action } = options;

    if (resource) {
      return (
        <PermissionProtectedRoute resource={resource} action={action}>
          <Component {...props} />
        </PermissionProtectedRoute>
      );
    }

    if (allowedRoles.length > 0) {
      return (
        <RoleProtectedRoute allowedRoles={allowedRoles}>
          <Component {...props} />
        </RoleProtectedRoute>
      );
    }

    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

/**
 * Hook pour vérifier conditionnellement l'accès dans les composants
 */
export const usePermission = () => {
  const { user, hasRole, hasAnyRole, canAccess } = useAuth();

  return {
    user,
    hasRole,
    hasAnyRole,
    canAccess,
    isAdmin: hasRole('admin'),
    isTeacher: hasRole('enseignant'),
    isStudent: hasRole('eleve'),
    isParent: hasRole('parent'),
    canManageUsers: canAccess('users', 'write'),
    canManageClasses: canAccess('classes', 'write'),
    canManageGrades: canAccess('grades', 'write'),
    canViewReports: canAccess('reports', 'read')
  };
};
