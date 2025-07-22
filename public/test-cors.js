// Test rapide de l'API depuis le navigateur
// Ouvrez la console de votre navigateur et collez ce code

const testCORS = async () => {
  try {
    console.log('🧪 Test de connexion CORS...');
    
    // Test de base
    const response = await fetch('http://localhost:8000/api/test', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Test CORS réussi !', data);
    
    // Test des périodes (sans auth pour voir si l'endpoint fonctionne)
    try {
      const periodesResponse = await fetch('http://localhost:8000/api/periodes', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📅 Test endpoint périodes:', periodesResponse.status);
    } catch (error) {
      console.log('⚠️ Périodes nécessitent une authentification (normal):', error.message);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur CORS:', error);
    return false;
  }
};

// Exécuter le test
testCORS();

// Aussi disponible en tant que fonction globale
window.testCORS = testCORS;

console.log('💡 Pour retester: window.testCORS()');
