import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  User,
  Calendar
} from 'lucide-react';

const GestionDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour l'upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    eleve_id: '',
    type_document: '',
    description: '',
    file: null
  });

  const typesDocuments = [
    'Certificat médical',
    'Justificatif absence',
    'Acte de naissance',
    'Bulletin précédent',
    'Attestation domicile',
    'Photo identité',
    'Autorisation sortie',
    'Autre'
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'approuve', label: 'Approuvé' },
    { value: 'rejete', label: 'Rejeté' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [documentsRes, elevesRes] = await Promise.all([
        apiService.get('/documents'),
        apiService.get('/eleves')
      ]);
      
      // Simuler des documents pour la démo
      const mockDocuments = [
        {
          id: 1,
          eleve_id: 1,
          nom_fichier: 'certificat_medical_aminata.pdf',
          type_document: 'Certificat médical',
          description: 'Absence du 15 au 17 janvier',
          taille: '245 KB',
          date_upload: '2025-01-15T10:30:00',
          statut: 'approuve',
          uploaded_by: 'parent'
        },
        {
          id: 2,
          eleve_id: 2,
          nom_fichier: 'justificatif_retard_omar.jpg',
          type_document: 'Justificatif absence',
          description: 'Retard du 20 janvier - RDV médical',
          taille: '156 KB',
          date_upload: '2025-01-20T14:15:00',
          statut: 'en_attente',
          uploaded_by: 'parent'
        },
        {
          id: 3,
          eleve_id: 1,
          nom_fichier: 'autorisation_sortie_aminata.pdf',
          type_document: 'Autorisation sortie',
          description: 'Sortie pédagogique du 25 janvier',
          taille: '89 KB',
          date_upload: '2025-01-18T09:45:00',
          statut: 'en_attente',
          uploaded_by: 'admin'
        }
      ];
      
      setDocuments(mockDocuments);
      setEleves(elevesRes.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 5MB)');
        return;
      }
      
      // Vérifier le type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Type de fichier non autorisé. Formats acceptés: PDF, JPG, PNG, DOC, DOCX');
        return;
      }
      
      setUploadData(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadData.eleve_id || !uploadData.type_document || !uploadData.file) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setUploadLoading(true);
    try {
      // Simuler l'upload
      const newDocument = {
        id: Date.now(),
        eleve_id: parseInt(uploadData.eleve_id),
        nom_fichier: uploadData.file.name,
        type_document: uploadData.type_document,
        description: uploadData.description,
        taille: `${Math.round(uploadData.file.size / 1024)} KB`,
        date_upload: new Date().toISOString(),
        statut: 'en_attente',
        uploaded_by: user.role
      };

      setDocuments(prev => [newDocument, ...prev]);
      setShowUploadModal(false);
      setUploadData({
        eleve_id: '',
        type_document: '',
        description: '',
        file: null
      });
      
      alert('Document téléchargé avec succès');
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors du téléchargement');
    } finally {
      setUploadLoading(false);
    }
  };

  const updateStatus = async (documentId, newStatus) => {
    try {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, statut: newStatus }
            : doc
        )
      );
      
      alert(`Document ${newStatus === 'approuve' ? 'approuvé' : 'rejeté'} avec succès`);
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const deleteDocument = async (documentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        alert('Document supprimé avec succès');
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const downloadDocument = (document) => {
    // Simuler le téléchargement
    alert(`Téléchargement de ${document.nom_fichier}`);
  };

  const viewDocument = (document) => {
    // Simuler l'aperçu
    alert(`Ouverture de ${document.nom_fichier} dans un nouvel onglet`);
  };

  const getEleveInfo = (eleveId) => {
    const eleve = eleves.find(e => e.id === eleveId);
    return eleve ? `${eleve.prenom} ${eleve.nom}` : 'Élève inconnu';
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'approuve':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejete':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'approuve':
        return 'Approuvé';
      case 'rejete':
        return 'Rejeté';
      default:
        return 'En attente';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const eleveMatch = selectedEleve === '' || doc.eleve_id.toString() === selectedEleve;
    const statusMatch = selectedStatus === '' || doc.statut === selectedStatus;
    const searchMatch = searchTerm === '' || 
      doc.nom_fichier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type_document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEleveInfo(doc.eleve_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    return eleveMatch && statusMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Chargement des documents...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-3 text-blue-500" />
            Gestion des Documents
          </h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Nouveau Document
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un document..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Élève
            </label>
            <select
              value={selectedEleve}
              onChange={(e) => setSelectedEleve(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les élèves</option>
              {eleves.map(eleve => (
                <option key={eleve.id} value={eleve.id}>
                  {eleve.prenom} {eleve.nom} - {eleve.classe_nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <div>Total: {filteredDocuments.length} documents</div>
              <div>En attente: {filteredDocuments.filter(d => d.statut === 'en_attente').length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Élève
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredDocuments.map(document => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {document.nom_fichier}
                        </div>
                        <div className="text-sm text-gray-500">
                          {document.taille} • {document.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {getEleveInfo(document.eleve_id)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {document.type_document}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(document.date_upload).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(document.statut)}
                      <span className="ml-2 text-sm text-gray-600">
                        {getStatusText(document.statut)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => viewDocument(document)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Aperçu"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadDocument(document)}
                      className="text-green-600 hover:text-green-900"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {document.statut === 'en_attente' && (
                      <>
                        <button
                          onClick={() => updateStatus(document.id, 'approuve')}
                          className="text-green-600 hover:text-green-900"
                          title="Approuver"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(document.id, 'rejete')}
                          className="text-red-600 hover:text-red-900"
                          title="Rejeter"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteDocument(document.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun document ne correspond aux critères de recherche.
            </p>
          </div>
        )}
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Nouveau Document
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Élève *
                  </label>
                  <select
                    value={uploadData.eleve_id}
                    onChange={(e) => setUploadData(prev => ({ ...prev, eleve_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un élève</option>
                    {eleves.map(eleve => (
                      <option key={eleve.id} value={eleve.id}>
                        {eleve.prenom} {eleve.nom} - {eleve.classe_nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de document *
                  </label>
                  <select
                    value={uploadData.type_document}
                    onChange={(e) => setUploadData(prev => ({ ...prev, type_document: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    {typesDocuments.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Description du document..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés: PDF, JPG, PNG, DOC, DOCX (max 5MB)
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadLoading ? 'Upload...' : 'Télécharger'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDocuments;
