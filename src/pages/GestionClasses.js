import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const GestionClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
      const response = await apiService.post('/classes', formData);
      setClasses([...classes, response.data]);
      setShowForm(false);
      setFormData({ nom: '', niveau: '', effectif: 0 });
      alert('Classe ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de la classe');
    }
  };  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Gestion des Classes</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? 'Annuler' : 'Ajouter une classe'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formContainer}>
          <h2>Ajouter une nouvelle classe</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom de la classe</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Ex: 6ème A"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Niveau</label>
                <select
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                >
                  <option value="">Sélectionner un niveau</option>
                  {niveaux.map(niveau => (
                    <option key={niveau} value={niveau}>
                      {niveau}
                    </option>
                  ))}
                </select>
              </div>
            </div>            <div style={styles.formGroup}>
              <label style={styles.label}>Effectif maximum</label>
              <input
                type="number"
                name="effectif"
                value={formData.effectif}
                onChange={handleInputChange}
                style={styles.input}
                min="1"
                placeholder="Ex: 30"
                required
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              Ajouter la classe
            </button>
          </form>
        </div>
      )}

      <div style={styles.tableContainer}>
        <h2>Liste des classes ({classes.length})</h2>
        {classes.length === 0 ? (
          <p style={styles.noData}>Aucune classe créée</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Niveau</th>
                  <th style={styles.th}>Effectif</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(classe => (
                  <tr key={classe.id} style={styles.tableRow}>
                    <td style={styles.td}>{classe.nom}</td>
                    <td style={styles.td}>{classe.niveau}</td>
                    <td style={styles.td}>{classe.effectif}</td>
                    <td style={styles.td}>
                      <button style={styles.actionButton}>Modifier</button>
                      <button style={{...styles.actionButton, backgroundColor: '#dc3545'}}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formRow: {
    display: 'flex',
    gap: '20px'
  },
  formGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333'
  },  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    alignSelf: 'flex-start'
  },
  tableContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '40px'
  },
  tableWrapper: {
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
  actionButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '8px'
  }
};

export default GestionClasses;