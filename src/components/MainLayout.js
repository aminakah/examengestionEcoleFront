import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../pages/Dashboard';
import GestionEleves from '../pages/GestionEleves';
import GestionEnseignants from '../pages/GestionEnseignants';
import GestionClasses from '../pages/GestionClasses';
import GestionMatieres from '../pages/GestionMatieres';
import SaisieNotes from '../pages/SaisieNotes';
import Bulletins from '../pages/Bulletins';
import BulletinsParent from '../pages/BulletinsParent';

const MainLayout = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user } = useAuth();

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'eleves':
        return user?.role === 'admin' ? <GestionEleves /> : <div>Accès non autorisé</div>;
      case 'enseignants':
        return user?.role === 'admin' ? <GestionEnseignants /> : <div>Accès non autorisé</div>;
      case 'classes':
        return user?.role === 'admin' ? <GestionClasses /> : <div>Accès non autorisé</div>;
      case 'matieres':
        return user?.role === 'admin' ? <GestionMatieres /> : <div>Accès non autorisé</div>;
      case 'notes':
        return ['admin', 'enseignant'].includes(user?.role) ? <SaisieNotes /> : <div>Accès non autorisé</div>;
      case 'bulletins':
        return ['admin', 'enseignant'].includes(user?.role) ? <Bulletins /> : <div>Accès non autorisé</div>;
      case 'bulletins-parent':
        return user?.role === 'parent' ? <BulletinsParent /> : <div>Accès non autorisé</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main style={styles.main}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  content: {
    display: 'flex'
  },
  main: {
    flex: 1,
    padding: '0',
    overflow: 'auto'
  }
};

export default MainLayout;