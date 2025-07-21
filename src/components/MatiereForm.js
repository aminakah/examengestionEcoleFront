import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Hash,
  Palette,
  FileText,
  Award,
  Save,
  X
} from 'lucide-react';

const MatiereForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    nom: initialData?.nom || '',
    code: initialData?.code || '',
    coefficient: initialData?.coefficient || 1,
    couleur: initialData?.couleur || '#3B82F6',
    description: initialData?.description || ''
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Couleurs prédéfinies
  const couleursPredefinies = [
    { couleur: '#3B82F6', nom: 'Bleu' },
    { couleur: '#10B981', nom: 'Vert' },
    { couleur: '#F59E0B', nom: 'Orange' },
    { couleur: '#EF4444', nom: 'Rouge' },
    { couleur: '#8B5CF6', nom: 'Violet' },
    { couleur: '#F97316', nom: 'Orange foncé' },
    { couleur: '#06B6D4', nom: 'Cyan' },
    { couleur: '#84CC16', nom: 'Lime' }
  ];

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
    min = null,
    max = null,
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
          {type === 'textarea' ? (
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
              min={min}
              max={max}
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
        {/* Section Informations de base */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Informations de base</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              icon={BookOpen}
              label="Nom de la matière"
              name="nom"
              required
              placeholder="Ex: Mathématiques, Français..."
            />
            
            <InputField
              icon={Code}
              label="Code matière"
              name="code"
              required
              placeholder="Ex: MATH, FR, ANG..."
            />
            
            <InputField
              icon={Hash}
              label="Coefficient"
              name="coefficient"
              type="number"
              min="1"
              max="10"
              required
              placeholder="1"
            />
          </div>
        </div>

        {/* Section Apparence et description */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Apparence et description</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sélection de couleur */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-gray-400" />
                  <span>Couleur de la matière</span>
                </div>
              </label>
              
              {/* Couleurs prédéfinies */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {couleursPredefinies.map(({ couleur, nom }) => (
                  <button
                    key={couleur}
                    type="button"
                    onClick={() => setFormData({...formData, couleur})}
                    className={`group relative w-full h-12 rounded-xl border-2 transition-all duration-200 ${
                      formData.couleur === couleur 
                        ? 'border-gray-800 scale-105 shadow-lg' 
                        : 'border-gray-300 hover:scale-105 hover:shadow-md'
                    }`}
                    style={{ backgroundColor: couleur }}
                    title={nom}
                  >
                    {formData.couleur === couleur && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Sélecteur de couleur personnalisé */}
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleInputChange}
                  className="w-12 h-12 border-2 border-gray-300 rounded-xl cursor-pointer"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.couleur}
                    onChange={(e) => setFormData({...formData, couleur: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <InputField
                icon={FileText}
                label="Description"
                name="description"
                type="textarea"
                rows={6}
                placeholder="Description de la matière, objectifs pédagogiques, etc."
              />
            </div>
          </div>
        </div>

        {/* Section Aperçu */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Aperçu de la matière</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aperçu visuel */}
            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-xl border border-white/40">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Aperçu visuel</h4>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: formData.couleur }}
                  >
                    {formData.code ? formData.code.substring(0, 2).toUpperCase() : '??'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {formData.nom || 'Nom de la matière'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.code || 'CODE'} • Coef. {formData.coefficient}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations récapitulatives */}
            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-xl border border-white/40">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Récapitulatif</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Matière :</span>
                    <span className="font-medium text-gray-900">
                      {formData.nom || 'Non renseigné'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code :</span>
                    <span className="font-medium text-gray-900">
                      {formData.code || 'Non renseigné'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coefficient :</span>
                    <span className="font-medium text-gray-900">
                      {formData.coefficient}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description :</span>
                    <span className="font-medium text-gray-900">
                      {formData.description ? '✓ Renseignée' : 'Non renseignée'}
                    </span>
                  </div>
                </div>
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
                <span>{isEditing ? 'Modifier la matière' : 'Ajouter la matière'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MatiereForm;