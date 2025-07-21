import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Clock,
  User,
  BookOpen,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Search,
  Save,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const GestionEmploiDuTemps = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données d'exemple
  const [classes] = useState([
    { id: 1, nom: '6ème A' },
    { id: 2, nom: '6ème B' },
    { id: 3, nom: '5ème A' },
    { id: 4, nom: '4ème A' },
    { id: 5, nom: '3ème A' },
    { id: 6, nom: '2nde A' },
    { id: 7, nom: '1ère S' },
    { id: 8, nom: 'Terminale S' }
  ]);

  const [enseignants] = useState([
    { id: 1, nom: 'Mme Diop', matiere: 'Mathématiques' },
    { id: 2, nom: 'M. Sarr', matiere: 'Physique-Chimie' },
    { id: 3, nom: 'Mme Fall', matiere: 'Français' },
    { id: 4, nom: 'M. Ndiaye', matiere: 'Histoire-Géographie' },
    { id: 5, nom: 'Mme Ba', matiere: 'Anglais' }
  ]);

  const [salles] = useState([
    'Salle 101', 'Salle 102', 'Salle 103', 'Salle 201', 'Salle 202',
    'Labo Physique', 'Labo Chimie', 'Salle Info', 'CDI', 'Gymnase'
  ]);

  const [emploiDuTemps, setEmploiDuTemps] = useState([
    {
      id: 1,
      jour: 'Lundi',
      heureDebut: '08:00',
      heureFin: '09:30',
      matiere: 'Mathématiques',
      enseignant: 'Mme Diop',
      classe: '6ème A',
      salle: 'Salle 101'
    },
    {
      id: 2,
      jour: 'Lundi',
      heureDebut: '09:45',
      heureFin: '11:15',
      matiere: 'Français',
      enseignant: 'Mme Fall',
      classe: '6ème A',
      salle: 'Salle 102'
    },
    {
      id: 3,
      jour: 'Mardi',
      heureDebut: '08:00',
      heureFin: '09:30',
      matiere: 'Physique-Chimie',
      enseignant: 'M. Sarr',
      classe: '1ère S',
      salle: 'Labo Physique'
    },
    {
      id: 4,
      jour: 'Mercredi',
      heureDebut: '10:00',
      heureFin: '11:30',
      matiere: 'Histoire-Géographie',
      enseignant: 'M. Ndiaye',
      classe: 'Terminale S',
      salle: 'Salle 201'
    }
  ]);

  const [formData, setFormData] = useState({
    jour: 'Lundi',
    heureDebut: '',
    heureFin: '',
    matiere: '',
    enseignant: '',
    classe: '',
    salle: ''
  });

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const heures = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const filteredCourses = emploiDuTemps.filter(cours => {
    const matchesSearch = cours.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cours.enseignant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cours.classe.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && cours.classe === selectedFilter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCourse) {
      setEmploiDuTemps(prev => prev.map(cours =>
        cours.id === editingCourse.id ? { ...formData, id: editingCourse.id } : cours
      ));
    } else {
      const newCourse = {
        ...formData,
        id: Date.now()
      };
      setEmploiDuTemps(prev => [...prev, newCourse]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      jour: 'Lundi',
      heureDebut: '',
      heureFin: '',
      matiere: '',
      enseignant: '',
      classe: '',
      salle: ''
    });
    setEditingCourse(null);
    setShowModal(false);
  };

  const handleEdit = (cours) => {
    setFormData(cours);
    setEditingCourse(cours);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      setEmploiDuTemps(prev => prev.filter(cours => cours.id !== id));
    }
  };

  const getCoursForDay = (jour) => {
    return filteredCourses
      .filter(cours => cours.jour === jour)
      .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));
  };

  const getTimeColor = (heureDebut) => {
    const hour = parseInt(heureDebut.split(':')[0]);
    if (hour < 10) return 'bg-blue-100 text-blue-800';
    if (hour < 12) return 'bg-green-100 text-green-800';
    if (hour < 14) return 'bg-yellow-100 text-yellow-800';
    return 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 my-10 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion de l'Emploi du Temps
          </h1>
          <p className="text-gray-600">
            Planifiez et organisez les cours de la semaine
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Cours</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par matière, enseignant ou classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Filter by Class */}
          <div className="lg:w-64">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les classes</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.nom}>{classe.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Emploi du Temps Hebdomadaire</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-600">
                Semaine du {selectedWeek.toLocaleDateString('fr-FR')}
              </span>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 gap-px bg-gray-200 min-w-max">
            {jours.map(jour => (
              <div key={jour} className="bg-white min-w-64">
                {/* Day Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-center">{jour}</h3>
                </div>
                
                {/* Day Schedule */}
                <div className="p-4 space-y-3 min-h-96">
                  {getCoursForDay(jour).map(cours => (
                    <div
                      key={cours.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-blue-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getTimeColor(cours.heureDebut)}`}>
                          {cours.heureDebut} - {cours.heureFin}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(cours)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cours.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-1">{cours.matiere}</h4>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{cours.enseignant}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{cours.classe}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{cours.salle}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {getCoursForDay(jour).length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun cours planifié</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Course */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCourse ? 'Modifier le Cours' : 'Nouveau Cours'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Day Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jour
                  </label>
                  <select
                    value={formData.jour}
                    onChange={(e) => setFormData({...formData, jour: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {jours.map(jour => (
                      <option key={jour} value={jour}>{jour}</option>
                    ))}
                  </select>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure de début
                    </label>
                    <select
                      value={formData.heureDebut}
                      onChange={(e) => setFormData({...formData, heureDebut: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner</option>
                      {heures.map(heure => (
                        <option key={heure} value={heure}>{heure}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure de fin
                    </label>
                    <select
                      value={formData.heureFin}
                      onChange={(e) => setFormData({...formData, heureFin: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionner</option>
                      {heures.map(heure => (
                        <option key={heure} value={heure}>{heure}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matière
                  </label>
                  <input
                    type="text"
                    value={formData.matiere}
                    onChange={(e) => setFormData({...formData, matiere: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Mathématiques"
                    required
                  />
                </div>

                {/* Teacher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enseignant
                  </label>
                  <select
                    value={formData.enseignant}
                    onChange={(e) => setFormData({...formData, enseignant: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un enseignant</option>
                    {enseignants.map(enseignant => (
                      <option key={enseignant.id} value={enseignant.nom}>
                        {enseignant.nom} - {enseignant.matiere}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classe
                  </label>
                  <select
                    value={formData.classe}
                    onChange={(e) => setFormData({...formData, classe: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map(classe => (
                      <option key={classe.id} value={classe.nom}>{classe.nom}</option>
                    ))}
                  </select>
                </div>

                {/* Room */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salle
                  </label>
                  <select
                    value={formData.salle}
                    onChange={(e) => setFormData({...formData, salle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une salle</option>
                    {salles.map(salle => (
                      <option key={salle} value={salle}>{salle}</option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingCourse ? 'Modifier' : 'Créer'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEmploiDuTemps;