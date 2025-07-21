import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Eye, Mail, Phone, MapPin } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState } from '../components/UIComponents';
import { getInitials, formatFullName, formatEmail } from '../utils/formatters';

const GestionEleves = () => {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEleve, setEditingEleve] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    classe_id: '',
    date_naissance: '',
    adresse: '',
    telephone_parent: '',
    parent_nom: '',
    parent_prenom: '',
    parent_email: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [elevesRes, classesRes] = await Promise.all([
        apiService.get('/eleves'),
        apiService.get('/classes')
      ]);
      
      setEleves(elevesRes.data);
      setClasses(classesRes.data);
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
      if (editingEleve) {
        const response = await apiService.put(`/eleves/${editingEleve.id}`, formData);
        setEleves(eleves.map(eleve => 
          eleve.id === editingEleve.id ? response.data : eleve
        ));
      } else {
        const response = await apiService.post('/eleves', formData);
        setEleves([...eleves, response.data]);
      }
      resetForm();
      alert(editingEleve ? 'Élève modifié avec succès!' : 'Élève ajouté avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'élève');
    }
  };

  const handleEdit = (eleve) => {
    setEditingEleve(eleve);
    setFormData({
      nom: eleve.nom,
      prenom: eleve.prenom,
      email: eleve.email,
      classe_id: eleve.classe_id,
      date_naissance: eleve.date_naissance,
      adresse: eleve.adresse,
      telephone_parent: eleve.telephone_parent,
      parent_nom: eleve.parent_nom,
      parent_prenom: eleve.parent_prenom,
      parent_email: eleve.parent_email
    });
    setShowForm(true);
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

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      classe_id: '',
      date_naissance: '',
      adresse: '',
      telephone_parent: '',
      parent_nom: '',
      parent_prenom: '',
      parent_email: ''
    });
    setEditingEleve(null);
    setShowForm(false);
  };

  const filteredEleves = eleves.filter(eleve =>
    eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'nom',
      label: 'Nom complet',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            {getInitials(row.prenom, value)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{formatFullName(row.prenom, value)}</div>
            <div className="text-sm text-gray-500">{formatEmail(row.email)}</div>
          </div>
        </div>
      )
    },
    {
      key: 'classe_nom',
      label: 'Classe',
      render: (value) => (
        <Badge variant="info">{value}</Badge>
      )
    },
    {
      key: 'date_naissance',
      label: 'Date de naissance',
      render: (value) => new Date(value).toLocaleDateString('fr-FR')
    },
    {
      key: 'parent_nom',
      label: 'Parent/Tuteur',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{row.parent_prenom} {value}</div>
          <div className="text-sm text-gray-500">{row.parent_email}</div>
        </div>
      )
    }
  ];

  const actions = [
    {
      icon: Eye,
      label: 'Voir',
      onClick: (eleve) => console.log('Voir', eleve),
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
      label: 'Ajouter un élève',
      icon: Plus,
      onClick: () => setShowForm(true),
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
      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card 
          title={editingEleve ? 'Modifier l\'élève' : 'Ajouter un nouvel élève'} 
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
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    value={formData.date_naissance}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classe *
                  </label>
                  <select
                    name="classe_id"
                    value={formData.classe_id}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map(classe => (
                      <option key={classe.id} value={classe.id}>
                        {classe.nom}
                      </option>
                    ))}
                  </select>
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

              {/* Informations parent/tuteur */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Informations parent/tuteur
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du parent/tuteur
                  </label>
                  <input
                    type="text"
                    name="parent_nom"
                    value={formData.parent_nom}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom du parent/tuteur
                  </label>
                  <input
                    type="text"
                    name="parent_prenom"
                    value={formData.parent_prenom}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email du parent/tuteur
                  </label>
                  <input
                    type="email"
                    name="parent_email"
                    value={formData.parent_email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone du parent/tuteur
                  </label>
                  <input
                    type="tel"
                    name="telephone_parent"
                    value={formData.telephone_parent}
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
                {editingEleve ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Liste des élèves */}
      <Card title="Liste des élèves">
        {filteredEleves.length === 0 ? (
          <EmptyState
            title="Aucun élève trouvé"
            description="Commencez par ajouter des élèves à votre système."
            icon={Users}
            action={() => setShowForm(true)}
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
