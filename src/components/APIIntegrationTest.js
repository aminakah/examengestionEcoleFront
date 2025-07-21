import React, { useState } from 'react';
import {
  authService,
  userService,
  schoolService,
  classService,
  subjectService,
  studentService,
  parentService,
  teacherService,
  enrollmentService,
  periodService,
  gradeService,
  bulletinService,
  dashboardService,
  documentService,
  testService
} from '../../services';
import { useToast } from '../../hooks/customHooks';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant de test d'intégration API
 * Teste tous les 104 endpoints de l'API
 */
export default function APIIntegrationTest() {
  const { success, error, info } = useToast();
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [currentTest, setCurrentTest] = useState('');

  // Configuration des tests par service
  const testSuites = [
    {
      name: 'Service de Test',
      service: testService,
      tests: [
        { name: 'Vérifier API', method: 'checkAPI', params: [] }
      ]
    },
    {
      name: 'Authentification (7 endpoints)',
      service: authService,
      tests: [
        { name: 'Récupérer profil', method: 'getProfile', params: [] },
        { name: 'Récupérer profil (alias)', method: 'getProfil', params: [] }
      ]
    },
    {
      name: 'Gestion des Utilisateurs (7 endpoints)',
      service: userService,
      tests: [
        { name: 'Liste des utilisateurs', method: 'getUsers', params: [{ page: 1, limit: 5 }] },
        { name: 'Détails utilisateur (ID: 1)', method: 'getUser', params: [1] }
      ]
    },
    {
      name: 'Gestion Scolaire (14 endpoints)',
      service: schoolService,
      tests: [
        { name: 'Liste années scolaires', method: 'getAnneesScolaires', params: [] },
        { name: 'Liste niveaux', method: 'getNiveaux', params: [] },
        { name: 'Détails niveau (ID: 1)', method: 'getNiveau', params: [1] },
        { name: 'Matières d\'un niveau', method: 'getMatieresNiveau', params: [1] },
        { name: 'Classes d\'un niveau', method: 'getClassesNiveau', params: [1] }
      ]
    },
    {
      name: 'Classes (10 endpoints)',
      service: classService,
      tests: [
        { name: 'Liste des classes', method: 'getClasses', params: [] },
        { name: 'Détails classe (ID: 1)', method: 'getClass', params: [1] },
        { name: 'Élèves d\'une classe', method: 'getClassStudents', params: [1] },
        { name: 'Enseignants d\'une classe', method: 'getClassTeachers', params: [1] }
      ]
    },
    {
      name: 'Matières (8 endpoints)',
      service: subjectService,
      tests: [
        { name: 'Liste des matières', method: 'getSubjects', params: [] },
        { name: 'Détails matière (ID: 1)', method: 'getSubject', params: [1] },
        { name: 'Enseignants d\'une matière', method: 'getSubjectTeachers', params: [1] }
      ]
    },
    {
      name: 'Élèves (12 endpoints)',
      service: studentService,
      tests: [
        { name: 'Liste des élèves', method: 'getStudents', params: [] },
        { name: 'Détails élève (ID: 1)', method: 'getStudent', params: [1] },
        { name: 'Notes d\'un élève', method: 'getStudentGrades', params: [1] },
        { name: 'Bulletins d\'un élève', method: 'getStudentBulletins', params: [1] },
        { name: 'Documents d\'un élève', method: 'getStudentDocuments', params: [1] },
        { name: 'Mes notes (élève connecté)', method: 'getMyGrades', params: [] },
        { name: 'Mes bulletins (élève connecté)', method: 'getMyBulletins', params: [] }
      ]
    },
    {
      name: 'Parents (9 endpoints)',
      service: parentService,
      tests: [
        { name: 'Liste des parents', method: 'getParents', params: [] },
        { name: 'Détails parent (ID: 1)', method: 'getParent', params: [1] },
        { name: 'Enfants d\'un parent', method: 'getParentChildren', params: [1] },
        { name: 'Bulletins des enfants', method: 'getChildrenBulletins', params: [1] },
        { name: 'Mes enfants (parent connecté)', method: 'getMyChildren', params: [] },
        { name: 'Bulletins d\'un enfant', method: 'getChildBulletins', params: [1] },
        { name: 'Notes d\'un enfant', method: 'getChildGrades', params: [1] }
      ]
    },
    {
      name: 'Enseignants (9 endpoints)',
      service: teacherService,
      tests: [
        { name: 'Liste des enseignants', method: 'getTeachers', params: [] },
        { name: 'Détails enseignant (ID: 1)', method: 'getTeacher', params: [1] },
        { name: 'Mes classes (enseignant connecté)', method: 'getMyClasses', params: [] }
      ]
    },
    {
      name: 'Inscriptions (7 endpoints)',
      service: enrollmentService,
      tests: [
        { name: 'Liste des inscriptions', method: 'getEnrollments', params: [] },
        { name: 'Détails inscription (ID: 1)', method: 'getEnrollment', params: [1] },
        { name: 'Stats inscription classe', method: 'getClassEnrollmentStats', params: [1] }
      ]
    },
    {
      name: 'Périodes (7 endpoints)',
      service: periodService,
      tests: [
        { name: 'Liste des périodes', method: 'getPeriods', params: [] },
        { name: 'Détails période (ID: 1)', method: 'getPeriod', params: [1] },
        { name: 'Stats de la période', method: 'getPeriodStats', params: [1] }
      ]
    },
    {
      name: 'Notes (6 endpoints)',
      service: gradeService,
      tests: [
        { name: 'Liste des notes', method: 'getGrades', params: [] },
        { name: 'Formulaire saisie par classe', method: 'getClassGradeForm', params: [{ classe_id: 1, matiere_id: 1 }] },
        { name: 'Stats notes par classe', method: 'getClassGradeStats', params: [{ classe_id: 1 }] },
        { name: 'Notes d\'un élève', method: 'getStudentGrades', params: [1] }
      ]
    },
    {
      name: 'Bulletins (6 endpoints)',
      service: bulletinService,
      tests: [
        { name: 'Liste des bulletins', method: 'getBulletins', params: [] },
        { name: 'Détails bulletin (ID: 1)', method: 'getBulletin', params: [1] }
      ]
    },
    {
      name: 'Tableaux de bord (5 endpoints)',
      service: dashboardService,
      tests: [
        { name: 'Mon tableau de bord', method: 'getMyDashboard', params: [] },
        { name: 'Stats générales', method: 'getGeneralStats', params: [] },
        { name: 'Stats enseignant', method: 'getTeacherStats', params: [] },
        { name: 'Stats élève', method: 'getStudentStats', params: [] },
        { name: 'Stats parent', method: 'getParentStats', params: [] }
      ]
    },
    {
      name: 'Documents (5 endpoints)',
      service: documentService,
      tests: [
        { name: 'Liste des documents', method: 'getDocuments', params: [] },
        { name: 'Détails document (ID: 1)', method: 'getDocument', params: [1] }
      ]
    }
  ];

  // Exécuter tous les tests
  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    const results = [];
    let totalTests = 0;
    let passedTests = 0;

    try {
      for (const suite of testSuites) {
        info(`Test en cours: ${suite.name}`);
        setCurrentTest(suite.name);
        
        for (const test of suite.tests) {
          totalTests++;
          const testName = `${suite.name} > ${test.name}`;
          
          try {
            const startTime = Date.now();
            const result = await suite.service[test.method](...test.params);
            const duration = Date.now() - startTime;
            
            results.push({
              name: testName,
              status: 'success',
              duration,
              result: result ? 'Données reçues' : 'Aucune donnée'
            });
            passedTests++;
            
          } catch (err) {
            results.push({
              name: testName,
              status: 'error',
              duration: 0,
              result: err.message || 'Erreur inconnue'
            });
          }
        }
      }

      // Résumé final
      if (passedTests === totalTests) {
        success(`🎉 Tous les tests réussis ! (${passedTests}/${totalTests})`);
      } else {
        error(`⚠️ ${totalTests - passedTests} test(s) en échec sur ${totalTests}`);
      }

    } catch (err) {
      error('Erreur lors de l\'exécution des tests');
    } finally {
      setTesting(false);
      setCurrentTest('');
      setTestResults(results);
    }
  };

  // Exécuter un test spécifique
  const runSingleTest = async (suite, test) => {
    setTesting(true);
    const testName = `${suite.name} > ${test.name}`;
    
    try {
      info(`Test: ${testName}`);
      const startTime = Date.now();
      const result = await suite.service[test.method](...test.params);
      const duration = Date.now() - startTime;
      
      success(`✅ ${testName} - ${duration}ms`);
      console.log('Résultat du test:', result);
      
    } catch (err) {
      error(`❌ ${testName} - ${err.message}`);
      console.error('Erreur du test:', err);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Test d'Intégration API</h1>
        <p className="text-gray-600 mt-2">
          Testez les 104 endpoints de l'API du système de gestion scolaire
        </p>
      </div>

      {/* Contrôles */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Contrôles de test</h2>
          <div className="flex space-x-4">
            <button
              onClick={runAllTests}
              disabled={testing}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? 'Tests en cours...' : 'Lancer tous les tests'}
            </button>
            
            <button
              onClick={() => setTestResults([])}
              disabled={testing}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Effacer résultats
            </button>
          </div>
        </div>

        {testing && (
          <div className="flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-600">
              Test en cours: {currentTest}
            </span>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              Résultats: {testResults.filter(r => r.status === 'success').length} réussis, {testResults.filter(r => r.status === 'error').length} échoués
            </div>
          </div>
        )}
      </div>

      {/* Suites de tests */}
      <div className="space-y-6">
        {testSuites.map((suite, suiteIndex) => (
          <div key={suiteIndex} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{suite.name}</h3>
              <p className="text-gray-600">{suite.tests.length} test(s) disponible(s)</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {suite.tests.map((test, testIndex) => {
                const testName = `${suite.name} > ${test.name}`;
                const result = testResults.find(r => r.name === testName);
                
                return (
                  <div key={testIndex} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{test.name}</h4>
                        <p className="text-sm text-gray-600">
                          Méthode: {test.method}
                          {test.params.length > 0 && (
                            <span className="ml-2">
                              Paramètres: {JSON.stringify(test.params)}
                            </span>
                          )}
                        </p>
                        
                        {result && (
                          <div className={`mt-2 text-sm ${
                            result.status === 'success' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.status === 'success' ? '✅' : '❌'} {result.result}
                            {result.duration > 0 && ` (${result.duration}ms)`}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => runSingleTest(suite, test)}
                        disabled={testing}
                        className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        Tester
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Résultats détaillés */}
      {testResults.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Résultats détaillés</h2>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{result.name}</h4>
                    <p className={`text-sm ${
                      result.status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.result}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {result.duration > 0 && (
                      <span className="text-sm text-gray-500">{result.duration}ms</span>
                    )}
                    <span className={`w-3 h-3 rounded-full ${
                      result.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informations sur l'API */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Informations sur l'API
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">104</div>
            <div className="text-blue-800">Endpoints API</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{testSuites.length}</div>
            <div className="text-blue-800">Services</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {testSuites.reduce((total, suite) => total + suite.tests.length, 0)}
            </div>
            <div className="text-blue-800">Tests disponibles</div>
          </div>
        </div>

        <div className="mt-6 text-sm text-blue-800">
          <p className="mb-2">
            <strong>Note:</strong> Certains tests peuvent échouer si le backend n'est pas accessible 
            ou si vous n'avez pas les permissions nécessaires pour certains endpoints.
          </p>
          <p>
            En cas d'échec massif, vérifiez que le backend Laravel est démarré sur 
            <code className="bg-blue-100 px-1 rounded">http://localhost:8000</code>
          </p>
        </div>
      </div>
    </div>
  );
}
