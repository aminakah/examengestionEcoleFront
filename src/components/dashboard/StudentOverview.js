import React from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  MoreHorizontal
} from 'lucide-react';

const StudentOverview = () => {
  const stats = [
    { 
      label: 'Total Étudiants', 
      value: '1,247', 
      color: 'text-blue-600',
      trend: 'up',
      change: '+12%'
    },
    { 
      label: 'Présents Aujourd\'hui', 
      value: '1,156', 
      color: 'text-green-600',
      trend: 'up',
      change: '+3%'
    },
    { 
      label: 'Absents', 
      value: '91', 
      color: 'text-orange-600',
      trend: 'down',
      change: '-5%'
    }
  ];

  const recentStudents = [
    {
      id: 1,
      name: "Aminata Sow",
      class: "Terminale S",
      status: "present",
      photo: "AS"
    },
    {
      id: 2,
      name: "Ousmane Diallo",
      class: "1ère L",
      status: "present",
      photo: "OD"
    },
    {
      id: 3,
      name: "Fatou Ndiaye",
      class: "2nde",
      status: "absent",
      photo: "FN"
    },
    {
      id: 4,
      name: "Moussa Ba",
      class: "Terminale ES",
      status: "present",
      photo: "MB"
    }
  ];

  const getStatusColor = (status) => {
    return status === 'present' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return status === 'present' ? 'Présent' : 'Absent';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Aperçu Étudiants
            </h3>
            <p className="text-sm text-gray-600">
              Statistiques du jour
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Students */}
      <div>
        <h4 className="text-sm font-medium text-gray-800 mb-3">
          Étudiants Récents
        </h4>
        <div className="space-y-3">
          {recentStudents.map((student) => (
            <div key={student.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {student.photo}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {student.name}
                </p>
                <p className="text-xs text-gray-500">
                  {student.class}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                {getStatusText(student.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
