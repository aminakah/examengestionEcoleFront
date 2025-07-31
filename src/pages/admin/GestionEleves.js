import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Eye, Mail, Phone, MapPin, UserCheck, BookOpen } from 'lucide-react';
import { apiService } from '../../services/apiService';
import PageLayout from '../../components/PageLayout';
import { Card, Badge, Loading, EmptyState, Table, StatsCard } from '../../components/UIComponents';
import { getInitials, formatFullName, formatEmail } from '../../utils/formatters';
import Modal from '../../components/Modal';
import EleveForm from '../../components/profiles/admin/EleveForm';
import EleveDetailsModal from '../../components/profiles/admin/EleveDetailsModal';
import { api } from '../../services/api';

const GestionEleves = () => {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingEleve, setEditingEleve] = useState(null);
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [elevesRes, classesRes] = await Promise.all([
        api.get('/eleves'),
        api.get('/classes')
      ]);
      
      console.log(elevesRes.data);
      setEleves(elevesRes.data.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingEleve) {
        const response = await apiService.put(`/eleves/${editingEleve.id}`, formData);
        setEleves(eleves.map(eleve => 
          eleve.id === editingEleve.id ? response.data : eleve
        ));
      } else {
        const response = await apiService.post('/eleves', formData);
        setEleves([...eleves, response.data]);
      }
      closeModal();
      alert(editingEleve ? 'Élève modifié avec succès!' : 'Élève ajouté avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'élève');
      throw error; // Re-throw pour gérer le loading dans le form
    }
  };

  const handleEdit = (eleve) => {
    setEditingEleve(eleve);
    setShowModal(true);
  };

  const handleViewDetails = (eleve) => {
    setSelectedEleve(eleve);
    setShowDetailsModal(true);
  };

  const openAddModal = () => {
    setEditingEleve(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingEleve(null);
    setShowModal(false);
  };

  const closeDetailsModal = () => {
    setSelectedEleve(null);
    setShowDetailsModal(false);
  };

  const handleDelete = async (eleve) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      try {
        await apiService.delete(`/eleves/${eleve.id}`);
        setEleves(eleves.filter(e => e.id !== eleve.id));
        alert('Élève supprimé avec succès!');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'élève');
      }
    }
  };



  const filteredEleves = eleves.filter(eleve =>
    eleve.user.nom.toLowerCase().includes(searchTerm.toLowerCase())
     ||
    eleve.user.name.toLowerCase().includes(searchTerm.toLowerCase())
     ||
    eleve.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'nom',
      label: 'Nom complet',
      minWidth: '250px',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            {getInitials(row.user.prenom, value)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{formatFullName(row.user.prenom, value)}</div>
            <div className="text-sm text-gray-500">{formatEmail(row.user.email)}</div>
          </div>
        </div>
      )
    },
    {
      key: 'classe_nom',
      label: 'Classe',
      minWidth: '120px',
      render: (value,row) => (
        <Badge variant="info">{row.inscriptions[0]?.classe.nom}</Badge>
      )
    },
    {
      key: 'date_naissance',
      label: 'Date de naissance',
      minWidth: '150px',
      render: (value,row) => new Date(row.user.date_naissance).toLocaleDateString('fr-FR')
    },
    {
      key: 'parent_nom',
      label: 'Parent/Tuteur',
      minWidth: '200px',
      wrap: true,
      render: (value, row) => (
        <div>
          <div className="flex flex-wrap gap-1">
                {row.parents.map((parent, index) => (
              <div key={index}>
                   <div className="font-medium text-gray-900">{parent.user.name} {value}</div>
          <div className="text-sm text-gray-500">{parent.user.email}</div>
              </div>
                ))}
              </div>
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
    // {
    //   icon: Trash2,
    //   label: 'Supprimer',
    //   onClick: handleDelete,
    //   variant: 'danger'
    // }
  ];

  const pageActions = [
    {
      label: 'Ajouter un élève',
      icon: Plus,
      onClick: openAddModal,
      variant: 'primary'
    }
  ];

  if (loading) {
    return (
      <PageLayout title="Gestion des Élèves" icon={Users}>
        <Loading text="Chargement des élèves..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gestion des Élèves"
      subtitle={`${eleves.length} élève(s) enregistré(s)`}
      icon={Users}
      actions={pageActions}
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
    >
      {/* Modal pour le formulaire */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatsCard
                title="Total Eleves"
                value={eleves.length}
                icon={UserCheck}
                color="blue"
              />
              <StatsCard
                title="Total Classes"
                value={"18"}
                icon={BookOpen}
                color="indigo"
              />
          
            </div>
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingEleve ? 'Modifier l\'élève' : 'Ajouter un nouvel élève'}
        size="lg"
      >
        <EleveForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          classes={classes}
          initialData={editingEleve}
          isEditing={!!editingEleve}
        />
      </Modal>

      {/* Modal pour les détails */}
      <EleveDetailsModal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        eleve={selectedEleve}
      />

      {/* Liste des élèves */}
      <Card title="Liste des élèves">
        {filteredEleves.length === 0 ? (
          <EmptyState
            title="Aucun élève trouvé"
            description="Commencez par ajouter des élèves à votre système."
            icon={Users}
            action={openAddModal}
            actionLabel="Ajouter un élève"
          />
        ) : (
          <Table
            columns={columns}
            data={filteredEleves}
            actions={actions}
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default GestionEleves;
