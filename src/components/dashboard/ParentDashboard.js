import React, { useState } from 'react';
import { useParentData } from '../../hooks/schoolHooks';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/customHooks';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant dashboard pour les parents
 */
export default function ParentDashboard() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { myChildren, loading, error: dataError, getChildGrades, getChildBulletins, refresh } = useParentData();
  
  const [selectedChild, setSelectedChild] = useState(null);
  const [childGrades, setChildGrades] = useState([]);
  const [childBulletins, setChildBulletins] = useState([]);
  const [loadingChildData, setLoadingChildData] = useState(false);

  // Charger les données d'un enfant spécifique
  const loadChildData = async (childId) => {
    try {
      setLoadingChildData(true);
      const child = myChildren.find(c => c.id === childId);
      setSelectedChild(child);
      
      const [grades, bulletins] = await Promise.all([
        getChildGrades(childId),
        getChildBulletins(childId)
      ]);
      
      setChildGrades(grades);
      setChildBulletins(bulletins);
    } catch (err) {
      error('Erreur lors du chargement des données de l\'enfant');
    } finally {
      setLoadingChildData(false);
    }
  };

  // Calculer les statistiques d'un enfant
  const getChildStats = (child) => {
    // Ces données viendraient normalement de l'API
    return {
      moyenne: child.moyenne || 'N/A',
      dernierBulletin: child.dernierBulletin || 'En attente',
      prochainRendezVous: child.prochainRendezVous || 'Aucun',
      comportement: child.comportement || 'Bon'
    };
  };

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
      {/* Header avec informations parent */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Espace Parent 👨‍👩‍👧‍👦</h1>
            <p className="text-green-100 mt-2">
              Bienvenue {user?.name}, suivez la scolarité de vos enfants
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{myChildren?.length || 0}</div>
            <div className="text-green-100">Enfant(s) suivi(s)</div>
          </div>
        </div>
      </div>

      {/* Vue d'ensemble des enfants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {myChildren && myChildren.length > 0 ? (
          myChildren.map((child) => {
            const stats = getChildStats(child);
            return (
              <ChildCard
                key={child.id}
                child={child}
                stats={stats}
                onSelect={() => loadChildData(child.id)}
                isSelected={selectedChild?.id === child.id}
              />
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun enfant enregistré
            </h3>
            <p className="text-gray-600 mb-6">
              Contactez l'établissement pour associer vos enfants à votre compte
            </p>
            <button
              onClick={() => success('Fonctionnalité bientôt disponible')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Contacter l'école
            </button>
          </div>
        )}
      </div>

      {/* Détails de l'enfant sélectionné */}
      {selectedChild && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Détails de {selectedChild.prenom} {selectedChild.nom}
              </h2>
              <button
                onClick={() => setSelectedChild(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingChildData ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations générales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <InfoRow label="Classe" value={selectedChild.classe?.nom || 'Non définie'} />
                    <InfoRow label="Enseignant principal" value={selectedChild.enseignantPrincipal || 'Non défini'} />
                    <InfoRow label="Date de naissance" value={
                      selectedChild.date_naissance ? 
                        new Date(selectedChild.date_naissance).toLocaleDateString('fr-FR') : 
                        'Non renseignée'
                    } />
                    <InfoRow label="Niveau" value={selectedChild.niveau?.nom || 'Non défini'} />
                  </div>
                </div>

                {/* Résultats scolaires */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Résultats scolaires</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <StatBox
                      title="Moyenne"
                      value={getChildStats(selectedChild).moyenne}
                      icon="📊"
                      color="blue"
                    />
                    <StatBox
                      title="Comportement"
                      value={getChildStats(selectedChild).comportement}
                      icon="😊"
                      color="green"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes récentes */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Notes récentes</h3>
              <p className="text-gray-600">Dernières notes de {selectedChild.prenom}</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {childGrades && childGrades.length > 0 ? (
                childGrades.slice(0, 5).map((grade, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {grade.matiere?.nom || 'Matière non définie'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {grade.type_note} • {new Date(grade.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          parseFloat(grade.note) >= 10 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {grade.note}/20
                        </div>
                        <div className="text-sm text-gray-500">
                          Coef. {grade.coefficient}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Aucune note récente
                </div>
              )}
            </div>
          </div>

          {/* Bulletins disponibles */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Bulletins disponibles</h3>
              <p className="text-gray-600">Téléchargez les bulletins de {selectedChild.prenom}</p>
            </div>
            
            <div className="p-6">
              {childBulletins && childBulletins.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {childBulletins.map((bulletin, index) => (
                    <BulletinCard
                      key={index}
                      bulletin={bulletin}
                      childName={selectedChild.prenom}
                      onDownload={() => success('Téléchargement en cours...')}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p>Aucun bulletin disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            title="Rendez-vous"
            icon="📅"
            description="Prendre RDV"
            onClick={() => success('Fonctionnalité bientôt disponible')}
          />
          <QuickActionButton
            title="Messages"
            icon="✉️"
            description="Messagerie école"
            onClick={() => success('Fonctionnalité bientôt disponible')}
          />
          <QuickActionButton
            title="Absences"
            icon="📊"
            description="Signaler absence"
            onClick={() => success('Fonctionnalité bientôt disponible')}
          />
          <QuickActionButton
            title="Paiements"
            icon="💳"
            description="Frais scolaires"
            onClick={() => success('Fonctionnalité bientôt disponible')}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Composant carte enfant
 */
function ChildCard({ child, stats, onSelect, isSelected }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {child.prenom?.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {child.prenom} {child.nom}
            </h3>
            <p className="text-gray-600">{child.classe?.nom || 'Classe non définie'}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <InfoRow label="Moyenne" value={stats.moyenne} />
          <InfoRow label="Comportement" value={stats.comportement} />
          <InfoRow label="Dernier bulletin" value={stats.dernierBulletin} />
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Voir les détails
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant ligne d'information
 */
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

/**
 * Composant boîte de statistique
 */
function StatBox({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4 text-center`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-75">{title}</div>
    </div>
  );
}

/**
 * Composant carte bulletin
 */
function BulletinCard({ bulletin, childName, onDownload }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900">
            {bulletin.periode?.nom || 'Bulletin'}
          </h4>
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
          onClick={onDownload}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          📄 Télécharger
        </button>
        
        <button
          onClick={() => {}}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm"
        >
          👁️ Visualiser
        </button>
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
