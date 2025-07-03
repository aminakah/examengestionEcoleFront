import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const GestionEnseignants = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    matieres: [],
    classes: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [enseignantsRes, matieresRes, classesRes] = await Promise.all([
        apiService.get('/enseignants'),
        apiService.get('/matieres'),
        apiService.get('/classes')
      ]);
      
      setEnseignants(enseignantsRes.data);
      setMatieres(matieresRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMultiSelectChange = (e, field) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData({
      ...formData,
      [field]: selectedValues
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.post('/enseignants', formData);
      setEnseignants([...enseignants, response.data]);
      setShowForm(false);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        matieres: [],
        classes: []
      });
      alert('Enseignant ajouté avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de l\'enseignant');
    }
  };  const getMatiereNoms = (matiereIds) => {
    return matiereIds.map(id => {
      const matiere = matieres.find(m => m.id === id);
      return matiere ? matiere.nom : '';
    }).filter(nom => nom).join(', ');
  };

  const getClasseNoms = (classeIds) => {
    return classeIds.map(id => {
      const classe = classes.find(c => c.id === id);
      return classe ? classe.nom : '';
    }).filter(nom => nom).join(', ');
  };

  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Gestion des Enseignants</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? 'Annuler' : 'Ajouter un enseignant'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formContainer}>
          <h2>Ajouter un nouvel enseignant</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>              <div style={styles.formGroup}>
                <label style={styles.label}>Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Matières enseignées</label>
                <select
                  multiple
                  value={formData.matieres}
                  onChange={(e) => handleMultiSelectChange(e, 'matieres')}
                  style={{...styles.input, height: '120px'}}
                >
                  {matieres.map(matiere => (
                    <option key={matiere.id} value={matiere.id}>
                      {matiere.nom}
                    </option>
                  ))}
                </select>
                <small style={styles.helpText}>
                  Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs matières
                </small>
              </div>              <div style={styles.formGroup}>
                <label style={styles.label}>Classes assignées</label>
                <select
                  multiple
                  value={formData.classes}
                  onChange={(e) => handleMultiSelectChange(e, 'classes')}
                  style={{...styles.input, height: '120px'}}
                >
                  {classes.map(classe => (
                    <option key={classe.id} value={classe.id}>
                      {classe.nom}
                    </option>
                  ))}
                </select>
                <small style={styles.helpText}>
                  Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs classes
                </small>
              </div>
            </div>

            <button type="submit" style={styles.submitButton}>
              Ajouter l'enseignant
            </button>
          </form>
        </div>
      )}

      <div style={styles.tableContainer}>
        <h2>Liste des enseignants ({enseignants.length})</h2>
        {enseignants.length === 0 ? (
          <p style={styles.noData}>Aucun enseignant enregistré</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Prénom</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Téléphone</th>
                  <th style={styles.th}>Matières</th>
                  <th style={styles.th}>Classes</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>              <tbody>
                {enseignants.map(enseignant => (
                  <tr key={enseignant.id} style={styles.tableRow}>
                    <td style={styles.td}>{enseignant.nom}</td>
                    <td style={styles.td}>{enseignant.prenom}</td>
                    <td style={styles.td}>{enseignant.email}</td>
                    <td style={styles.td}>{enseignant.telephone}</td>
                    <td style={styles.td}>{getMatiereNoms(enseignant.matieres)}</td>
                    <td style={styles.td}>{getClasseNoms(enseignant.classes)}</td>
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
};

const styles = {
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
  },  loading: {
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
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  helpText: {
    color: '#666',
    fontSize: '12px',
    marginTop: '4px'
  },  submitButton: {
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

export default GestionEnseignants;