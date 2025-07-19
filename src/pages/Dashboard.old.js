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
  const [activeStat, setActiveStat] = useState(null);

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
  };
  const statCards = [
    {
      id: 'eleves',
      title: 'Élèves',
      value: stats.totalEleves,
      icon: '👨‍🎓',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: 'rgba(102, 126, 234, 0.1)',
      change: '+5.2%',
      changeType: 'positive'
    },
    {
      id: 'enseignants',
      title: 'Enseignants',
      value: stats.totalEnseignants,
      icon: '👩‍🏫',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: 'rgba(240, 147, 251, 0.1)',
      change: '+2.1%',
      changeType: 'positive'
    },
    {
      id: 'classes',
      title: 'Classes',
      value: stats.totalClasses,
      icon: '🏫',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: 'rgba(79, 172, 254, 0.1)',
      change: '0%',
      changeType: 'neutral'
    },
    {
      id: 'matieres',
      title: 'Matières',
      value: stats.totalMatieres,
      icon: '📚',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: 'rgba(67, 233, 123, 0.1)',
      change: '+8.3%',
      changeType: 'positive'
    }
  ];
  const activities = [
    {
      id: 1,
      type: 'bulletin',
      title: 'Nouveau bulletin généré',
      description: 'Classe 6ème A - Trimestre 1',
      time: 'Il y a 2 heures',
      icon: '📄',
      color: '#667eea',
      priority: 'high'
    },
    {
      id: 2,
      type: 'notes',
      title: 'Notes saisies en Mathématiques',
      description: '5ème A - 25 élèves notés',
      time: 'Il y a 4 heures',
      icon: '📝',
      color: '#f093fb',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'student',
      title: 'Nouvel élève inscrit',
      description: 'Aminata Diallo - 6ème B',
      time: 'Hier',
      icon: '👤',
      color: '#43e97b',
      priority: 'low'
    },
    {
      id: 4,
      type: 'teacher',
      title: 'Réunion enseignants',
      description: 'Conseil pédagogique programmé',
      time: 'Dans 2 jours',
      icon: '👥',
      color: '#4facfe',
      priority: 'medium'
    }
  ];
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Background effects */}
      <div style={styles.backgroundOverlay}></div>
      <div style={styles.backgroundShapes}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>
      
      <div style={styles.content}>
        {/* Header moderne */}
        <div style={styles.header} className="fade-in-up">
          <div>
            <h1 style={styles.title}>
              Tableau de Bord
              <span style={styles.titleAccent}>✨</span>
            </h1>
            <p style={styles.subtitle}>
              Vue d'ensemble de votre établissement scolaire
            </p>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.actionButton}>
              <span style={styles.buttonIcon}>📊</span>
              Rapport
            </button>
            <button style={styles.primaryActionButton}>
              <span style={styles.buttonIcon}>➕</span>
              Nouveau
            </button>
          </div>
        </div>
        {/* Statistiques modernes */}
        <div style={styles.statsSection}>
          <h2 style={styles.sectionTitle}>Statistiques</h2>
          <div style={styles.statsGrid}>
            {statCards.map((stat, index) => (
              <div
                key={stat.id}
                style={{
                  ...styles.statCard,
                  ...(activeStat === stat.id ? styles.statCardActive : {})
                }}
                className={`stat-card-${index} fade-in-up hover-lift hover-shadow`}
                onMouseEnter={() => setActiveStat(stat.id)}
                onMouseLeave={() => setActiveStat(null)}
              >
                <div style={styles.statCardHeader}>
                  <div style={{
                    ...styles.statIcon,
                    background: stat.bgColor
                  }}>
                    <span style={styles.statIconEmoji}>{stat.icon}</span>
                  </div>
                  <div style={styles.statChange}>
                    <span style={{
                      ...styles.statChangeText,
                      color: stat.changeType === 'positive' ? '#10b981' : 
                             stat.changeType === 'negative' ? '#ef4444' : '#64748b'
                    }}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <div style={styles.statContent}>
                  <div style={{
                    ...styles.statNumber,
                    background: stat.color,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {stat.value}
                  </div>
                  <div style={styles.statLabel}>{stat.title}</div>
                </div>

                <div style={styles.statCardFooter}>
                  <div style={{
                    ...styles.statProgress,
                    background: stat.color
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Section activités récentes */}
        <div style={styles.activitiesSection}>
          <div style={styles.activitiesHeader}>
            <h2 style={styles.sectionTitle}>Activités Récentes</h2>
            <button style={styles.viewAllButton}>
              Voir tout
              <span style={styles.viewAllIcon}>→</span>
            </button>
          </div>
          
          <div style={styles.activitiesContainer}>
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                style={styles.activityItem}
                className={`activity-item-${index} slide-in-right hover-lift`}
              >
                <div style={{
                  ...styles.activityIcon,
                  backgroundColor: `${activity.color}20`,
                  borderColor: `${activity.color}40`
                }}>
                  <span>{activity.icon}</span>
                </div>
                
                <div style={styles.activityContent}>
                  <div style={styles.activityHeader}>
                    <h4 style={styles.activityTitle}>{activity.title}</h4>
                    <span style={{
                      ...styles.activityPriority,
                      backgroundColor: activity.priority === 'high' ? '#fee2e2' : 
                                     activity.priority === 'medium' ? '#fef3c7' : '#f0fdf4',
                      color: activity.priority === 'high' ? '#dc2626' : 
                             activity.priority === 'medium' ? '#d97706' : '#16a34a'
                    }}>
                      {activity.priority === 'high' ? 'Urgent' : 
                       activity.priority === 'medium' ? 'Moyen' : 'Info'}
                    </span>
                  </div>
                  <p style={styles.activityDescription}>{activity.description}</p>
                  <span style={styles.activityTime}>{activity.time}</span>
                </div>

                <div style={styles.activityActions}>
                  <button style={styles.activityActionButton} className="hover-scale">
                    <span>👁️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Section graphiques (placeholder) */}
        <div style={styles.chartsSection}>
          <h2 style={styles.sectionTitle}>Aperçu Analytique</h2>
          <div style={styles.chartsGrid}>
            <div style={styles.chartCard} className="hover-lift hover-shadow">
              <h3 style={styles.chartTitle}>Évolution des inscriptions</h3>
              <div style={styles.chartPlaceholder}>
                <span style={styles.chartIcon}>📈</span>
                <p style={styles.chartText}>Graphique à venir</p>
              </div>
            </div>
            <div style={styles.chartCard} className="hover-lift hover-shadow">
              <h3 style={styles.chartTitle}>Performances par classe</h3>
              <div style={styles.chartPlaceholder}>
                <span style={styles.chartIcon}>📊</span>
                <p style={styles.chartText}>Graphique à venir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const styles = {
  container: {
    minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(16, 91, 165, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)',

    position: 'relative',
    overflow: 'hidden'
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(120, 75, 162, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)',
    pointerEvents: 'none'
  },
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden'
  },
  shape1: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '300px',
    height: '300px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float 6s ease-in-out infinite'
  },
  shape2: {
    position: 'absolute',
    bottom: '20%',
    left: '5%',
    width: '200px',
    height: '200px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
    borderRadius: '30%',
    filter: 'blur(30px)',
    animation: 'float 8s ease-in-out infinite reverse'
  },
  shape3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '400px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    borderRadius: '40%',
    filter: 'blur(60px)',
    animation: 'float 10s ease-in-out infinite'
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '3rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '900',
    color: 'white',
    marginBottom: '0.5rem',
    lineHeight: '1.1',
    letterSpacing: '-1px'
  },
  titleAccent: {
    marginLeft: '0.5rem',
    fontSize: '2rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    marginBottom: 0
  },
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.75rem 1.5rem',
    borderRadius: '1rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  primaryActionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '0.75rem 1.5rem',
    borderRadius: '1rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)'
  },
  buttonIcon: {
    fontSize: '1rem'
  },
  statsSection: {
    marginBottom: '4rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '1.5rem',
    padding: '2rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  statCardActive: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
  },
  statCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  },
  statIconEmoji: {
    fontSize: '1.75rem'
  },
  statChange: {
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981'
  },
  statChangeText: {
    fontSize: '0.75rem',
    fontWeight: '700'
  },
  statContent: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  statNumber: {
    fontSize: '3.5rem',
    fontWeight: '900',
    lineHeight: '1',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statCardFooter: {
    height: '4px',
    borderRadius: '2px',
    overflow: 'hidden',
    background: '#f1f5f9'
  },
  statProgress: {
    height: '100%',
    width: '75%',
    borderRadius: '2px',
    transition: 'width 1s ease'
  },
  activitiesSection: {
    marginBottom: '4rem'
  },
  activitiesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  },
  viewAllIcon: {
    transition: 'transform 0.3s ease'
  },
  activitiesContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease'
  },
  activityIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    fontSize: '1.25rem',
    border: '1px solid'
  },
  activityContent: {
    flex: 1
  },
  activityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem'
  },
  activityTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  activityPriority: {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.7rem',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  activityDescription: {
    fontSize: '0.8rem',
    color: '#6b7280',
    margin: '0 0 0.25rem 0',
    lineHeight: '1.4'
  },
  activityTime: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    fontWeight: '500'
  },
  activityActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  activityActionButton: {
    width: '32px',
    height: '32px',
    borderRadius: '0.5rem',
    border: 'none',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  chartsSection: {
    marginBottom: '2rem'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem'
  },
  chartCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
  },
  chartTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem',
    margin: '0 0 1.5rem 0'
  },
  chartPlaceholder: {
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '1rem',
    border: '2px dashed rgba(0, 0, 0, 0.1)'
  },
  chartIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  chartText: {
    color: '#9ca3af',
    fontWeight: '500',
    fontSize: '0.875rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  loadingText: {
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: '500'
  }
};

export default Dashboard;