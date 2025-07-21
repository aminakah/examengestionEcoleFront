import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Clock, Users } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';
import { getInitial } from '../utils/formatters';

const GestionMatieres = () => {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    coefficient: 1,
    couleur: '#3B82F6',
    description: ''
  });

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      resetForm();
      alert(editingMatiere ? 'Matière modifiée avec succès!' : 'Matière ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la matière');
    }
  };

  const handleEdit = (matiere) => {
    setEditingMatiere(matiere);
    setFormData({
      nom: matiere.nom,
      code: matiere.code,
      coefficient: matiere.coefficient,
      couleur: matiere.couleur || '#3B82F6',
      description: matiere.description || ''
    });
    setShowForm(true);
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

  const resetForm = () => {
    setFormData({
      nom: '',
      code: '',
      coefficient: 1,
      couleur: '#3B82F6',
      description: ''
    });
    setEditingMatiere(null);
    setShowForm(false);
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
      onClick: () => setShowForm(true),
      variant: 'primary'
    }
  ];

  // Statistiques
  const totalMatieres = matieres.length;
  const coefficientMoyen = totalMatieres > 0 
    ? Math.round((matieres.reduce((sum, m) => sum + m.coefficient, 0) / totalMatieres) * 10) / 10 
    : 0;

  // Couleurs prédéfinies
  const couleursPredefinies = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ];

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
          color="orange"
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

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card 
          title={editingMatiere ? 'Modifier la matière' : 'Ajouter une nouvelle matière'} 
          className="mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la matière *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Mathématiques, Français..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code matière *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: MATH, FR, ANG..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coefficient *
                  </label>
                  <input
                    type="number"
                    name="coefficient"
                    value={formData.coefficient}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur de la matière
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {couleursPredefinies.map(couleur => (
                      <button
                        key={couleur}
                        type="button"
                        onClick={() => setFormData({...formData, couleur})}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.couleur === couleur 
                            ? 'border-gray-800 scale-110' 
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: couleur }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleInputChange}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Description de la matière..."
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
                {editingMatiere ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Liste des matières */}
      <Card title="Liste des matières">
        {filteredMatieres.length === 0 ? (
          <EmptyState
            title="Aucune matière trouvée"
            description="Commencez par ajouter des matières à votre programme scolaire."
            icon={BookOpen}
            action={() => setShowForm(true)}
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
