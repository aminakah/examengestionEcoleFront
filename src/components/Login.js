import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background effects */}
      <div style={styles.backgroundShapes}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>
      
      <div style={styles.loginBox} className="fade-in-up">
        {/* Logo et titre */}
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🎓</div>
            <span style={styles.logoText}>EduPortal</span>
          </div>
          <h2 style={styles.title}>Connexion</h2>
          <p style={styles.subtitle}>Accédez à votre espace personnel</p>
        </div>
        
        {error && (
          <div style={styles.errorAlert} className="slide-in-right">
            <span style={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Adresse email</label>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.input,
                  ...(focusedField === 'email' ? styles.inputFocused : {})
                }}
                placeholder="votre@email.com"
                required
              />
              <div style={styles.inputIcon}>📧</div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.input,
                  ...(focusedField === 'password' ? styles.inputFocused : {})
                }}
                placeholder="••••••••"
                required
              />
              <div style={styles.inputIcon}>🔐</div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonLoading : {})
            }}
            className="hover-lift"
          >
            {loading ? (
              <>
                <div style={styles.spinner}></div>
                Connexion...
              </>
            ) : (
              <>
                <span style={styles.buttonIcon}>🚀</span>
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Comptes de test */}
        <div style={styles.testAccounts}>
          <div style={styles.testAccountsHeader}>
            <span style={styles.testIcon}>🧪</span>
            <span style={styles.testTitle}>Comptes de démonstration</span>
          </div>
          <div style={styles.testAccountsList}>
            <div style={styles.testAccount}>
              <div style={styles.testRole}>👑 Admin</div>
              <div style={styles.testCredentials}>admin@ecole.com / password</div>
            </div>
            <div style={styles.testAccount}>
              <div style={styles.testRole}>📚 Enseignant</div>
              <div style={styles.testCredentials}>prof@ecole.com / password</div>
            </div>
            <div style={styles.testAccount}>
              <div style={styles.testRole}>👨‍👩‍👧‍👦 Parent</div>
              <div style={styles.testCredentials}>parent@ecole.com / password</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          EduPortal 2025 - Gestion scolaire moderne
        </p>
      </div>
    </div>
  );
};
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none'
  },
  shape1: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '400px',
    height: '400px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 8s ease-in-out infinite'
  },
  shape2: {
    position: 'absolute',
    bottom: '10%',
    left: '10%',
    width: '300px',
    height: '300px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
    borderRadius: '40%',
    filter: 'blur(40px)',
    animation: 'float 6s ease-in-out infinite reverse'
  },
  shape3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '500px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    borderRadius: '30%',
    filter: 'blur(80px)',
    animation: 'float 10s ease-in-out infinite'
  },
  loginBox: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '3rem',
    borderRadius: '2rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    zIndex: 1
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '2.5rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  logoIcon: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    borderRadius: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
  },
  logoText: {
    fontSize: '2rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1rem',
    fontWeight: '400'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  inputWrapper: {
    position: 'relative'
  },
  input: {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    border: '2px solid #e5e7eb',
    borderRadius: '1rem',
    fontSize: '1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    outline: 'none',
    color: '#1f2937'
  },
  inputFocused: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)',
    background: 'rgba(255, 255, 255, 0.95)'
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.25rem',
    color: '#9ca3af',
    pointerEvents: 'none'
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '1rem',
    marginBottom: '1.5rem',
    border: '1px solid #fca5a5',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  errorIcon: {
    fontSize: '1.25rem'
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '1rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    marginTop: '0.5rem'
  },
  submitButtonLoading: {
    opacity: 0.8,
    cursor: 'not-allowed'
  },
  buttonIcon: {
    fontSize: '1.25rem'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  testAccounts: {
    marginTop: '2.5rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
    borderRadius: '1rem',
    border: '1px solid rgba(59, 130, 246, 0.1)'
  },
  testAccountsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  testIcon: {
    fontSize: '1.25rem'
  },
  testTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151'
  },
  testAccountsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  testAccount: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '0.75rem',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  testRole: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#4b5563'
  },
  testCredentials: {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontFamily: 'monospace',
    background: 'rgba(0, 0, 0, 0.05)',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem'
  },
  footer: {
    position: 'absolute',
    bottom: '2rem',
    textAlign: 'center',
    zIndex: 1
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.875rem',
    fontWeight: '500'
  }
};

export default Login;