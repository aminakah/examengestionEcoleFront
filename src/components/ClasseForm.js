import React, { useState } from 'react';
import { 
  School, 
  Users, 
  BookOpen,
  Award,
  Save,
  X
} from 'lucide-react';

const ClasseForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    nom: initialData?.nom || '',
    niveau: initialData?.niveau || '',
    effectif: initialData?.effectif || 0
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const niveaux = ['6ème', '5ème', '4ème', '3ème'];

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
    min = null 
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
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
              min={min}
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
        {/* Section Informations de la classe */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Informations de la classe</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              icon={BookOpen}
              label="Nom de la classe"
              name="nom"
              required
              placeholder="Ex: 6ème A, 5ème B..."
            />
            
            <InputField
              icon={Award}
              label="Niveausdv scolaire"
              name="niveau"
              type="select"
              required
              placeholder="Sélectionner un niveau"
              options={niveaux}
            />
            
            <InputField
              icon={Users}
              label="Effectif prévu"
              name="effectif"
              type="number"
              min="0"
              placeholder="30"
            />
          </div>
        </div>

        {/* Section Informations complémentaires */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Aperçu de la classe</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aperçu des informations */}
            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-xl border border-white/40">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Récapitulatif</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classe :</span>
                    <span className="font-medium text-gray-900">
                      {formData.nom || 'Non renseigné'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Niveau :</span>
                    <span className="font-medium text-gray-900">
                      {formData.niveau || 'Non renseigné'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effectif :</span>
                    <span className="font-medium text-gray-900">
                      {formData.effectif} élève{formData.effectif > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations utiles */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Conseils</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Effectif optimal : 25-30 élèves</li>
                  <li>• Nommage conseillé : Niveau + Lettre</li>
                  <li>• Vous pourrez modifier plus tard</li>
                </ul>
              </div>
            </div>
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
                <span>{isEditing ? 'Modifier la classe' : 'Ajouter la classe'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClasseForm;