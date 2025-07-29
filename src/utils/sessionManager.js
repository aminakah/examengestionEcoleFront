import React from 'react';

/**
 * Gestionnaire d'expiration des sessions - Amélioration pour l'audit
 * Gère l'expiration automatique et les notifications d'avertissement
 */

/**
 * Configuration par défaut des sessions
 */
const SESSION_CONFIG = {
  // Durée de session en millisecondes (30 minutes par défaut)
  sessionDuration: 30 * 60 * 1000,
  
  // Temps d'avertissement avant expiration (5 minutes)
  warningTime: 5 * 60 * 1000,
  
  // Intervalle de vérification (30 secondes)
  checkInterval: 30 * 1000,
  
  // Clé de stockage pour l'activité
  activityKey: 'lastActivity',
  
  // Clé de stockage pour le token
  tokenKey: 'authToken',
  
  // Events à surveiller pour l'activité utilisateur
  activityEvents: ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
};

/**
 * Classe principale de gestion des sessions
 */
export class SessionManager {
  constructor(config = {}) {
    this.config = { ...SESSION_CONFIG, ...config };
    this.timers = {
      sessionCheck: null,
      warningTimeout: null,
      logoutTimeout: null
    };
    this.callbacks = {
      onWarning: null,
      onExpiration: null,
      onActivity: null
    };
    this.isActive = false;
    this.warningShown = false;
    
    this.init();
  }

  /**
   * Initialisation du gestionnaire
   */
  init() {
    this.setupActivityListeners();
    this.startSessionMonitoring();
    this.updateActivity();
  }

  /**
   * Configuration des callbacks
   */
  setCallbacks({ onWarning, onExpiration, onActivity }) {
    this.callbacks.onWarning = onWarning;
    this.callbacks.onExpiration = onExpiration;
    this.callbacks.onActivity = onActivity;
  }

  /**
   * Mise en place des écouteurs d'activité
   */
  setupActivityListeners() {
    this.config.activityEvents.forEach(event => {
      document.addEventListener(event, this.handleActivity.bind(this), true);
    });
  }

  /**
   * Gestion de l'activité utilisateur
   */
  handleActivity() {
    this.updateActivity();
    
    // Réinitialiser l'avertissement si une activité est détectée
    if (this.warningShown) {
      this.warningShown = false;
      this.clearTimeouts();
      this.startSessionMonitoring();
    }
    
    // Callback d'activité
    if (this.callbacks.onActivity) {
      this.callbacks.onActivity();
    }
  }

  /**
   * Mise à jour du timestamp d'activité
   */
  updateActivity() {
    const now = Date.now();
    localStorage.setItem(this.config.activityKey, now.toString());
  }

  /**
   * Récupération du timestamp de dernière activité
   */
  getLastActivity() {
    const lastActivity = localStorage.getItem(this.config.activityKey);
    return lastActivity ? parseInt(lastActivity, 10) : Date.now();
  }

  /**
   * Calcul du temps restant avant expiration
   */
  getTimeUntilExpiration() {
    const lastActivity = this.getLastActivity();
    const sessionEnd = lastActivity + this.config.sessionDuration;
    return Math.max(0, sessionEnd - Date.now());
  }

  /**
   * Vérification si la session est expirée
   */
  isSessionExpired() {
    return this.getTimeUntilExpiration() === 0;
  }

  /**
   * Vérification si on est dans la période d'avertissement
   */
  isInWarningPeriod() {
    const timeLeft = this.getTimeUntilExpiration();
    return timeLeft > 0 && timeLeft <= this.config.warningTime;
  }

  /**
   * Démarrage du monitoring de session
   */
  startSessionMonitoring() {
    this.isActive = true;
    
    // Vérification périodique
    this.timers.sessionCheck = setInterval(() => {
      this.checkSession();
    }, this.config.checkInterval);
    
    // Première vérification immédiate
    this.checkSession();
  }

  /**
   * Vérification de l'état de la session
   */
  checkSession() {
    if (!this.isSessionActive()) {
      return;
    }

    if (this.isSessionExpired()) {
      this.handleSessionExpiration();
    } else if (this.isInWarningPeriod() && !this.warningShown) {
      this.handleSessionWarning();
    }
  }

  /**
   * Gestion de l'avertissement d'expiration
   */
  handleSessionWarning() {
    this.warningShown = true;
    const timeLeft = this.getTimeUntilExpiration();
    const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
    
    if (this.callbacks.onWarning) {
      this.callbacks.onWarning(minutesLeft, timeLeft);
    }
    
    // Programmer la déconnexion automatique
    this.timers.logoutTimeout = setTimeout(() => {
      this.handleSessionExpiration();
    }, timeLeft);
  }

  /**
   * Gestion de l'expiration de session
   */
  handleSessionExpiration() {
    this.cleanup();
    
    if (this.callbacks.onExpiration) {
      this.callbacks.onExpiration();
    }
  }

  /**
   * Extension de la session
   */
  extendSession() {
    this.updateActivity();
    this.warningShown = false;
    this.clearTimeouts();
    
    if (this.isActive) {
      this.startSessionMonitoring();
    }
  }

  /**
   * Vérification si une session est active (token présent)
   */
  isSessionActive() {
    return !!localStorage.getItem(this.config.tokenKey);
  }

  /**
   * Nettoyage des timeouts
   */
  clearTimeouts() {
    Object.values(this.timers).forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    this.timers = {
      sessionCheck: null,
      warningTimeout: null,
      logoutTimeout: null
    };
  }

  /**
   * Arrêt du gestionnaire
   */
  stop() {
    this.isActive = false;
    this.clearTimeouts();
    
    // Suppression des écouteurs
    this.config.activityEvents.forEach(event => {
      document.removeEventListener(event, this.handleActivity.bind(this), true);
    });
  }

  /**
   * Nettoyage complet
   */
  cleanup() {
    this.stop();
    localStorage.removeItem(this.config.activityKey);
    // Note: On ne supprime pas le token ici, c'est le rôle du AuthContext
  }

  /**
   * Récupération des informations de session
   */
  getSessionInfo() {
    return {
      isActive: this.isSessionActive(),
      timeUntilExpiration: this.getTimeUntilExpiration(),
      lastActivity: this.getLastActivity(),
      inWarningPeriod: this.isInWarningPeriod(),
      isExpired: this.isSessionExpired(),
      warningShown: this.warningShown
    };
  }

  /**
   * Formatage du temps restant
   */
  static formatTimeRemaining(milliseconds) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}min ${seconds}s`;
    }
    return `${seconds}s`;
  }
}

/**
 * Instance singleton du gestionnaire de session
 */
let sessionManagerInstance = null;

/**
 * Fonction d'initialisation du gestionnaire de session
 */
export const initSessionManager = (config = {}) => {
  if (!sessionManagerInstance) {
    sessionManagerInstance = new SessionManager(config);
  }
  return sessionManagerInstance;
};

/**
 * Récupération de l'instance du gestionnaire
 */
export const getSessionManager = () => {
  if (!sessionManagerInstance) {
    throw new Error('SessionManager non initialisé. Appelez initSessionManager() d\'abord.');
  }
  return sessionManagerInstance;
};

/**
 * Hook React pour l'utilisation du gestionnaire de session
 */
export const useSessionManager = () => {
  const [sessionInfo, setSessionInfo] = React.useState(null);
  const [showWarning, setShowWarning] = React.useState(false);
  
  React.useEffect(() => {
    const manager = getSessionManager();
    
    // Configuration des callbacks
    manager.setCallbacks({
      onWarning: (minutesLeft, timeLeft) => {
        setShowWarning(true);
        setSessionInfo(manager.getSessionInfo());
      },
      onExpiration: () => {
        setShowWarning(false);
        // La déconnexion sera gérée par AuthContext
      },
      onActivity: () => {
        setSessionInfo(manager.getSessionInfo());
        if (showWarning) {
          setShowWarning(false);
        }
      }
    });
    
    // Mise à jour périodique des infos
    const interval = setInterval(() => {
      setSessionInfo(manager.getSessionInfo());
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [showWarning]);
  
  return {
    sessionInfo,
    showWarning,
    extendSession: () => getSessionManager().extendSession(),
    formatTimeRemaining: SessionManager.formatTimeRemaining
  };
};