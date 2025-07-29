import React, { useState } from 'react';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/customHooks';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  const { 
    login, 
    isAuthenticated, 
    loading, 
    user,
    loginError,   
    loginSuccess, 
    clearLoginMessages
  } = useAuth();
  
  const error = loginError || localError;
  const success = loginSuccess || localSuccess;
  
 


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Effacer les messages précédents (local et contexte)
    setLocalError('');
    setLocalSuccess('');
    clearLoginMessages();

    if (!credentials.email || !credentials.password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 [Login] Tentative de connexion avec:', credentials.email);
      
      await login(credentials);
      
      console.log('✅ [Login] Connexion réussie !');
      
    } catch (err) {
      console.log('❌ [Login] Erreur attrapée (traitée dans le contexte):', err.message);
 
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const demoAccounts = [
    { email: 'admin@gestionecole.com', password: 'admin123', role: 'Administrateur' },
    { email: 'aissatou.faye118@eleve.gestionecole.comm', password: 'password123', role: 'Eleve' },
    { email: 'parent.faye17@parent.gestionecole.com',password: 'password123', role: 'Parent' },
    { email: 'aminata.fall@gestionecole.com', password: 'password123', role: 'Enseignant' },
  ];

  const fillDemoCredentials = (email, password) => {
    setCredentials({ email, password });
  };

  // Fonction de test pour vérifier l'affichage des erreurs
  const testError = () => {
    setLocalError('Test d\'erreur LOCAL - Si vous voyez ce message, l\'affichage des erreurs fonctionne !');
    setLocalSuccess('');
    clearLoginMessages(); // Effacer les messages du contexte
    console.log('🧪 [Login] Test d\'erreur locale activé');
    
    // Effacer après 5 secondes
    setTimeout(() => {
      setLocalError('');
    }, 5000);
  };

  // Test avec de mauvaises données
  const testBadLogin = async () => {
    console.log('🚨 [Login] Test avec de mauvaises données');
    setCredentials({ email: 'mauvais@email.com', password: 'mauvaispassword' });
    
    // Attendre un petit moment puis déclencher la connexion
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Portail Scolaire</h2>
            <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="p-4 text-green-800 bg-green-100 border border-green-300 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              </div>
            )}
            {error && (
              <div className="p-4 text-red-800 bg-red-100 border border-red-300 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Votre mot de passe"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500">Comptes de démonstration</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(account.email, account.password)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded"
                >
                  {account.role}
                </button>
              ))}
            </div>
           
          </div>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Mot de passe oublié ?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
