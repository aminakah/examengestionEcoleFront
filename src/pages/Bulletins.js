import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const Bulletins = () => {
  const [bulletins, setBulletins] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedPeriode, setSelectedPeriode] = useState('Trimestre 1');
  const [loading, setLoading] = useState(true);

  const periodes = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bulletinsRes, elevesRes, classesRes] = await Promise.all([
        apiService.get('/bulletins'),
        apiService.get('/eleves'),
        apiService.get('/classes')
      ]);
      
      setBulletins(bulletinsRes.data);
      setEleves(elevesRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEleveNom = (eleveId) => {
    const eleve = eleves.find(e => e.id === eleveId);
    return eleve ? `${eleve.prenom} ${eleve.nom}` : 'Inconnu';
  };

  const getClasseNom = (eleveId) => {
    const eleve = eleves.find(e => e.id === eleveId);
    if (!eleve) return 'Non assigné';
    const classe = classes.find(c => c.id === eleve.classe_id);
    return classe ? classe.nom : 'Non assigné';
  };  const filteredBulletins = bulletins.filter(bulletin => {
    let match = true;
    if (selectedPeriode) {
      match = match && bulletin.periode === selectedPeriode;
    }
    if (selectedClasse) {
      const eleve = eleves.find(e => e.id === bulletin.eleve_id);
      match = match && eleve && eleve.classe_id === selectedClasse;
    }
    return match;
  });

  const generateBulletin = async (eleveId) => {
    try {
      // Simulation de génération de bulletin
      const newBulletin = {
        eleve_id: eleveId,
        periode: selectedPeriode,
        date_generation: new Date().toISOString().split('T')[0],
        moyenne_generale: Math.round((Math.random() * 10 + 10) * 100) / 100,
        rang: Math.floor(Math.random() * 25) + 1,
        mention: 'Bien',
        appreciation: 'Bon travail, continue ainsi'
      };
      
      const response = await apiService.post('/bulletins', newBulletin);
      setBulletins([...bulletins, response.data]);
      alert('Bulletin généré avec succès!');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur lors de la génération du bulletin');
    }
  };

  const downloadBulletin = (bulletin) => {
    // Simulation de téléchargement PDF
    alert(`Téléchargement du bulletin de ${getEleveNom(bulletin.eleve_id)} - ${bulletin.periode}`);
  };

  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestion des Bulletins</h1>
      
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Classe</label>
          <select
            value={selectedClasse}
            onChange={(e) => setSelectedClasse(e.target.value)}
            style={styles.select}
          >
            <option value="">Toutes les classes</option>
            {classes.map(classe => (
              <option key={classe.id} value={classe.id}>
                {classe.nom}
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
      </div>

      <div style={styles.actionsContainer}>
        <button 
          onClick={() => {
            if (selectedClasse) {
              const elevesClasse = eleves.filter(e => e.classe_id === selectedClasse);
              if (elevesClasse.length > 0) {
                generateBulletin(elevesClasse[0].id);
              }
            } else {
              alert('Veuillez sélectionner une classe');
            }
          }}
          style={styles.generateButton}
        >
          Générer les bulletins
        </button>
      </div>      <div style={styles.bulletinsContainer}>
        <h2>Bulletins disponibles ({filteredBulletins.length})</h2>
        {filteredBulletins.length === 0 ? (
          <p style={styles.noData}>Aucun bulletin trouvé pour les critères sélectionnés</p>
        ) : (
          <div style={styles.bulletinsList}>
            {filteredBulletins.map(bulletin => (
              <div key={bulletin.id} style={styles.bulletinCard}>
                <div style={styles.bulletinHeader}>
                  <h3>{getEleveNom(bulletin.eleve_id)}</h3>
                  <span style={styles.classe}>{getClasseNom(bulletin.eleve_id)}</span>
                </div>
                
                <div style={styles.bulletinDetails}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Période:</span>
                    <span>{bulletin.periode}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Moyenne générale:</span>
                    <span style={styles.moyenne}>{bulletin.moyenne_generale}/20</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Rang:</span>
                    <span>{bulletin.rang}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Mention:</span>
                    <span style={styles.mention}>{bulletin.mention}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Date de génération:</span>
                    <span>{bulletin.date_generation}</span>
                  </div>
                </div>

                <div style={styles.bulletinActions}>
                  <button 
                    onClick={() => downloadBulletin(bulletin)}
                    style={styles.downloadButton}
                  >
                    📄 Télécharger PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'white',
    marginBottom: '2rem',
    textAlign: 'center',
    background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px'
  },
  filtersContainer: {
    display: 'flex',
    gap: '1.5rem',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '2rem',
    borderRadius: '1.5rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '1.5rem'
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
  },
  actionsContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px',
    textAlign: 'center'
  },
  generateButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    padding: '1rem 2.5rem',
    borderRadius: '1rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
  },
  bulletinsContainer: {
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
  bulletinsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  bulletinCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fafafa'
  },  bulletinHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #ddd'
  },
  classe: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  bulletinDetails: {
    marginBottom: '20px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  detailLabel: {
    fontWeight: '500',
    color: '#555'
  },
  moyenne: {
    fontWeight: 'bold',
    color: '#28a745'
  },
  mention: {
    fontWeight: 'bold',
    color: '#007bff'
  },
  bulletinActions: {
    textAlign: 'center'
  },
  downloadButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default Bulletins;