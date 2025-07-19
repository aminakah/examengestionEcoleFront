import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  GraduationCap,
  MessageSquare, 
  BarChart3, 
  Settings,
  School,
  ClipboardList,
  UserCheck,
  Award
} from 'lucide-react';

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Étudiants', icon: Users },
    { id: 'teachers', label: 'Enseignants', icon: UserCheck },
    { id: 'courses', label: 'Cours', icon: BookOpen },
    { id: 'classes', label: 'Classes', icon: School },
    { id: 'schedule', label: 'Planning', icon: Calendar },
    { id: 'grades', label: 'Notes', icon: Award },
    { id: 'attendance', label: 'Présence', icon: ClipboardList },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reports', label: 'Rapports', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-800 to-blue-900 w-64 min-h-screen p-4 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 p-2">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-blue-800" />
        </div>
        <div>
          <span className="text-xl font-bold">EduPortal</span>
          <p className="text-xs text-blue-200">Gestion Scolaire</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                activeItem === item.id 
                  ? 'bg-white/20 text-white shadow-lg scale-105' 
                  : 'text-blue-200 hover:bg-white/10 hover:text-white hover:scale-102'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-blue-300 text-center">
          <p className="font-medium">EduPortal v2.0</p>
          <p>© 2024 - Système Éducatif</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
