import React, { useState, useEffect } from 'react';
import { School, Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';
import { getInitial } from '../utils/formatters';

const GestionClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClasse, setEditingClasse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    niveau: '',
    effectif: 0
  });

  const niveaux = ['6ème', '5ème', '4ème', '3ème'];

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await apiService.get('/classes');
      setClasses(response.data);
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
      if (editingClasse) {
        const response = await apiService.put(`/classes/${editingClasse.id}`, formData);
        setClasses(classes.map(classe => 
          classe.id === editingClasse.id ? response.data : classe
        ));
      } else {
        const response = await apiService.post('/classes', formData);
        setClasses([...classes, response.data]);
      }
      resetForm();
      alert(editingClasse ? 'Classe modifiée avec succès!' : 'Classe ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la classe');
    }
  };

  const handleEdit = (classe) => {
    setEditingClasse(classe);
    setFormData({
      nom: classe.nom,
      niveau: classe.niveau,
      effectif: classe.effectif
    });
    setShowForm(true);
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

  const resetForm = () => {
    setFormData({ nom: '', niveau: '', effectif: 0 });
    setEditingClasse(null);
    setShowForm(false);
  };

  const filteredClasses = classes.filter(classe =>
    classe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.niveau.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'nom',
      label: 'Nom de la classe',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {getInitial(value)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{value || 'Nom non renseigné'}</div>
            <div className="text-sm text-gray-500">{row.niveau || 'Niveau non renseigné'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'niveau',
      label: 'Niveau',
      render: (value) => (
        <Badge variant="info">{value}</Badge>
      )
    },
    {
      key: 'effectif',
      label: 'Effectif',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{value} élèves</span>
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
      label: 'Ajouter une classe',
      icon: Plus,
      onClick: () => setShowForm(true),
      variant: 'primary'
    }
  ];

  // Statistiques
  const totalClasses = classes.length;
  const totalEleves = classes.reduce((sum, classe) => sum + classe.effectif, 0);
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
          color="purple"
          trend={`+${Math.round((totalClasses / 10) * 100)}%`}
        />
        <StatsCard
          title="Total Élèves"
          value={totalEleves}
          icon={Users}
          color="blue"
          trend={`${moyenneEffectif} moy/classe`}
        />
        <StatsCard
          title="Effectif Moyen"
          value={moyenneEffectif}
          icon={BookOpen}
          color="green"
          trend="Optimal"
        />
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <Card 
          title={editingClasse ? 'Modifier la classe' : 'Ajouter une nouvelle classe'} 
          className="mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la classe *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: 6ème A, 5ème B..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau *
                </label>
                <select
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un niveau</option>
                  {niveaux.map(niveau => (
                    <option key={niveau} value={niveau}>
                      {niveau}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effectif prévu
                </label>
                <input
                  type="number"
                  name="effectif"
                  value={formData.effectif}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="30"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                {editingClasse ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Liste des classes */}
      <Card title="Liste des classes">
        {filteredClasses.length === 0 ? (
          <EmptyState
            title="Aucune classe trouvée"
            description="Commencez par créer des classes pour votre établissement."
            icon={School}
            action={() => setShowForm(true)}
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
