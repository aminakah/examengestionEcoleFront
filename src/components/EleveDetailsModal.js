import React from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Users, 
  GraduationCap,
  UserCheck,
  X,
  Info,
  Clock
} from 'lucide-react';
import Modal from './Modal';

const EleveDetailsModal = ({ isOpen, onClose, eleve }) => {
  if (!eleve) return null;

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

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} ans`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Profil de ${eleve.prenom} ${eleve.nom}`}
      size="lg"
    >
      <div className="space-y-6">
       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <InfoCard icon={GraduationCap} title="Informations personnelles" color="blue">
            <InfoField
              icon={User}
              label="Nom complet"
              value={`${eleve.prenom} ${eleve.nom}`}
            />
            
            <InfoField
              icon={Mail}
              label="Adresse e-mail"
              value={eleve.email}
              isEmail={true}
            />
            
            <InfoField
              icon={Calendar}
              label="Date de naissance"
              value={eleve.date_naissance && (
                <div>
                  <div>{formatDate(eleve.date_naissance)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    ({calculateAge(eleve.date_naissance)})
                  </div>
                </div>
              )}
            />
            
            <InfoField
              icon={Users}
              label="Classe"
              value={eleve.classe_nom}
            />
            
            {eleve.adresse && (
              <InfoField
                icon={MapPin}
                label="Adresse"
                value={eleve.adresse}
              />
            )}
          </InfoCard>

          {/* Informations parent/tuteur */}
          <InfoCard icon={UserCheck} title="Parent / Tuteur légal" color="gray">
            {(eleve.parent_prenom || eleve.parent_nom) && (
              <InfoField
                icon={User}
                label="Nom du parent/tuteur"
                value={`${eleve.parent_prenom || ''} ${eleve.parent_nom || ''}`.trim()}
              />
            )}
            
            {eleve.parent_email && (
              <InfoField
                icon={Mail}
                label="E-mail du parent/tuteur"
                value={eleve.parent_email}
                isEmail={true}
              />
            )}
            
            {eleve.telephone_parent && (
              <InfoField
                icon={Phone}
                label="Téléphone du parent/tuteur"
                value={eleve.telephone_parent}
                isPhone={true}
              />
            )}

            {/* Message si aucune info parent */}
            {!eleve.parent_prenom && !eleve.parent_nom && !eleve.parent_email && !eleve.telephone_parent && (
              <div className="text-center py-8 text-gray-500">
                <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucune information de contact parental renseignée</p>
              </div>
            )}
          </InfoCard>
        </div>

        {/* Informations système */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              Élève n°{eleve.id} 
              {eleve.created_at && (
                <span> • Inscrit le {new Date(eleve.created_at).toLocaleDateString('fr-FR')}</span>
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

export default EleveDetailsModal;