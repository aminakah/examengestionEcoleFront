import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  GraduationCap,
  Calendar,
  Award,
  Save,
  X
} from 'lucide-react';

// ✅ CORRECTION: Déplacer InputField EN DEHORS du composant principal
const InputField = ({ 
  icon: Icon, 
  label, 
  name, 
  type = "text", 
  required = false, 
  placeholder = "", 
  options = null,
  rows = null,
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused
}) => {
  const hasValue = value !== '' && value !== 0;
  
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
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
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
            {options && options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
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
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
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
        
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
          isFocused ? 'text-blue-500' : hasValue ? 'text-blue-400' : 'text-gray-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
const EnseignantForm = ({ 
  onSubmit, 
  onCancel, 
  matieres = [], 
  initialData = null,
  isEditing = false 
}) => {
  // ✅ CORRECTION: Fonctions utilitaires pour extraction sécurisée
  const extractSafeValue = (value, defaultValue = '') => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'object') {
      return value.nom || value.name || value.label || defaultValue;
    }
    return String(value);
  };

  const extractSafeId = (value, defaultValue = '') => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'object') {
      return value.id || defaultValue;
    }
    return String(value);
  };
console.log(initialData)
  // ✅ CORRECTION: Initialisation sécurisée des données
  const [formData, setFormData] = useState({
    nom: extractSafeValue(initialData?.user?.nom ||''),
    prenom: extractSafeValue(initialData?.user?.prenom, ''),
    email: extractSafeValue(initialData?.user?.email, ''),
    telephone: extractSafeValue(initialData?.user?.telephone, ''),
    adresse: extractSafeValue(initialData?.user?.adresse, ''),
    matiere_id: extractSafeId(initialData?.matiere_id || initialData?.matiere, ''),
    specialite: extractSafeValue(initialData?.specialite, ''),
    date_embauche: extractSafeValue(initialData?.created_at , '')
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // ✅ CORRECTION: Validation des données avant envoi
      const submitData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        adresse: formData.adresse.trim(),
        matiere_id: formData.matiere_id,
        specialite: formData.specialite.trim(),
        date_embauche: formData.date_embauche
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Section Informations personnelles */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Informations personnelles</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              icon={User}
              label="Prénom"
              name="prenom"
              required
              placeholder="Entrez le prénom"
              value={formData.prenom}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('prenom')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'prenom'}
            />
            
            <InputField
              icon={User}
              label="Nom de famille"
              name="nom"
              required
              placeholder="Entrez le nom de famille"
              value={formData.nom}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('nom')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'nom'}
            />
            
            <InputField
              icon={Mail}
              label="Adresse e-mail"
              name="email"
              type="email"
              required
              placeholder="enseignant@ecole.com"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'email'}
            />
            
            <InputField
              icon={Phone}
              label="Téléphone"
              name="telephone"
              type="tel"
              placeholder="+221 XX XXX XX XX"
              value={formData.telephone}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('telephone')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'telephone'}
            />
            
            <div className="md:col-span-2 lg:col-span-3">
              <InputField
                icon={MapPin}
                label="Adresse"
                name="adresse"
                type="textarea"
                rows={3}
                placeholder="Adresse complète de l'enseignant"
                value={formData.adresse}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('adresse')}
                onBlur={() => setFocusedField(null)}
                isFocused={focusedField === 'adresse'}
              />
            </div>
          </div>
        </div>
        {/* Section Informations professionnelles */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Informations professionnelles</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              icon={BookOpen}
              label="Matière enseignée"
              name="matiere_id"
              type="select"
              required
              placeholder="Sélectionner une matière"
              options={matieres.map(matiere => ({
                value: matiere.id,
                label: matiere.nom
              }))}
              value={formData.matiere_id}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('matiere_id')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'matiere_id'}
            />
            
            <InputField
              icon={Award}
              label="Spécialité"
              name="specialite"
              placeholder="Ex: Algèbre, Littérature contemporaine..."
              value={formData.specialite}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('specialite')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'specialite'}
            />
            
            <InputField
              icon={Calendar}
              label="Date d'embauche"
              name="date_embauche"
              type="date"
              value={formData.date_embauche}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('date_embauche')}
              onBlur={() => setFocusedField(null)}
              isFocused={focusedField === 'date_embauche'}
            />
          </div>
        </div>
      </div>
      {/* Boutons d'action */}
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
                <span>{isEditing ? 'Modifier l\'enseignant' : 'Ajouter l\'enseignant'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EnseignantForm;