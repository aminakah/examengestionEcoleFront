import React, { useState } from 'react';
import { useStudentData } from '../../hooks/schoolHooks';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/customHooks';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant tableau de bord pour les élèves
 */
export default function StudentDashboard() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('overview'); // overview, grades, bulletins, schedule
  
  // Hook pour les données élève
  const { 
    myGrades, 
    myBulletins, 
    loading, 
    error, 
    refresh 
  } = useStudentData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon Espace Élève</h1>
        <p className="text-gray-600 mt-2">
          Bienvenue {user?.name}, consultez vos résultats scolaires
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <TabButton
              label="Vue d'ensemble"
              icon="📊"
              isActive={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <TabButton
              label="Mes Notes"
              icon="📝"
              isActive={activeTab === 'grades'}
              onClick={() => setActiveTab('grades')}
            />
            <TabButton
              label="Mes Bulletins"
              icon="📋"
              isActive={activeTab === 'bulletins'}
              onClick={() => setActiveTab('bulletins')}
            />
            <TabButton
              label="Planning"
              icon="📅"
              isActive={activeTab === 'schedule'}
              onClick={() => setActiveTab('schedule')}
            />
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab grades={myGrades} bulletins={myBulletins} user={user} />
          )}
          {activeTab === 'grades' && (
            <GradesTab grades={myGrades} />
          )}
          {activeTab === 'bulletins' && (
            <BulletinsTab bulletins={myBulletins} />
          )}
          {activeTab === 'schedule' && (
            <ScheduleTab />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Composant bouton d'onglet
 */
function TabButton({ label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/**
 * Onglet vue d'ensemble
 */
function OverviewTab({ grades, bulletins, user }) {
  // Calculer les statistiques
  const stats = calculateStudentStats(grades, bulletins);
  const recentGrades = grades.slice(0, 6);
  const latestBulletin = bulletins[0];

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Moyenne générale"
          value={stats.generalAverage || 'N/A'}
          icon="📊"
          color="blue"
          subtitle="Ce trimestre"
        />
        <StatCard
          title="Notes saisies"
          value={stats.totalGrades}
          icon="📝"
          color="green"
          subtitle="Total"
        />
        <StatCard
          title="Matières"
          value={stats.subjectsCount}
          icon="📚"
          color="purple"
          subtitle="Étudiées"
        />
        <StatCard
          title="Rang de classe"
          value={stats.classRank || 'N/A'}
          icon="🏆"
          color="orange"
          subtitle="Position"
        />
      </div>

      {/* Graphique de progression */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Évolution des notes</h3>
        <div className="h-64 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📈</div>
            <p>Graphique d'évolution</p>
            <p className="text-sm">Disponible prochainement</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières notes */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Dernières notes</h3>
          {recentGrades.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>Aucune note récente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium text-gray-900">{grade.matiere?.nom}</span>
                    <span className="text-sm text-gray-600 ml-2">({grade.type_note})</span>
                    <div className="text-xs text-gray-500">
                      {new Date(grade.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${
                      parseFloat(grade.note) >= 10 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {grade.note}/20
                    </span>
                    <div className="text-xs text-gray-500">
                      Coef. {grade.coefficient}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dernier bulletin */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Dernier bulletin</h3>
          {!latestBulletin ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p>Aucun bulletin disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{latestBulletin.periode?.nom}</h4>
                    <p className="text-sm text-gray-600">{latestBulletin.annee_scolaire?.nom}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    latestBulletin.statut === 'finalisé' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {latestBulletin.statut}
                  </span>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Moyenne générale</p>
                    <p className={`text-xl font-bold ${
                      parseFloat(latestBulletin.moyenne_generale) >= 10 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {latestBulletin.moyenne_generale}/20
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rang</p>
                    <p className="text-xl font-bold text-purple-600">
                      {latestBulletin.rang || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                📥 Télécharger le bulletin
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conseils et encouragements */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">💡 Conseils pour réussir</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-medium mb-1">Révisions régulières</h4>
            <p className="text-sm text-gray-600">15-20 min par jour</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">❓</div>
            <h4 className="font-medium mb-1">Posez des questions</h4>
            <p className="text-sm text-gray-600">N'hésitez pas en classe</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📝</div>
            <h4 className="font-medium mb-1">Organisez-vous</h4>
            <p className="text-sm text-gray-600">Planning et agenda</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Onglet des notes détaillées
 */
function GradesTab({ grades }) {
  // Grouper les notes par matière
  const gradesBySubject = grades.reduce((acc, grade) => {
    const subject = grade.matiere?.nom || 'Matière inconnue';
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(grade);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Toutes mes notes</h3>
        <div className="text-sm text-gray-600">
          Total: {grades.length} notes
        </div>
      </div>
      
      {Object.keys(gradesBySubject).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune note disponible</h3>
          <p className="text-gray-600">Vos notes apparaîtront ici une fois saisies par vos enseignants</p>
        </div>
      ) : (
        Object.entries(gradesBySubject).map(([subject, subjectGrades]) => {
          const average = calculateSubjectAverage(subjectGrades);
          
          return (
            <div key={subject} className="border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-blue-900">{subject}</h4>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    average >= 10 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Moyenne: {average}/20
                  </div>
                  <div className="text-sm text-gray-600">
                    {subjectGrades.length} note{subjectGrades.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subjectGrades
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((grade, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700">{grade.type_note}</span>
                        <span className={`text-xl font-bold ${
                          parseFloat(grade.note) >= 10 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {grade.note}/20
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Coefficient: {grade.coefficient}</div>
                        <div>Date: {new Date(grade.created_at).toLocaleDateString()}</div>
                      </div>
                      
                      {grade.commentaire && (
                        <div className="mt-2 text-xs text-gray-600 italic border-t pt-2">
                          "{grade.commentaire}"
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/**
 * Onglet des bulletins
 */
function BulletinsTab({ bulletins }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mes bulletins scolaires</h3>
        <div className="text-sm text-gray-600">
          {bulletins.length} bulletin{bulletins.length > 1 ? 's' : ''}
        </div>
      </div>
      
      {bulletins.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bulletin disponible</h3>
          <p className="text-gray-600">Vos bulletins apparaîtront ici une fois générés</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bulletins.map((bulletin) => (
            <div key={bulletin.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{bulletin.periode?.nom}</h4>
                  <p className="text-sm text-gray-600">{bulletin.annee_scolaire?.nom}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  bulletin.statut === 'finalisé' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {bulletin.statut}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Moyenne générale:</span>
                  <span className={`font-bold text-lg ${
                    parseFloat(bulletin.moyenne_generale) >= 10 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {bulletin.moyenne_generale}/20
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Rang de classe:</span>
                  <span className="font-medium">{bulletin.rang || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Moyenne de classe:</span>
                  <span className="font-medium">{bulletin.moyenne_classe || 'N/A'}/20</span>
                </div>
              </div>
              
              {bulletin.observation_conseil && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Observation du conseil:</strong><br />
                    {bulletin.observation_conseil}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  📥 Télécharger
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                  👁️ Aperçu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Onglet planning (placeholder)
 */
function ScheduleTab() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📅</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Planning des cours</h3>
      <p className="text-gray-600 mb-6">Cette fonctionnalité sera disponible prochainement</p>
      
      <div className="bg-gray-100 rounded-lg p-8">
        <p className="text-gray-500">
          Vous pourrez bientôt consulter votre emploi du temps,<br />
          vos devoirs à rendre et vos prochains contrôles.
        </p>
      </div>
    </div>
  );
}

/**
 * Composant carte de statistique
 */
function StatCard({ title, value, icon, color, subtitle }) {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-opacity-90 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-white text-opacity-75 text-xs">{subtitle}</p>}
          </div>
          <div className="text-3xl opacity-80">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Fonctions utilitaires
 */
function calculateStudentStats(grades, bulletins) {
  const stats = {
    totalGrades: grades.length,
    subjectsCount: new Set(grades.map(g => g.matiere?.id)).size
  };

  if (grades.length > 0) {
    const totalPoints = grades.reduce((sum, grade) => {
      return sum + (parseFloat(grade.note) * parseFloat(grade.coefficient));
    }, 0);
    
    const totalCoef = grades.reduce((sum, grade) => {
      return sum + parseFloat(grade.coefficient);
    }, 0);
    
    stats.generalAverage = totalCoef > 0 ? (totalPoints / totalCoef).toFixed(2) : null;
  }

  if (bulletins.length > 0) {
    stats.classRank = bulletins[0].rang;
  }

  return stats;
}

function calculateSubjectAverage(grades) {
  if (grades.length === 0) return 0;
  
  const totalPoints = grades.reduce((sum, grade) => {
    return sum + (parseFloat(grade.note) * parseFloat(grade.coefficient));
  }, 0);
  
  const totalCoef = grades.reduce((sum, grade) => {
    return sum + parseFloat(grade.coefficient);
  }, 0);
  
  return totalCoef > 0 ? (totalPoints / totalCoef).toFixed(2) : 0;
}
