import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Download, 
  Filter,
  Search,
  Eye,
  Calendar,
  Award
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import PageLayout from '../../components/PageLayout';
import { Card, Badge, Loading, EmptyState, StatsCard, Table } from '../../components/UIComponents';
import { getInitials, formatFullName } from '../../utils/formatters';
import { api } from '../../services/api';

/**
 * Composant de consultation des notes pour les administrateurs
 * Permet de visualiser toutes les notes de tous les élèves dans toutes les matières
 */
const ConsultationNotes = () => {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Chargement des données
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [elevesRes, classesRes, matieresRes, notesRes] = await Promise.all([
        api.get('/eleves'),
        api.get('/classes'),
        api.get('/matieres'),
        api.get('/notes')
      ]);
      
      setEleves(elevesRes.data || []);
      setClasses(classesRes.data || []);
      setMatieres(matieresRes.data || []);
      setNotes(notesRes.data || []);
      console.log(notesRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Données filtrées
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchClasse = !selectedClasse || note.classe_id?.toString() === selectedClasse;
      const matchMatiere = !selectedMatiere || note.matiere_id?.toString() === selectedMatiere;
      const matchPeriode = !selectedPeriode || note.periode === selectedPeriode;
      const matchSearch = !searchTerm || 
        note.eleve.user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.eleve.user.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchClasse && matchMatiere && matchPeriode && matchSearch;
    });
  }, [notes, selectedClasse, selectedMatiere, selectedPeriode, searchTerm]);

  // Statistiques
  const stats = useMemo(() => {
    const totalNotes = filteredNotes.length;
    const moyenneGenerale = totalNotes > 0 
      ? (filteredNotes.reduce((sum, note) => sum + parseFloat(note.note || 0), 0) / totalNotes).toFixed(2)
      : 0;
    
    const notesParMatiere = {};
    filteredNotes.forEach(note => {
      if (!notesParMatiere[note.matiere_nom]) {
        notesParMatiere[note.matiere_nom] = [];
      }
      notesParMatiere[note.matiere_nom].push(parseFloat(note.note || 0));
    });

    const elevesUniques = new Set(filteredNotes.map(note => note.eleve_id)).size;

    return {
      totalNotes,
      moyenneGenerale,
      elevesUniques,
      matieresActives: Object.keys(notesParMatiere).length
    };
  }, [filteredNotes]);

  // Colonnes pour le tableau
  const columns = [
    {
      key: 'eleve',
      title: 'Élève',
      render: (note) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {getInitials(note.eleve.user.name, note.eleve.user.nom)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {formatFullName(note.eleve?.user.name, note.eleve_nom)}
            </p>
            <p className="text-sm text-gray-500">{note.classe_nom}</p>
          </div>
        </div>
      )
    },
    {
      key: 'matiere',
      title: 'Matière',
      render: (note) => (
        <div>
          <span className="font-medium text-gray-900">{note.matiere_nom}</span>
          <p className="text-sm text-gray-500">Coef. {note.matiere_coefficient}</p>
        </div>
      )
    },
    {
      key: 'note',
      title: 'Note',
      render: (note) => {
        const noteValue = parseFloat(note.note);
        const badgeColor = noteValue >= 16 ? 'green' : 
                          noteValue >= 14 ? 'blue' : 
                          noteValue >= 12 ? 'yellow' : 
                          noteValue >= 10 ? 'orange' : 'red';
        
        return (
          <div className="text-center">
            <Badge variant={badgeColor} className="px-3 py-1 text-lg font-bold">
              {noteValue.toFixed(1)}/20
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{note.type_evaluation}</p>
          </div>
        );
      }
    },
    {
      key: 'periode',
      title: 'Période',
      render: (note) => (
        <div className="text-center">
          <span className="font-medium text-gray-900">{note.periode}</span>
          <p className="text-sm text-gray-500">
            {new Date(note.date_evaluation).toLocaleDateString()}
          </p>
        </div>
      )
    },
    {
      key: 'enseignant',
      title: 'Enseignant',
      render: (note) => (
        <div className="text-sm">
          <span className="text-gray-900">{note.enseignant_nom}</span>
        </div>
      )
    }
  ];

  // Actions (consultation uniquement)
  const actions = [
    {
      icon: Eye,
      label: 'Voir détails',
      onClick: (note) => {
        // Logique pour voir les détails de la note
        console.log('Voir détails de la note:', note);
      },
      className: 'text-blue-600 hover:text-blue-700'
    }
  ];

  // Export des données
  const handleExport = () => {
    const csvContent = [
      ['Élève', 'Classe', 'Matière', 'Note', 'Période', 'Date', 'Type', 'Enseignant'],
      ...filteredNotes.map(note => [
        `${note.eleve_prenom} ${note.eleve_nom}`,
        note.classe_nom,
        note.matiere_nom,
        note.note,
        note.periode,
        new Date(note.date_evaluation).toLocaleDateString(),
        note.type_evaluation,
        note.enseignant_nom
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `notes_consultation_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  if (loading) {
    return (
      <PageLayout title="Consultation des Notes" icon={BarChart3}>
        <Loading message="Chargement des notes..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Consultation des Notes" icon={BarChart3}>
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Notes"
          value={stats.totalNotes}
          icon={Award}
          color="blue"
        />
        <StatsCard
          title="Moyenne Générale"
          value={`${stats.moyenneGenerale}/20`}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Élèves"
          value={stats.elevesUniques}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Matières Actives"
          value={stats.matieresActives}
          icon={BookOpen}
          color="orange"
        />
      </div>

      {/* Filtres et actions */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un élève..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filtre par classe */}
              <select
                value={selectedClasse}
                onChange={(e) => setSelectedClasse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les classes</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>
                    {classe.nom}
                  </option>
                ))}
              </select>

              {/* Filtre par matière */}
              <select
                value={selectedMatiere}
                onChange={(e) => setSelectedMatiere(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les matières</option>
                {matieres.map((matiere) => (
                  <option key={matiere.id} value={matiere.id}>
                    {matiere.nom}
                  </option>
                ))}
              </select>

              {/* Filtre par période */}
              <select
                value={selectedPeriode}
                onChange={(e) => setSelectedPeriode(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les périodes</option>
                <option value="Trimestre 1">Trimestre 1</option>
                <option value="Trimestre 2">Trimestre 2</option>
                <option value="Trimestre 3">Trimestre 3</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tableau des notes */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Notes des Élèves ({filteredNotes.length})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Filter className="w-4 h-4" />
              <span>Consultation uniquement</span>
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <EmptyState
              title="Aucune note trouvée"
              description="Aucune note ne correspond aux critères de filtrage sélectionnés."
              icon={Award}
            />
          ) : (
            <Table
              columns={columns}
              data={filteredNotes}
              actions={actions}
            />
          )}
        </div>
      </Card>
    </PageLayout>
  );
};

export default ConsultationNotes;