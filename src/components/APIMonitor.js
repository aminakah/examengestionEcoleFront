import React, { useState, useEffect } from 'react';
import { 
  authService, 
  userService, 
  studentService, 
  teacherService, 
  classService,
  subjectService,
  gradeService,
  bulletinService,
  dashboardService,
  testService 
} from '../../services';
import { useToast } from '../../hooks/customHooks';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant de monitoring des APIs en temps réel
 */
export default function APIMonitor() {
  const { success, error: showError } = useToast();
  
  const [monitoring, setMonitoring] = useState(false);
  const [apiHealth, setApiHealth] = useState({});
  const [performanceStats, setPerformanceStats] = useState({});
  const [realtimeData, setRealtimeData] = useState({
    requestCount: 0,
    errorCount: 0,
    averageResponseTime: 0,
    lastUpdate: null
  });

  // Configuration des services à monitorer
  const monitoredServices = [
    { name: 'Authentification', service: authService, key: 'auth', endpoints: ['getProfile'] },
    { name: 'Utilisateurs', service: userService, key: 'users', endpoints: ['getUsers'] },
    { name: 'Élèves', service: studentService, key: 'students', endpoints: ['getStudents'] },
    { name: 'Enseignants', service: teacherService, key: 'teachers', endpoints: ['getTeachers'] },
    { name: 'Classes', service: classService, key: 'classes', endpoints: ['getClasses'] },
    { name: 'Matières', service: subjectService, key: 'subjects', endpoints: ['getSubjects'] },
    { name: 'Notes', service: gradeService, key: 'grades', endpoints: ['getGrades'] },
    { name: 'Bulletins', service: bulletinService, key: 'bulletins', endpoints: ['getBulletins'] },
    { name: 'Dashboard', service: dashboardService, key: 'dashboard', endpoints: ['getMyDashboard'] },
    { name: 'Test API', service: testService, key: 'test', endpoints: ['checkAPI'] }
  ];

  // Vérifier la santé d'un service
  const checkServiceHealth = async (serviceConfig) => {
    const results = {};
    
    for (const endpoint of serviceConfig.endpoints) {
      const startTime = performance.now();
      
      try {
        await serviceConfig.service[endpoint]();
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        results[endpoint] = {
          status: 'healthy',
          responseTime: Math.round(responseTime),
          lastCheck: new Date().toISOString()
        };
      } catch (error) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        results[endpoint] = {
          status: 'error',
          responseTime: Math.round(responseTime),
          error: error.message,
          lastCheck: new Date().toISOString()
        };
      }
    }
    
    return results;
  };

  // Vérifier tous les services
  const checkAllServices = async () => {
    const healthResults = {};
    const performanceResults = {};
    
    for (const serviceConfig of monitoredServices) {
      const serviceHealth = await checkServiceHealth(serviceConfig);
      healthResults[serviceConfig.key] = {
        name: serviceConfig.name,
        endpoints: serviceHealth,
        overallStatus: Object.values(serviceHealth).every(r => r.status === 'healthy') ? 'healthy' : 'degraded'
      };
      
      // Calculer les métriques de performance
      const responseTimes = Object.values(serviceHealth).map(r => r.responseTime);
      performanceResults[serviceConfig.key] = {
        averageResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
        minResponseTime: Math.min(...responseTimes),
        maxResponseTime: Math.max(...responseTimes),
        successRate: Object.values(serviceHealth).filter(r => r.status === 'healthy').length / Object.values(serviceHealth).length * 100
      };
    }
    
    setApiHealth(healthResults);
    setPerformanceStats(performanceResults);
    
    // Mettre à jour les statistiques en temps réel
    const totalRequests = Object.keys(healthResults).length;
    const errorCount = Object.values(healthResults).filter(s => s.overallStatus === 'degraded').length;
    const allResponseTimes = Object.values(performanceResults).map(p => p.averageResponseTime);
    const avgResponseTime = allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length;
    
    setRealtimeData(prev => ({
      requestCount: prev.requestCount + totalRequests,
      errorCount: prev.errorCount + errorCount,
      averageResponseTime: Math.round(avgResponseTime),
      lastUpdate: new Date().toISOString()
    }));
  };

  // Démarrer le monitoring
  const startMonitoring = () => {
    setMonitoring(true);
    success('Monitoring démarré');
    
    // Vérification initiale
    checkAllServices();
    
    // Vérifications périodiques toutes les 30 secondes
    const interval = setInterval(checkAllServices, 30000);
    
    return () => clearInterval(interval);
  };

  // Arrêter le monitoring
  const stopMonitoring = () => {
    setMonitoring(false);
    success('Monitoring arrêté');
  };

  // Réinitialiser les statistiques
  const resetStats = () => {
    setRealtimeData({
      requestCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      lastUpdate: null
    });
    setApiHealth({});
    setPerformanceStats({});
    success('Statistiques réinitialisées');
  };

  // Test de charge
  const runLoadTest = async () => {
    try {
      showError('Démarrage du test de charge...');
      
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(testService.checkAPI());
      }
      
      const startTime = performance.now();
      await Promise.all(promises);
      const endTime = performance.now();
      
      success(`Test de charge terminé en ${Math.round(endTime - startTime)}ms`);
    } catch (error) {
      showError('Erreur durant le test de charge');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Monitoring des APIs</h1>
        <p className="text-gray-600 mt-2">
          Surveillez la santé et les performances des 104 endpoints API
        </p>
      </div>

      {/* Contrôles */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${monitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="font-medium">
              {monitoring ? 'Monitoring actif' : 'Monitoring inactif'}
            </span>
          </div>
          
          <div className="flex space-x-3">
            {!monitoring ? (
              <button
                onClick={startMonitoring}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              >
                Démarrer
              </button>
            ) : (
              <button
                onClick={stopMonitoring}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
              >
                Arrêter
              </button>
            )}
            
            <button
              onClick={checkAllServices}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Vérifier maintenant
            </button>
            
            <button
              onClick={runLoadTest}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
            >
              Test de charge
            </button>
            
            <button
              onClick={resetStats}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Métriques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Requêtes totales"
          value={realtimeData.requestCount}
          icon="📊"
          color="blue"
        />
        <MetricCard
          title="Erreurs"
          value={realtimeData.errorCount}
          icon="⚠️"
          color="red"
        />
        <MetricCard
          title="Temps de réponse moyen"
          value={`${realtimeData.averageResponseTime}ms`}
          icon="⚡"
          color="green"
        />
        <MetricCard
          title="Dernière vérification"
          value={realtimeData.lastUpdate ? new Date(realtimeData.lastUpdate).toLocaleTimeString() : 'Jamais'}
          icon="🕒"
          color="purple"
        />
      </div>

      {/* État des services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {Object.entries(apiHealth).map(([key, service]) => (
          <ServiceHealthCard key={key} service={service} performance={performanceStats[key]} />
        ))}
      </div>

      {/* Graphique de performance (placeholder) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance dans le temps</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📈</div>
            <p>Graphique de performance</p>
            <p className="text-sm">(Implémentation avec Chart.js recommandée)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Carte de métrique
 */
function MetricCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}

/**
 * Carte de santé de service
 */
function ServiceHealthCard({ service, performance }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getStatusIcon(service.overallStatus)}</span>
          <span className={`font-medium ${getStatusColor(service.overallStatus)}`}>
            {service.overallStatus === 'healthy' ? 'Opérationnel' : 'Dégradé'}
          </span>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-2 mb-4">
        {Object.entries(service.endpoints).map(([endpoint, data]) => (
          <div key={endpoint} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{endpoint}</span>
            <div className="flex items-center space-x-2">
              <span className={getStatusColor(data.status)}>
                {data.responseTime}ms
              </span>
              <span className="text-lg">{getStatusIcon(data.status)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Métriques de performance */}
      {performance && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Temps moyen:</span>
              <span className="font-medium ml-1">{performance.averageResponseTime}ms</span>
            </div>
            <div>
              <span className="text-gray-600">Taux de succès:</span>
              <span className="font-medium ml-1">{Math.round(performance.successRate)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Min:</span>
              <span className="font-medium ml-1">{performance.minResponseTime}ms</span>
            </div>
            <div>
              <span className="text-gray-600">Max:</span>
              <span className="font-medium ml-1">{performance.maxResponseTime}ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook pour le monitoring en temps réel
 */
export const useAPIMonitoring = () => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);

  const quickHealthCheck = async () => {
    try {
      const startTime = performance.now();
      await testService.checkAPI();
      const endTime = performance.now();
      
      setIsHealthy(true);
      setLastCheck({
        timestamp: new Date().toISOString(),
        responseTime: Math.round(endTime - startTime),
        status: 'healthy'
      });
    } catch (error) {
      setIsHealthy(false);
      setLastCheck({
        timestamp: new Date().toISOString(),
        responseTime: null,
        status: 'error',
        error: error.message
      });
    }
  };

  useEffect(() => {
    // Vérification initiale
    quickHealthCheck();
    
    // Vérifications périodiques toutes les 5 minutes
    const interval = setInterval(quickHealthCheck, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    isHealthy,
    lastCheck,
    quickHealthCheck
  };
};
