// SAUVEGARDE DU FICHIER ORIGINAL - Créée le $(date)
// Ce fichier contient la version originale avant optimisation

import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit, Save, Users, BookOpen, Calculator, TrendingUp } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';
import { getInitials, formatFullName, formatEmail } from '../utils/formatters';

const SaisieNotes = () => {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [evaluationType, setEvaluationType] = useState('devoir');
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClasse && selectedMatiere) {
      loadEleves();
      loadNotes();
    }
  }, [selectedClasse, selectedMatiere]);

  const loadData = async () => {
    try {
      const [classesRes, matieresRes] = await Promise.all([
        apiService.get('/classes'),
        apiService.get('/matieres')
      ]);
      
      console(classesRes.data);
      setClasses(classesRes.data);
      setMatieres(matieresRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEleves = async () => {
    if (!selectedClasse) return;
    
    try {
      const response = await apiService.get(`/classes/${selectedClasse}/eleves`);
      setEleves(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
    }
  };

  const loadNotes = async () => {
    if (!selectedClasse || !selectedMatiere) return;
    
    try {
      const response = await apiService.get(`/notes?classe_id=${selectedClasse}&matiere_id=${selectedMatiere}`);
      setNotes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    }
  };

  const handleNoteChange = (eleveId, value) => {
    const noteValue = value === '' ? null : parseFloat(value);
    
    setEleves(eleves.map(eleve => 
      eleve.id === eleveId 
        ? { ...eleve, note_temp: noteValue }
        : eleve
    ));
  };

  const saveNote = async (eleveId) => {
    const eleve = eleves.find(e => e.id === eleveId);
    if (!eleve || eleve.note_temp === undefined) return;

    try {
      const noteData = {
        eleve_id: eleveId,
        matiere_id: selectedMatiere,
        note: eleve.note_temp,
        type: evaluationType,
        date_evaluation: evaluationDate
      };

      await apiService.post('/notes', noteData);
      
      // Mettre à jour l'élève pour marquer la note comme sauvegardée
      setEleves(eleves.map(e => 
        e.id === eleveId 
          ? { ...e, note_actuelle: e.note_temp, note_temp: undefined }
          : e
      ));
      
      alert('Note sauvegardée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la note');
    }
  };

  const saveAllNotes = async () => {
    const elevesWithNotes = eleves.filter(e => e.note_temp !== undefined && e.note_temp !== null);
    
    if (elevesWithNotes.length === 0) {
      alert('Aucune note à sauvegarder');
      return;
    }

    try {
      const promises = elevesWithNotes.map(eleve => {
        const noteData = {
          eleve_id: eleve.id,
          matiere_id: selectedMatiere,
          note: eleve.note_temp,
          type: evaluationType,
          date_evaluation: evaluationDate
        };
        return apiService.post('/notes', noteData);
      });

      await Promise.all(promises);
      
      // Mettre à jour tous les élèves
      setEleves(eleves.map(e => 
        e.note_temp !== undefined 
          ? { ...e, note_actuelle: e.note_temp, note_temp: undefined }
          : e
      ));
      
      alert(`${elevesWithNotes.length} note(s) sauvegardée(s) avec succès!`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des notes');
    }
  };

  const filteredEleves = eleves.filter(eleve =>
    eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques
  const elevesAvecNotes = eleves.filter(e => e.note_actuelle !== null && e.note_actuelle !== undefined);
  const moyenneClasse = elevesAvecNotes.length > 0 
    ? Math.round((elevesAvecNotes.reduce((sum, e) => sum + e.note_actuelle, 0) / elevesAvecNotes.length) * 100) / 100
    : 0;
  const tauxCompletion = eleves.length > 0 ? Math.round((elevesAvecNotes.length / eleves.length) * 100) : 0;

  const pageActions = [
    {
      label: 'Sauvegarder toutes les notes',
      icon: Save,
      onClick: saveAllNotes,
      variant: 'success'
    }
  ];

  if (loading) {
    return (
      <PageLayout title="Saisie des Notes" icon={Award}>
        <Loading text="Chargement des données..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Saisie de nms Notes"
      subtitle="Gérez les évaluations et notes des élèves"
      icon={Award}
      actions={selectedClasse && selectedMatiere ? pageActions : []}
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
    >
      {/* Filtres de sélection */}
      <Card title="Sélection de l'évaluation" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe *
            </label>
            <select
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
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
              Matière *
            </label>
            <select
              value={selectedMatiere}
              onChange={(e) => setSelectedMatiere(e.target.value)}
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
              Type d'évaluation
            </label>
            <select
              value={evaluationType}
              onChange={(e) => setEvaluationType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="devoir">Devoir</option>
              <option value="composition">Composition</option>
              <option value="interrogation">Interrogation</option>
              <option value="examen">Examen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'évaluation
            </label>
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => setEvaluationDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {selectedClasse && selectedMatiere && (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Élèves"
              value={eleves.length}
              icon={Users}
              color="blue"
            />
            <StatsCard
              title="Notes saisies"
              value={elevesAvecNotes.length}
              icon={Award}
              color="green"
              trend={`${tauxCompletion}% complété`}
            />
            <StatsCard
              title="Moyenne classe"
              value={`${moyenneClasse}/20`}
              icon={Calculator}
              color="orange"
              trend={moyenneClasse >= 10 ? "Satisfaisant" : "À améliorer"}
            />
            <StatsCard
              title="Progression"
              value={`${tauxCompletion}%`}
              icon={TrendingUp}
              color="purple"
              trend={tauxCompletion === 100 ? "Terminé" : "En cours"}
            />
          </div>

          {/* Saisie des notes */}
          <Card title={`Saisie des notes - ${classes.find(c => c.id == selectedClasse)?.nom} - ${matieres.find(m => m.id == selectedMatiere)?.nom}`}>
            {filteredEleves.length === 0 ? (
              <EmptyState
                title="Aucun élève trouvé"
                description="Aucun élève n'est inscrit dans cette classe ou ne correspond à votre recherche."
                icon={Users}
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
                  <div className="col-span-4">Élève</div>
                  <div className="col-span-2">Note actuelle</div>
                  <div className="col-span-3">Nouvelle note (/20)</div>
                  <div className="col-span-2">Statut</div>
                  <div className="col-span-1">Action</div>
                </div>

                {filteredEleves.map(eleve => {
                  const hasChanges = eleve.note_temp !== undefined;
                  const noteDisplay = eleve.note_temp !== undefined ? eleve.note_temp : eleve.note_actuelle;
                  
                  return (
                    <div key={eleve.id} className="grid grid-cols-12 gap-4 py-4 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      {/* Informations élève */}
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {getInitials(eleve.prenom, eleve.nom)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatFullName(eleve.prenom, eleve.nom)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatEmail(eleve.email)}
                          </div>
                        </div>
                      </div>

                      {/* Note actuelle */}
                      <div className="col-span-2 flex items-center">
                        {eleve.note_actuelle !== null && eleve.note_actuelle !== undefined ? (
                          <Badge variant={eleve.note_actuelle >= 10 ? 'success' : 'danger'}>
                            {eleve.note_actuelle}/20
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Pas de note</span>
                        )}
                      </div>

                      {/* Saisie nouvelle note */}
                      <div className="col-span-3 flex items-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={eleve.note_temp || ''}
                          onChange={(e) => handleNoteChange(eleve.id, e.target.value)}
                          placeholder="0-20"
                          className={`w-full border rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            hasChanges ? 'border-orange-300 bg-orange-50' : 'border-gray-300'
                          }`}
                        />
                      </div>

                      {/* Statut */}
                      <div className="col-span-2 flex items-center">
                        {hasChanges ? (
                          <Badge variant="warning">Non sauvegardé</Badge>
                        ) : eleve.note_actuelle !== null ? (
                          <Badge variant="success">Sauvegardé</Badge>
                        ) : (
                          <Badge variant="default">Vide</Badge>
                        )}
                      </div>

                      {/* Action */}
                      <div className="col-span-1 flex items-center">
                        {hasChanges && (
                          <button
                            onClick={() => saveNote(eleve.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Sauvegarder cette note"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      )}

      {!selectedClasse || !selectedMatiere ? (
        <Card>
          <EmptyState
            title="Sélectionnez une classe et une matière"
            description="Pour commencer la saisie des notes, veuillez d'abord sélectionner une classe et une matière."
            icon={Award}
          />
        </Card>
      ) : null}
    </PageLayout>
  );
};

export default SaisieNotes;