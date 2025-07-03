import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Tableau de bord', roles: ['admin', 'enseignant'] },
    ];

    const adminItems = [
      { id: 'eleves', label: 'Gestion des élèves', roles: ['admin'] },
      { id: 'enseignants', label: 'Gestion des enseignants', roles: ['admin'] },
      { id: 'classes', label: 'Gestion des classes', roles: ['admin'] },
      { id: 'matieres', label: 'Gestion des matières', roles: ['admin'] },
    ];

    const enseignantItems = [
      { id: 'notes', label: 'Saisie des notes', roles: ['admin', 'enseignant'] },
      { id: 'bulletins', label: 'Bulletins', roles: ['admin', 'enseignant'] },
    ];

    const parentItems = [
      { id: 'bulletins-parent', label: 'Bulletins de mon enfant', roles: ['parent'] },
    ];

    return [...baseItems, ...adminItems, ...enseignantItems, ...parentItems]
      .filter(item => item.roles.includes(user?.role));
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.menu}>
        {getMenuItems().map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              ...styles.menuItem,
              backgroundColor: currentPage === item.id ? '#007bff' : 'transparent'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#f8f9fa',
    height: 'calc(100vh - 60px)',
    borderRight: '1px solid #dee2e6',
    padding: '20px 0'
  },
  menu: {
    display: 'flex',
    flexDirection: 'column'
  },
  menuItem: {
    padding: '15px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    transition: 'all 0.3s ease'
  }
};

export default Sidebar;