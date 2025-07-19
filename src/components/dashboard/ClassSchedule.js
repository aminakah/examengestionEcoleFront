import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin,
  User,
  BookOpen,
  MoreHorizontal
} from 'lucide-react';

const ClassSchedule = () => {
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
      status: "upcoming",
      students: 30
    },
    {
      id: 4,
      subject: "Anglais",
      teacher: "M. Johnson",
      class: "Terminale L",
      time: "14:00 - 15:00",
      room: "Salle 208",
      status: "scheduled",
      students: 22
    },
    {
      id: 5,
      subject: "Histoire-Géo",
      teacher: "Mme Mbaye",
      class: "1ère ES",
      time: "15:15 - 16:15",
      room: "Salle 301",
      status: "scheduled",
      students: 26
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Emploi du Temps
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {getCurrentDate()}
            </p>
          </div>
        </div>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
          Voir planning complet
        </button>
      </div>

      <div className="space-y-4">
        {todaySchedule.map((schedule) => (
          <div 
            key={schedule.id} 
            className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getStatusColor(schedule.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-gray-600" />
                  <h4 className="font-medium text-gray-800">
                    {schedule.subject}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {getStatusText(schedule.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{schedule.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{schedule.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{schedule.class}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{schedule.room}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  {schedule.students} étudiants inscrits
                </div>
              </div>
              
              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;
