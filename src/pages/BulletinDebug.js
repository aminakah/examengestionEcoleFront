import React, { useState, useEffect } from 'react';

// Composant de debug pour diagnostiquer le problème des objets React
const BulletinDebug = () => {
  const [debugData, setDebugData] = useState(null);

  useEffect(() => {
    // Simuler des données de test pour identifier le problème
    const testData = {
      periode: {
        id: 1,
        nom: "1er Trimestre",
        type: "trimestre",
        ordre: 1,
        annee_scolaire_id: 1,
        date_debut: "2024-10-01",
        date_fin: "2024-12-20",
        actuelle: false,
        created_at: "2024-10-01T10:00:00.000000Z",
        updated_at: "2024-10-01T10:00:00.000000Z"
      }
    };
    
    setDebugData(testData);
  }, []);

  const renderSafely = (data) => {
    if (typeof data === 'object' && data !== null) {
      // Si c'est un objet, convertir en chaîne ou extraire une propriété utile
      if (data.nom) return data.nom;
      if (data.type) return data.type;
      return JSON.stringify(data);
    }
    return data;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug - Test d'affichage des objets</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-2">Données brutes :</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-2">Affichage sécurisé de la période :</h3>
          {debugData && (
            <div className="space-y-2">
              <div>Période (renderSafely): {renderSafely(debugData.periode)}</div>
              <div>Période.nom: {debugData.periode?.nom || 'Non défini'}</div>
              <div>Type de période: {typeof debugData.periode}</div>
            </div>
          )}
        </div>

        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-medium mb-2">Tests d'affichage :</h3>
          {debugData && (
            <div className="space-y-2">
              {/* Test 1: Affichage direct d'un objet (devrait causer l'erreur) */}
              <div>
                <strong>Test sûr - nom de période:</strong> 
                <span className="ml-2 px-2 py-1 bg-blue-100 rounded">
                  {debugData.periode?.nom}
                </span>
              </div>
              
              {/* Test 2: Affichage conditionnel */}
              <div>
                <strong>Test conditionnel:</strong>
                <span className="ml-2 px-2 py-1 bg-green-100 rounded">
                  {typeof debugData.periode === 'object' ? 
                    debugData.periode.nom : 
                    debugData.periode}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulletinDebug;
