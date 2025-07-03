import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const SaisieNotes = () => {
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [selectedPeriode, setSelectedPeriode] = useState('Trimestre 1');
  const [loading, setLoading] = useState(true);
  const [saisieNotes, setSaisieNotes] = useState({});

  const periodes = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClasse) {
      loadEleves();
    }
  }, [selectedClasse]);

  const loadData = async () => {
    try {
      const [classesRes, matieresRes] = await Promise.all([
        apiService.get('/classes'),
        apiService.get('/matieres')
      ]);
      
      setClasses(classesRes.data);
      setMatieres(matieresRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEleves = async () => {
    try {
      const elevesRes = await apiService.get('/eleves');
      const elevesClasse = elevesRes.data.filter(eleve => eleve.classe_id == selectedClasse);
      setEleves(elevesClasse);
      
      // Initialiser les notes existantes
      const notesInit = {};
      elevesClasse.forEach(eleve => {
        notesInit[eleve.id] = '';
      });
      setSaisieNotes(notesInit);
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
    }
  };  const handleNoteChange = (eleveId, note) => {
    setSaisieNotes({
      ...saisieNotes,
      [eleveId]: note
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedClasse || !selectedMatiere) {
      alert('Veuillez sélectionner une classe et une matière');
      return;
    }

    try {
      const notesToSave = Object.entries(saisieNotes)
        .filter(([eleveId, note]) => note !== '')
        .map(([eleveId, note]) => ({
          eleve_id: parseInt(eleveId),
          matiere_id: parseInt(selectedMatiere),
          note: parseFloat(note),
          periode: selectedPeriode,
          date: new Date().toISOString().split('T')[0],
          type: 'Devoir'
        }));

      // Simuler la sauvegarde des notes
      for (const noteData of notesToSave) {
        await apiService.post('/notes', noteData);
      }

      alert(`${notesToSave.length} notes sauvegardées avec succès!`);
      
      // Réinitialiser le formulaire
      const notesInit = {};
      eleves.forEach(eleve => {
        notesInit[eleve.id] = '';
      });
      setSaisieNotes(notesInit);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des notes');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Saisie des Notes</h1>
      
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Classe</label>
          <select
            value={selectedClasse}
            onChange={(e) => setSelectedClasse(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Sélectionner une classe</option>
            {classes.map(classe => (
              <option key={classe.id} value={classe.id}>
                {classe.nom}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Matière</label>
          <select
            value={selectedMatiere}
            onChange={(e) => setSelectedMatiere(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Sélectionner une matière</option>
            {matieres.map(matiere => (
              <option key={matiere.id} value={matiere.id}>
                {matiere.nom}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Période</label>
          <select
            value={selectedPeriode}
            onChange={(e) => setSelectedPeriode(e.target.value)}
            style={styles.select}
          >
            {periodes.map(periode => (
              <option key={periode} value={periode}>
                {periode}
              </option>
            ))}
          </select>
        </div>
      </div>      {selectedClasse && selectedMatiere && eleves.length > 0 && (
        <div style={styles.notesContainer}>
          <h2>
            Saisie des notes - {classes.find(c => c.id == selectedClasse)?.nom} - 
            {matieres.find(m => m.id == selectedMatiere)?.nom} - {selectedPeriode}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Nom</th>
                    <th style={styles.th}>Prénom</th>
                    <th style={styles.th}>Note (/20)</th>
                  </tr>
                </thead>
                <tbody>
                  {eleves.map(eleve => (
                    <tr key={eleve.id} style={styles.tableRow}>
                      <td style={styles.td}>{eleve.nom}</td>
                      <td style={styles.td}>{eleve.prenom}</td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={saisieNotes[eleve.id] || ''}
                          onChange={(e) => handleNoteChange(eleve.id, e.target.value)}
                          style={styles.noteInput}
                          placeholder="Note"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={styles.submitContainer}>
              <button type="submit" style={styles.submitButton}>
                Sauvegarder les notes
              </button>
            </div>
          </form>
        </div>
      )}      {selectedClasse && eleves.length === 0 && (
        <div style={styles.noData}>
          Aucun élève trouvé dans cette classe
        </div>
      )}
      
      {!selectedClasse && (
        <div style={styles.instruction}>
          Veuillez sélectionner une classe pour commencer la saisie des notes
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px'
  },
  title: {
    marginBottom: '30px',
    color: '#333'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px'
  },
  filtersContainer: {
    display: 'flex',
    gap: '20px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  filterGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333'
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },  notesContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  tableContainer: {
    marginTop: '20px',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontWeight: '600'
  },
  tableRow: {
    borderBottom: '1px solid #eee'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee'
  },
  noteInput: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '80px',
    textAlign: 'center'
  },
  submitContainer: {
    marginTop: '30px',
    textAlign: 'center'
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },  noData: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  instruction: {
    textAlign: 'center',
    color: '#666',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontSize: '16px'
  }
};

export default SaisieNotes;