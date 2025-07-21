import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Download, Eye, Trash2, Plus, 
  File, Image, Video, Archive, Search, Calendar
} from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';

const GestionDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [uploadData, setUploadData] = useState({
    titre: '',
    description: '',
    type: 'cours',
    categorie: '',
    file: null
  });

  const typesDocuments = [
    { value: 'cours', label: 'Cours', icon: FileText, color: 'blue' },
    { value: 'exercice', label: 'Exercices', icon: File, color: 'green' },
    { value: 'corrige', label: 'Corrigés', icon: FileText, color: 'orange' },
    { value: 'evaluation', label: 'Évaluations', icon: File, color: 'red' },
    { value: 'administratif', label: 'Administratif', icon: Archive, color: 'purple' }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await apiService.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUploadData({
      ...uploadData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setUploadData({
      ...uploadData,
      file: e.target.files[0]
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    const formData = new FormData();
    formData.append('titre', uploadData.titre);
    formData.append('description', uploadData.description);
    formData.append('type', uploadData.type);
    formData.append('categorie', uploadData.categorie);
    formData.append('file', uploadData.file);

    try {
      const response = await apiService.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setDocuments([response.data, ...documents]);
      resetForm();
      alert('Document téléchargé avec succès!');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du document');
    }
  };

  const handleDelete = async (document) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await apiService.delete(`/documents/${document.id}`);
        setDocuments(documents.filter(d => d.id !== document.id));
        alert('Document supprimé avec succès!');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du document');
      }
    }
  };

  const downloadDocument = async (document) => {
    try {
      const response = await apiService.get(`/documents/${document.id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.nom_fichier);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du document');
    }
  };

  const resetForm = () => {
    setUploadData({
      titre: '',
      description: '',
      type: 'cours',
      categorie: '',
      file: null
    });
    setShowUploadForm(false);
  };

  const getFileIcon = (extension) => {
    const ext = extension?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return Image;
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) return Video;
    if (['zip', 'rar', '7z'].includes(ext)) return Archive;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      key: 'titre',
      label: 'Document',
      render: (value, row) => {
        const FileIcon = getFileIcon(row.extension);
        const typeInfo = typesDocuments.find(t => t.value === row.type);
        
        return (
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br from-${typeInfo?.color || 'gray'}-500 to-${typeInfo?.color || 'gray'}-600 rounded-lg flex items-center justify-center text-white`}>
              <FileIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{row.nom_fichier}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => {
        const typeInfo = typesDocuments.find(t => t.value === value);
        return (
          <Badge variant="info">{typeInfo?.label || value}</Badge>
        );
      }
    },
    {
      key: 'taille',
      label: 'Taille',
      render: (value) => formatFileSize(value)
    },
    {
      key: 'created_at',
      label: 'Date d\'ajout',
      render: (value) => new Date(value).toLocaleDateString('fr-FR')
    },
    {
      key: 'telechargements',
      label: 'Téléchargements',
      render: (value) => (
        <Badge variant="default">{value || 0}</Badge>
      )
    }
  ];

  const actions = [
    {
      icon: Eye,
      label: 'Aperçu',
      onClick: (doc) => window.open(`/documents/${doc.id}/preview`, '_blank'),
      variant: 'default'
    },
    {
      icon: Download,
      label: 'Télécharger',
      onClick: downloadDocument,
      variant: 'default'
    },
    {
      icon: Trash2,
      label: 'Supprimer',
      onClick: handleDelete,
      variant: 'danger'
    }
  ];

  const pageActions = [
    {
      label: 'Ajouter un document',
      icon: Plus,
      onClick: () => setShowUploadForm(true),
      variant: 'primary'
    }
  ];

  // Statistiques
  const totalDocuments = documents.length;
  const totalSize = documents.reduce((sum, doc) => sum + (doc.taille || 0), 0);
  const documentsParType = typesDocuments.map(type => ({
    type: type.label,
    count: documents.filter(d => d.type === type.value).length
  }));

  if (loading) {
    return (
      <PageLayout title="Gestion des Documents" icon={FileText}>
        <Loading text="Chargement des documents..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gestion des Documents"
      subtitle={`${totalDocuments} document(s) • ${formatFileSize(totalSize)} au total`}
      icon={FileText}
      actions={pageActions}
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
    >
      {/* Filtres */}
      <Card title="Filtres" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de document
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              {typesDocuments.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Documents"
          value={totalDocuments}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Espace Utilisé"
          value={formatFileSize(totalSize)}
          icon={Archive}
          color="orange"
        />
        <StatsCard
          title="Types"
          value={typesDocuments.length}
          icon={File}
          color="green"
        />
        <StatsCard
          title="Dernière Activité"
          value="Aujourd'hui"
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Formulaire d'upload */}
      {showUploadForm && (
        <Card title="Ajouter un nouveau document" className="mb-6">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du document *
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={uploadData.titre}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de document *
                  </label>
                  <select
                    name="type"
                    value={uploadData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {typesDocuments.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    name="categorie"
                    value={uploadData.categorie}
                    onChange={handleInputChange}
                    placeholder="Ex: Mathématiques, 6ème..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Télécharger un fichier</span>
                          <input
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, JPG, PNG jusqu'à 10MB
                      </p>
                      {uploadData.file && (
                        <p className="text-sm text-green-600 mt-2">
                          Fichier sélectionné: {uploadData.file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={uploadData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Description du document..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105"
              >
                Télécharger
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Liste des documents */}
      <Card title="Bibliothèque de documents">
        {filteredDocuments.length === 0 ? (
          <EmptyState
            title="Aucun document trouvé"
            description="Commencez par ajouter des documents à votre bibliothèque."
            icon={FileText}
            action={() => setShowUploadForm(true)}
            actionLabel="Ajouter un document"
          />
        ) : (
          <Table
            columns={columns}
            data={filteredDocuments}
            actions={actions}
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default GestionDocuments;
