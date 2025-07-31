import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, Download, Eye, Calendar, TrendingUp, TrendingDown, 
  Award, BookOpen, BarChart3, Mail, Phone, MapPin, Home, AlertCircle
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import PageLayout from '../../components/PageLayout';
import { Card, Badge, Loading, EmptyState, StatsCard } from '../../components/UIComponents';
import { getInitials, formatFullName, formatDate, formatEmail, formatPhone, getInitial } from '../../utils/formatters';
import { bulletinService } from '../../services';
import { api } from '../../services/api';

const BulletinsParentAmélioré = () => {
  const [enfants, setEnfants] = useState([]);
  const [trimestres, setTrimestres] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [selectedEnfant, setSelectedEnfant] = useState('');
  const [selectedTrimestre, setSelectedTrimestre] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingBulletins, setLoadingBulletins] = useState(false);
  const [error, setError] = useState(null);
  const [bulletinError, setBulletinError] = useState(null);

  // Message d'erreur personnalisé
  const ErrorMessage = ({ message, onRetry }) => (
    <Card className="border-red-200 bg-red-50">
      <div className="flex items-center space-x-3 text-red-700">
        <AlertCircle className="w-5 h-5" />
        <div className="flex-1">
          <p className="font-medium">Une erreur s'est produite</p>
          <p className="text-sm text-red-600">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-sm bg-red-100 border border-red-300 rounded hover:bg-red-200"
          >
            Réessayer
          </button>
        )}
      </div>
    </Card>
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des données parent...');
      
      // Chargement des enfants du parent connecté
      const [enfantsResponse, periodsResponse] = await Promise.all([
        bulletinService.mesEnfants().catch(err => {
          console.error('❌ Erreur enfants:', err);
          throw new Error('Impossible de charger la liste des enfants');
        }),
        bulletinService.getPeriod().catch(err => {
          console.error('❌ Erreur périodes:', err);
          throw new Error('Impossible de charger la liste des trimestres');
        })
      ]);
      
      console.log('✅ Données reçues:', { enfantsResponse, periodsResponse });
      
      const enfantsData = enfantsResponse.data || [];
      const trimestreData = periodsResponse.data || [];
      
      setEnfants(enfantsData);
      setTrimestres(trimestreData);
      
      // Sélection automatique du premier enfant et du premier trimestre
      if (enfantsData.length > 0) {
        const enfantId = enfantsData[0].id;
        setSelectedEnfant(enfantId);
        console.log("✅ Enfant sélectionné automatiquement:", enfantId);
      }
      
      if (trimestreData.length > 0) {
        const trimestreId = trimestreData[0].id;
        setSelectedTrimestre(trimestreId);
        console.log("✅ Trimestre sélectionné automatiquement:", trimestreId);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      setError(error.message || 'Une erreur inattendue s\'est produite');
      setEnfants([]);
      setTrimestres([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (selectedEnfant && selectedTrimestre) {
      loadBulletins();
    }
  }, [selectedEnfant, selectedTrimestre]);

  const loadBulletins = useCallback(async () => {
    if (!selectedEnfant || !selectedTrimestre) {
      console.log("⚠️ Enfant ou trimestre non sélectionné");
      setBulletins([]);
      return;
    }
    
    try {
      setLoadingBulletins(true);
      setBulletinError(null);
      
      console.log('🔄 Chargement des bulletins pour:', { selectedEnfant, selectedTrimestre });
      
      const response = await bulletinService.getBulletinsEnfants(selectedEnfant, selectedTrimestre);
      console.log('✅ Réponse bulletins:', response);

      if (response.success) {
        setBulletins(Array.isArray(response.data) ? response.data : [response.data].filter(Boolean));
      } else {
        throw new Error(response.message || 'Réponse API invalide');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des bulletins:', error);
      setBulletinError(error.message || 'Impossible de charger le bulletin');
      setBulletins([]);
    } finally {
      setLoadingBulletins(false);
    }
  }, [selectedEnfant, selectedTrimestre]);

  const downloadBulletin = async (bulletinId) => {
    try {
      console.log('🔄 Téléchargement du bulletin:', bulletinId);
      
      const response = await apiService.get(`/bulletins/${bulletinId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bulletin_${bulletinId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Téléchargement terminé');
      
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du bulletin. Veuillez réessayer.');
    }
  };

  // Données calculées avec vérifications robustes
  const enfantSelectionne = enfants.find(e => e.id == selectedEnfant);
  const trimestreSelectionne = trimestres.find(t => t.id == selectedTrimestre);
  const bulletinActuel = bulletins.find(b => 
    b.periode_id == selectedTrimestre || b.trimestre === selectedTrimestre
  );

  console.log('📊 État actuel:', { bulletins, bulletinActuel });

  // Calculs des statistiques avec vérifications de sécurité
  const moyenneGenerale = bulletinActuel?.moyenne_generale || 0;
  const evolutionMoyenne = bulletinActuel?.evolution || 0;
  const nombreMatieres = bulletinActuel?.notes?.length || 0;
  const matieresReussies = bulletinActuel?.notes?.filter(n => n?.moyenne >= 10).length || 0;

  const pageActions = bulletinActuel ? [
    {
      label: 'Télécharger le bulletin',
      icon: Download,
      onClick: () => downloadBulletin(bulletinActuel.id),
      variant: 'primary'
    }
  ] : [];

  if (loading) {
    return (
      <PageLayout title="Bulletins de Notes" icon={User}>
        <Loading text="Chargement des bulletins..." />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Bulletins de Notes" icon={User}>
        <ErrorMessage message={error} onRetry={loadData} />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Bulletins de Notes"
      subtitle="Consultez les résultats scolqwsdfgvb vaires de vos enfants"
      icon={User}
      actions={pageActions}
      showSearch={false}
    >
      {/* Sélection enfant et trimestre */}
      <Card title="Sélection" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enfant
            </label>
            <select
              value={selectedEnfant}
              onChange={(e) => {
                setSelectedEnfant(e.target.value);
                setBulletinError(null); // Reset l'erreur lors du changement
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={enfants.length === 0}
            >
              <option value="">Sélectionner un enfant</option>
              {enfants.map(enfant => (
                <option key={enfant.id} value={enfant.id}>
                  {enfant?.user?.prenom || 'Nom non disponible'} - {enfant?.inscriptions?.[0]?.classe?.nom || 'Classe non définie'}
                </option>
              ))}
            </select>
            {enfants.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">Aucun enfant trouvé</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trimestre
            </label>
            <select
              value={selectedTrimestre}
              onChange={(e) => {
                setSelectedTrimestre(e.target.value);
                setBulletinError(null); // Reset l'erreur lors du changement
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={trimestres.length === 0}
            >
              <option value="">Sélectionner un trimestre</option>
              {trimestres.map(trimestre => (
                <option key={trimestre.id} value={trimestre.id}>
                  {trimestre.nom}
                </option>
              ))}
            </select>
            {trimestres.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">Aucun trimestre disponible</p>
            )}
          </div>
        </div>
      </Card>

      {/* Affichage des erreurs de bulletin */}
      {bulletinError && (
        <ErrorMessage 
          message={bulletinError} 
          onRetry={() => loadBulletins()} 
        />
      )}

      {enfantSelectionne && (
        <>
          {/* Informations de l'enfant */}
          <Card title="Informations de l'élève" className="mb-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(enfantSelectionne?.user?.prenom, enfantSelectionne?.user?.nom)}
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {formatFullName(enfantSelectionne?.user?.prenom, enfantSelectionne?.user?.nom)}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        <span>Classe: <strong>{enfantSelectionne?.inscriptions?.[0]?.classe?.nom || 'Non renseignée'}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Né(e) le: {formatDate(enfantSelectionne?.user?.date_naissance)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{formatEmail(enfantSelectionne?.user?.email)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{formatPhone(enfantSelectionne?.user?.telephone)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{enfantSelectionne?.user?.adresse || 'Adresse non renseignée'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {selectedTrimestre && loadingBulletins && (
            <Card>
              <Loading text="Chargement du bulletin en cours..." />
            </Card>
          )}

          {selectedTrimestre && !loadingBulletins && !bulletinError && bulletinActuel && (
            <>
              {/* Statistiques générales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Moyenne Générale"
                  value={`${moyenneGenerale}/20`}
                  icon={Award}
                  color={moyenneGenerale >= 10 ? 'green' : 'red'}
                  trend={evolutionMoyenne > 0 ? `+${evolutionMoyenne.toFixed(2)}` : evolutionMoyenne.toFixed(2)}
                  trendDirection={evolutionMoyenne >= 0 ? 'up' : 'down'}
                />
                <StatsCard
                  title="Matières"
                  value={nombreMatieres}
                  icon={BookOpen}
                  color="blue"
                  trend={`${matieresReussies} réussies`}
                />
                <StatsCard
                  title="Rang dans la classe"
                  value={bulletinActuel.rang || '-'}
                  icon={BarChart3}
                  color="purple"
                  trend={`/${bulletinActuel.effectif_classe || '-'} élèves`}
                />
                <StatsCard
                  title="Progression"
                  value={evolutionMoyenne >= 0 ? 'Positive' : 'À améliorer'}
                  icon={evolutionMoyenne >= 0 ? TrendingUp : TrendingDown}
                  color={evolutionMoyenne >= 0 ? 'green' : 'orange'}
                  trend={Math.abs(evolutionMoyenne).toFixed(2) + ' pts'}
                />
              </div>

              {/* Détail des notes par matière */}
              <Card title={`Détail des notes - ${trimestreSelectionne?.nom || 'Trimestre sélectionné'}`}>
                {bulletinActuel.notes && bulletinActuel.notes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Matière
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            1er Devoir
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            2e Devoir
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Composition
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Moyenne
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Coefficient
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Appréciation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bulletinActuel.notes.map((note, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: note.matiere_couleur || '#3B82F6' }}
                                >
                                  {getInitial(note.matiere_code) || 'M'}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{note.matiere_nom}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                              {note.note_devoir1 !== null && note.note_devoir1 !== undefined ? `${note.note_devoir1}/20` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                              {note.note_devoir2 !== null && note.note_devoir2 !== undefined ? `${note.note_devoir2}/20` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                              {note.note_composition !== null && note.note_composition !== undefined ? `${note.note_composition}/20` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <Badge variant={note.moyenne >= 10 ? 'success' : 'danger'}>
                                {note.moyenne ? `${note.moyenne}/20` : '-'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                              {note.coefficient || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                              {note.appreciation || 'Aucune appréciation'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    title="Aucune note disponible"
                    description="Les notes pour ce trimestre ne sont pas encore saisies."
                    icon={BookOpen}
                  />
                )}
              </Card>

              {/* Appréciations générales */}
              {bulletinActuel.appreciation_generale && (
                <Card title="Appréciation générale" className="mt-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">
                      {bulletinActuel.appreciation_generale}
                    </p>
                    {bulletinActuel.professeur_principal && (
                      <div className="mt-4 text-sm text-gray-600">
                        <strong>Professeur principal:</strong> {bulletinActuel.professeur_principal}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Conseils et recommandations */}
              {bulletinActuel.conseils && (
                <Card title="Conseils et recommandations" className="mt-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">
                      {bulletinActuel.conseils}
                    </p>
                  </div>
                </Card>
              )}
            </>
          )}

          {selectedTrimestre && !loadingBulletins && !bulletinError && !bulletinActuel && (
            <Card>
              <EmptyState
                title="Bulletin non disponible"
                description={`Le bulletin du ${trimestreSelectionne?.nom || 'trimestre sélectionné'} n'est pas encore disponible pour ${enfantSelectionne?.user?.prenom}.`}
                icon={Calendar}
              />
            </Card>
          )}

          {!selectedTrimestre && (
            <Card>
              <EmptyState
                title="Sélectionnez un trimestre"
                description="Choisissez un trimestre pour consulter le bulletin de notes."
                icon={Calendar}
              />
            </Card>
          )}
        </>
      )}

      {enfants.length === 0 && !loading && !error && (
        <Card>
          <EmptyState
            title="Aucun enfant trouvé"
            description="Aucun enfant n'est associé à votre compte parent."
            icon={User}
          />
        </Card>
      )}
    </PageLayout>
  );
};

export default BulletinsParentAmélioré;