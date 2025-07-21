import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award,
  Clock,
  User,
  MapPin,
  UserPlus,
  BookPlus,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const statsData = [
    {
      title: "Total Étudiants",
      value: "1,247",
      icon: Users,
      bgColor: "bg-blue-500",
      bgLight: "bg-blue-100",
      textColor: "text-blue-600",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Cours Actifs", 
      value: "156",
      icon: BookOpen,
      bgColor: "bg-green-500",
      bgLight: "bg-green-100",
      textColor: "text-green-600",
      trend: "+5%",
      trendUp: true
    },
    {
      title: "Présence Moyenne",
      value: "92.5%",
      icon: Calendar,
      bgColor: "bg-purple-500",
      bgLight: "bg-purple-100",
      textColor: "text-purple-600",
      trend: "+2.1%",
      trendUp: true
    },
    {
      title: "Moyenne Générale",
      value: "14.2/20",
      icon: Award,
      bgColor: "bg-orange-500",
      bgLight: "bg-orange-100",
      textColor: "text-orange-600",
      trend: "+0.8",
      trendUp: true
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
      bgColor: "bg-blue-500",
      bgLight: "bg-blue-100",
      textColor: "text-blue-600",
      action: () => navigate('/eleves'),
      roles: ['admin']
    },
    {
      title: "Planifier un cours",
      description: "Gérer l'emploi du temps",
      icon: Calendar,
      bgColor: "bg-purple-500",
      bgLight: "bg-purple-100",
      textColor: "text-purple-600",
      action: () => navigate('/emploi-du-temps'),
      roles: ['admin']
    },
    {
      title: "Saisir des notes",
      description: "Ajouter des notes d'évaluation",
      icon: BookPlus,
      bgColor: "bg-green-500",
      bgLight: "bg-green-100",
      textColor: "text-green-600",
      action: () => navigate('/notes'),
      roles: ['admin', 'enseignant']
    },
    {
      title: "Voir les bulletins",
      description: "Consulter les bulletins",
      icon: FileText,
      bgColor: "bg-orange-500",
      bgLight: "bg-orange-100",
      textColor: "text-orange-600",
      action: () => navigate('/bulletins'),
      roles: ['admin', 'enseignant', 'parent']
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-600';
      case 'warning': return 'bg-yellow-100 text-yellow-600';
      case 'info': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Filtrer les actions rapides selon le rôle
  const availableActions = quickActions.filter(action => 
    action.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 my-10 ">
     

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgLight} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trendUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Emploi du Temps</h3>
                  <p className="text-sm text-gray-600">Aujourd'hui</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Voir planning complet →
              </button>
            </div>

            <div className="space-y-4">
              {todaySchedule.map((schedule) => (
                <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{schedule.subject}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                      {getStatusText(schedule.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{schedule.teacher}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{schedule.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{schedule.class}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{schedule.room}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    {schedule.students} étudiants inscrits
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Voir tout →
              </button>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityStatusColor(activity.status)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    {activity.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-8">
          {/* Student Overview */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Aperçu Étudiants</h3>
                <p className="text-sm text-gray-600">Statistiques du jour</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div className="text-2xl font-bold text-green-600">1,156</div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-xs text-gray-600">Présents</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <div className="text-2xl font-bold text-orange-600">91</div>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-xs text-gray-600">Absents</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions Rapides</h3>
            
            <div className="space-y-3">
              {availableActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button 
                    key={index} 
                    onClick={action.action}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left group"
                  >
                    <div className={`w-10 h-10 ${action.bgLight} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${action.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;