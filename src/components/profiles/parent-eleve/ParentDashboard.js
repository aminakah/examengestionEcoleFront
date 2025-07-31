import React, { useState } from 'react';
import { useParentData } from '../../hooks/schoolHooks';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/customHooks';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant tableau de bord pour les parents
 */
export default function ParentDashboard() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, grades, bulletins
  
  // Hook pour les données parent
  const { 
    myChildren, 
    loading, 
    error, 
    getChildGrades, 
    getChildBulletins,
    refresh 
  } = useParentData();

  // États pour les données de l'enfant sélectionné
  const [childData, setChildData] = useState({
    grades: [],
    bulletins: [],
    loading: false
  });
  console.log(myChildren)

  // Charger les données d'un enfant
  const loadChildData = async (childId) => {
    try {
      setChildData(prev => ({ ...prev, loading: true }));
      
      const [grades, bulletins] = await Promise.all([
        getChildGrades(childId),
        getChildBulletins(childId)
      ]);
      
      setChildData({
        grades: grades || [],
        bulletins: bulletins || [],
        loading: false
      });
    } catch (err) {
      showError('Erreur lors du chargement des données de l\'enfant');
      setChildData(prev => ({ ...prev, loading: false }));
    }
  };

  // Sélectionner un enfant
  const selectChild = (child) => {
    setSelectedChild(child);
    loadChildData(child.id);
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Espace Parent</h1>
        <p className="text-gray-600 mt-2">
          Bienvenue {user?.name}, suivez la scolarité de vos enfants
        </p>
      </div>

      {/* Sélection d'enfant */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Mes enfants</h2>
        
        {myChildren.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun enfant trouvé</h3>
            <p className="text-gray-600">
              Contactez l'administration pour associer vos enfants à votre compte
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myChildren.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                isSelected={selectedChild?.id === child.id}
                onSelect={() => selectChild(child)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Détails de l'enfant sélectionné */}
      {selectedChild && (
        <div className="space-y-6">
          {/* Navigation par onglets */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <TabButton
                  label="Vue d'ensemble"
                  isActive={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                />
                <TabButton
                  label="Notes"
                  isActive={activeTab === 'grades'}
                  onClick={() => setActiveTab('grades')}
                />
                <TabButton
                  label="Bulletins"
                  isActive={activeTab === 'bulletins'}
                  onClick={() => setActiveTab('bulletins')}
                />
              </nav>
            </div>

            <div className="p-6">
              {childData.loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  {activeTab === 'overview' && (
                    <OverviewTab child={selectedChild} data={childData} />
                  )}
                  {activeTab === 'grades' && (
                    <GradesTab grades={childData.grades} />
                  )}
                  {activeTab === 'bulletins' && (
                    <BulletinsTab bulletins={childData.bulletins} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Composant carte d'enfant
 */
function ChildCard({ child, isSelected, onSelect }) {
  const moyenne = child.moyenne_generale ? parseFloat(child.moyenne_generale) : null;
  
  return (
    <div
      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          {child.nom?.charAt(0)}{child.prenom?.charAt(0)}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{child.nom} {child.prenom}</h3>
          <p className="text-sm text-gray-600">{child.classe?.nom}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Moyenne:</span>
          <span className={`font-medium ${
            moyenne !== null 
              ? moyenne >= 10 ? 'text-green-600' : 'text-red-600'
              : 'text-gray-500'
          }`}>
            {moyenne !== null ? `${moyenne.toFixed(2)}/20` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Niveau:</span>
          <span className="font-medium">{child.niveau?.nom || 'N/A'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Année scolaire:</span>
          <span className="font-medium">{child.annee_scolaire?.nom || 'N/A'}</span>
        </div>
      </div>

      {isSelected && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <span className="text-sm text-blue-600 font-medium">✓ Sélectionné</span>
        </div>
      )}
    </div>
  );
}

/**
 * Composant bouton d'onglet
 */
function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-1 border-b-2 font-medium text-sm ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

/**
 * Onglet vue d'ensemble
 */
function OverviewTab({ child, data }) {
  const recentGrades = data.grades.slice(0, 5);
  const latestBulletin = data.bulletins[0];

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-2 text-white">
              📊
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-600">Moyenne générale</p>
              <p className="text-xl font-bold text-blue-900">
                {child.moyenne_generale || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-2 text-white">
              📝
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-600">Notes ce trimestre</p>
              <p className="text-xl font-bold text-green-900">
                {data.grades.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-2 text-white">
              🏆
            </div>
            <div className="ml-3">
              <p className="text-sm text-purple-600">Rang de classe</p>
              <p className="text-xl font-bold text-purple-900">
                {child.rang_classe || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dernières notes */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Dernières notes</h3>
        {recentGrades.length === 0 ? (
          <p className="text-gray-500">Aucune note récente</p>
        ) : (
          <div className="space-y-2">
            {recentGrades.map((grade, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{grade.matiere?.nom}</span>
                  <span className="text-sm text-gray-600 ml-2">({grade.type_note})</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${
                    parseFloat(grade.note) >= 10 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {grade.note}/20
                  </span>
                  <div className="text-xs text-gray-500">
                    {new Date(grade.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dernier bulletin */}
      {latestBulletin && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Dernier bulletin</h3>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{latestBulletin.periode?.nom}</h4>
                <p className="text-sm text-gray-600">
                  Moyenne: {latestBulletin.moyenne_generale}/20
                </p>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Onglet des notes
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
      <h3 className="text-lg font-semibold">Toutes les notes</h3>
      
      {Object.keys(gradesBySubject).length === 0 ? (
        <p className="text-gray-500">Aucune note disponible</p>
      ) : (
        Object.entries(gradesBySubject).map(([subject, subjectGrades]) => (
          <div key={subject} className="border rounded-lg p-4">
            <h4 className="font-medium mb-3 text-blue-900">{subject}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjectGrades.map((grade, index) => (
                <div key={index} className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{grade.type_note}</span>
                    <span className={`font-bold ${
                      parseFloat(grade.note) >= 10 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {grade.note}/20
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Coef. {grade.coefficient} - {new Date(grade.created_at).toLocaleDateString()}
                  </div>
                  {grade.commentaire && (
                    <div className="text-xs text-gray-600 mt-1 italic">
                      {grade.commentaire}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
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
      <h3 className="text-lg font-semibold">Bulletins scolaires</h3>
      
      {bulletins.length === 0 ? (
        <p className="text-gray-500">Aucun bulletin disponible</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bulletins.map((bulletin) => (
            <div key={bulletin.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{bulletin.periode?.nom}</h4>
                  <p className="text-sm text-gray-600">{bulletin.annee_scolaire?.nom}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  bulletin.statut === 'finalisé' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {bulletin.statut}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Moyenne générale:</span>
                  <span className={`font-medium ${
                    parseFloat(bulletin.moyenne_generale) >= 10 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {bulletin.moyenne_generale}/20
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rang:</span>
                  <span className="font-medium">{bulletin.rang || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                  📥 Télécharger
                </button>
                <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700">
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
