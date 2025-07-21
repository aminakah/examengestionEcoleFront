import React from 'react';
import { 
  School, 
  Users, 
  BookOpen,
  Award,
  X,
  Info,
  Clock,
  BarChart3,
  Target
} from 'lucide-react';
import Modal from './Modal';

const ClasseDetailsModal = ({ isOpen, onClose, classe }) => {
  if (!classe) return null;

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
          <p className="text-base font-medium text-gray-900">{value}</p>
        </div>
      </div>
    );
  };

  const getEffectifStatus = (effectif) => {
    if (effectif === 0) return { status: 'Vide', color: 'text-gray-500', bg: 'bg-gray-100' };
    if (effectif <= 20) return { status: 'Petit groupe', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (effectif <= 30) return { status: 'Optimal', color: 'text-green-600', bg: 'bg-green-100' };
    if (effectif <= 35) return { status: 'Chargé', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { status: 'Surchargé', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getNiveauInfo = (niveau) => {
    const niveauInfos = {
      '6ème': { cycle: 'Cycle 3', description: 'Adaptation au collège' },
      '5ème': { cycle: 'Cycle 4', description: 'Approfondissement' },
      '4ème': { cycle: 'Cycle 4', description: 'Consolidation' },
      '3ème': { cycle: 'Cycle 4', description: 'Orientation' }
    };
    return niveauInfos[niveau] || { cycle: 'Non défini', description: 'Information manquante' };
  };

  const effectifStatus = getEffectifStatus(classe.effectif || 0);
  const niveauInfo = getNiveauInfo(classe.niveau);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Détails de la classe ${classe.nom}`}
      size="lg"
    >
      <div className="space-y-6">
       

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations de base */}
          <InfoCard icon={School} title="Informations générales" color="blue">
            <InfoField
              icon={BookOpen}
              label="Nom de la classe"
              value={classe.nom}
            />
            
            <InfoField
              icon={Award}
              label="Niveau scolaire"
              value={classe.niveau}
            />
            
            <InfoField
              icon={Users}
              label="Effectif actuel"
              value={`${classe.effectif || 0} élève${(classe.effectif || 0) > 1 ? 's' : ''}`}
            />

            {/* Statut de l'effectif */}
            <div className="p-3 bg-white/60 rounded-xl border border-white/40">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Statut de l'effectif</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${effectifStatus.bg} ${effectifStatus.color}`}>
                      {effectifStatus.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Statistiques et conseils */}
          <InfoCard icon={BarChart3} title="Analyses et recommandations" color="gray">
            {/* Graphique visuel simple de l'effectif */}
            <div className="p-4 bg-white/60 rounded-xl border border-white/40">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Répartition de l'effectif</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacité optimale :</span>
                  <span className="font-medium">30 élèves</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      (classe.effectif || 0) <= 30 ? 'bg-blue-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(((classe.effectif || 0) / 30) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>Actuel: {classe.effectif || 0}</span>
                  <span>30</span>
                </div>
              </div>
            </div>

            {/* Recommandations */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Recommandations</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {(classe.effectif || 0) === 0 && (
                  <li>• Commencer le recrutement d'élèves</li>
                )}
                {(classe.effectif || 0) > 0 && (classe.effectif || 0) <= 20 && (
                  <>
                    <li>• Effectif favorable à l'attention individuelle</li>
                    <li>• Possibilité d'accueillir plus d'élèves</li>
                  </>
                )}
                {(classe.effectif || 0) > 20 && (classe.effectif || 0) <= 30 && (
                  <>
                    <li>• Effectif optimal pour l'apprentissage</li>
                    <li>• Équilibre entre dynamique et suivi</li>
                  </>
                )}
                {(classe.effectif || 0) > 30 && (
                  <>
                    <li>• Envisager une division de classe</li>
                    <li>• Surveiller la qualité pédagogique</li>
                  </>
                )}
              </ul>
            </div>
          </InfoCard>
        </div>

        {/* Informations sur le niveau */}
        <InfoCard icon={Award} title={`À propos du niveau ${classe.niveau}`} color="purple">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-xl">
              <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Cycle</p>
              <p className="font-bold text-gray-900">{niveauInfo.cycle}</p>
            </div>
            
            <div className="text-center p-4 bg-white/60 rounded-xl">
              <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Focus</p>
              <p className="font-bold text-gray-900">{niveauInfo.description}</p>
            </div>
            
            <div className="text-center p-4 bg-white/60 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Effectif</p>
              <p className="font-bold text-gray-900">{classe.effectif || 0}</p>
            </div>
          </div>
        </InfoCard>

        {/* Informations système */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              Classe n°{classe.id} 
              {classe.created_at && (
                <span> • Créée le {new Date(classe.created_at).toLocaleDateString('fr-FR')}</span>
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

export default ClasseDetailsModal;