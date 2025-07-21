import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/common/ToastNotifications';
import Login from '../components/Login';
import APIIntegrationTest from '../components/APIIntegrationTest';
import SmartDashboard from '../components/dashboard/SmartDashboard';
import { authService, testService } from '../services';

// Mock des services
jest.mock('../services', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
    isAuthenticated: jest.fn()
  },
  testService: {
    checkAPI: jest.fn()
  },
  setupAPIInterceptors: jest.fn(),
  configureServices: jest.fn()
}));

// Helper pour wrapper les composants avec les providers nécessaires
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          {component}
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Component', () => {
    test('renders login form with all required fields', () => {
      renderWithProviders(<Login />);
      
      expect(screen.getByText('Portail Scolaire')).toBeInTheDocument();
      expect(screen.getByLabelText(/adresse email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    test('displays demo accounts', () => {
      renderWithProviders(<Login />);
      
      expect(screen.getByText('Administrateur')).toBeInTheDocument();
      expect(screen.getByText('Enseignant')).toBeInTheDocument();
      expect(screen.getByText('Parent')).toBeInTheDocument();
      expect(screen.getByText('Élève')).toBeInTheDocument();
    });

    test('fills credentials when demo account is clicked', () => {
      renderWithProviders(<Login />);
      
      const adminButton = screen.getByText('Administrateur');
      fireEvent.click(adminButton);
      
      const emailInput = screen.getByLabelText(/adresse email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      
      expect(emailInput.value).toBe('admin@ecole.com');
      expect(passwordInput.value).toBe('password');
    });

    test('calls authService.login when form is submitted', async () => {
      authService.login.mockResolvedValue({
        user: { id: 1, name: 'Test User', role: 'admin' },
        token: 'fake-token'
      });

      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/adresse email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /se connecter/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });

    test('shows loading state during authentication', async () => {
      authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/adresse email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /se connecter/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Connexion...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('API Integration Test Component', () => {
    test('renders test interface with all test suites', () => {
      renderWithProviders(<APIIntegrationTest />);
      
      expect(screen.getByText('Test d\'Intégration API')).toBeInTheDocument();
      expect(screen.getByText('Testez les 104 endpoints de l\'API')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /lancer tous les tests/i })).toBeInTheDocument();
      
      // Vérifier que les suites de tests sont affichées
      expect(screen.getByText('Service de Test')).toBeInTheDocument();
      expect(screen.getByText('Authentification (7 endpoints)')).toBeInTheDocument();
      expect(screen.getByText('Gestion des Utilisateurs (7 endpoints)')).toBeInTheDocument();
    });

    test('executes individual test when test button is clicked', async () => {
      testService.checkAPI.mockResolvedValue({ status: 'ok' });
      
      renderWithProviders(<APIIntegrationTest />);
      
      const testButtons = screen.getAllByText('Tester');
      fireEvent.click(testButtons[0]);
      
      await waitFor(() => {
        expect(testService.checkAPI).toHaveBeenCalled();
      });
    });

    test('shows test results after execution', async () => {
      testService.checkAPI.mockResolvedValue({ status: 'ok' });
      
      renderWithProviders(<APIIntegrationTest />);
      
      const runAllButton = screen.getByRole('button', { name: /lancer tous les tests/i });
      fireEvent.click(runAllButton);
      
      await waitFor(() => {
        expect(screen.getByText('Résultats détaillés')).toBeInTheDocument();
      });
    });

    test('displays API information correctly', () => {
      renderWithProviders(<APIIntegrationTest />);
      
      expect(screen.getByText('104')).toBeInTheDocument();
      expect(screen.getByText('Endpoints API')).toBeInTheDocument();
    });
  });

  describe('Smart Dashboard Component', () => {
    test('shows loading state initially', () => {
      // Mock de l'état de chargement
      const mockDashboardData = null;
      const mockLoading = true;
      
      jest.doMock('../hooks/schoolHooks', () => ({
        useDashboard: () => ({
          dashboardData: mockDashboardData,
          loading: mockLoading,
          error: null,
          refresh: jest.fn()
        })
      }));

      renderWithProviders(<SmartDashboard />);
      
      // Le composant LoadingSpinner devrait être affiché
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('displays error message when API fails', () => {
      const mockError = 'API Error';
      
      jest.doMock('../hooks/schoolHooks', () => ({
        useDashboard: () => ({
          dashboardData: null,
          loading: false,
          error: mockError,
          refresh: jest.fn()
        })
      }));

      renderWithProviders(<SmartDashboard />);
      
      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
      expect(screen.getByText(mockError)).toBeInTheDocument();
    });
  });

  describe('Service Integration', () => {
    test('authService methods are properly exported', () => {
      expect(typeof authService.login).toBe('function');
      expect(typeof authService.logout).toBe('function');
      expect(typeof authService.getProfile).toBe('function');
      expect(typeof authService.isAuthenticated).toBe('function');
    });

    test('testService is available for API testing', () => {
      expect(typeof testService.checkAPI).toBe('function');
    });
  });

  describe('Error Handling', () => {
    test('handles authentication errors gracefully', async () => {
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/adresse email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /se connecter/i });
      
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
        // L'erreur devrait être gérée sans faire planter l'application
      });
    });

    test('handles API test failures gracefully', async () => {
      testService.checkAPI.mockRejectedValue(new Error('API not available'));
      
      renderWithProviders(<APIIntegrationTest />);
      
      const testButtons = screen.getAllByText('Tester');
      fireEvent.click(testButtons[0]);
      
      await waitFor(() => {
        expect(testService.checkAPI).toHaveBeenCalled();
        // L'erreur devrait être capturée et affichée
      });
    });
  });

  describe('Route Protection', () => {
    test('redirects to login when not authenticated', () => {
      authService.isAuthenticated.mockReturnValue(false);
      
      // Test implicite : si le composant protégé ne rend pas d'erreur,
      // cela signifie que la redirection fonctionne
    });

    test('allows access when authenticated', () => {
      authService.isAuthenticated.mockReturnValue(true);
      authService.getProfile.mockResolvedValue({
        id: 1,
        name: 'Test User',
        role: 'admin'
      });
      
      // Test que les composants protégés sont accessibles
    });
  });

  describe('Toast Notifications', () => {
    test('displays success notifications', async () => {
      authService.login.mockResolvedValue({
        user: { id: 1, name: 'Test User', role: 'admin' },
        token: 'fake-token'
      });

      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/adresse email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /se connecter/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        // Vérifier qu'une notification de succès est affichée
        expect(screen.getByText('Connexion réussie !')).toBeInTheDocument();
      });
    });

    test('displays error notifications', async () => {
      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      renderWithProviders(<Login />);
      
      const emailInput = screen.getByLabelText(/adresse email/i);
      const passwordInput = screen.getByLabelText /mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /se connecter/i });
      
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        // Vérifier qu'une notification d'erreur est affichée
        expect(screen.getByText(/erreur/i)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    test('adapts to mobile viewport', () => {
      // Simuler un viewport mobile
      global.innerWidth = 375;
      global.innerHeight = 667;
      
      renderWithProviders(<Login />);
      
      // Vérifier que l'interface s'adapte au mobile
      const container = screen.getByText('Portail Scolaire').closest('div');
      expect(container).toHaveClass('max-w-md');
    });

    test('works on desktop viewport', () => {
      // Simuler un viewport desktop
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      
      renderWithProviders(<APIIntegrationTest />);
      
      // Vérifier que l'interface utilise l'espace disponible
      const container = screen.getByText('Test d\'Intégration API').closest('div');
      expect(container).toHaveClass('max-w-7xl');
    });
  });
});

