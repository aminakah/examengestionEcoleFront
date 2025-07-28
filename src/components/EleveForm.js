import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Users, 
  GraduationCap,
  UserCheck,
  Save,
  X
} from 'lucide-react';

const EleveForm = ({ 
  onSubmit, 
  onCancel, 
  classes = [], 
  initialData = null,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    nom: initialData?.user.nom || '',
    prenom: initialData?.user.name || '',
    email: initialData?.user.email || '',
    classe_id: initialData?.inscriptions[0]?.classe_id || '',
    date_naissance: initialData?.user.date_naissance || '',
    adresse: initialData?.user.adresse || '',
    telephone_parent: initialData?.parents[0].user.telephone|| '',
    parent_nom: initialData?.parents[0].user.nom || '',
    parent_prenom: initialData?.parents[0].user.name || '',
    parent_email: initialData?.parents[0].user.email || ''
  });
console.log(initialData)
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ 
    icon: Icon, 
    label, 
    name, 
    type = "text", 
    required = false, 
    placeholder = "", 
    options = null,
    rows = null 
  }) => {
    const isFocused = focusedField === name;
    const hasValue = formData[name];
    
    return (
      <div className="group">
        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
          isFocused ? 'text-blue-600' : 'text-gray-700'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon className={`w-4 h-4 transition-colors duration-200 ${
              isFocused ? 'text-blue-500' : hasValue ? 'text-blue-400' : 'text-gray-400'
            }`} />
            <span>{label} {required && <span className="text-red-500">*</span>}</span>
          </div>
        </label>
        
        <div className="relative">
          {type === 'select' ? (
            <select
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              required={required}
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white
                ${isFocused 
                  ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.02]' 
                  : hasValue 
                    ? 'border-blue-300 shadow-md hover:border-blue-400' 
                    : 'border-gray-200 hover:border-gray-300 shadow-sm'
                }
                focus:outline-none text-gray-900`}
            >
              <option value="">{placeholder}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              required={required}
              rows={rows || 3}
              placeholder={placeholder}
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white resize-none
                ${isFocused 
                  ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.02]' 
                  : hasValue 
                    ? 'border-blue-300 shadow-md hover:border-blue-400' 
                    : 'border-gray-200 hover:border-gray-300 shadow-sm'
                }
                focus:outline-none text-gray-900`}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              required={required}
              placeholder={placeholder}
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white
                ${isFocused 
                  ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.02]' 
                  : hasValue 
                    ? 'border-blue-300 shadow-md hover:border-blue-400' 
                    : 'border-gray-200 hover:border-gray-300 shadow-sm'
                }
                focus:outline-none text-gray-900`}
            />
          )}
          
          {/* Icône dans le champ */}
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? 'text-blue-500' : hasValue ? 'text-blue-400' : 'text-gray-400'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Section Élève */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Informations de l'élève</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              icon={User}
              label="Prénom"
              name="prenom"
              required
              placeholder="Entrez le prénom"
            />
            
            <InputField
              icon={User}
              label="Nom de famille"
              name="nom"
              required
              placeholder="Entrez le nom de famille"
            />
            
            <InputField
              icon={Mail}
              label="Adresse e-mail"
              name="email"
              type="email"
              required
              placeholder="exemple@email.com"
            />
            
            <InputField
              icon={Calendar}
              label="Date de naissance"
              name="date_naissance"
              type="date"
              required
            />
            
            <InputField
              icon={Users}
              label="Classe"
              name="classe_id"
              type="select"
              required
              placeholder="Sélectionner une classe"
              options={classes.map(classe => ({
                value: classe.id,
                label: classe.nom
              }))}
            />
            
            <div className="md:col-span-2 lg:col-span-3">
              <InputField
                icon={MapPin}
                label="Adresse"
                name="adresse"
                type="textarea"
                rows={3}
                placeholder="Adresse complète de l'élève"
              />
            </div>
          </div>
        </div>

        {/* Section Parent/Tuteur */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Parent / Tuteur légal</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              icon={User}
              label="Prénom du parent/tuteur"
              name="parent_prenom"
              placeholder="Prénom du parent"
            />
            
            <InputField
              icon={User}
              label="Nom du parent/tuteur"
              name="parent_nom"
              placeholder="Nom du parent"
            />
            
            <InputField
              icon={Mail}
              label="E-mail du parent/tuteur"
              name="parent_email"
              type="email"
              placeholder="parent@email.com"
            />
            
            <InputField
              icon={Phone}
              label="Téléphone du parent/tuteur"
              name="telephone_parent"
              type="tel"
              placeholder="+221 XX XXX XX XX"
            />
          </div>
        </div>
      </div>

      {/* Boutons d'action - Version Sticky */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-6 mt-8 -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed group order-2 sm:order-1"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            <span>Annuler</span>
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none order-1 sm:order-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{isEditing ? 'Modifier l\'élève' : 'Ajouter l\'élève'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EleveForm;