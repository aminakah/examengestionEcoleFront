import React from 'react';
import { 
  UserPlus, 
  BookPlus, 
  Calendar,
  FileText,
  Users,
  Award,
  ClipboardCheck
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: "Inscrire un étudiant",
      description: "Nouvel étudiant dans le système",
      icon: UserPlus,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      action: "student"
    },
    {
      title: "Créer un cours",
      description: "Ajouter un nouveau cours",
      icon: BookPlus,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      action: "course"
    },
    {
      title: "Planifier événement",
      description: "Ajouter au calendrier",
      icon: Calendar,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      action: "event"
    },
    {
      title: "Générer rapport",
      description: "Rapport académique",
      icon: FileText,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      action: "report"
    },
    {
      title: "Gérer les classes",
      description: "Organisation des classes",
      icon: Users,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      action: "classes"
    },
    {
      title: "Saisir les notes",
      description: "Évaluation des étudiants",
      icon: Award,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
      action: "grades"
    }
  ];

  const handleAction = (actionType) => {
    console.log(`Action déclenchée: ${actionType}`);
    // Ici vous pouvez ajouter la logique pour chaque action
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Actions Rapides
        </h3>
        <ClipboardCheck className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => handleAction(action.action)}
              className={`flex items-center gap-4 p-4 border border-gray-200 rounded-lg ${action.hoverColor} hover:text-white hover:border-transparent transition-all duration-200 text-left group`}
            >
              <div className={`p-3 ${action.color} rounded-lg text-white group-hover:bg-white/20`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 group-hover:text-white">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 group-hover:text-white/80">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
