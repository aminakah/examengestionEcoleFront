import React from 'react';
import { useDashboard } from '../../hooks/schoolHooks';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import { da } from 'date-fns/locale';
import AdminDashboard from './AdminDashboardOptimized';

/**
 * Composant Dashboard intelligent qui s'adapte au rôle de l'utilisateur
 */
export default function SmartDashboard() {
  const { user } = useAuth();
  const { dashboardData, loading, error, refresh } = useDashboard();
  console.log(dashboardData)

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Erreur de chargement</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refresh}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Rendu spécifique selon le rôle
  const renderRoleSpecificDashboard = () => {
    switch (user?.role) {
      case 'administrateur':
        return <AdminDashboard data={dashboardData} />;
      case 'enseignant':
        return <TeacherDashboard data={dashboardData} />;
      case 'eleve':
        return <StudentDashboard data={dashboardData} />;
      case 'parent':
        return <ParentDashboard data={dashboardData} />;
      default:
        return <DefaultDashboard data={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec informations utilisateur */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                Bienvenue, {user?.name} ({user?.role})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refresh}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderRoleSpecificDashboard()}
      </div>
    </div>
  );
}

/**
 * Dashboard Administrateur
 */
function AdminDasshboard({ data }) {
  const stats = data?.main?.totaux || {};
  const academicStats = data?.activite_recente || {};
  const classAverages = data?.classAverages || [];
  const gradeStats = data?.gradeStats || {};
  const recentActivity = data?.recentActivity || [];
  
  console.log('Admin Dashboard Data:', data);

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Élèves"
          value={stats.eleves || 0}
          icon="👥"
          color="blue"
          subtitle="Inscrits cette année"
        />
        <StatCard
          title="Enseignants"
          value={stats.enseignants || 0}
          icon="👨‍🏫"
          color="green"
          subtitle="Corps enseignant"
        />
        <StatCard
          title="Classes"
          value={stats.classes || 0}
          icon="🏫"
          color="purple"
          subtitle="Tous niveaux"
        />
        <StatCard
          title="Matières"
          value={stats.matieres || 0}
          icon="📚"
          color="orange"
          subtitle="Enseignées"
        />
      </div>

      {/* Statistiques académiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Globale</h3>
            <span className="text-3xl">📊</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Moyenne générale</span>
              <span className="font-bold text-xl text-blue-600">
                {academicStats.averageGeneral || 'N/A'}/20
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taux de réussite</span>
              <span className="font-bold text-green-600">
                {academicStats.successRate || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Élèves en difficulté</span>
              <span className="font-bold text-red-600">
                {academicStats.strugglingStudents || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Notes Saisies</h3>
            <span className="text-3xl">✏️</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Ce mois</span>
              <span className="font-bold text-xl text-blue-600">
                {gradeStats.thisMonth || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cette semaine</span>
              <span className="font-bold text-green-600">
                {gradeStats.thisWeek || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Aujourd'hui</span>
              <span className="font-bold text-purple-600">
                {gradeStats.today || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activité Récente</h3>
            <span className="text-3xl">🔄</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Nouvelles inscriptions</span>
              <span className="font-medium text-blue-600">
                +{academicStats.newEnrollments || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bulletins générés</span>
              <span className="font-medium text-green-600">
                {academicStats.reportsGenerated || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Alertes actives</span>
              <span className="font-medium text-red-600">
                {academicStats.activeAlerts || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Moyennes par classe */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Moyennes Générales par Classe</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Voir détails
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élèves
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moyenne
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Évolution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classAverages.length > 0 ? classAverages.map((classe, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{classe.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{classe.niveau}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{classe.effectif || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-bold ${
                        classe.moyenne >= 12 ? 'text-green-600' : 
                        classe.moyenne >= 10 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {classe.moyenne ? `${classe.moyenne}/20` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${classe.evolution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {classe.evolution ? `${classe.evolution > 0 ? '+' : ''}${classe.evolution}` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        classe.moyenne >= 12 ? 'bg-green-100 text-green-800' : 
                        classe.moyenne >= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {classe.moyenne >= 12 ? 'Excellent' : 
                         classe.moyenne >= 10 ? 'Moyen' : 'À surveiller'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Aucune donnée disponible pour le moment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Graphiques de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Évolution des Notes (6 derniers mois)</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <div className="text-gray-600">Graphique d'évolution des notes</div>
              <div className="text-sm text-gray-500 mt-1">À intégrer avec Chart.js</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition des Notes</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-gray-600">Distribution des notes par tranche</div>
              <div className="text-sm text-gray-500 mt-1">0-10, 10-14, 14-16, 16-20</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides administrateur */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Actions Administratives</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <QuickActionButton
            title="Nouvel élève"
            icon="👤"
            href="/admin/eleves/nouveau"
          />
          <QuickActionButton
            title="Nouvelle classe"
            icon="🏫"
            href="/admin/classes/nouvelle"
          />
          <QuickActionButton
            title="Ajouter enseignant"
            icon="👨‍🏫"
            href="/admin/enseignants/nouveau"
          />
          <QuickActionButton
            title="Gérer matières"
            icon="📚"
            href="/admin/matieres"
          />
          <QuickActionButton
            title="Bulletins"
            icon="📋"
            href="/admin/bulletins"
          />
          <QuickActionButton
            title="Rapports"
            icon="📊"
            href="/admin/rapports"
          />
        </div>
      </div>

      {/* Alertes et notifications */}
      {academicStats.activeAlerts > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Attention :</span> {academicStats.activeAlerts} alerte(s) nécessite(nt) votre attention.
              </p>
              <div className="mt-2">
                <button className="text-yellow-700 hover:text-yellow-600 text-sm font-medium underline">
                  Voir les alertes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Dashboard Enseignant
 */
function TeacherDashboard({ data }) {
  const stats = data?.roleSpecific || {};

  return (
    <div className="space-y-6">
      {/* Statistiques enseignant */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Mes classes"
          value={stats.myClassesCount || 0}
          icon="🏫"
          color="blue"
        />
        <StatCard
          title="Élèves"
          value={stats.myStudentsCount || 0}
          icon="👥"
          color="green"
        />
        <StatCard
          title="Notes saisies"
          value={stats.gradesEnteredCount || 0}
          icon="📝"
          color="purple"
        />
      </div>

      {/* Mes classes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mes classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.myClasses?.map((classe) => (
            <div key={classe.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900">{classe.nom}</h4>
              <p className="text-sm text-gray-600">{classe.niveau}</p>
              <p className="text-sm text-gray-600">{classe.studentsCount || 0} élèves</p>
              <div className="mt-2 space-x-2">
                <button className="text-blue-600 text-sm hover:underline">
                  Saisir notes
                </button>
                <button className="text-green-600 text-sm hover:underline">
                  Voir élèves
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            title="Saisir notes"
            icon="📝"
            href="/notes/saisie"
          />
          <QuickActionButton
            title="Mes élèves"
            icon="👥"
            href="/mes-eleves"
          />
          <QuickActionButton
            title="Planning"
            icon="📅"
            href="/planning"
          />
          <QuickActionButton
            title="Bulletins"
            icon="📋"
            href="/bulletins"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Élève
 */
function StudentDashboard({ data }) {
  const stats = data?.roleSpecific || {};

  return (
    <div className="space-y-6">
      {/* Statistiques élève */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Moyenne générale"
          value={stats.generalAverage || 'N/A'}
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Notes ce trimestre"
          value={stats.gradesThisPeriod || 0}
          icon="📝"
          color="green"
        />
        <StatCard
          title="Rang de classe"
          value={stats.classRank || 'N/A'}
          icon="🏆"
          color="purple"
        />
      </div>

      {/* Dernières notes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Dernières notes</h3>
        <div className="space-y-3">
          {stats.recentGrades?.map((grade, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{grade.matiere}</span>
                <span className="text-sm text-gray-600 ml-2">({grade.type})</span>
              </div>
              <div className="text-right">
                <span className={`font-bold ${grade.note >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                  {grade.note}/20
                </span>
                <div className="text-xs text-gray-500">{grade.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mes outils</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            title="Mes notes"
            icon="📝"
            href="/mes-notes"
          />
          <QuickActionButton
            title="Mes bulletins"
            icon="📋"
            href="/mes-bulletins"
          />
          <QuickActionButton
            title="Planning"
            icon="📅"
            href="/planning"
          />
          <QuickActionButton
            title="Devoirs"
            icon="📚"
            href="/devoirs"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Parent
 */
function ParentDashboard({ data }) {
  const stats = data?.roleSpecific || {};
  console.log(stats)

  return (
    <div className="space-y-6">
      {/* Mes enfants */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mes eenfants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.enfants_details?.map((child) => (
            <div key={child.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{child.nom} {child.prenom}</h4>
                  <p className="text-sm text-gray-600">{child.classe}</p>
                  <p className="text-sm text-gray-600">{child.derniere_periode}</p>
                 

                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">
                    {child.moyenne_generale
 || 'N/A'}
                  </span>
                  <div className="text-xs text-gray-500">Moyenne</div>

                </div>
              </div>
              
              
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            title="Notes enfants"
            icon="📝"
            href="/enfants/notes"
          />
          <QuickActionButton
            title="Bulletins"
            icon="📋"
            href="/enfants/bulletins"
          />
          <QuickActionButton
            title="Rendez-vous"
            icon="📅"
            href="/rendez-vous"
          />
          <QuickActionButton
            title="Messages"
            icon="💬"
            href="/messages"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard par défaut
 */
function DefaultDashboard({ data }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900">
        Tableau de bord en cours de configuration
      </h2>
      <p className="text-gray-600 mt-2">
        Votre rôle n'est pas encore configuré pour ce tableau de bord.
      </p>
    </div>
  );
}

/**
 * Composant carte de statistique
 */
function StatCard({ title, value, icon, color = 'blue', subtitle }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <div className={`${colorClasses[color]} rounded-lg p-3 text-white text-2xl`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Composant bouton d'action rapide
 */
function QuickActionButton({ title, icon, href, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      // Navigation vers l'URL
      window.location.href = href;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
    </button>
  );
}
