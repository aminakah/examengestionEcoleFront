import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  GraduationCap,
  Calendar,
  Award,
  X,
  Info,
  Clock,
  UserCheck
} from 'lucide-react';
import Modal from '../../Modal';

const EnseignantDetailsModal = ({ isOpen, onClose, enseignant }) => {
  if (!enseignant) return null;

  const InfoCard = ({ icon: Icon, title, children, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-50 to-indigo-50 border-blue-100",
      gray: "from-gray-50 to-slate-50 border-gray-200"
    };

    const iconColorClasses = {
      blue: "from-blue-500 to-indigo-600",
      gray: "from-gray-500 to-slate-600"
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

  const InfoField = ({ icon: Icon, label, value, isEmail = false, isPhone = false }) => {
    if (!value) return null;

    return (
      <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-xl border border-white/40">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          {isEmail ? (
            <a 
              href={`mailto:${value}`}
              className="text-base font-medium text-blue-600 hover:text-blue-800 transition-colors break-all"
            >
              {value}
            </a>
          ) : isPhone ? (
            <a 
              href={`tel:${value}`}
              className="text-base font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {value}
            </a>
          ) : (
            <p className="text-base font-medium text-gray-900 break-words">{value}</p>
          )}
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateExperience = (startDate) => {
    if (!startDate) return '';
    const today = new Date();
    const start = new Date(startDate);
    let years = today.getFullYear() - start.getFullYear();
    let months = today.getMonth() - start.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return months > 0 ? `${years} an${years > 1 ? 's' : ''} et ${months} mois` : `${years} an${years > 1 ? 's' : ''}`;
    } else {
      return months > 0 ? `${months} mois` : 'Moins d\'un mois';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Profil de ${enseignant.user.name} ${enseignant.user.nom}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* En-tête avec photo/avatar */}
     

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <InfoCard icon={User} title="Informations personnelles" color="blue">
            <InfoField
              icon={User}
              label="Nom complet"
              value={`${enseignant.user.name} ${enseignant.user.nom}`}
            />
            
            <InfoField
              icon={Mail}
              label="Adresse e-mail"
              value={enseignant.user.email}
              isEmail={true}
            />
            
            <InfoField
              icon={Phone}
              label="Téléphone"
              value={enseignant.user.telephone}
              isPhone={true}
            />
            
            {enseignant.adresse && (
              <InfoField
                icon={MapPin}
                label="Adresse"
                value={enseignant.user.adresse}
              />
            )}

            {/* Message si aucune info de contact */}
            {!enseignant.user.telephone && !enseignant.user.adresse && (
              <div className="text-center py-4 text-gray-500">
                <Info className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Informations de contact limitées</p>
              </div>
            )}
          </InfoCard>

          {/* Informations professionnelles */}
          <InfoCard icon={GraduationCap} title="Informations professionnelles" color="gray">
            <InfoField
              icon={BookOpen}
              label="Matière enseignée"
              value={enseignant.matiere_nom}
            />
            
            {enseignant.specialite && (
              <InfoField
                icon={Award}
                label="Spécialité"
                value={enseignant.specialite}
              />
            )}
            
            {enseignant.created_at && (
              <InfoField
                icon={Calendar}
                label="Date d'embauche"
                value={(
                  <div>
                    <div>{formatDate(enseignant.created_at)}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Expérience : {calculateExperience(enseignant.created_at)}
                    </div>
                  </div>
                )}
              />
            )}

            {/* Badge de statut */}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Enseignant actif</span>
              </div>
            </div>
          </InfoCard>
        </div>

        
   {enseignant.created_at && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
      <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
      <p className="text-sm text-gray-600">Ancienneté</p>
      <p className="font-bold text-gray-900">{calculateExperience(enseignant.created_at)}</p>
    </div>

    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
      <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
      <p className="text-sm text-gray-600">Matières</p>
      <div className="font-bold text-gray-900 space-y-1">
        {enseignant.matieres && enseignant.matieres.length > 0 ? (
          enseignant.matieres.map((matiere, index) => (
            <p key={index}>{matiere.code
}</p>
          ))
        ) : (
          <p>Non définies</p>
        )}
      </div>
    </div>

    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
      <GraduationCap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
      <p className="text-sm text-gray-600">Statut</p>
      <p className="font-bold text-blue-600">Actif</p>
    </div>
  </div>
)}



        {/* Informations système */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              Enseignant n°{enseignant.id} 
              {enseignant.created_at && (
                <span> • Ajouté le {new Date(enseignant.created_at).toLocaleDateString('fr-FR')}</span>
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

export default EnseignantDetailsModal;