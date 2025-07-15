import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const BulletinsParent = () => {
  const [bulletins, setBulletins] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bulletinsRes, elevesRes] = await Promise.all([
        apiService.get('/bulletins'),
        apiService.get('/eleves')
      ]);
      
      // Filtrer les élèves qui appartiennent au parent connecté
      const mesEleves = elevesRes.data.filter(eleve => 
        eleve.parent_email === user?.email
      );
      
      // Filtrer les bulletins correspondant aux élèves du parent
      const mesBulletins = bulletinsRes.data.filter(bulletin => 
        mesEleves.some(eleve => eleve.id === bulletin.eleve_id)
      );
      
      setEleves(mesEleves);
      setBulletins(mesBulletins);
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

  const downloadBulletin = (bulletin) => {
    // Simulation de téléchargement PDF
    alert(`Téléchargement du bulletin de ${getEleveNom(bulletin.eleve_id)} - ${bulletin.periode}`);
  };

  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bulletins de mes enfants</h1>
      
      {eleves.length === 0 ? (
        <div style={styles.noEleves}>
          <p>Aucun élève trouvé pour votre compte.</p>
          <p>Veuillez contacter l'administration si cette information est incorrecte.</p>
        </div>
      ) : (
        <div>
          <div style={styles.elevesInfo}>
            <h3>Mes enfants :</h3>
            {eleves.map(eleve => (
              <div key={eleve.id} style={styles.eleveCard}>
                <strong>{eleve.prenom} {eleve.nom}</strong> - Classe : {eleve.classe_id}
              </div>
            ))}
          </div>

          <div style={styles.bulletinsContainer}>
            <h2>Bulletins disponibles ({bulletins.length})</h2>
            {bulletins.length === 0 ? (
              <p style={styles.noData}>Aucun bulletin disponible pour le moment</p>
            ) : (
              <div style={styles.bulletinsList}>
                {bulletins.map(bulletin => (
                  <div key={bulletin.id} style={styles.bulletinCard}>
                    <div style={styles.bulletinHeader}>
                      <h3>{getEleveNom(bulletin.eleve_id)}</h3>
                      <span style={styles.periode}>{bulletin.periode}</span>
                    </div>
                    
                    <div style={styles.bulletinDetails}>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Moyenne générale:</span>
                        <span style={styles.moyenne}>{bulletin.moyenne_generale}/20</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Rang dans la classe:</span>
                        <span>{bulletin.rang}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Mention:</span>
                        <span style={styles.mention}>{bulletin.mention}</span>
                      </div>                      <div style={styles.appreciation}>
                        <strong>Appréciation :</strong>
                        <p style={styles.appreciationText}>{bulletin.appreciation}</p>
                      </div>
                    </div>

                    <div style={styles.bulletinActions}>
                      <button 
                        onClick={() => downloadBulletin(bulletin)}
                        style={styles.downloadButton}
                      >
                        📄 Télécharger le bulletin
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
  noEleves: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    color: '#666'
  },  elevesInfo: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  eleveCard: {
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    margin: '10px 0'
  },
  bulletinsContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '2.5rem',
    borderRadius: '1.5rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
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
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '1.5rem',
    padding: '2rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  bulletinHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #ddd'
  },
  periode: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },  bulletinDetails: {
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
    color: '#28a745',
    fontSize: '18px'
  },
  mention: {
    fontWeight: 'bold',
    color: '#007bff'
  },
  appreciation: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f0f8ff',
    borderRadius: '4px',
    borderLeft: '4px solid #007bff'
  },
  appreciationText: {
    margin: '8px 0 0 0',
    fontStyle: 'italic',
    color: '#555'
  },
  bulletinActions: {
    textAlign: 'center'
  },
  downloadButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    padding: '0.875rem 2rem',
    borderRadius: '1rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
  }
};

export default BulletinsParent;