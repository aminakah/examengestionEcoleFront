import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Clock, Users, Eye } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';
import { getInitial } from '../utils/formatters';
import Modal from '../components/Modal';
import MatiereForm from '../components/MatiereForm';
import MatiereDetailsModal from '../components/MatiereDetailsModal';

const GestionMatieres = () => {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState(null);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMatieres();
  }, []);

  const loadMatieres = async () => {
    try {
      const response = await apiService.get('/matieres');
      setMatieres(response.data);
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
        setMatieres(matieres.map(matiere => 
          matiere.id === editingMatiere.id ? response.data : matiere
        ));
      } else {
        const response = await apiService.post('/matieres', formData);
        setMatieres([...matieres, response.data]);
      }
      closeModal();
      alert(editingMatiere ? 'Matière modifiée avec succès!' : 'Matière ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la matière');
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

  const handleDelete = async (matiere) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      try {
        await apiService.delete(`/matieres/${matiere.id}`);
        setMatieres(matieres.filter(m => m.id !== matiere.id));
        alert('Matière supprimée avec succès!');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la matière');
      }
    }
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
      key: 'description',
      label: 'Description',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value || 'Aucune description'}
        </span>
      )
    },
    {
      key: 'enseignants_count',
      label: 'Enseignants',
      render: (value) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{value || 0} enseignant(s)</span>
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
    ? Math.round((matieres.reduce((sum, m) => sum + m.coefficient, 0) / totalMatieres) * 10) / 10 
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
        size="lg"
      >
        <MatiereForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
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
