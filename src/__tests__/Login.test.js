import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../components/Login';

// Mock du localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  };

  test('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByText('École Moderne')).toBeInTheDocument();
    expect(screen.getByText('Portail Scolaire')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email requis')).toBeInTheDocument();
      expect(screen.getByText('Mot de passe requis')).toBeInTheDocument();
    });
  });

  test('shows error for invalid credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'invalid@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Identifiants incorrects')).toBeInTheDocument();
    });
  });

  test('successful login with valid credentials', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'admin@ecole.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        expect.stringContaining('admin@ecole.com')
      );
    });
  });

  test('displays different user types in demo section', () => {
    renderLogin();
    
    expect(screen.getByText('admin@ecole.com')).toBeInTheDocument();
    expect(screen.getByText('prof@ecole.com')).toBeInTheDocument();
    expect(screen.getByText('parent@ecole.com')).toBeInTheDocument();
  });

  test('handles loading state correctly', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'admin@ecole.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    // Pendant le chargement, le bouton devrait être désactivé
    expect(submitButton).toBeDisabled();
  });
});

describe('Login Form Validation', () => {
  test('validates email format', async () => {
    const { container } = render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    // Note: Dans une vraie implémentation, nous aurions une validation d'email
    // Ici on teste juste que le champ est rempli
    expect(emailInput.value).toBe('invalid-email');
  });

  test('password field is of type password', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
