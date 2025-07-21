import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit, Trash2, Mail, Phone, BookOpen, GraduationCap, Eye } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, TableWithAdvancedScroll, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';
import { getInitials, formatFullName, formatEmail } from '../utils/formatters';
import Modal from '../components/Modal';
import EnseignantForm from '../components/EnseignantForm';
import EnseignantDetailsModal from '../components/EnseignantDetailsModal';

const GestionEnseignants = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingEnseignant, setEditingEnseignant] = useState(null);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [enseignantsRes, matieresRes] = await Promise.all([
        apiService.get('/enseignants'),
        apiService.get('/matieres')
      ]);
      
      console.log(enseignantsRes.data);
      setEnseignants(enseignantsRes.data);
      setMatieres(matieresRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingEnseignant) {
        const response = await apiService.put(`/enseignants/${editingEnseignant.id}`, formData);
        setEnseignants(enseignants.map(enseignant => 
          enseignant.id === editingEnseignant.id ? response.data : enseignant
        ));
      } else {
        const response = await apiService.post('/enseignants', formData);
        setEnseignants([...enseignants, response.data]);
      }
      closeModal();
      alert(editingEnseignant ? 'Enseignant modifié avec succès!' : 'Enseignant ajouté avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'enseignant');
      throw error; // Re-throw pour gérer le loading dans le form
    }
  };

  const handleEdit = (enseignant) => {
    setEditingEnseignant(enseignant);
    setShowModal(true);
  };

  const handleViewDetails = (enseignant) => {
    setSelectedEnseignant(enseignant);
    setShowDetailsModal(true);
  };

  const openAddModal = () => {
    setEditingEnseignant(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingEnseignant(null);
    setShowModal(false);
  };

  const closeDetailsModal = () => {
    setSelectedEnseignant(null);
    setShowDetailsModal(false);
  };

  const handleDelete = async (enseignant) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      try {
        await apiService.delete(`/enseignants/${enseignant.id}`);
        setEnseignants(enseignants.filter(e => e.id !== enseignant.id));
        alert('Enseignant supprimé avec succès!');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'enseignant');
      }
    }
  };



  const filteredEnseignants = enseignants.filter(enseignant =>
    enseignant.user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (enseignant.matiere_nom && enseignant.matiere_nom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      key: 'nom',
      label: 'Enseignant',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            {getInitials(row.prenom, value)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{formatFullName(row.prenom, value)}</div>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>{formatEmail(row.email)}</span>
            </div>
          </div>
        </div>
      )
    },
   {
  key: 'matiere_nom',
  label: 'Matières',
  render: (value, row) => (
    <div className="flex flex-wrap gap-1">
      {row.matieres.map((matiere, index) => (
        <Badge key={index} variant="info">
          {matiere.code}
        </Badge>
      ))}
    </div>
  )
},
    {
      key: 'specialite',
      label: 'Spécialité',
      render: (value) => value || 'Non renseignée'
    },
    {
      key: 'telephone',
      label: 'Contact',
      render: (value, row) => (
        <div className="text-sm">
          <div className="flex items-center space-x-1">
            <Phone className="w-3 h-3 text-gray-400" />
            <span>{row.user.telephone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'date_embauche',
      label: 'Date d\'embauche',
      render: (value, row) => row.created_at ? new Date(row.created_at
).toLocaleDateString('fr-FR') : 'Non renseignée'
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
      label: 'Ajouter un enseignant',
      icon: Plus,
      onClick: openAddModal,
      variant: 'primary'
    }
  ];

  // Statistiques
  const totalEnseignants = enseignants.length;
  const matieresEnseignees = [...new Set(enseignants.map(e => e.matiere_id))].length;

  if (loading) {
    return (
      <PageLayout title="Gestion des Enseignants" icon={UserCheck}>
        <Loading text="Chargement des enseignants..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gestion des Enseignants"
      subtitle={`${totalEnseignants} enseignant(s) • ${matieresEnseignees} matières enseignées`}
      icon={UserCheck}
      actions={pageActions}
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Enseignants"
          value={totalEnseignants}
          icon={UserCheck}
          color="blue"
        />
        <StatsCard
          title="Matières Enseignées"
          value={matieresEnseignees}
          icon={BookOpen}
          color="indigo"
        />
        <StatsCard
          title="Qualification"
          value="100%"
          icon={GraduationCap}
          color="purple"
          trend="Certifiés"
        />
      </div>

      {/* Modal pour le formulaire */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingEnseignant ? 'Modifier l\'enseignant' : 'Ajouter un nouvel enseignant'}
        size="lg"
      >
        <EnseignantForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          matieres={matieres}
          initialData={editingEnseignant}
          isEditing={!!editingEnseignant}
        />
      </Modal>

      {/* Modal pour les détails */}
      <EnseignantDetailsModal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        enseignant={selectedEnseignant}
      />

      {/* Liste des enseignants */}
      <Card title="Liste des enseignants">
        {filteredEnseignants.length === 0 ? (
          <EmptyState
            title="Aucun enseignant trouvé"
            description="Commencez par ajouter des enseignants à votre établissement."
            icon={UserCheck}
            action={openAddModal}
            actionLabel="Ajouter un enseignant"
          />
        ) : (
          <TableWithAdvancedScroll
            columns={columns}
            data={filteredEnseignants}
            actions={actions}
            maxHeight="450px"
            itemsPerPage={12}
            showPagination={true}
            stickyHeader={true}
            stickyActions={true}
            emptyMessage="Aucun enseignant trouvé avec ces critères de recherche"
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default GestionEnseignants;
