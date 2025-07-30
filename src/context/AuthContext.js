import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, setupAPIInterceptors } from '../services/index';
import { initSessionManager, getSessionManager } from '../utils/sessionManager';
import { 
  SessionExpirationModal, 
  useSessionNotifications 
} from '../components/common/SessionComponents';

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

  // État pour la gestion de session - Amélioration pour l'audit
  const [sessionManager, setSessionManager] = useState(null);
  
  // Hook pour les notifications de session
  const {
    showModal,
    showToast,
    timeRemaining,
    showWarning,
    hideWarnings,
    setShowModal,
    setShowToast
  } = useSessionNotifications();

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

            // Initialiser le gestionnaire de session - Amélioration pour l'audit
            initializeSessionManager();
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

  // Initialisation du gestionnaire de session - Amélioration pour l'audit
  const initializeSessionManager = () => {
    if (!sessionManager) {
      const manager = initSessionManager({
        sessionDuration: 30 * 60 * 1000, // 30 minutes
        warningTime: 5 * 60 * 1000,      // 5 minutes avant expiration
        checkInterval: 30 * 1000          // Vérification toutes les 30s
      });

      // Configuration des callbacks
      manager.setCallbacks({
        onWarning: (minutes, timeLeft) => {
          console.log(`🔔 Session expire dans ${minutes} minutes`);
          showWarning(minutes, timeLeft);
        },
        onExpiration: () => {
          console.log('🔓 Session expirée - Déconnexion automatique');
          handleSessionExpiration();
        },
        onActivity: () => {
          // Réinitialiser les avertissements lors d'activité
          hideWarnings();
        }
      });

      setSessionManager(manager);
    }
  };

  // Gestion de l'expiration de session - Amélioration pour l'audit
  const handleSessionExpiration = async () => {
    hideWarnings();
    
    // Afficher une notification finale
    if (window.confirm('Votre session a expiré pour des raisons de sécurité. Vous allez être déconnecté.')) {
      await logout();
    } else {
      await logout(); // Force la déconnexion même si annulé
    }
  };

  // Extension de session - Amélioration pour l'audit
  const extendSession = () => {
    if (sessionManager) {
      sessionManager.extendSession();
      hideWarnings();
      console.log('📱 Session prolongée');
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Initialiser la gestion de session après connexion - Amélioration pour l'audit
        initializeSessionManager();
        
        return { success: true, user: response.user };
      } else {
        throw new Error('Réponse de connexion invalide');
      }
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
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
      // Arrêter le gestionnaire de session - Amélioration pour l'audit
      if (sessionManager) {
        sessionManager.stop();
        setSessionManager(null);
      }
      
      hideWarnings();
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
    canAccess,
    // Nouvelles fonctions de gestion de session - Amélioration pour l'audit
    extendSession,
    sessionManager,
    sessionInfo: sessionManager?.getSessionInfo()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Composants de notification de session - Amélioration pour l'audit */}
      <SessionExpirationModal
        isOpen={showModal}
        timeRemaining={timeRemaining}
        onExtend={extendSession}
        onLogout={logout}
      />
    </AuthContext.Provider>
  );
};
