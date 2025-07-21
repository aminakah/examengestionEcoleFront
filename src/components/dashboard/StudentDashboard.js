import React, { useState, useEffect } from 'react';
import { useStudentData } from '../../hooks/schoolHooks';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/customHooks';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant dashboard pour les élèves
 */
export default function StudentDashboard() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { myGrades, myBulletins, loading, error: dataError, refresh } = useStudentData();
  
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [gradeStats, setGradeStats] = useState({});

  // Calculer les statistiques des notes
  useEffect(() => {
    if (myGrades && myGrades.length > 0) {
      const filteredGrades = selectedPeriod 
        ? myGrades.filter(grade => grade.periode_id === selectedPeriod)
        : myGrades;

      const average = filteredGrades.reduce((sum, grade) => sum + parseFloat(grade.note), 0) / filteredGrades.length;
      const minGrade = Math.min(...filteredGrades.map(g => parseFloat(g.note)));
      const maxGrade = Math.max(...filteredGrades.map(g => parseFloat(g.note)));
      
      // Statistiques par matière
      const gradesBySubject = filteredGrades.reduce((acc, grade) => {
        const subject = grade.matiere?.nom || 'Non défini';
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push(parseFloat(grade.note));
        return acc;
      }, {});

      const subjectAverages = Object.entries(gradesBySubject).map(([subject, grades]) => ({
        subject,
        average: (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(2),
        count: grades.length
      }));

      setGradeStats({
        overall: average.toFixed(2),
        min: minGrade,
        max: maxGrade,
        count: filteredGrades.length,
        subjects: subjectAverages
      });
    }
  }, [myGrades, selectedPeriod]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Erreur de chargement</div>
          <p className="text-gray-600 mb-4">{dataError}</p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header avec informations élève */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bonjour {user?.name} ! 👋</h1>
            <p className="text-blue-100 mt-2">Voici un aperçu de vos résultats scolaires</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{gradeStats.overall || '--'}</div>
            <div className="text-blue-100">Moyenne générale</div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Moyenne générale"
          value={gradeStats.overall || '--'}
          subtitle="/20"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Meilleure note"
          value={gradeStats.max || '--'}
          subtitle="/20"
          icon="🌟"
          color="green"
        />
        <StatCard
          title="Notes ce trimestre"
          value={gradeStats.count || 0}
          subtitle="notes"
          icon="📝"
          color="purple"
        />
        <StatCard
          title="Bulletins"
          value={myBulletins?.length || 0}
          subtitle="disponibles"
          icon="📋"
          color="orange"
        />
      </div>

      {/* Moyennes par matière */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Mes matières</h2>
          <p className="text-gray-600">Moyennes par matière</p>
        </div>
        
        <div className="p-6">
          {gradeStats.subjects && gradeStats.subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gradeStats.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{subject.subject}</h3>
                      <p className="text-sm text-gray-600">{subject.count} note(s)</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        parseFloat(subject.average) >= 10 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subject.average}
                      </div>
                      <div className="text-sm text-gray-500">/20</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Aucune note disponible pour le moment
            </div>
          )}
        </div>
      </div>

      {/* Dernières notes */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Dernières notes</h2>
          <p className="text-gray-600">Vos notes les plus récentes</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {myGrades && myGrades.length > 0 ? (
            myGrades.slice(0, 5).map((grade, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {grade.matiere?.nom || 'Matière non définie'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {grade.type_note} • {grade.periode?.nom || 'Période non définie'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(grade.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        parseFloat(grade.note) >= 10 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {grade.note}
                      </div>
                      <div className="text-sm text-gray-500">
                        /20 (coef. {grade.coefficient})
                      </div>
                    </div>
                    
                    <div className={`w-3 h-3 rounded-full ${
                      parseFloat(grade.note) >= 16 ? 'bg-green-500' :
                      parseFloat(grade.note) >= 12 ? 'bg-blue-500' :
                      parseFloat(grade.note) >= 10 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                  </div>
                </div>
                
                {grade.commentaire && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{grade.commentaire}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              Aucune note disponible
            </div>
          )}
        </div>
        
        {myGrades && myGrades.length > 5 && (
          <div className="p-4 bg-gray-50 text-center">
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Voir toutes mes notes ({myGrades.length})
            </button>
          </div>
        )}
      </div>

      {/* Mes bulletins */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Mes bulletins</h2>
          <p className="text-gray-600">Téléchargez vos bulletins de notes</p>
        </div>
        
        <div className="p-6">
          {myBulletins && myBulletins.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBulletins.map((bulletin, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {bulletin.periode?.nom || `Bulletin ${index + 1}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {bulletin.annee_scolaire?.nom || 'Année en cours'}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Disponible
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        // Logique de téléchargement
                        success('Téléchargement du bulletin en cours...');
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      📄 Télécharger PDF
                    </button>
                    
                    <button
                      onClick={() => {
                        // Logique de visualisation
                      }}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      👁️ Visualiser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">📋</div>
              <p>Aucun bulletin disponible pour le moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            title="Mes notes"
            icon="📝"
            description="Voir toutes mes notes"
            onClick={() => {}}
          />
          <QuickActionButton
            title="Planning"
            icon="📅"
            description="Mon emploi du temps"
            onClick={() => {}}
          />
          <QuickActionButton
            title="Devoirs"
            icon="📚"
            description="Mes devoirs à faire"
            onClick={() => {}}
          />
          <QuickActionButton
            title="Messages"
            icon="✉️"
            description="Messagerie"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Composant carte de statistique
 */
function StatCard({ title, value, subtitle, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm opacity-75">{subtitle}</p>
          </div>
        </div>
        <div className="text-3xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * Composant bouton d'action rapide
 */
function QuickActionButton({ title, icon, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-6 text-center transition-all duration-200 group"
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="font-medium text-gray-900 mb-1">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </button>
  );
}
