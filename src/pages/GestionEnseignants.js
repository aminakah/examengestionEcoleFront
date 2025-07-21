import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit, Trash2, Mail, Phone, BookOpen, GraduationCap } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';
import { getInitials, formatFullName, formatEmail } from '../utils/formatters';

const GestionEnseignants = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEnseignant, setEditingEnseignant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    matiere_id: '',
    specialite: '',
    date_embauche: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [enseignantsRes, matieresRes] = await Promise.all([
        apiService.get('/enseignants'),
        apiService.get('/matieres')
      ]);
      
      setEnseignants(enseignantsRes.data);
      setMatieres(matieresRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      resetForm();
      alert(editingEnseignant ? 'Enseignant modifié avec succès!' : 'Enseignant ajouté avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'enseignant');
    }
  };

  const handleEdit = (enseignant) => {
    setEditingEnseignant(enseignant);
    setFormData({
      nom: enseignant.nom,
      prenom: enseignant.prenom,
      email: enseignant.email,
      telephone: enseignant.telephone,
      adresse: enseignant.adresse,
      matiere_id: enseignant.matiere_id,
      specialite: enseignant.specialite,
      date_embauche: enseignant.date_embauche
    });
    setShowForm(true);
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

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      matiere_id: '',
      specialite: '',
      date_embauche: ''
    });
    setEditingEnseignant(null);
    setShowForm(false);
  };

  const filteredEnseignants = enseignants.filter(enseignant =>
    enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (enseignant.matiere_nom && enseignant.matiere_nom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      key: 'nom',
      label: 'Enseignant',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
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
      label: 'Matière',
      render: (value) => (
        <Badge variant="success">{value}</Badge>
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
            <span>{value}</span>
          </div>
        </div>
      )
    },
    {
      key: 'date_embauche',
      label: 'Date d\'embauche',
      render: (value) => value ? new Date(value).toLocaleDateString('fr-FR') : 'Non renseignée'
    }
  ];

  const actions = [
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
      onClick: () => setShowForm(true),
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
          color="green"
        />
        <StatsCard
          title="Matières Enseignées"
          value={matieresEnseignees}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Qualification"
          value="100%"
          icon={GraduationCap}
          color="purple"
          trend="Certifiés"
        />
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card 
          title={editingEnseignant ? 'Modifier l\'enseignant' : 'Ajouter un nouvel enseignant'} 
          className="mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Informations personnelles
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <textarea
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Informations professionnelles */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Informations professionnelles
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matière enseignée *
                  </label>
                  <select
                    name="matiere_id"
                    value={formData.matiere_id}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une matière</option>
                    {matieres.map(matiere => (
                      <option key={matiere.id} value={matiere.id}>
                        {matiere.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialité
                  </label>
                  <input
                    type="text"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleInputChange}
                    placeholder="Ex: Algèbre, Littérature contemporaine..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'embauche
                  </label>
                  <input
                    type="date"
                    name="date_embauche"
                    value={formData.date_embauche}
                    onChange={handleInputChange}
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
                {editingEnseignant ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Liste des enseignants */}
      <Card title="Liste des enseignants">
        {filteredEnseignants.length === 0 ? (
          <EmptyState
            title="Aucun enseignant trouvé"
            description="Commencez par ajouter des enseignants à votre établissement."
            icon={UserCheck}
            action={() => setShowForm(true)}
            actionLabel="Ajouter un enseignant"
          />
        ) : (
          <Table
            columns={columns}
            data={filteredEnseignants}
            actions={actions}
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default GestionEnseignants;
