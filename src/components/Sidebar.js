import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Tableau de bord', icon: '📊', roles: ['admin', 'enseignant'] },
    ];

    const adminItems = [
      { id: 'eleves', label: 'Gestion des élèves', icon: '👨‍🎓', roles: ['admin'] },
      { id: 'enseignants', label: 'Gestion des enseignants', icon: '👩‍🏫', roles: ['admin'] },
      { id: 'classes', label: 'Gestion des classes', icon: '🏫', roles: ['admin'] },
      { id: 'matieres', label: 'Gestion des matières', icon: '📚', roles: ['admin'] },
    ];

    const enseignantItems = [
      { id: 'notes', label: 'Saisie des notes', icon: '📝', roles: ['admin', 'enseignant'] },
      { id: 'bulletins', label: 'Bulletins', icon: '📄', roles: ['admin', 'enseignant'] },
    ];

    const parentItems = [
      { id: 'bulletins-parent', label: 'Bulletins de mon enfant', icon: '👶', roles: ['parent'] },
    ];

    return [...baseItems, ...adminItems, ...enseignantItems, ...parentItems]
      .filter(item => item.roles.includes(user?.role));
  };

  return (
    <div style={styles.sidebar}>
      {/* Overlay décoratif */}
      <div style={styles.sidebarOverlay}></div>
      
      {/* Avatar utilisateur */}
      <div style={styles.userProfile}>
        <div style={styles.avatar}>
          {user?.role === 'admin' ? '👑' : user?.role === 'enseignant' ? '📚' : '👨‍👩‍👧‍👦'}
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user?.name}</div>
          <div style={styles.userRole}>{user?.role}</div>
        </div>
      </div>

      {/* Menu navigation */}
      <div style={styles.menu}>
        <div style={styles.menuHeader}>
          <span style={styles.menuTitle}>Navigation</span>
        </div>
        {getMenuItems().map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              ...styles.menuItem,
              ...(currentPage === item.id ? styles.menuItemActive : {})
            }}
            className="hover-lift"
          >
            <div style={styles.menuIcon}>
              <span>{item.icon}</span>
            </div>
            <span style={styles.menuLabel}>{item.label}</span>
            {currentPage === item.id && (
              <div style={styles.activeIndicator}></div>
            )}
          </button>
        ))}
      </div>

      {/* Section aide */}
      <div style={styles.helpSection}>
        <div style={styles.helpCard}>
          <div style={styles.helpIcon}>💡</div>
          <div style={styles.helpContent}>
            <div style={styles.helpTitle}>Besoin d'aide ?</div>
            <div style={styles.helpText}>Consultez notre guide</div>
          </div>
        </div>
      </div>
    </div>
  );
};
const styles = {
  sidebar: {
    width: '280px',
    background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    height: 'calc(100vh - 75px)',
    borderRight: '1px solid rgba(226, 232, 240, 0.8)',
    padding: '0',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)'
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
    pointerEvents: 'none'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    padding: '2rem 1.5rem',
    borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
    position: 'relative',
    zIndex: 1
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '1rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginRight: '1rem',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.8)'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.25rem',
    lineHeight: '1.2'
  },
  userRole: {
    fontSize: '0.8rem',
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'capitalize',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    display: 'inline-block',
    border: '1px solid rgba(59, 130, 246, 0.2)'
  },
  menu: {
    padding: '1rem 0',
    position: 'relative',
    zIndex: 1
  },
  menuHeader: {
    padding: '0 1.5rem 1rem',
    borderBottom: '1px solid rgba(226, 232, 240, 0.3)',
    marginBottom: '1rem'
  },
  menuTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '1rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#64748b',
    borderRadius: '0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    margin: '0.25rem 1rem',
    borderRadius: '0.75rem'
  },
  menuItemActive: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white',
    transform: 'translateX(8px)',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    borderRadius: '0.75rem'
  },
  menuIcon: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.75rem',
    fontSize: '1.1rem',
    transition: 'transform 0.3s ease'
  },
  menuLabel: {
    flex: 1,
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  activeIndicator: {
    position: 'absolute',
    right: '1rem',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
  },
  helpSection: {
    position: 'absolute',
    bottom: '2rem',
    left: '1.5rem',
    right: '1.5rem',
    zIndex: 1
  },
  helpCard: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '1rem',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  helpIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '0.5rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.75rem',
    fontSize: '1rem'
  },
  helpContent: {
    flex: 1
  },
  helpTitle: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.25rem'
  },
  helpText: {
    fontSize: '0.7rem',
    color: '#6b7280',
    lineHeight: '1.3'
  }
};

export default Sidebar;