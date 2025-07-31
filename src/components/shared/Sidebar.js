import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardList,
  Calendar,
  School,
  UserCheck,
  Award,
  Upload,
  User,
  LogOut,
  Shield
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const items = [
      { 
        path: '/dashboard', 
        label: 'Tableau de bord', 
        icon: LayoutDashboard, 
        // roles: ['admin', 'enseignant', 'parent'] 
        roles: [] 
      },
    ];

    // Items admin seulement
    if (user?.role === 'administrateur') {
      items.push(
        { path: '/eleves', label: 'Gestion des élèves', icon: Users, roles: ['administrateur'] },
        { path: '/enseignants', label: 'Gestion des enseignants', icon: UserCheck, roles: ['administrateur'] },
        { path: '/classes', label: 'Gestion des classes', icon: School, roles: ['administrateur'] },
        { path: '/matieres', label: 'Gestion des matières', icon: BookOpen, roles: ['administrateur'] },
        { path: '/admin/emploi-du-temps', label: 'Emploi du Temps', icon: Calendar, roles: ['administrateur'] },
        { path: '/admin/documents', label: 'Gestion des documents', icon: Upload, roles: ['administrateur'] },
        { path: '/admin/notes', label: 'Saisie des notes', icon: ClipboardList, roles: ['administrateur', 'enseignant'] },
        { path: '/admin/bulletins', label: 'Bulletins', icon: Award, roles: ['administrateur', 'enseignant'] },
        // Nouvel item pour la démo de sécurité - Amélioration pour l'audit
        { path: '/admin/security-demo', label: 'Améliorations Sécurité', icon: Shield, roles: ['administrateur'] }
      );
    }

    // Items administrateur et enseignant
    if ([ 'enseignant'].includes(user?.role)) {
      items.push(
        { path: '/enseignant/notes', label: 'Saisie des notes', icon: ClipboardList, roles: [ 'enseignant'] },
        { path: '/enseignant/bulletins', label: 'Bulletins', icon: Award, roles: [ 'enseignant'] }
      );
    }

    // Items parent
    if (user?.role === 'parent') {
      items.push(
        { path: '/bulletins', label: 'Bulletins de mes enfants', icon: Award, roles: ['parent'] }
      );
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className={`
      fixed left-0 top-0 h-screen w-64 bg-white shadow-xl border-r border-gray-200 z-50 flex flex-col
      transition-transform duration-300 ease-in-out
      ${isMobile 
        ? (isOpen ? 'translate-x-0' : '-translate-x-full')
        : (isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')
      }
    `}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-md">
              <School className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">École Moderne</h2>
              <p className="text-blue-100 text-sm">Portail Scolaire</p>
            </div>
          </div>
          
          {/* Bouton fermer pour mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu - Prend tout l'espace disponible */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-2">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && onClose()} // Fermer le sidebar sur mobile
                className={({ isActive }) => `
                  w-full flex items-center px-3 py-3 text-left rounded-lg transition-all duration-200 group
                  ${isActive
                    ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }
                `}
              >
                <Icon className={`
                  w-5 h-5 mr-3 flex-shrink-0 transition-colors
                  ${isActive ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-600'}
                `} />
                <span className={`
                  font-medium text-sm
                  ${isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'}
                `}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer - User Info & Logout - Toujours en bas */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
        {/* User Info */}
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-sm">{user?.nom || 'Utilisateur'}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role || 'Invité'}</div>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group border border-red-200 hover:border-red-300"
        >
          <LogOut className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600" />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;