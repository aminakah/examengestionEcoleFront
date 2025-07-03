import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const GestionEleves = () => {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    classe_id: '',
    date_naissance: '',
    adresse: '',
    telephone_parent: '',
    parent_nom: '',
    parent_prenom: '',
    parent_email: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [elevesRes, classesRes] = await Promise.all([
        apiService.get('/eleves'),
        apiService.get('/classes')
      ]);
      
      setEleves(elevesRes.data);
      setClasses(classesRes.data);
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
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.post('/eleves', formData);
      setEleves([...eleves, response.data]);
      setShowForm(false);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        classe_id: '',
        date_naissance: '',
        adresse: '',
        telephone_parent: '',
        parent_nom: '',
        parent_prenom: '',
        parent_email: ''
      });
      alert('Élève ajouté avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout de l\'élève');
    }
  };

  const getClasseNom = (classeId) => {
    const classe = classes.find(c => c.id === classeId);
    return classe ? classe.nom : 'Non assigné';
  };

  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Gestion des Élèves</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? 'Annuler' : 'Ajouter un élève'}
        </button>
      </div>      {showForm && (
        <div style={styles.formContainer}>
          <h2>Inscription d'un nouvel élève</h2>
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
              </div>
              <div style={styles.formGroup}>
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
              </div>              <div style={styles.formGroup}>
                <label style={styles.label}>Classe</label>
                <select
                  name="classe_id"
                  value={formData.classe_id}
                  onChange={handleInputChange}
                  style={styles.input}
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
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date de naissance</label>
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Adresse</label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                style={styles.textarea}
                required
              />
            </div>            <h3>Informations du parent/tuteur</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom du parent</label>
                <input
                  type="text"
                  name="parent_nom"
                  value={formData.parent_nom}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Prénom du parent</label>
                <input
                  type="text"
                  name="parent_prenom"
                  value={formData.parent_prenom}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email du parent</label>
                <input
                  type="email"
                  name="parent_email"
                  value={formData.parent_email}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>              <div style={styles.formGroup}>
                <label style={styles.label}>Téléphone du parent</label>
                <input
                  type="tel"
                  name="telephone_parent"
                  value={formData.telephone_parent}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <button type="submit" style={styles.submitButton}>
              Inscrire l'élève
            </button>
          </form>
        </div>
      )}

      <div style={styles.tableContainer}>
        <h2>Liste des élèves ({eleves.length})</h2>
        {eleves.length === 0 ? (
          <p style={styles.noData}>Aucun élève inscrit</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Prénom</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Classe</th>
                  <th style={styles.th}>Parent</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>              <tbody>
                {eleves.map(eleve => (
                  <tr key={eleve.id} style={styles.tableRow}>
                    <td style={styles.td}>{eleve.nom}</td>
                    <td style={styles.td}>{eleve.prenom}</td>
                    <td style={styles.td}>{eleve.email}</td>
                    <td style={styles.td}>{getClasseNom(eleve.classe_id)}</td>
                    <td style={styles.td}>
                      {eleve.parent_prenom} {eleve.parent_nom}
                    </td>
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
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical'
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

export default GestionEleves;