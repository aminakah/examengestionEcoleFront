import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Award, Plus, Edit, Save, Users, BookOpen, Calculator, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/apiService';
import PageLayout from '../../components/PageLayout';
import { Card, Badge, Loading, EmptyState, StatsCard } from '../../components/UIComponents';
import { getInitials, formatFullName, formatEmail } from '../../utils/formatters';

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

  // États pour optimiser les appels API
  const [loadingEleves, setLoadingEleves] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [elevesCache, setElevesCache] = useState(new Map()); // Cache des élèves par classe
  const [notesCache, setNotesCache] = useState(new Map()); // Cache des notes

  // ✅ FIX 1: Chargement initial optimisé
  useEffect(() => {
    loadInitialData();
  }, []); // ← Pas de dépendances, exécuté une seule fois

  // ✅ FIX 2: useCallback pour éviter les re-créations de fonctions
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📚 [SaisieNotes] Chargement des données initiales...');
      
      const [classesRes, matieresRes] = await Promise.all([
        apiService.get('/classes'),
        apiService.get('/matieres')
      ]);
      
      console.log('✅ [SaisieNotes] Données initiales chargées');
      setClasses(classesRes.data);
      setMatieres(matieresRes.data);
    } catch (error) {
      console.error('❌ [SaisieNotes] Erreur lors du chargement initial:', error);
    } finally {
      setLoading(false);
    }
  }, []); // ← Pas de dépendances externes

  // ✅ FIX 3: Fonction loadEleves optimisée avec cache
  const loadEleves = useCallback(async (classeId) => {
    if (!classeId) return;
    
    // Vérifier le cache d'abord
    const cacheKey = classeId.toString();
    if (elevesCache.has(cacheKey)) {
      console.log('📋 [SaisieNotes] Élèves récupérés du cache pour classe:', classeId);
      setEleves(elevesCache.get(cacheKey));
      return;
    }
    
    try {
      setLoadingEleves(true);
      console.log('📡 [SaisieNotes] Chargement des élèves pour classe:', classeId);
      
      const response = await apiService.get(`/classes/${classeId}/eleves`);
      const elevesData = response.data;
      
      // Mettre en cache
      setElevesCache(prev => new Map(prev.set(cacheKey, elevesData)));
      setEleves(elevesData);
      
      console.log('✅ [SaisieNotes] Élèves chargés et mis en cache');
    } catch (error) {
      console.error('❌ [SaisieNotes] Erreur lors du chargement des élèves:', error);
      setEleves([]);
    } finally {
      setLoadingEleves(false);
    }
  }, [elevesCache]);

  // ✅ FIX 4: Fonction loadNotes optimisée avec cache
  const loadNotes = useCallback(async (classeId, matiereId) => {
    if (!classeId || !matiereId) return;
    
    // Clé de cache combinée
    const cacheKey = `${classeId}-${matiereId}`;
    if (notesCache.has(cacheKey)) {
      console.log('📋 [SaisieNotes] Notes récupérées du cache pour:', cacheKey);
      setNotes(notesCache.get(cacheKey));
      return;
    }
    
    try {
      setLoadingNotes(true);
      console.log('📡 [SaisieNotes] Chargement des notes pour:', cacheKey);
      
      const response = await apiService.get(`/notes?classe_id=${classeId}&matiere_id=${matiereId}`);
      const notesData = response.data;
      
      // Mettre en cache
      setNotesCache(prev => new Map(prev.set(cacheKey, notesData)));
      setNotes(notesData);
      
      console.log('✅ [SaisieNotes] Notes chargées et mises en cache');
    } catch (error) {
      console.error('❌ [SaisieNotes] Erreur lors du chargement des notes:', error);
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  }, [notesCache]);

  // ✅ FIX 5: useEffect optimisé avec debouncing
  useEffect(() => {
    if (!selectedClasse || !selectedMatiere) {
      setEleves([]);
      setNotes([]);
      return;
    }

    console.log('🔄 [SaisieNotes] Changement de sélection:', { selectedClasse, selectedMatiere });
    
    // Debounce pour éviter les appels trop fréquents
    const timeoutId = setTimeout(() => {
      loadEleves(selectedClasse);
      loadNotes(selectedClasse, selectedMatiere);
    }, 300); // 300ms de délai

    return () => {
      clearTimeout(timeoutId);
      console.log('⏹️ [SaisieNotes] Annulation du timeout précédent');
    };
  }, [selectedClasse, selectedMatiere, loadEleves, loadNotes]);

  // ✅ FIX 6: Gestion optimisée des changements de notes
  const handleNoteChange = useCallback((eleveId, value) => {
    const noteValue = value === '' ? null : parseFloat(value);
    
    setEleves(prevEleves => prevEleves.map(eleve => 
      eleve.id === eleveId 
        ? { ...eleve, note_temp: noteValue }
        : eleve
    ));
  }, []);

  // ✅ FIX 7: Sauvegarde individuelle optimisée
  const saveNote = useCallback(async (eleveId) => {
    const eleve = eleves.find(e => e.id === eleveId);
    if (!eleve || eleve.note_temp === undefined) return;

    try {
      console.log('💾 [SaisieNotes] Sauvegarde note pour élève:', eleveId);
      
      const noteData = {
        eleve_id: eleveId,
        matiere_id: selectedMatiere,
        note: eleve.note_temp,
        type: evaluationType,
        date_evaluation: evaluationDate
      };

      await apiService.post('/notes', noteData);
      
      // Mettre à jour l'élève et invalider le cache des notes
      setEleves(prevEleves => prevEleves.map(e => 
        e.id === eleveId 
          ? { ...e, note_actuelle: e.note_temp, note_temp: undefined }
          : e
      ));
      
      // Invalider le cache des notes pour cette combinaison
      const cacheKey = `${selectedClasse}-${selectedMatiere}`;
      setNotesCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(cacheKey);
        return newCache;
      });
      
      console.log('✅ [SaisieNotes] Note sauvegardée avec succès');
      alert('Note sauvegardée avec succès!');
    } catch (error) {
      console.error('❌ [SaisieNotes] Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la note');
    }
  }, [eleves, selectedMatiere, evaluationType, evaluationDate, selectedClasse]);

  // ✅ FIX 8: Sauvegarde groupée optimisée
  const saveAllNotes = useCallback(async () => {
    const elevesWithNotes = eleves.filter(e => e.note_temp !== undefined && e.note_temp !== null);
    
    if (elevesWithNotes.length === 0) {
      alert('Aucune note à sauvegarder');
      return;
    }

    try {
      console.log(`💾 [SaisieNotes] Sauvegarde groupée de ${elevesWithNotes.length} notes...`);
      
      // Préparer toutes les données
      const notesData = elevesWithNotes.map(eleve => ({
        eleve_id: eleve.id,
        matiere_id: selectedMatiere,
        note: eleve.note_temp,
        type: evaluationType,
        date_evaluation: evaluationDate
      }));

      // ✅ OPTIMISATION: Appel API groupé au lieu de multiples appels
      // Option 1: Si votre API supporte la sauvegarde en batch
      try {
        await apiService.post('/notes/batch', { notes: notesData });
      } catch (batchError) {
        // Option 2: Fallback avec Promise.all mais avec limitation
        console.log('📡 [SaisieNotes] Batch non supporté, utilisation de Promise.all avec limitation');
        
        // Traiter par chunks de 5 pour éviter la surcharge
        const chunkSize = 5;
        for (let i = 0; i < notesData.length; i += chunkSize) {
          const chunk = notesData.slice(i, i + chunkSize);
          const promises = chunk.map(noteData => apiService.post('/notes', noteData));
          await Promise.all(promises);
          
          // Petite pause entre les chunks
          if (i + chunkSize < notesData.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }
      
      // Mettre à jour tous les élèves
      setEleves(prevEleves => prevEleves.map(e => 
        e.note_temp !== undefined 
          ? { ...e, note_actuelle: e.note_temp, note_temp: undefined }
          : e
      ));
      
      // Invalider le cache des notes
      const cacheKey = `${selectedClasse}-${selectedMatiere}`;
      setNotesCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(cacheKey);
        return newCache;
      });
      
      console.log('✅ [SaisieNotes] Toutes les notes sauvegardées avec succès');
      alert(`${elevesWithNotes.length} note(s) sauvegardée(s) avec succès!`);
    } catch (error) {
      console.error('❌ [SaisieNotes] Erreur lors de la sauvegarde groupée:', error);
      alert('Erreur lors de la sauvegarde des notes');
    }
  }, [eleves, selectedMatiere, evaluationType, evaluationDate, selectedClasse]);

  // ✅ FIX 9: Memoization des données calculées
  const filteredEleves = useMemo(() => {
    return eleves.filter(eleve =>
      eleve.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [eleves, searchTerm]);

  // Statistiques memoizées
  const stats = useMemo(() => {
    const elevesAvecNotes = eleves.filter(e => e.note_actuelle !== null && e.note_actuelle !== undefined);
    const moyenneClasse = elevesAvecNotes.length > 0 
      ? Math.round((elevesAvecNotes.reduce((sum, e) => sum + e.note_actuelle, 0) / elevesAvecNotes.length) * 100) / 100
      : 0;
    const tauxCompletion = eleves.length > 0 ? Math.round((elevesAvecNotes.length / eleves.length) * 100) : 0;
    
    return { elevesAvecNotes, moyenneClasse, tauxCompletion };
  }, [eleves]);

  // ✅ FIX 10: Actions memoizées
  const pageActions = useMemo(() => {
    if (!selectedClasse || !selectedMatiere) return [];
    
    return [
      {
        label: 'Sauvegarder toutes les notes',
        icon: Save,
        onClick: saveAllNotes,
        variant: 'success'
      }
    ];
  }, [selectedClasse, selectedMatiere, saveAllNotes]);

  // ✅ FIX 11: Fonction de nettoyage du cache
  const clearCache = useCallback(() => {
    setElevesCache(new Map());
    setNotesCache(new Map());
    console.log('🧹 [SaisieNotes] Cache vidé');
  }, []);

  if (loading) {
    return (
      <PageLayout title="Saisie des Notes" icon={Award}>
        <Loading text="Chargement des données..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Saisie de Notes (Optimisée)"
      subtitle="Gérez les évaluations et notes des élèves - Version optimisée"
      icon={Award}
      actions={pageActions}
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
    >
      {/* Indicateurs de performance pour debug */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
        <div className="flex justify-between items-center">
          <span>🔧 Debug Performance:</span>
          <div className="flex gap-2">
            <span>Cache Élèves: {elevesCache.size}</span>
            <span>Cache Notes: {notesCache.size}</span>
            <button 
              onClick={clearCache}
              className="px-2 py-1 bg-blue-200 rounded text-xs hover:bg-blue-300"
            >
              Vider Cache
            </button>
          </div>
        </div>
      </div>

      {/* Filtres de sélection */}
      <Card title="Sélection de l'évaluation" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe *
            </label>
            <select
              value={selectedClasse}
              onChange={(e) => {
                console.log('📝 [SaisieNotes] Changement de classe:', e.target.value);
                setSelectedClasse(e.target.value);
              }}
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
              onChange={(e) => {
                console.log('📝 [SaisieNotes] Changement de matière:', e.target.value);
                setSelectedMatiere(e.target.value);
              }}
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
          {/* Indicateurs de chargement */}
          {(loadingEleves || loadingNotes) && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              ⏳ Chargement en cours... {loadingEleves && 'Élèves'} {loadingNotes && 'Notes'}
            </div>
          )}

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
              value={stats.elevesAvecNotes.length}
              icon={Award}
              color="green"
              trend={`${stats.tauxCompletion}% complété`}
            />
            <StatsCard
              title="Moyenne classe"
              value={`${stats.moyenneClasse}/20`}
              icon={Calculator}
              color="orange"
              trend={stats.moyenneClasse >= 10 ? "Satisfaisant" : "À améliorer"}
            />
            <StatsCard
              title="Progression"
              value={`${stats.tauxCompletion}%`}
              icon={TrendingUp}
              color="purple"
              trend={stats.tauxCompletion === 100 ? "Terminé" : "En cours"}
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