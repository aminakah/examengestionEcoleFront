import React, { useState } from 'react';
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
  Award,
  Search, 
  Bell,
  Mail,
  User,
  Clock,
  MapPin,
  MoreHorizontal,
  UserPlus,
  BookPlus,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

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

  const statsData = [
    {
      title: "Total Étudiants",
      value: "1,247",
      icon: Users,
      colorClass: "blue",
      trend: "+12%"
    },
    {
      title: "Cours Actifs", 
      value: "156",
      icon: BookOpen,
      colorClass: "green",
      trend: "+5%"
    },
    {
      title: "Présence Moyenne",
      value: "92.5%",
      icon: Calendar,
      colorClass: "purple",
      trend: "+2.1%"
    },
    {
      title: "Moyenne Générale",
      value: "14.2/20",
      icon: Award,
      colorClass: "orange",
      trend: "+0.8"
    }
  ];

  const activities = [
    {
      id: 1,
      title: "Nouvel étudiant inscrit",
      description: "Marie Diallo - Classe de Terminale S",
      time: "Il y a 5 min",
      type: "student",
      status: "success"
    },
    {
      id: 2,
      title: "Cours programmé",
      description: "Mathématiques - Salle 205 à 14h00",
      time: "Il y a 15 min",
      type: "course",
      status: "info"
    },
    {
      id: 3,
      title: "Absence signalée",
      description: "Jean Sow - Cours d'Anglais",
      time: "Il y a 30 min",
      type: "absence",
      status: "warning"
    },
    {
      id: 4,
      title: "Notes publiées",
      description: "Évaluation de Physique - 1ère S",
      time: "Il y a 1h",
      type: "grade",
      status: "success"
    }
  ];

  const quickActions = [
    {
      title: "Inscrire un étudiant",
      description: "Nouvel étudiant dans le système",
      icon: UserPlus,
      colorClass: "blue"
    },
    {
      title: "Créer un cours",
      description: "Ajouter un nouveau cours",
      icon: BookPlus,
      colorClass: "green"
    },
    {
      title: "Planifier événement",
      description: "Ajouter au calendrier",
      icon: Calendar,
      colorClass: "purple"
    },
    {
      title: "Générer rapport",
      description: "Rapport académique",
      icon: FileText,
      colorClass: "orange"
    }
  ];

  const todaySchedule = [
    {
      id: 1,
      subject: "Mathématiques",
      teacher: "Mme Diop",
      class: "Terminale S1",
      time: "08:00 - 09:30",
      room: "Salle 205",
      status: "ongoing",
      students: 28
    },
    {
      id: 2,
      subject: "Physique-Chimie",
      teacher: "M. Sarr",
      class: "1ère S2",
      time: "09:45 - 11:15",
      room: "Labo 1",
      status: "upcoming",
      students: 25
    },
    {
      id: 3,
      subject: "Français",
      teacher: "Mme Fall",
      class: "2nde A",
      time: "11:30 - 12:30",
      room: "Salle 103",
      status: "scheduled",
      students: 30
    }
  ];

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'student': return User;
      case 'course': return BookOpen;
      case 'absence': return AlertCircle;
      case 'grade': return Award;
      default: return Clock;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ongoing': return 'En cours';
      case 'upcoming': return 'Bientôt';
      case 'scheduled': return 'Planifié';
      default: return 'Planifié';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="sidebar-title">EduPortal</div>
            <div className="sidebar-subtitle">Gestion Scolaire</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div>EduPortal v2.0</div>
          <div>© 2024 - Système Éducatif</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="header-title-section">
              <div>
                <h1 className="header-title">Tableau de Bord</h1>
                <div className="header-date-time">
                  <div className="header-date-item">
                    <Calendar size={16} />
                    <span>{getCurrentDate()}</span>
                  </div>
                  <div className="header-date-item">
                    <Clock size={16} />
                    <span>{getCurrentTime()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="header-actions">
              <div className="search-container">
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher un étudiant, cours..."
                  className="search-input"
                />
              </div>

              <button className="notification-btn">
                <Bell size={20} />
                <span className="notification-badge">5</span>
              </button>

              <button className="notification-btn">
                <Mail size={20} />
                <span className="notification-badge blue">12</span>
              </button>

              <div className="user-profile">
                <div className="user-info">
                  <p className="user-name">Directeur Académique</p>
                  <p className="user-role">Administration</p>
                </div>
                <div className="user-avatar">
                  <User size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`stats-card ${stat.colorClass}`}>
                  <div className="stats-card-content">
                    <div className="stats-card-header">
                      <div className="stats-icon">
                        <Icon size={24} />
                      </div>
                      <div className="stats-trend">
                        {stat.trend}
                      </div>
                    </div>
                    <div className="stats-value">{stat.value}</div>
                    <div className="stats-title">{stat.title}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Left Column */}
            <div className="content-left">
              {/* Class Schedule */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title-section">
                    <div className="card-icon purple">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="card-title">Emploi du Temps</h3>
                      <p className="card-subtitle">Aujourd'hui</p>
                    </div>
                  </div>
                  <a href="#" className="card-action">Voir planning complet</a>
                </div>

                <div className="schedule-list">
                  {todaySchedule.map((schedule) => (
                    <div key={schedule.id} className={`schedule-item ${schedule.status}`}>
                      <div className="schedule-header">
                        <h4 className="schedule-subject">{schedule.subject}</h4>
                        <span className={`schedule-status ${schedule.status}`}>
                          {getStatusText(schedule.status)}
                        </span>
                      </div>
                      
                      <div className="schedule-details">
                        <div className="schedule-detail">
                          <User size={16} />
                          <span>{schedule.teacher}</span>
                        </div>
                        <div className="schedule-detail">
                          <Clock size={16} />
                          <span>{schedule.time}</span>
                        </div>
                        <div className="schedule-detail">
                          <BookOpen size={16} />
                          <span>{schedule.class}</span>
                        </div>
                        <div className="schedule-detail">
                          <MapPin size={16} />
                          <span>{schedule.room}</span>
                        </div>
                      </div>
                      
                      <div className="schedule-students">
                        {schedule.students} étudiants inscrits
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title-section">
                    <div className="card-icon blue">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="card-title">Activités Récentes</h3>
                    </div>
                  </div>
                  <a href="#" className="card-action">Voir tout</a>
                </div>

                <div className="activity-list">
                  {activities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="activity-item">
                        <div className={`activity-icon ${activity.status}`}>
                          <Icon size={16} />
                        </div>
                        <div className="activity-content">
                          <h4 className="activity-title">{activity.title}</h4>
                          <p className="activity-description">{activity.description}</p>
                          <div className="activity-time">
                            <Clock size={12} />
                            <span>{activity.time}</span>
                          </div>
                        </div>
                        {activity.status === 'success' && (
                          <CheckCircle size={16} style={{ color: '#059669' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="content-right">
              {/* Student Overview */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title-section">
                    <div className="card-icon blue">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="card-title">Aperçu Étudiants</h3>
                      <p className="card-subtitle">Statistiques du jour</p>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '1rem', 
                  marginBottom: '1.5rem' 
                }}>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>1,247</div>
                      <TrendingUp size={16} style={{ color: '#10b981' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>1,156</div>
                      <TrendingUp size={16} style={{ color: '#10b981' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Présents</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>91</div>
                      <TrendingDown size={16} style={{ color: '#ef4444' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Absents</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title-section">
                    <div>
                      <h3 className="card-title">Actions Rapides</h3>
                    </div>
                  </div>
                </div>
                
                <div className="quick-actions-grid">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button key={index} className="quick-action-btn">
                        <div className={`quick-action-icon ${action.colorClass}`}>
                          <Icon size={20} />
                        </div>
                        <div className="quick-action-content">
                          <h4 className="quick-action-title">{action.title}</h4>
                          <p className="quick-action-desc">{action.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