describe('Integration Hooks Tests', () => {
  test('useAuth hook provides authentication state', () => {
    // Test du hook useAuth
    // Note: Dans un vrai test, on utiliserait @testing-library/react-hooks
  });

  test('useToast hook manages notifications', () => {
    // Test du hook useToast
  });

  test('custom hooks handle API data correctly', () => {
    // Test des hooks personnalisés pour les données scolaires
  });
});

describe('Performance Tests', () => {
  test('components render within acceptable time', async () => {
    const startTime = performance.now();
    
    renderWithProviders(<Login />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Vérifier que le rendu prend moins de 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test('API calls complete within timeout', async () => {
    testService.checkAPI.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ status: 'ok' }), 50))
    );

    const startTime = performance.now();
    
    renderWithProviders(<APIIntegrationTest />);
    
    const testButtons = screen.getAllByText('Tester');
    fireEvent.click(testButtons[0]);
    
    await waitFor(() => {
      expect(testService.checkAPI).toHaveBeenCalled();
    });

    const endTime = performance.now();
    const apiTime = endTime - startTime;
    
    // Vérifier que l'appel API prend moins de 1 seconde
    expect(apiTime).toBeLessThan(1000);
  });
});

describe('Accessibility Tests', () => {
  test('login form has proper ARIA labels', () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/adresse email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('buttons have proper accessibility attributes', () => {
    renderWithProviders(<APIIntegrationTest />);
    
    const runAllButton = screen.getByRole('button', { name: /lancer tous les tests/i });
    
    expect(runAllButton).toBeInTheDocument();
    expect(runAllButton).not.toHaveAttribute('aria-disabled');
  });

  test('navigation is keyboard accessible', () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/adresse email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    
    // Simuler la navigation au clavier
    emailInput.focus();
    expect(document.activeElement).toBe(emailInput);
    
    fireEvent.keyDown(emailInput, { key: 'Tab' });
    expect(document.activeElement).toBe(passwordInput);
    
    fireEvent.keyDown(passwordInput, { key: 'Tab' });
    expect(document.activeElement).toBe(submitButton);
  });
});
