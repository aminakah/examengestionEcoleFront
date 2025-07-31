import React from 'react';
import { 
  BookOpen, 
  Code, 
  Hash,
  Palette,
  FileText,
  Users,
  Award,
  X,
  Info,
  Clock,
  BarChart3,
  Target,
  Star
} from 'lucide-react';
import Modal from '../../Modal';

const MatiereDetailsModal = ({ isOpen, onClose, matiere }) => {
  if (!matiere) return null;
console.log(matiere)

  const InfoCard = ({ icon: Icon, title, children, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-50 to-indigo-50 border-blue-100",
      gray: "from-gray-50 to-slate-50 border-gray-200",
      purple: "from-purple-50 to-violet-50 border-purple-100"
    };

    const iconColorClasses = {
      blue: "from-blue-500 to-indigo-600",
      gray: "from-gray-500 to-slate-600",
      purple: "from-purple-500 to-violet-600"
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-10 h-10 bg-gradient-to-br ${iconColorClasses[color]} rounded-xl flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    );
  };

  const InfoField = ({ icon: Icon, label, value }) => {
    if (!value && value !== 0) return null;

    return (
      <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-xl border border-white/40">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-base font-medium text-gray-900 break-words">{value}</p>
        </div>
      </div>
    );
  };

  const getCoefficientStatus = (coefficient) => {
    if (coefficient <= 1) return { status: 'Faible importance', color: 'text-gray-600', bg: 'bg-gray-100' };
    if (coefficient <= 2) return { status: 'Importance standard', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (coefficient <= 3) return { status: 'Importance élevée', color: 'text-green-600', bg: 'bg-green-100' };
    if (coefficient <= 4) return { status: 'Matière principale', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { status: 'Matière fondamentale', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getColorName = (hexColor) => {
    const colors = {
      '#3B82F6': 'Bleu',
      '#10B981': 'Vert',
      '#F59E0B': 'Orange',
      '#EF4444': 'Rouge',
      '#8B5CF6': 'Violet',
      '#F97316': 'Orange foncé',
      '#06B6D4': 'Cyan',
      '#84CC16': 'Lime'
    };
    return colors[hexColor] || 'Couleur personnalisée';
  };

  const coefficientStatus = getCoefficientStatus(matiere.coefficient || 1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Détails de ${matiere.nom}`}
      size="lg"
    >
      <div className="space-y-6">
       

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations de base */}
          <InfoCard icon={BookOpen} title="Informations générales" color="blue">
            <InfoField
              icon={BookOpen}
              label="Nom de la matière"
              value={matiere.nom}
            />
            
            <InfoField
              icon={Code}
              label="Code matière"
              value={matiere.code}
            />
            
            <InfoField
              icon={Hash}
              label="Coefficient"
              value={matiere.coefficient}
            />

            {/* Statut du coefficient */}
            <div className="p-3 bg-white/60 rounded-xl border border-white/40">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Importance pédagogique</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${coefficientStatus.bg} ${coefficientStatus.color}`}>
                      {coefficientStatus.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Couleur */}
            <div className="p-3 bg-white/60 rounded-xl border border-white/40">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Couleur d'identification</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: matiere.couleur || '#3B82F6' }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">
                      {getColorName(matiere.couleur)} ({matiere.couleur})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Description et statistiques */}
          <InfoCard icon={BarChart3} title="Description et données" color="gray">
            {matiere.description && (
              <InfoField
                icon={FileText}
                label="Description"
                value={matiere.description}
              />
            )}

            <InfoField
              icon={Users}
              label="Enseignants assignés"
              value={`${matiere.enseignants_count || 0} enseignant${(matiere.enseignants_count || 0) > 1 ? 's' : ''}`}
            />

            {/* Graphique visuel du coefficient */}
            <div className="p-4 bg-white/60 rounded-xl border border-white/40">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Impact du coefficient</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Coefficient actuel :</span>
                  <span className="font-medium">{matiere.coefficient}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      (matiere.coefficient || 1) <= 2 ? 'bg-blue-500' : 
                      (matiere.coefficient || 1) <= 3 ? 'bg-green-500' : 
                      (matiere.coefficient || 1) <= 4 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(((matiere.coefficient || 1) / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>Actuel: {matiere.coefficient}</span>
                  <span>5+</span>
                </div>
              </div>
            </div>

            {/* Message si pas de description */}
            {!matiere.description && (
              <div className="text-center py-6 text-gray-500">
                <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucune description renseignée</p>
              </div>
            )}
          </InfoCard>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
            <Hash className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Coefficient</p>
            <p className="font-bold text-gray-900">{matiere.coefficient}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Enseignants</p>
            <p className="font-bold text-gray-900">{matiere.enseignants_count || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
            <Star className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Statut</p>
            <p className="font-bold text-blue-600">Active</p>
          </div>
        </div>

        {/* Informations pédagogiques */}
        <InfoCard icon={Award} title="Informations pédagogiques" color="purple">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Impact sur les notes */}
            <div className="p-4 bg-white/60 rounded-xl border border-white/40">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Impact sur la moyenne</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Coefficient :</span>
                  <span className="font-medium">{matiere.coefficient}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pondération :</span>
                  <span className="font-medium">{matiere.coefficient}x</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {matiere.coefficient > 3 
                    ? "Cette matière a un impact important sur la moyenne générale"
                    : "Cette matière a un impact modéré sur la moyenne générale"
                  }
                </p>
              </div>
            </div>

            {/* Recommandations */}
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="text-sm font-medium text-purple-800 mb-2">💡 Recommandations</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                {(matiere.coefficient || 1) <= 2 && (
                  <>
                    <li>• Matière d'ouverture culturelle</li>
                    <li>• Favorise l'épanouissement</li>
                  </>
                )}
                {(matiere.coefficient || 1) > 2 && (matiere.coefficient || 1) <= 3 && (
                  <>
                    <li>• Matière importante au programme</li>
                    <li>• Suivi régulier recommandé</li>
                  </>
                )}
                {(matiere.coefficient || 1) > 3 && (
                  <>
                    <li>• Matière fondamentale</li>
                    <li>• Priorité dans le suivi pédagogique</li>
                  </>
                )}
                <li>• Code couleur : {getColorName(matiere.couleur)}</li>
              </ul>
            </div>
          </div>
        </InfoCard>

        {/* Informations système */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              Matière n°{matiere.id} 
              {matiere.created_at && (
                <span> • Créée le {new Date(matiere.created_at).toLocaleDateString('fr-FR')}</span>
              )}
            </span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            <X className="w-5 h-5" />
            <span>Fermer</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MatiereDetailsModal;