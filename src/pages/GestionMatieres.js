import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Clock, Users, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';
import { getInitial } from '../utils/formatters';
import Modal from '../components/Modal';
import MatiereForm from '../components/MatiereForm';
import MatiereDetailsModal from '../components/MatiereDetailsModal';
import { schoolService, teacherService } from '../services';

const GestionMatieres = () => {
  const [niveaux, setNiveaux] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [anneesScolaires, setAnneesScolaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState(null);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // États pour les modals de feedback
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [matiereToDelete, setMatiereToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadMatieres();
  }, []);

  const loadMatieres = async () => {
    try {
      // Charger toutes les données en parallèle
      const [
        matieresResponse, 
        niveauxResponse, 
        enseignantsResponse, 
        anneesScolairesResponse
      ] = await Promise.all([
        apiService.get('/matieres'),
        schoolService.getNiveaux(),
        teacherService.getTeachers(),
        schoolService.getAnneesScolaires()
      ]);

      setMatieres(matieresResponse.data);
      setNiveaux(niveauxResponse.data);
      setEnseignants(enseignantsResponse.data);
      setAnneesScolaires(anneesScolairesResponse.data);
      
      console.log('Données chargées:', {
        matieres: matieresResponse.data.length,
        niveaux: niveauxResponse.data.length,
        enseignants: enseignantsResponse.data.length,
        anneesScolaires: anneesScolairesResponse.data.length,
        anneesScolairesData: anneesScolairesResponse.data
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingMatiere) {
        const response = await apiService.put(`/matieres/${editingMatiere.id}`, formData);
        console.log(response)
        if(response.success===true){
          console.log("response")
          loadMatieres()
          closeModal();
          setSuccessMessage('Matière modifiée avec succès!');
          setShowSuccessModal(true);
        }
      } else {
        console.log(formData)
        const response = await apiService.post('/matieres', formData);
        if(response.success===true){
          loadMatieres()
          closeModal();
          setSuccessMessage('Matière ajoutée avec succès!');
          setShowSuccessModal(true);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrorMessage(editingMatiere ? 'Erreur lors de la modification de la matière' : 'Erreur lors de l\'ajout de la matière');
      setShowErrorModal(true);
      throw error; // Re-throw pour gérer le loading dans le form
    }
  };

  const handleEdit = (matiere) => {
    setEditingMatiere(matiere);
    setShowModal(true);
  };

  const handleViewDetails = (matiere) => {
    setSelectedMatiere(matiere);
    setShowDetailsModal(true);
  };

  const openAddModal = () => {
    setEditingMatiere(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingMatiere(null);
    setShowModal(false);
  };

  const closeDetailsModal = () => {
    setSelectedMatiere(null);
    setShowDetailsModal(false);
  };

  const handleDelete = (matiere) => {
    setMatiereToDelete(matiere);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.delete(`/matieres/${matiereToDelete.id}`);
      setMatieres(matieres.filter(m => m.id !== matiereToDelete.id));
      setShowDeleteConfirm(false);
      setMatiereToDelete(null);
      setSuccessMessage('Matière supprimée avec succès!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setShowDeleteConfirm(false);
      setMatiereToDelete(null);
      setErrorMessage('Erreur lors de la suppression de la matière');
      setShowErrorModal(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setMatiereToDelete(null);
  };



  const filteredMatieres = matieres.filter(matiere =>
    matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    matiere.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'nom',
      label: 'Matière',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: row.couleur || '#3B82F6' }}
          >
            {getInitial(row.code)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{value || 'Matière non renseignée'}</div>
            <div className="text-sm text-gray-500">{row.code || 'Code non renseigné'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'coefficient',
      label: 'Coefficient',
      render: (value) => (
        <Badge variant={value >= 3 ? 'warning' : 'info'}>
          Coef. {value}
        </Badge>
      )
    },
    {
      key: 'Niveau',
      label: 'Niveau',
      render: (value, row) => (
        <span className="text-sm text-gray-600">
          {row.niveau.nom || 'Aucune niveau'}
        </span>
      )
    },
    {
      key: 'enseignants_count',
      label: 'Enseignants',
      render: (value,row) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{row.enseignants
[0]?.user?.name || "pas d'enseignant"} </span>
        </div>
      )
    }
  ];

  const actions = [
    {
      icon: Eye,
      label: 'Voir détails',
      onClick: handleViewDetails,
      variant: 'default'
    },
    {
      icon: Edit,
      label: 'Modifier',
      onClick: handleEdit,
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
      label: 'Ajouter une matière',
      icon: Plus,
      onClick: openAddModal,
      variant: 'primary'
    }
  ];

  // Statistiques
  const totalMatieres = matieres.length;
const coefficientMoyen = totalMatieres > 0 
  ? Math.round(
      (matieres.reduce((sum, m) => sum + (Number(m.coefficient) || 0), 0) / totalMatieres) * 10
    ) / 10 
  : 0;

  if (loading) {
    return (
      <PageLayout title="Gestion des Matières" icon={BookOpen}>
        <Loading text="Chargement des matières..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gestion des Matières"
      subtitle={`${totalMatieres} matière(s) • Coefficient moyen: ${coefficientMoyen}`}
      icon={BookOpen}
      actions={pageActions}
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Matières"
          value={totalMatieres}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Coefficient Moyen"
          value={coefficientMoyen}
          icon={Clock}
          color="indigo"
          trend="Équilibré"
        />
        <StatsCard
          title="Disciplines"
          value={Math.ceil(totalMatieres / 2)}
          icon={Users}
          color="purple"
          trend="Variées"
        />
      </div>

      {/* Modal pour le formulaire */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingMatiere ? 'Modifier la matière' : 'Ajouter une nouvelle matière'}
        size="xl"
      >
        <MatiereForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          niveaux={niveaux}
          enseignants={enseignants}
          anneesScolaires={anneesScolaires}
          initialData={editingMatiere}
          isEditing={!!editingMatiere}
        />
      </Modal>

      {/* Modal pour les détails */}
      <MatiereDetailsModal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        matiere={selectedMatiere}
      />

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        title="Confirmer la suppression"
        size="md"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Supprimer la matière
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Êtes-vous sûr de vouloir supprimer la matière{' '}
            <span className="font-medium text-gray-900">
              {matiereToDelete?.nom}
            </span> ? Cette action est irréversible.
          </p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de succès */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Opération réussie"
        size="md"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Succès
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {successMessage}
          </p>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Modal d'erreur */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Erreur"
        size="md"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {errorMessage}
          </p>
          <button
            onClick={() => setShowErrorModal(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Liste des matières */}
      <Card title="Liste des matières">
        {filteredMatieres.length === 0 ? (
          <EmptyState
            title="Aucune matière trouvée"
            description="Commencez par ajouter des matières à votre programme scolaire."
            icon={BookOpen}
            action={openAddModal}
            actionLabel="Ajouter une matière"
          />
        ) : (
          <Table
            columns={columns}
            data={filteredMatieres}
            actions={actions}
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default GestionMatieres;
