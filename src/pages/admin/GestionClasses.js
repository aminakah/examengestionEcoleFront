import React, { useState, useEffect } from 'react';
import { School, Plus, Edit, Trash2, Users, BookOpen, Eye } from 'lucide-react';
import { apiService } from '../../services/apiService';
import PageLayout from '../../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState, StatsCard } from '../../components/UIComponents';
import { getInitial } from '../../utils/formatters';
import Modal from '../../components/Modal';
import ClasseForm from '../../components/ClasseForm';
import ClasseDetailsModal from '../../components/ClasseDetailsModal';

const GestionClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingClasse, setEditingClasse] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ CORRECTION 1: Fonction utilitaire robuste pour extraire le nom du niveau
  const getNiveauName = (niveau) => {
    if (!niveau) return 'Non défini';
    
    // Si c'est un objet, essayer d'extraire le nom
    if (typeof niveau === 'object') {
      return niveau.nom || niveau.name || 'Niveau non défini';
    }    
    // Si c'est une string ou autre type primitif
    return String(niveau);
  };

  // ✅ CORRECTION 2: Fonction utilitaire robuste pour extraire l'effectif
  const getEffectif = (effectif) => {
    // Convertir en nombre et s'assurer que c'est valide
    const numEffectif = Number(effectif);
    return isNaN(numEffectif) ? 0 : Math.max(0, numEffectif);
  };

  // ✅ CORRECTION 3: Fonction pour normaliser les données de classe
  const normalizeClasseData = (classe) => {
    return {
      ...classe,
      nom: classe.nom || 'Classe sans nom',
      niveau: getNiveauName(classe.niveau),
      effectif: getEffectif(classe.effectif)
    };
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await apiService.get('/classes');
      console.log('📊 Structure des données classes:', response.data);      
      // Vérifier que les données sont bien un array
      let classesData = Array.isArray(response.data) ? response.data : [];
      
      // ✅ CORRECTION 4: Normaliser toutes les données avant de les stocker
      classesData = classesData.map(normalizeClasseData);
      
      // Debug : afficher la structure d'une classe pour comprendre le format
      if (classesData.length > 0) {
        console.log('📋 Exemple de classe normalisée:', classesData[0]);
      }
      
      setClasses(classesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setClasses([]); // S'assurer qu'on a toujours un array
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingClasse) {
        const response = await apiService.put(`/classes/${editingClasse.id}`, formData);
        const updatedClasse = normalizeClasseData(response.data);
        setClasses(classes.map(classe => 
          classe.id === editingClasse.id ? updatedClasse : classe
        ));      } else {
        const response = await apiService.post('/classes', formData);
        const newClasse = normalizeClasseData(response.data);
        setClasses([...classes, newClasse]);
      }
      closeModal();
      alert(editingClasse ? 'Classe modifiée avec succès!' : 'Classe ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la classe');
      throw error;
    }
  };

  // ✅ CORRECTION 5: Normaliser les données avant édition
  const handleEdit = (classe) => {
    const normalizedClasse = normalizeClasseData(classe);
    setEditingClasse(normalizedClasse);
    setShowModal(true);
  };

  const handleViewDetails = (classe) => {
    const normalizedClasse = normalizeClasseData(classe);
    setSelectedClasse(normalizedClasse);
    setShowDetailsModal(true);
  };

  const openAddModal = () => {
    setEditingClasse(null);
    setShowModal(true);
  };
  const closeModal = () => {
    setEditingClasse(null);
    setShowModal(false);
  };

  const closeDetailsModal = () => {
    setSelectedClasse(null);
    setShowDetailsModal(false);
  };

  const handleDelete = async (classe) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      try {
        await apiService.delete(`/classes/${classe.id}`);
        setClasses(classes.filter(c => c.id !== classe.id));
        alert('Classe supprimée avec succès!');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la classe');
      }
    }
  };

  // ✅ CORRECTION 6: Améliorer la fonction de filtrage
  const filteredClasses = Array.isArray(classes) ? classes.filter(classe => {
    const classeNom = (classe.nom || '').toLowerCase();
    const niveauNom = getNiveauName(classe.niveau).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return classeNom.includes(searchLower) || niveauNom.includes(searchLower);
  }) : [];
  const columns = [
    {
      key: 'nom',
      label: 'Nom de la classe',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {getInitial(value || 'C')}
          </div>
          <div>
            <div className="font-medium text-gray-900">{value || 'Nom non renseigné'}</div>
            <div className="text-sm text-gray-500">{getNiveauName(row.niveau)}</div>
          </div>
        </div>
      )
    },
    {
      key: 'niveau',
      label: 'Niveau',
      render: (value) => (
        <Badge variant="info">{getNiveauName(value)}</Badge>
      )
    },
    {
      key: 'effectif',
      label: 'Effectif',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{getEffectif(value)} élève{getEffectif(value) > 1 ? 's' : ''}</span>
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
      label: 'Ajouter une classe',
      icon: Plus,
      onClick: openAddModal,
      variant: 'primary'
    }
  ];

  // ✅ CORRECTION 7: Calculs statistiques sécurisés
  const totalClasses = Array.isArray(classes) ? classes.length : 0;
  const totalEleves = Array.isArray(classes) ? 
    classes.reduce((sum, classe) => sum + getEffectif(classe.effectif), 0) : 0;
  const moyenneEffectif = totalClasses > 0 ? Math.round(totalEleves / totalClasses) : 0;
  if (loading) {
    return (
      <PageLayout title="Gestion des Classes" icon={School}>
        <Loading text="Chargement des classes..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gestion des Classes"
      subtitle={`${totalClasses} classe(s) • ${totalEleves} élèves au total`}
      icon={School}
      actions={pageActions}
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Classes"
          value={totalClasses}
          icon={School}
          color="blue"
          trend={`+${Math.round((totalClasses / 10) * 100)}%`}
        />
        <StatsCard
          title="Total Élèves"
          value={totalEleves}
          icon={Users}
          color="indigo"
          trend={`${moyenneEffectif} moy/classe`}
        />        <StatsCard
          title="Effectif Moyen"
          value={moyenneEffectif}
          icon={BookOpen}
          color="purple"
          trend="Optimal"
        />
      </div>

      {/* Modal pour le formulaire */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingClasse ? 'Modifier la classe' : 'Ajouter une nouvelle classe'}
        size="lg"
      >
        <ClasseForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          initialData={editingClasse}
          isEditing={!!editingClasse}
        />
      </Modal>

      {/* Modal pour les détails */}
      <ClasseDetailsModal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        classe={selectedClasse}
      />

      {/* Liste des classes */}
      <Card title="Liste des classes">
        {filteredClasses.length === 0 ? (
          <EmptyState
            title="Aucune classe trouvée"
            description="Commencez par créer des classes pour votre établissement."
            icon={School}
            action={openAddModal}
            actionLabel="Ajouter une classe"
          />
        ) : (
          <Table
            columns={columns}
            data={filteredClasses}
            actions={actions}
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default GestionClasses;