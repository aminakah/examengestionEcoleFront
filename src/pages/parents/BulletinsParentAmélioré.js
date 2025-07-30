import React, { useState, useEffect } from 'react';
import { 
  User, Download, Eye, Calendar, TrendingUp, TrendingDown, 
  Award, BookOpen, BarChart3, Mail, Phone, MapPin, Home
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

 
 const loadData = async () => {
    try {
      setLoading(true);
      // Chargement des enfants du parent connecté
      const response = await bulletinService.mesEnfants();
      const periods = await bulletinService.getPeriod();
      
      setEnfants(response.data || []);
      setTrimestres(periods.data || []);
      
      // Sélection automatique du premier enfant et du premier trimestre
      if (response.data && response.data.length > 0) {
        const enfantId = response.data[0].id;
        setSelectedEnfant(enfantId);
        console.log("Enfant sélectionné automatiquement:", enfantId);
      }
      
      if (periods.data && periods.data.length > 0) {
        const trimestreId = periods.data[0].id;
        setSelectedTrimestre(trimestreId);
        console.log("Trimestre sélectionné automatiquement:", trimestreId);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setEnfants([]);
      setTrimestres([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  
useEffect(() => {
  if (selectedEnfant && selectedTrimestre) {
    loadBulletins();
  }
}, [selectedEnfant, selectedTrimestre]);


 
  const loadBulletins = async () => {
    if (!selectedEnfant || !selectedTrimestre) {
      console.log("Enfant ou trimestre non sélectionné");
      setBulletins([]);
      return;
    }
    
    try {
      setLoadingBulletins(true);
      console.log('Chargement des bulletins pour:', { selectedEnfant, selectedTrimestre });
      
      const response = await bulletinService.getBulletinsEnfants(selectedEnfant, selectedTrimestre);
      console.log('Réponse bulsdfvsdletins:', response);

      setBulletins(Array.isArray(response.data) ? response.data : [response.data].filter(Boolean));
    } catch (error) {
      console.error('Erreur lors du chargement des bulletins:', error);
      setBulletins([]);
    } finally {
      setLoadingBulletins(false);
    }
  };

  const downloadBulletin = async (bulletinId) => {
    try {
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
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du bulletin');
    }
  };

  const enfantSelectionne = enfants.find(e => e.id == selectedEnfant);
  const trimestreSelectionne = trimestres.find(t => t.id == selectedTrimestre);
  const bulletinActuel = bulletins.find(b => b.
periode_id
 == selectedTrimestre || b.trimestre === selectedTrimestre);
console.log(bulletins)
console.log(bulletinActuel)
  // Calculs des statistiques avec vérifications de sécurité
  const moyenneGenerale = bulletinActuel?.
moyenne_generale || 0;
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

  return (
    <PageLayout
      title="Bulletins de Notes"
      subtitle="Consultez les résultats scolaires de vos enfants"
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
              onChange={(e) => setSelectedEnfant(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {enfants.map(enfant => (
                <option key={enfant.id} value={enfant.id}>
                  {enfant?.user?.prenom || 'Nom non disponible'} - {enfant?.inscriptions?.[0]?.classe?.nom || 'Classe non définie'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trimestre
            </label>
            <select
              value={selectedTrimestre}
              onChange={(e) => setSelectedTrimestre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner un trimestre</option>
              {trimestres.map(trimestre => (
                <option key={trimestre.id} value={trimestre.id}>
                  {trimestre.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

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

          {selectedTrimestre && !loadingBulletins && bulletinActuel && (
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
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Matière
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          1 Devoir
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          2 Devoir
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
                      {bulletinActuel.notes?.map((note, index) => (
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
                                <div className="text-sm text-gray-500">{note.enseignant_nom}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                            {note.note_devoir1 || '-'}/20
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                            {note.note_devoir2 || '-'}/20
                          </td><td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                            {note.note_composition || '-'}/20
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Badge variant={note.moyenne >= 10 ? 'success' : 'danger'}>
                              {note.moyenne || '-'}/20
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                            {note.coefficient}
                          </td>
                          
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                            {note.appreciation || 'Aucune appréciation'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Appréciations générales */}
              {bulletinActuel.appreciation_generale && (
                <Card title="Appréciation générale" className="mt-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">
                      {bulletinActuel.appreciation_generale}
                    </p>
                    <div className="mt-4 text-sm text-gray-600">
                      <strong>Professeur principal:</strong> {bulletinActuel.professeur_principal}
                    </div>
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

          {selectedTrimestre && !loadingBulletins && !bulletinActuel && (
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

      {enfants.length === 0 && (
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
