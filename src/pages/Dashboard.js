import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEleves: 0,
    totalEnseignants: 0,
    totalClasses: 0,
    totalMatieres: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [elevesRes, enseignantsRes, classesRes, matieresRes] = await Promise.all([
        apiService.get('/eleves'),
        apiService.get('/enseignants'),
        apiService.get('/classes'),
        apiService.get('/matieres')
      ]);

      setStats({
        totalEleves: elevesRes.data.length,
        totalEnseignants: enseignantsRes.data.length,
        totalClasses: classesRes.data.length,
        totalMatieres: matieresRes.data.length
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };  if (loading) {
    return <div style={styles.loading}>Chargement...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tableau de Bord</h1>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalEleves}</div>
          <div style={styles.statLabel}>Élèves</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalEnseignants}</div>
          <div style={styles.statLabel}>Enseignants</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalClasses}</div>
          <div style={styles.statLabel}>Classes</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalMatieres}</div>
          <div style={styles.statLabel}>Matières</div>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Activités récentes</h2>
        <div style={styles.activityList}>
          <div style={styles.activityItem}>
            <span>Nouveau bulletin généré pour la classe 6ème A</span>
            <span style={styles.activityTime}>Il y a 2 heures</span>
          </div>          <div style={styles.activityItem}>
            <span>Notes saisies en Mathématiques - 5ème A</span>
            <span style={styles.activityTime}>Il y a 4 heures</span>
          </div>
          <div style={styles.activityItem}>
            <span>Nouvel élève inscrit: Aminata Diallo</span>
            <span style={styles.activityTime}>Hier</span>
          </div>
        </div>
      </div>
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '10px'
  },
  statLabel: {
    fontSize: '16px',
    color: '#666'
  },
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  activityList: {
    marginTop: '20px'
  },
  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    borderBottom: '1px solid #eee'
  },
  activityTime: {
    color: '#999',
    fontSize: '14px'
  }
};

export default Dashboard;