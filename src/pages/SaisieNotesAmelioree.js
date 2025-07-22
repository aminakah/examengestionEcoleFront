import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import notificationService, { NotificationService } from '../services/notificationService';
import { 
  BookOpen, 
  Save, 
  Mail, 
  Users, 
  Calculator, 
  CheckCircle,
  AlertCircle,
  Filter,
  Plus,
  Edit2
} from 'lucide-react';

const SaisieNotesAmelioree = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [selectedPeriode, setSelectedPeriode] = useState('Trimestre 1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingNotifications, setSendingNotifications] = useState(false);
  const [newNotes, setNewNotes] = useState({});
  const [appreciations, setAppreciations] = useState({});

  const periodes = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClasse && selectedMatiere && selectedPeriode) {
      loadElevesAndNotes();
    }
  }, [selectedClasse, selectedMatiere, selectedPeriode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesRes, matieresRes] = await Promise.all([
        apiService.get('/classes'),
        apiService.get('/matieres')
      ]);
      
      setClasses(classesRes.data);
      
      // Filtrer les matières selon le rôle de l'utilisateur
      if (user.role === 'enseignant') {
        // Pour un enseignant, ne montrer que ses matières
        const mesMatiers = matieresRes.data.filter(matiere => 
          matiere.enseignant_id === user.id
        );
        setMatieres(mesMatiers);
      } else {
        setMatieres(matieresRes.data);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadElevesAndNotes = async () => {
    try {
      const [elevesRes, notesRes] = await Promise.all([
        apiService.get('/eleves'),
        apiService.get('/notes')
      ]);
      
      // Filtrer les élèves de la classe sélectionnée
      const elevesClasse = elevesRes.data.filter(eleve => 
        eleve.classe_id.toString() === selectedClasse
      );
      
      // Filtrer les notes existantes
      const notesExistantes = notesRes.data.filter(note =>
        note.classe_id?.toString() === selectedClasse &&
        note.matiere_id?.toString() === selectedMatiere &&
        note.periode === selectedPeriode
      );
      
      setEleves(elevesClasse);
      setNotes(notesExistantes);
      
      // Initialiser les nouvelles notes et appréciations
      const initialNotes = {};
      const initialAppreciations = {};
      
      elevesClasse.forEach(eleve => {
        const noteExistante = notesExistantes.find(note => note.eleve_id === eleve.id);
        initialNotes[eleve.id] = noteExistante?.note || '';
        initialAppreciations[eleve.id] = noteExistante?.appreciation || '';
      });
      
      setNewNotes(initialNotes);
      setAppreciations(initialAppreciations);
    } catch (error) {
      console.error('Erreur chargement élèves/notes:', error);
    }
  };

  const handleNoteChange = (eleveId, note) => {
    if (note === '' || (note >= 0 && note <= 20)) {
      setNewNotes(prev => ({
        ...prev,
        [eleveId]: note
      }));
    }
  };

  const handleAppreciationChange = (eleveId, appreciation) => {
    setAppreciations(prev => ({
      ...prev,
      [eleveId]: appreciation
    }));
  };

  const saveNotes = async () => {
    if (!selectedClasse || !selectedMatiere || !selectedPeriode) {
      alert('Veuillez sélectionner une classe, une matière et une période');
      return;
    }

    setSaving(true);
    try {
      const notesToSave = [];
      
      Object.entries(newNotes).forEach(([eleveId, note]) => {
        if (note !== '' && note >= 0 && note <= 20) {
          notesToSave.push({
            eleve_id: parseInt(eleveId),
            matiere_id: parseInt(selectedMatiere),
            classe_id: parseInt(selectedClasse),
            periode: selectedPeriode,
            note: parseFloat(note),
            appreciation: appreciations[eleveId] || '',
            enseignant_id: user.id,
            date_saisie: new Date().toISOString()
          });
        }
      });

      if (notesToSave.length === 0) {
        alert('Aucune note valide à sauvegarder');
        return;
      }

      // Sauvegarder les notes
      for (const noteData of notesToSave) {
        await apiService.post('/notes', noteData);
      }

      alert(`${notesToSave.length} note(s) sauvegardée(s) avec succès`);
      
      // Recharger les données
      await loadElevesAndNotes();
      
    } catch (error) {
      console.error('Erreur sauvegarde notes:', error);
      alert('Erreur lors de la sauvegarde des notes');
    } finally {
      setSaving(false);
    }
  };

  const sendNotificationsToParents = async () => {
    if (!selectedClasse || !selectedMatiere) {
      alert('Veuillez sélectionner une classe et une matière');
      return;
    }

    setSendingNotifications(true);
    try {
      const matiereInfo = matieres.find(m => m.id.toString() === selectedMatiere);
      let successCount = 0;
      
      for (const eleve of eleves) {
        const note = newNotes[eleve.id];
        
        if (note !== '' && note >= 0 && note <= 20 && eleve.parent_email) {
          const parent = {
            nom: eleve.parent_nom || 'Parent',
            email: eleve.parent_email
          };

          const result = await notificationService.sendNewGradeNotification(
            parent,
            eleve,
            matiereInfo?.nom || 'Matière',
            note,
            appreciations[eleve.id] || ''
          );

          if (result.success) {
            successCount++;
          }
          
          // Délai entre les envois
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      alert(`Notifications envoyées à ${successCount} parents`);
    } catch (error) {
      console.error('Erreur envoi notifications:', error);
      alert('Erreur lors de l\'envoi des notifications');
    } finally {
      setSendingNotifications(false);
    }
  };

  const calculateStatistiques = () => {
    const notesValides = Object.values(newNotes)
      .filter(note => note !== '' && note >= 0 && note <= 20)
      .map(note => parseFloat(note));

    if (notesValides.length === 0) return null;

    const moyenne = (notesValides.reduce((sum, note) => sum + note, 0) / notesValides.length).toFixed(2);
    const noteMax = Math.max(...notesValides);
    const noteMin = Math.min(...notesValides);
    const notesSuperieur10 = notesValides.filter(note => note >= 10).length;
    const tauxReussite = ((notesSuperieur10 / notesValides.length) * 100).toFixed(1);

    return {
      moyenne,
      noteMax,
      noteMin,
      nombreNotes: notesValides.length,
      tauxReussite
    };
  };

  const getAppreciationSuggestion = (note) => {
    if (note >= 16) return "Excellent travail";
    if (note >= 14) return "Très bon travail";
    if (note >= 12) return "Bon travail";
    if (note >= 10) return "Travail satisfaisant";
    if (note >= 8) return "Travail moyen, peut mieux faire";
    return "Travail insuffisant, doit faire des efforts";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
  }

  const stats = calculateStatistiques();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 my-10  ">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <BookOpen className="mr-3 text-blue-500" />
            Saisie des Notes
          </h2>
          <div className="text-sm text-gray-500">
            Enseignant: {user.name}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe
            </label>
            <select
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.id}>{classe.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matière
            </label>
            <select
              value={selectedMatiere}
              onChange={(e) => setSelectedMatiere(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map(matiere => (
                <option key={matiere.id} value={matiere.id}>
                  {matiere.nom} (Coeff: {matiere.coefficient})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periodes.map(periode => (
                <option key={periode} value={periode}>{periode}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={saveNotes}
            disabled={saving || !selectedClasse || !selectedMatiere}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder Notes'}
          </button>

          <button
            onClick={sendNotificationsToParents}
            disabled={sendingNotifications || !selectedClasse || !selectedMatiere}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-4 h-4 mr-2" />
            {sendingNotifications ? 'Envoi...' : 'Notifier Parents'}
          </button>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-500" />
            Statistiques de la saisie
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.moyenne}</div>
              <div className="text-sm text-gray-500">Moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.noteMax}</div>
              <div className="text-sm text-gray-500">Note max</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.noteMin}</div>
              <div className="text-sm text-gray-500">Note min</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.nombreNotes}</div>
              <div className="text-sm text-gray-500">Notes saisies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.tauxReussite}%</div>
              <div className="text-sm text-gray-500">Taux réussite</div>
            </div>
          </div>
        </div>
      )}

      {/* Saisie des notes */}
      {selectedClasse && selectedMatiere && selectedPeriode && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Élèves de la classe ({eleves.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note actuelle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nouvelle note (/20)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appréciation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eleves.map(eleve => {
                  const noteActuelle = notes.find(note => note.eleve_id === eleve.id);
                  const nouvelleNote = newNotes[eleve.id];
                  
                  return (
                    <tr key={eleve.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {eleve.prenom} {eleve.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {eleve.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {noteActuelle ? (
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            noteActuelle.note >= 10 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {noteActuelle.note}/20
                          </span>
                        ) : (
                          <span className="text-gray-400">Aucune note</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={nouvelleNote}
                          onChange={(e) => handleNoteChange(eleve.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Note"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={appreciations[eleve.id] || ''}
                          onChange={(e) => handleAppreciationChange(eleve.id, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                          placeholder="Appréciation..."
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {nouvelleNote && nouvelleNote >= 0 && nouvelleNote <= 20 && (
                          <button
                            onClick={() => {
                              const suggestion = getAppreciationSuggestion(parseFloat(nouvelleNote));
                              handleAppreciationChange(eleve.id, suggestion);
                            }}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="Suggestion d'appréciation"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedClasse && selectedMatiere && selectedPeriode && eleves.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun élève trouvé</h3>
          <p className="text-gray-500">
            Aucun élève n'est inscrit dans cette classe.
          </p>
        </div>
      )}
    </div>
  );
};

export default SaisieNotesAmelioree;
