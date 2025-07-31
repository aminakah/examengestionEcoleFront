import React, { useState } from 'react';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/customHooks';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      await login(credentials);
      setSuccess('Connexion réussie !');
      setError('');
    } catch (err) {
      console.log(err);
      
      // Gestion simple des erreurs
      let errorMessage = "Erreur de connexion";
      
      if (err.response && err.response.status === 401) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (err.request) {
        errorMessage = "Impossible de se connecter au serveur.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setSuccess('');
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
    { email: 'parent.faye17@parent.gestionecole.com', password: 'password123', role: 'Parent' },
    // { email: 'omar.ndiaye526@eleve.gestionecole.com', password: 'password123', role: 'Eleve' },
    { email: 'aminata.fall@gestionecole.com', password: 'password123', role: 'Enseignant' },
  ];

  const fillDemoCredentials = (email, password) => {
    setCredentials({ email, password });
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
              <div className="p-3 text-green-700 bg-green-100 border border-green-300 rounded-md">
                {success}
              </div>
            )}
            {error && (
              <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">
                {error}
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