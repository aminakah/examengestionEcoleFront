import React from 'react';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Award,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const RecentActivities = () => {
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
    },
    {
      id: 5,
      title: "Réunion prévue",
      description: "Conseil de classe - 16h30",
      time: "Il y a 2h",
      type: "meeting",
      status: "info"
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'student': return <User className="w-4 h-4" />;
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'absence': return <AlertCircle className="w-4 h-4" />;
      case 'grade': return <Award className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-600';
      case 'warning': return 'bg-orange-100 text-orange-600';
      case 'info': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Activités Récentes
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          Voir tout
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 truncate">
                {activity.title}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {activity.description}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
            {activity.status === 'success' && (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
