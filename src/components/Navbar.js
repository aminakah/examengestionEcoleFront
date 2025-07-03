import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        <div style={styles.logo}>
          <h3>Portail Scolaire</h3>
        </div>
        
        <div style={styles.userInfo}>
          <span style={styles.username}>
            {user?.name} ({user?.role})
          </span>
          <button 
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#343a40',
    color: 'white',
    padding: '0 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    height: '60px'
  },
  logo: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  username: {
    fontSize: '14px'
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default Navbar;