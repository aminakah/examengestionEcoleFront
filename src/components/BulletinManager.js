import React, { useState, useEffect } from 'react';
import { useBulletins } from '../../hooks/schoolHooks';
import { classService, periodService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/customHooks';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant de gestion des bulletins pour les administrateurs et enseignants
 */
export default function BulletinManager() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  
  // États pour les filtres
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState('');
  
  // États pour les données de référence
  const [classes, setClasses] = useState([]);
  const [periods, setPeriods] = useState([]);
  
  // Hook pour les bulletins
  const { 
    bulletins, 
    loading, 
    error, 
    generating, 
    generateBulletins, 
    downloadBulletin,
    downloadClassBulletins,
    refresh 
  } = useBulletins({
    classe_id: selectedClass,
    periode_id: selectedPeriod,
    annee_scolaire: selectedAnnee
  });

  // États pour les modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showBulletinDetails, setShowBulletinDetails] = useState(null);

  // Charger les données de référence
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [classesResponse, periodsResponse] = await Promise.all([
          classService.getClasses(),
          periodService.getPeriods()
        ]);
        
        setClasses(classesResponse.data || classesResponse);
        setPeriods(periodsResponse.data || periodsResponse);
      } catch (err) {
        showError('Erreur lors du chargement des données de référence');
      }
    };

    loadReferenceData();
  }, [showError]);

  // Génération de bulletins
  const handleGenerateBulletins = async (generationData) => {
    try {
      await generateBulletins(generationData);
      success('Bulletins générés avec succès !');
      setShowGenerateModal(false);
    } catch (err) {
      showError('Erreur lors de la génération des bulletins');
    }
  };

  // Téléchargement d'un bulletin individuel
  const handleDownloadBulletin = async (bulletinId, studentName) => {
    try {
      await downloadBulletin(bulletinId, `bulletin_${studentName}.pdf`);
      success('Bulletin téléchargé !');
    } catch (err) {
      showError('Erreur lors du téléchargement');
    }
  };

  // Téléchargement de tous les bulletins d'une classe
  const handleDownloadClassBulletins = async () => {
    if (!selectedClass || !selectedPeriod) {
      showError('Sélectionnez une classe et une période');
      return;
    }

    try {
      await downloadClassBulletins({
        classe_id: selectedClass,
        periode_id: selectedPeriod
      }, `bulletins_classe_${selectedClass}_periode_${selectedPeriod}.zip`);
      success('Archive des bulletins téléchargée !');
    } catch (err) {
      showError('Erreur lors du téléchargement de l\'archive');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Bulletins</h1>
        <p className="text-gray-600 mt-2">Générez et gérez les bulletins de notes</p>
      </div>

      {/* Filtres et actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Sélection de classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les classes</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection de période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les périodes</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Année scolaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année scolaire
            </label>
            <select
              value={selectedAnnee}
              onChange={(e) => setSelectedAnnee(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Année actuelle</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les statuts</option>
              <option value="genere">Générés</option>
              <option value="valide">Validés</option>
              <option value="envoye">Envoyés</option>
            </select>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowGenerateModal(true)}
            disabled={generating}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Génération...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Générer bulletins
              </>
            )}
          </button>

          <button
            onClick={handleDownloadClassBulletins}
            disabled={!selectedClass || !selectedPeriod}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Télécharger classe (ZIP)
          </button>

          <button
            onClick={refresh}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>

        {/* Informations de filtre actuel */}
        {(selectedClass || selectedPeriod) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Filtres actifs: 
              {selectedClass && ` Classe: ${classes.find(c => c.id == selectedClass)?.nom}`}
              {selectedPeriod && ` • Période: ${periods.find(p => p.id == selectedPeriod)?.nom}`}
            </p>
          </div>
        )}
      </div>

      {/* Liste des bulletins */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Bulletins disponibles</h2>
          <p className="text-gray-600">
            {bulletins?.length || 0} bulletin(s) trouvé(s)
          </p>
        </div>

        {loading ? (
          <div className="p-6">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Erreur: {error}
          </div>
        ) : bulletins && bulletins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moyenne
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bulletins.map((bulletin) => (
                  <tr key={bulletin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {bulletin.eleve?.prenom?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {bulletin.eleve?.nom} {bulletin.eleve?.prenom}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {bulletin.eleve?.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bulletin.classe?.nom || 'Non définie'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bulletin.periode?.nom || 'Non définie'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${
                        bulletin.moyenne_generale >= 10 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {bulletin.moyenne_generale || 'N/A'}/20
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BulletinStatusBadge status={bulletin.statut} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setShowBulletinDetails(bulletin)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDownloadBulletin(
                          bulletin.id, 
                          `${bulletin.eleve?.nom}_${bulletin.eleve?.prenom}`
                        )}
                        className="text-green-600 hover:text-green-900"
                      >
                        PDF
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => {/* Logique d'édition */}}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Éditer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun bulletin trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Aucun bulletin ne correspond aux critères sélectionnés
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Générer des bulletins
            </button>
          </div>
        )}
      </div>

      {/* Modal de génération */}
      {showGenerateModal && (
        <GenerateBulletinsModal
          classes={classes}
          periods={periods}
          onGenerate={handleGenerateBulletins}
          onClose={() => setShowGenerateModal(false)}
          generating={generating}
        />
      )}

      {/* Modal détails bulletin */}
      {showBulletinDetails && (
        <BulletinDetailsModal
          bulletin={showBulletinDetails}
          onClose={() => setShowBulletinDetails(null)}
          onDownload={() => handleDownloadBulletin(
            showBulletinDetails.id, 
            `${showBulletinDetails.eleve?.nom}_${showBulletinDetails.eleve?.prenom}`
          )}
        />
      )}
    </div>
  );
}

/**
 * Badge de statut du bulletin
 */
function BulletinStatusBadge({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'genere':
        return { color: 'blue', text: 'Généré' };
      case 'valide':
        return { color: 'green', text: 'Validé' };
      case 'envoye':
        return { color: 'purple', text: 'Envoyé' };
      case 'brouillon':
        return { color: 'gray', text: 'Brouillon' };
      default:
        return { color: 'gray', text: 'Inconnu' };
    }
  };

  const { color, text } = getStatusConfig();
  
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {text}
    </span>
  );
}

/**
 * Modal de génération de bulletins
 */
function GenerateBulletinsModal({ classes, periods, onGenerate, onClose, generating }) {
  const [formData, setFormData] = useState({
    classe_id: '',
    periode_id: '',
    type_generation: 'definitif', // 'brouillon' ou 'definitif'
    inclure_observations: true,
    inclure_graphiques: true,
    envoyer_par_email: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.classe_id || !formData.periode_id) return;
    onGenerate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Générer des bulletins</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe *
            </label>
            <select
              value={formData.classe_id}
              onChange={(e) => setFormData({...formData, classe_id: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période *
            </label>
            <select
              value={formData.periode_id}
              onChange={(e) => setFormData({...formData, periode_id: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Sélectionner une période</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de génération
            </label>
            <select
              value={formData.type_generation}
              onChange={(e) => setFormData({...formData, type_generation: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="brouillon">Brouillon</option>
              <option value="definitif">Définitif</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.inclure_observations}
                onChange={(e) => setFormData({...formData, inclure_observations: e.target.checked})}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Inclure les observations</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.inclure_graphiques}
                onChange={(e) => setFormData({...formData, inclure_graphiques: e.target.checked})}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Inclure les graphiques</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.envoyer_par_email}
                onChange={(e) => setFormData({...formData, envoyer_par_email: e.target.checked})}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Envoyer par email aux parents</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={generating || !formData.classe_id || !formData.periode_id}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {generating ? 'Génération...' : 'Générer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Modal détails du bulletin
 */
function BulletinDetailsModal({ bulletin, onClose, onDownload }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Bulletin de {bulletin.eleve?.prenom} {bulletin.eleve?.nom}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Informations élève</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Nom:</span> {bulletin.eleve?.nom}</p>
                <p><span className="text-gray-600">Prénom:</span> {bulletin.eleve?.prenom}</p>
                <p><span className="text-gray-600">Classe:</span> {bulletin.classe?.nom}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Période</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Période:</span> {bulletin.periode?.nom}</p>
                <p><span className="text-gray-600">Année:</span> {bulletin.annee_scolaire?.nom}</p>
                <p><span className="text-gray-600">Statut:</span> <BulletinStatusBadge status={bulletin.statut} /></p>
              </div>
            </div>
          </div>

          {/* Moyennes */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Résultats</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  bulletin.moyenne_generale >= 10 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {bulletin.moyenne_generale || 'N/A'}/20
                </div>
                <div className="text-gray-600">Moyenne générale</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Fermer
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
