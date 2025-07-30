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
  ChevronRight,
  AlertCircle,
  Loader
} from 'lucide-react';

// Import des services API
import { 
  emploiTempsService, 
  classeService, 
  enseignantService, 
  matiereService 
} from '../../services/emploiTempsService';
import { api } from '../../services/api';
import notificationService from '../../services/notificationService';

const GestionEmploiDuTemps = () => {
  // États pour les données
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // États pour les données de l'API
  const [emploiDuTemps, setEmploiDuTemps] = useState([]);
  const [classes, setClasses] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);

  // Liste des salles (pourrait venir d'une API plus tard)
  const [salles] = useState([
    'Salle 101', 'Salle 102', 'Salle 103', 'Salle 201', 'Salle 202',
    'Labo Physique', 'Labo Chimie', 'Salle Info', 'CDI', 'Gymnase'
  ]);

  const [formData, setFormData] = useState({
    jour: 'Lundi',
    heure_debut: '',
    heure_fin: '',
    matiere: '',
    professeur: '',
    classe: '',
    salle: '',
    description: '',
    statut: 'actif'
  });

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const heures = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Hook pour charger les données initiales
  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  // Hook pour recharger l'emploi du temps quand les filtres changent
  useEffect(() => {
    if (isAuthenticated) {
      loadEmploiDuTemps();
    }
  }, [selectedFilter, isAuthenticated]);

  // Fonction pour vérifier l'authentification et charger les données
  const checkAuthAndLoadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Rafraîchir le token depuis localStorage
      api.refreshToken();
      
      // Vérifier l'authentification
      if (!api.isAuthenticated()) {
        setError('Vous devez être connecté pour accéder à cette page.');
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      await loadInitialData();
      
    } catch (error) {
      console.error('Erreur lors de la vérification d\'authentification:', error);
      setError('Erreur d\'authentification. Veuillez vous reconnecter.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger toutes les données initiales
  const loadInitialData = async () => {
    try {
      // Charger en parallèle toutes les données nécessaires
      const [classesResponse, enseignantsResponse, matieresResponse] = await Promise.all([
        classeService.getAll({ actif: true }),
        enseignantService.getAll(),
        matiereService.getAll()
      ]);

      // Traiter les réponses en tenant compte du format API
      setClasses(classesResponse.data || classesResponse || []);
      setEnseignants(enseignantsResponse.data || enseignantsResponse || []);
      setMatieres(matieresResponse.data || matieresResponse || []);

      // Charger l'emploi du temps
      await loadEmploiDuTemps();
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
      notificationService.error('Erreur lors du chargement des données');
    }
  };

  // Fonction pour charger l'emploi du temps
  const loadEmploiDuTemps = async () => {
    try {
      const filters = {};
      
      if (selectedFilter !== 'all') {
        filters.classe = selectedFilter;
      }

      const response = await emploiTempsService.getEmploiSemaine(filters);
      
      // Vérifier la structure de la réponse
      console.log('Response from API:', response);
      
      // Transformer les données pour correspondre au format attendu
      const emploisArray = [];
      const emploiData = response.data || response; // S'adapter aux deux formats possibles
      
      Object.entries(emploiData).forEach(([jour, cours]) => {
        if (Array.isArray(cours)) {
          cours.forEach(coursItem => {
            emploisArray.push({
              id: coursItem.id,
              jour: jour,
              heureDebut: coursItem.heure_debut,
              heureFin: coursItem.heure_fin,
              matiere: coursItem.matiere,
              enseignant: coursItem.professeur,
              classe: coursItem.classe,
              salle: coursItem.salle,
              description: coursItem.description,
              statut: coursItem.statut
            });
          });
        }
      });

      setEmploiDuTemps(emploisArray);
      
    } catch (error) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', error);
      notificationService.error('Erreur lors du chargement de l\'emploi du temps');
    }
  };

  // Fonction pour filtrer les cours
  const filteredCourses = emploiDuTemps.filter(cours => {
    const matchesSearch = cours.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cours.enseignant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cours.classe.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && cours.classe === selectedFilter;
  });

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Préparer les données pour l'API
      const apiData = {
        jour: formData.jour,
        heure_debut: formData.heure_debut,
        heure_fin: formData.heure_fin,
        matiere: formData.matiere,
        professeur: formData.professeur,
        classe: formData.classe,
        salle: formData.salle,
        description: formData.description,
        statut: formData.statut || 'actif'
      };
      
      if (editingCourse) {
        // Mise à jour
        const updateResponse = await emploiTempsService.update(editingCourse.id, apiData);
        console.log('Update response:', updateResponse);
        notificationService.success('Cours modifié avec succès');
      } else {
        // Création
        const createResponse = await emploiTempsService.create(apiData);
        console.log('Create response:', createResponse);
        notificationService.success('Cours créé avec succès');
      }
      
      // Recharger les données
      await loadEmploiDuTemps();
      resetForm();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Gestion des erreurs de validation
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        notificationService.error(errorMessages.join(', '));
      } else if (error.response?.data?.message) {
        notificationService.error(error.response.data.message);
      } else {
        notificationService.error('Erreur lors de la sauvegarde du cours');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      jour: 'Lundi',
      heure_debut: '',
      heure_fin: '',
      matiere: '',
      professeur: '',
      classe: '',
      salle: '',
      description: '',
      statut: 'actif'
    });
    setEditingCourse(null);
    setShowModal(false);
  };

  // Fonction pour éditer un cours
  const handleEdit = (cours) => {
    setFormData({
      jour: cours.jour,
      heure_debut: cours.heureDebut,
      heure_fin: cours.heureFin,
      matiere: cours.matiere,
      professeur: cours.enseignant,
      classe: cours.classe,
      salle: cours.salle,
      description: cours.description || '',
      statut: cours.statut || 'actif'
    });
    setEditingCourse(cours);
    setShowModal(true);
  };

  // Fonction pour supprimer un cours
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      setLoading(true);
      
      try {
        const deleteResponse = await emploiTempsService.delete(id);
        console.log('Delete response:', deleteResponse);
        notificationService.success('Cours supprimé avec succès');
        await loadEmploiDuTemps();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        if (error.response?.data?.message) {
          notificationService.error(error.response.data.message);
        } else {
          notificationService.error('Erreur lors de la suppression du cours');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Fonction pour obtenir les cours d'un jour
  const getCoursForDay = (jour) => {
    return filteredCourses
      .filter(cours => cours.jour === jour)
      .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));
  };

  // Fonction pour obtenir la couleur selon l'heure
  const getTimeColor = (heureDebut) => {
    const hour = parseInt(heureDebut.split(':')[0]);
    if (hour < 10) return 'bg-blue-100 text-blue-800';
    if (hour < 12) return 'bg-green-100 text-green-800';
    if (hour < 14) return 'bg-yellow-100 text-yellow-800';
    return 'bg-purple-100 text-purple-800';
  };

  // Composant de chargement
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <Loader className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">Chargement...</span>
    </div>
  );

  // Composant d'erreur
  const ErrorDisplay = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
        <span className="text-red-800">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );

  // Composant d'authentification manquante
  const AuthenticationRequired = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentification requise
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à la gestion de l'emploi du temps.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );

  // Si l'utilisateur n'est pas authentifié, afficher le composant d'authentification
  if (!loading && !isAuthenticated) {
    return <AuthenticationRequired />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 my-10">
      {/* Affichage de l'erreur si présente */}
      {error && (
        <ErrorDisplay 
          message={error} 
          onRetry={() => {
            setError(null);
            checkAuthAndLoadData();
          }} 
        />
      )}

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
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loading}
            >
              <option value="all">Toutes les classes</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.nom}>{classe.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Affichage du chargement */}
      {loading && <LoadingSpinner />}

      {/* Weekly Schedule */}
      {!loading && (
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
                              disabled={loading}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cours.id)}
                              disabled={loading}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
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
      )}

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
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
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
                    disabled={loading}
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
                      value={formData.heure_debut}
                      onChange={(e) => setFormData({...formData, heure_debut: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
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
                      value={formData.heure_fin}
                      onChange={(e) => setFormData({...formData, heure_fin: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    >
                      <option value="">Sélectionner</option>
                      {heures.map(heure => (
                        <option key={heure} value={heure}>{heure}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject - Using API data or manual input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matière
                  </label>
                  {matieres.length > 0 ? (
                    <select
                      value={formData.matiere}
                      onChange={(e) => setFormData({...formData, matiere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    >
                      <option value="">Sélectionner une matière</option>
                      {matieres.map(matiere => (
                        <option key={matiere.id} value={matiere.nom}>
                          {matiere.nom}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.matiere}
                      onChange={(e) => setFormData({...formData, matiere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Mathématiques"
                      required
                      disabled={loading}
                    />
                  )}
                </div>

                {/* Teacher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enseignant
                  </label>
                  {enseignants.length > 0 ? (
                    <select
                      value={formData.professeur}
                      onChange={(e) => setFormData({...formData, professeur: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    >
                      <option value="">Sélectionner un enseignant</option>
                      {enseignants.map(enseignant => (
                        <option key={enseignant.id} value={`${enseignant.user?.nom} ${enseignant.user?.prenom}`}>
                          {enseignant.user?.nom} {enseignant.user?.prenom} 
                          {enseignant.matieres?.[0] && ` - ${enseignant.matieres[0].nom}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.professeur}
                      onChange={(e) => setFormData({...formData, professeur: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom de l'enseignant"
                      required
                      disabled={loading}
                    />
                  )}
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
                    disabled={loading}
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
                    disabled={loading}
                  >
                    <option value="">Sélectionner une salle</option>
                    {salles.map(salle => (
                      <option key={salle} value={salle}>{salle}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description ou remarques sur le cours"
                    rows="2"
                    disabled={loading}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({...formData, statut: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="actif">Actif</option>
                    <option value="annule">Annulé</option>
                    <option value="reporte">Reporté</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
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
