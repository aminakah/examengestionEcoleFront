import { validatePassword } from '../utils/validation';
import { SessionManager } from '../utils/sessionManager';

/**
 * Tests pour les améliorations de sécurité - Amélioration pour l'audit
 */

describe('Validation des mots de passe', () => {
  test('devrait accepter un mot de passe fort', () => {
    const password = 'MonMotDePasse123!';
    const result = validatePassword(password);
    
    expect(result.isValid).toBe(true);
    expect(result.strength.level).toBe('très fort');
    expect(result.errors).toHaveLength(0);
  });

  test('devrait rejeter un mot de passe faible', () => {
    const password = '123456';
    const result = validatePassword(password);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.strength.level).toBe('très faible');
  });

  test('devrait détecter les motifs interdits', () => {
    const passwords = [
      'password123',
      'admin123',
      'qwerty123',
      'azerty123',
      '123456789'
    ];

    passwords.forEach(password => {
      const result = validatePassword(password);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  test('devrait valider tous les critères de complexité', () => {
    const testCases = [
      { password: 'abc', missing: ['majuscule', 'chiffre', 'caractère spécial'] },
      { password: 'ABC', missing: ['minuscule', 'chiffre', 'caractère spécial'] },
      { password: '123', missing: ['majuscule', 'minuscule', 'caractère spécial'] },
      { password: 'Abc123!', valid: true }
    ];

    testCases.forEach(({ password, missing, valid }) => {
      const result = validatePassword(password);
      
      if (valid) {
        expect(result.isValid).toBe(true);
      } else {
        missing.forEach(requirement => {
          expect(result.errors.some(error => 
            error.toLowerCase().includes(requirement.split(' ')[1])
          )).toBe(true);
        });
      }
    });
  });

  test('devrait calculer la force correctement', () => {
    const testPasswords = [
      { password: '123', expectedLevel: 'très faible' },
      { password: 'password', expectedLevel: 'faible' },
      { password: 'Password1', expectedLevel: 'moyen' },
      { password: 'Password123!', expectedLevel: 'fort' },
      { password: 'MonSuperMotDePasseTrèsSécurisé2024!@#', expectedLevel: 'très fort' }
    ];

    testPasswords.forEach(({ password, expectedLevel }) => {
      const result = validatePassword(password);
      expect(result.strength.level).toBe(expectedLevel);
    });
  });

  test('devrait fournir des recommandations utiles', () => {
    const password = 'abc';
    const result = validatePassword(password);
    
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations.some(rec => rec.includes('majuscules'))).toBe(true);
    expect(result.recommendations.some(rec => rec.includes('chiffres'))).toBe(true);
  });
});

describe('Gestion des sessions', () => {
  let sessionManager;

  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    // Mock les événements DOM
    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();

    sessionManager = new SessionManager({
      sessionDuration: 30 * 60 * 1000, // 30 minutes
      warningTime: 5 * 60 * 1000,      // 5 minutes
      checkInterval: 1000               // 1 seconde pour les tests
    });
  });

  afterEach(() => {
    if (sessionManager) {
      sessionManager.stop();
    }
    jest.clearAllMocks();
  });

  test('devrait initialiser correctement', () => {
    expect(sessionManager).toBeDefined();
    expect(sessionManager.config.sessionDuration).toBe(30 * 60 * 1000);
    expect(sessionManager.config.warningTime).toBe(5 * 60 * 1000);
  });

  test('devrait détecter une session active', () => {
    window.localStorage.getItem.mockReturnValue('mock-token');
    
    const isActive = sessionManager.isSessionActive();
    expect(isActive).toBe(true);
    expect(window.localStorage.getItem).toHaveBeenCalledWith('authToken');
  });

  test('devrait calculer le temps restant correctement', () => {
    const now = Date.now();
    const lastActivity = now - (10 * 60 * 1000); // Il y a 10 minutes
    
    window.localStorage.getItem.mockReturnValue(lastActivity.toString());
    
    const timeLeft = sessionManager.getTimeUntilExpiration();
    const expectedTimeLeft = 20 * 60 * 1000; // 30 - 10 = 20 minutes
    
    expect(timeLeft).toBeCloseTo(expectedTimeLeft, -3); // Précision de ±1000ms
  });

  test('devrait détecter une session expirée', () => {
    const now = Date.now();
    const lastActivity = now - (35 * 60 * 1000); // Il y a 35 minutes (> 30 min limite)
    
    window.localStorage.getItem.mockReturnValue(lastActivity.toString());
    
    const isExpired = sessionManager.isSessionExpired();
    expect(isExpired).toBe(true);
  });

  test('devrait détecter la période d\'avertissement', () => {
    const now = Date.now();
    const lastActivity = now - (27 * 60 * 1000); // Il y a 27 minutes (3 min restantes < 5 min warning)
    
    window.localStorage.getItem.mockReturnValue(lastActivity.toString());
    
    const inWarning = sessionManager.isInWarningPeriod();
    expect(inWarning).toBe(true);
  });

  test('devrait mettre à jour l\'activité', () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    
    sessionManager.updateActivity();
    
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'lastActivity', 
      now.toString()
    );
  });

  test('devrait formater le temps correctement', () => {
    expect(SessionManager.formatTimeRemaining(125000)).toBe('2min 5s');
    expect(SessionManager.formatTimeRemaining(45000)).toBe('45s');
    expect(SessionManager.formatTimeRemaining(0)).toBe('0s');
  });

  test('devrait configurer les callbacks', () => {
    const mockCallbacks = {
      onWarning: jest.fn(),
      onExpiration: jest.fn(),
      onActivity: jest.fn()
    };

    sessionManager.setCallbacks(mockCallbacks);

    expect(sessionManager.callbacks.onWarning).toBe(mockCallbacks.onWarning);
    expect(sessionManager.callbacks.onExpiration).toBe(mockCallbacks.onExpiration);
    expect(sessionManager.callbacks.onActivity).toBe(mockCallbacks.onActivity);
  });

  test('devrait nettoyer les timers correctement', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    sessionManager.clearTimeouts();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

describe('Intégration complète', () => {
  test('devrait intégrer la validation de mot de passe dans le contexte auth', () => {
    // Tester que la validation est appelée lors de la création d'utilisateur
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // Mot de passe faible
      role: 'eleve'
    };

    const validation = validatePassword(userData.password);
    expect(validation.isValid).toBe(false);
    expect(validation.warnings.length).toBeGreaterThan(0);
  });

  test('devrait intégrer la gestion de session dans le contexte auth', () => {
    // Mock du localStorage pour simuler une session
    window.localStorage.getItem = jest.fn()
      .mockReturnValueOnce('mock-token') // Pour isSessionActive
      .mockReturnValueOnce(Date.now().toString()); // Pour lastActivity

    const sessionManager = new SessionManager();
    const sessionInfo = sessionManager.getSessionInfo();

    expect(sessionInfo.isActive).toBe(true);
    expect(sessionInfo.timeUntilExpiration).toBeGreaterThan(0);
  });
});

describe('Scénarios d\'utilisation réels', () => {
  test('scénario: utilisateur crée un compte avec mot de passe faible', () => {
    const formData = {
      name: 'Nouvel Utilisateur',
      email: 'nouveau@ecole.com',
      password: '123456',
      password_confirmation: '123456',
      role: 'eleve'
    };

    const validation = validatePassword(formData.password);
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain(expect.stringContaining('majuscule'));
    expect(validation.errors).toContain(expect.stringContaining('minuscule'));
    expect(validation.errors).toContain(expect.stringContaining('caractère spécial'));
    expect(validation.strength.level).toBe('très faible');
  });

  test('scénario: session approche de l\'expiration', () => {
    const now = Date.now();
    const lastActivity = now - (27 * 60 * 1000); // Il y a 27 minutes
    
    window.localStorage.getItem = jest.fn().mockReturnValue(lastActivity.toString());
    
    const sessionManager = new SessionManager();
    const sessionInfo = sessionManager.getSessionInfo();
    
    expect(sessionInfo.inWarningPeriod).toBe(true);
    expect(sessionInfo.timeUntilExpiration).toBeLessThan(5 * 60 * 1000); // < 5 minutes
  });

  test('scénario: extension de session après avertissement', () => {
    const sessionManager = new SessionManager();
    const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
    
    sessionManager.extendSession();
    
    expect(setItemSpy).toHaveBeenCalledWith(
      'lastActivity',
      expect.any(String)
    );
    expect(sessionManager.warningShown).toBe(false);
  });
});

export {
  validatePassword,
  SessionManager
};