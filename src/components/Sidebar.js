import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardList,
  School,
  UserCheck,
  Award,
  Upload,
  User,
  LogOut
} from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const items = [
      { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'enseignant', 'parent'] },
    ];

    // Items admin seulement
    if (user?.role === 'admin') {
      items.push(
        { id: 'eleves', label: 'Gestion des élèves', icon: Users, roles: ['admin'] },
        { id: 'enseignants', label: 'Gestion des enseignants', icon: UserCheck, roles: ['admin'] },
        { id: 'classes', label: 'Gestion des classes', icon: School, roles: ['admin'] },
        { id: 'matieres', label: 'Gestion des matières', icon: BookOpen, roles: ['admin'] },
        { id: 'documents', label: 'Gestion des documents', icon: Upload, roles: ['admin'] }
      );
    }

    // Items admin et enseignant
    if (['admin', 'enseignant'].includes(user?.role)) {
      items.push(
        { id: 'notes', label: 'Saisie des notes', icon: ClipboardList, roles: ['admin', 'enseignant'] },
        { id: 'bulletins', label: 'Bulletins', icon: Award, roles: ['admin', 'enseignant'] }
      );
    }

    // Items parent
    if (user?.role === 'parent') {
      items.push(
        { id: 'bulletins', label: 'Bulletins de mes enfants', icon: Award, roles: ['parent'] }
      );
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
            <School className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">École Moderne</h2>
            <p className="text-blue-100 text-sm">Portail Scolaire</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{user?.name}</div>
            <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map(item => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${
                isActive ? 'text-blue-700' : 'text-gray-500'
              }`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
