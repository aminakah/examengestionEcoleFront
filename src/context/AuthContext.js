import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, setupAPIInterceptors } from '../services/index';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Configurer les intercepteurs API pour la gestion automatique des erreurs
        setupAPIInterceptors();
        
        // Vérifier si l'utilisateur est déjà connecté
        if (authService.isAuthenticated()) {
          try {
            const profile = await authService.getProfile();
            setUser(profile.user || profile);

            setIsAuthenticated(true);
          } catch (error) {
            console.error('Erreur récupération profil:', error);
            // Token expiré ou invalide, déconnecter
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      console.log(response)
      
      if (response.user) {
        console.log(response.user)
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        throw new Error('Réponse de connexion invalide');
      }
    } catch (error) {
      console.error('Erreur login:', error);
      throw new Error(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error('Erreur register:', error);
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      throw new Error(error.message || 'Erreur lors du changement de mot de passe');
    }
  };

  const refreshProfile = async () => {
    try {
      if (isAuthenticated) {
        const profile = await authService.getProfile();
        setUser(profile.data || profile);
      }
    } catch (error) {
      console.error('Erreur refresh profile:', error);
      // En cas d'erreur, déconnecter l'utilisateur
      logout();
    }
  };

  // Fonction utilitaire pour vérifier les permissions
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Fonction pour vérifier si l'utilisateur peut accéder à une ressource
  const canAccess = (resource, action = 'read') => {
    if (!user) return false;
    
    // Règles d'accès basées sur les rôles
    const permissions = {
      admin: ['*'], // Accès total
      enseignant: [
        'classes:read', 'students:read', 'grades:write', 'notes:write',
        'bulletins:read', 'subjects:read', 'dashboard:read'
      ],
      eleve: [
        'grades:read', 'bulletins:read', 'profile:read'
      ],
      parent: [
        'children:read', 'grades:read', 'bulletins:read', 'profile:read'
      ]
    };

    const userPermissions = permissions[user.role] || [];
    
    // Accès admin total
    if (userPermissions.includes('*')) return true;
    
    // Vérifier permission spécifique
    const permission = `${resource}:${action}`;
    return userPermissions.includes(permission);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    changePassword,
    refreshProfile,
    hasRole,
    hasAnyRole,
    canAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
