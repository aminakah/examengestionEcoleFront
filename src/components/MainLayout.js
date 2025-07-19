import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Dashboard from '../pages/Dashboard';
import GestionEleves from '../pages/GestionEleves';
import GestionEnseignants from '../pages/GestionEnseignants';
import GestionClasses from '../pages/GestionClasses';
import GestionMatieres from '../pages/GestionMatieres';
import SaisieNotesAmelioree from '../pages/SaisieNotesAmelioree';
import BulletinsAdmin from '../pages/BulletinsAdmin';
import BulletinsParentAmélioré from '../pages/BulletinsParentAmélioré';
import GestionDocuments from '../pages/GestionDocuments';

const MainLayout = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user } = useAuth();

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'eleves':
        return user?.role === 'admin' ? <GestionEleves /> : <AccessDenied />;
      case 'enseignants':
        return user?.role === 'admin' ? <GestionEnseignants /> : <AccessDenied />;
      case 'classes':
        return user?.role === 'admin' ? <GestionClasses /> : <AccessDenied />;
      case 'matieres':
        return user?.role === 'admin' ? <GestionMatieres /> : <AccessDenied />;
      case 'notes':
        return ['admin', 'enseignant'].includes(user?.role) ? <SaisieNotesAmelioree /> : <AccessDenied />;
      case 'bulletins':
        if (user?.role === 'parent') {
          return <BulletinsParentAmélioré />;
        } else if (['admin', 'enseignant'].includes(user?.role)) {
          return <BulletinsAdmin />;
        } else {
          return <AccessDenied />;
        }
      case 'documents':
        return user?.role === 'admin' ? <GestionDocuments /> : <AccessDenied />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="flex-1 p-6 pt-20 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// Composant pour l'accès refusé
const AccessDenied = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Accès non autorisé</h3>
      <p className="text-gray-500">Vous n'avez pas les permissions pour accéder à cette page.</p>
    </div>
  </div>
);

export default MainLayout;
