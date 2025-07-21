import React from 'react';
import { useDashboard } from '../../hooks/schoolHooks';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant Dashboard intelligent qui s'adapte au rôle de l'utilisateur
 */
export default function SmartDashboard() {
  const { user } = useAuth();
  const { dashboardData, loading, error, refresh } = useDashboard();

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
      case 'admin':
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
function AdminDashboard({ data }) {
  const stats = data?.roleSpecific || {};

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Élèves"
          value={stats.totalStudents || 0}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Enseignants"
          value={stats.totalTeachers || 0}
          icon="👨‍🏫"
          color="green"
        />
        <StatCard
          title="Classes"
          value={stats.totalClasses || 0}
          icon="🏫"
          color="purple"
        />
        <StatCard
          title="Matières"
          value={stats.totalSubjects || 0}
          icon="📚"
          color="orange"
        />
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Inscriptions par mois</h3>
          {/* Placeholder pour graphique */}
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            Graphique des inscriptions
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition par niveau</h3>
          {/* Placeholder pour graphique */}
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            Graphique par niveau
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            title="Nouvel élève"
            icon="➕"
            href="/eleves/nouveau"
          />
          <QuickActionButton
            title="Nouvelle classe"
            icon="🏫"
            href="/classes/nouvelle"
          />
          <QuickActionButton
            title="Générer bulletins"
            icon="📋"
            href="/bulletins/generer"
          />
          <QuickActionButton
            title="Rapports"
            icon="📊"
            href="/rapports"
          />
        </div>
      </div>
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

  return (
    <div className="space-y-6">
      {/* Mes enfants */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Mes enfants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.myChildren?.map((child) => (
            <div key={child.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{child.nom} {child.prenom}</h4>
                  <p className="text-sm text-gray-600">{child.classe}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">
                    {child.moyenne || 'N/A'}
                  </span>
                  <div className="text-xs text-gray-500">Moyenne</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full text-left text-blue-600 text-sm hover:underline">
                  Voir les notes
                </button>
                <button className="w-full text-left text-green-600 text-sm hover:underline">
                  Télécharger bulletin
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
function StatCard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${colorClasses[color]} rounded-lg p-3 text-white text-2xl`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
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
