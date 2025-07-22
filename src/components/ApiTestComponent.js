import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Composant de test pour diagnostiquer les problèmes d'authentification
 * À utiliser temporairement pour débugger l'intégration API
 */
const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = () => {
    const results = {};
    
    // Test 1: Vérifier localStorage
    const token = localStorage.getItem('authToken');
    results.hasToken = !!token;
    results.tokenPreview = token ? `${token.substring(0, 20)}...` : 'Aucun token';
    
    // Test 2: Vérifier l'API service
    results.isAuthenticated = api.isAuthenticated();
    
    // Test 3: Vérifier l'URL de base de l'API
    results.apiBaseUrl = api.baseURL;
    
    setTestResults(results);
  };

  const testLoginEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/test', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      alert(`Test endpoint: ${response.status} - ${JSON.stringify(result)}`);
    } catch (error) {
      alert(`Erreur test endpoint: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthenticatedEndpoint = async () => {
    setLoading(true);
    try {
      const response = await api.get('/emploi-temps-semaine');
      alert(`Test authentifié réussi: ${JSON.stringify(response)}`);
    } catch (error) {
      alert(`Erreur test authentifié: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearTokenAndReload = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">🔧 Test API & Authentification</h2>
      
      {/* Résultats du diagnostic */}
      <div className="bg-white p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">📋 Diagnostic</h3>
        <div className="space-y-2 text-sm">
          <div className={`flex justify-between ${testResults.hasToken ? 'text-green-600' : 'text-red-600'}`}>
            <span>Token en localStorage:</span>
            <span>{testResults.hasToken ? '✅ Présent' : '❌ Absent'}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Token preview:</span>
            <span className="font-mono text-xs">{testResults.tokenPreview}</span>
          </div>
          <div className={`flex justify-between ${testResults.isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
            <span>API Service authentifié:</span>
            <span>{testResults.isAuthenticated ? '✅ Oui' : '❌ Non'}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>URL API de base:</span>
            <span className="font-mono text-xs">{testResults.apiBaseUrl}</span>
          </div>
        </div>
      </div>

      {/* Boutons de test */}
      <div className="space-y-3">
        <button
          onClick={testLoginEndpoint}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          🧪 Tester endpoint public (/test)
        </button>
        
        <button
          onClick={testAuthenticatedEndpoint}
          disabled={loading || !testResults.isAuthenticated}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          🔒 Tester endpoint authentifié (/emploi-temps-semaine)
        </button>
        
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          🔄 Relancer le diagnostic
        </button>
        
        <button
          onClick={clearTokenAndReload}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
        >
          🗑️ Supprimer token et recharger
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Instructions</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Si pas de token → Se connecter d'abord</li>
          <li>2. Tester l'endpoint public pour vérifier la connexion Laravel</li>
          <li>3. Tester l'endpoint authentifié pour vérifier le token</li>
          <li>4. Ouvrir la console pour voir les logs détaillés</li>
        </ul>
      </div>

      {loading && (
        <div className="text-center mt-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Test en cours...</span>
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent;
