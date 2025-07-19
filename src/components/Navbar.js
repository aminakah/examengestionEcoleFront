import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return '#8b5cf6';
      case 'enseignant': return '#10b981';
      case 'parent': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return '👑';
      case 'enseignant': return '📚';
      case 'parent': return '👨‍👩‍👧‍👦';
      default: return '👤';
    }
  };

  return (
    <nav style={{
      ...styles.navbar,
      ...(isScrolled ? styles.navbarScrolled : {})
    }}>
      <div style={styles.navContent}>
       
        
        {/* Info utilisateur avec design glassmorphism */}
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {getRoleIcon(user?.role)}
            </div>
            <div style={styles.userDetails}>
              <span style={styles.username}>
                {user?.name}
              </span>
              <span style={{
                ...styles.userRole,
                background: `linear-gradient(135deg, ${getRoleColor(user?.role)}20, ${getRoleColor(user?.role)}40)`,
                color: getRoleColor(user?.role)
              }}>
                {user?.role}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={styles.logoutBtn}
            className="fade-in-up"
          >
            <span style={styles.logoutIcon}>🚪</span>
            Déconnexion
          </button>
        </div>
      </div>
      
      {/* Effet de lueur en arrière-plan */}
      <div style={styles.backgroundGlow}></div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#CBDBEC',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    color: '#334155',
    padding: '0',
    position: 'fixed',
    top: 0,
    left: '280px', // Décaler pour éviter le sidebar
    right: 0,
    height: '75px',
    zIndex: 999, // Moins que le sidebar (1000)
    // transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 32px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  navbarScrolled: {
    background: '#D5E0EC',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(25px)'
  },
  navContent: {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    width: '100%',
    height: '75px',
    padding: '0 2rem',
    position: 'relative',
    zIndex: 2
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: '-0.5px'
  },
  logoBadge: {
    fontSize: '0.65rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '1rem',
    boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
    animation: 'pulse 2s infinite'
  },
  userSection: {
    display: 'flex',
    justifyContent:'end',
    alignItems: 'center',
    gap: '1rem'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
    padding: '0.75rem 1rem',
    borderRadius: '2rem',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem'
  },
  username: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: '1.2'
  },
  userRole: {
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '0.2rem 0.6rem',
    borderRadius: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    lineHeight: '1'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
    color: 'white',
    padding: '0.75rem 1.25rem',
    borderRadius: '1.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    overflow: 'hidden',
    position: 'relative'
  },
  logoutIcon: {
    fontSize: '14px',
    transition: 'transform 0.3s ease'
  },
  backgroundGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    opacity: 0.6,
    zIndex: 1,
    pointerEvents: 'none'
  }
};

export default Navbar;