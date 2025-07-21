import React, { useState } from 'react';
import { Users, Eye, Edit, Trash2, Star, Award, CheckCircle, XCircle } from 'lucide-react';
import { TableWithAdvancedScroll, Card, Badge } from './UIComponents';

// Données de démonstration
const generateDemoData = (count = 50) => {
  const prenoms = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Antoine', 'Claire', 'Lucas', 'Emma', 'Nicolas', 'Julie'];
  const noms = ['Dupont', 'Martin', 'Bernard', 'Durand', 'Robert', 'Petit', 'Roux', 'Vincent', 'Fournier', 'Morel'];
  const domaines = ['Informatique', 'Marketing', 'Finance', 'RH', 'Design', 'Commercial', 'Production'];
  const statuts = ['Actif', 'Inactif', 'En formation', 'En congé'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    prenom: prenoms[Math.floor(Math.random() * prenoms.length)],
    nom: noms[Math.floor(Math.random() * noms.length)],
    email: `user${index + 1}@example.com`,
    telephone: `06 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
    domaine: domaines[Math.floor(Math.random() * domaines.length)],
    statut: statuts[Math.floor(Math.random() * statuts.length)],
    dateInscription: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    score: Math.floor(Math.random() * 100),
    dernierConnexion: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    projets: Math.floor(Math.random() * 20),
    description: `Description détaillée de l'utilisateur ${index + 1} avec des informations complémentaires sur son profil et ses compétences.`
  }));
};

const TableScrollDemo = () => {
  const [data] = useState(() => generateDemoData(100));
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');

  // Configuration des colonnes
  const columns = [
    {
      key: 'nom',
      label: 'Utilisateur',
      minWidth: '280px',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {row.prenom.charAt(0)}{value.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.prenom} {value}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
            <div className="text-xs text-gray-400">{row.telephone}</div>
          </div>
        </div>
      )
    },
    {
      key: 'domaine',
      label: 'Domaine',
      minWidth: '140px',
      render: (value) => (
        <Badge variant="info" className="font-medium">
          {value}
        </Badge>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      minWidth: '120px',
      render: (value) => {
        const variants = {
          'Actif': 'success',
          'Inactif': 'danger', 
          'En formation': 'warning',
          'En congé': 'purple'
        };
        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              value === 'Actif' ? 'bg-green-500' : 
              value === 'Inactif' ? 'bg-red-500' :
              value === 'En formation' ? 'bg-yellow-500' : 'bg-purple-500'
            }`}></div>
            <Badge variant={variants[value]}>
              {value}
            </Badge>
          </div>
        );
      }
    },
    {
      key: 'score',
      label: 'Score',
      minWidth: '100px',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                value >= 80 ? 'bg-green-500' : 
                value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">{value}%</span>
        </div>
      )
    },
    {
      key: 'projets',
      label: 'Projets',
      minWidth: '90px',
      render: (value) => (
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">projets</div>
        </div>
      )
    },
    {
      key: 'dateInscription',
      label: 'Date inscription',
      minWidth: '130px',
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {value.toLocaleDateString('fr-FR')}
          </div>
          <div className="text-gray-500">
            {value.toLocaleDateString('fr-FR', { weekday: 'short' })}
          </div>
        </div>
      )
    },
    {
      key: 'dernierConnexion',
      label: 'Dernière connexion',
      minWidth: '150px',
      render: (value) => {
        const daysDiff = Math.floor((new Date() - value) / (1000 * 60 * 60 * 24));
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {value.toLocaleDateString('fr-FR')}
            </div>
            <div className={`text-xs ${
              daysDiff <= 7 ? 'text-green-600' : 
              daysDiff <= 30 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              Il y a {daysDiff} jour{daysDiff > 1 ? 's' : ''}
            </div>
          </div>
        );
      }
    },
    {
      key: 'description',
      label: 'Description',
      minWidth: '300px',
      wrap: true,
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 leading-relaxed">
            {value}
          </p>
        </div>
      )
    }
  ];

  // Configuration des actions
  const actions = [
    {
      icon: Eye,
      label: 'Voir les détails',
      onClick: (row) => alert(`Voir détails de ${row.prenom} ${row.nom}`),
      variant: 'default'
    },
    {
      icon: Edit,
      label: 'Modifier',
      onClick: (row) => alert(`Modifier ${row.prenom} ${row.nom}`),
      variant: 'default',
      disabled: (row) => row.statut === 'Inactif'
    },
    {
      icon: Star,
      label: 'Marquer comme favori',
      onClick: (row) => alert(`Favori: ${row.prenom} ${row.nom}`),
      variant: 'warning'
    },
    {
      icon: Trash2,
      label: 'Supprimer',
      onClick: (row) => {
        if (window.confirm(`Supprimer ${row.prenom} ${row.nom} ?`)) {
          alert('Supprimé !');
        }
      },
      variant: 'danger',
      disabled: (row) => row.statut === 'En formation'
    }
  ];

  // Fonction de recherche
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.prenom.toLowerCase().includes(term.toLowerCase()) ||
        item.nom.toLowerCase().includes(term.toLowerCase()) ||
        item.email.toLowerCase().includes(term.toLowerCase()) ||
        item.domaine.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Démonstration TableWithAdvancedScroll
          </h1>
          <p className="text-gray-600">
            Exemple d'utilisation du composant avec {data.length} utilisateurs fictifs
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou domaine..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredData.length} résultat{filteredData.length > 1 ? 's' : ''}
              </div>
            </div>
          </Card>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.filter(u => u.statut === 'Actif').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En formation</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {data.filter(u => u.statut === 'En formation').length}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactifs</p>
                <p className="text-2xl font-bold text-red-600">
                  {data.filter(u => u.statut === 'Inactif').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Tableau principal */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Liste des utilisateurs
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tableau avec scroll avancé, pagination et actions
            </p>
          </div>
          
          <TableWithAdvancedScroll
            columns={columns}
            data={filteredData}
            actions={actions}
            maxHeight="600px"
            itemsPerPage={20}
            showPagination={true}
            stickyHeader={true}
            stickyActions={true}
            emptyMessage="Aucun utilisateur ne correspond à vos critères de recherche"
            className="bg-white"
          />
        </Card>

        {/* Fonctionnalités */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fonctionnalités du tableau
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Scroll vertical et horizontal optimisé</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>En-têtes et actions collants</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Pagination intelligente</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Indicateurs visuels</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Actions conditionnelles</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configuration utilisée
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>maxHeight:</strong> 600px</div>
              <div><strong>itemsPerPage:</strong> 20</div>
              <div><strong>stickyHeader:</strong> true</div>
              <div><strong>stickyActions:</strong> true</div>
              <div><strong>showPagination:</strong> true</div>
              <div><strong>Colonnes:</strong> 8 avec largeurs personnalisées</div>
              <div><strong>Actions:</strong> 4 avec conditions</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TableScrollDemo;