import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { 
  BookOpen, 
  Code, 
  Hash,
  GraduationCap,
  Award,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  Users,
  Plus,
  Trash2,
  Calendar,
  UserCheck
} from 'lucide-react';

// Composant InputField optimisé avec React.memo
const InputField = memo(({ 
  icon: Icon, 
  label, 
  name, 
  type = "text", 
  required = false, 
  placeholder = "", 
  min = null,
  max = null,
  rows = null,
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused,
  hasValue,
  options = null // Pour les select
}) => {
  const inputClasses = useMemo(() => {
    const baseClasses = "w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white focus:outline-none text-gray-900";
    
    if (isFocused) {
      return `${baseClasses} border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-[1.02]`;
    } else if (hasValue) {
      return `${baseClasses} border-blue-300 shadow-md hover:border-blue-400`;
    } else {
      return `${baseClasses} border-gray-200 hover:border-gray-300 shadow-sm`;
    }
  }, [isFocused, hasValue]);
  const iconClasses = useMemo(() => {
    const baseClasses = "w-4 h-4 transition-colors duration-200";
    
    if (isFocused) {
      return `${baseClasses} text-blue-500`;
    } else if (hasValue) {
      return `${baseClasses} text-blue-400`;
    } else {
      return `${baseClasses} text-gray-400`;
    }
  }, [isFocused, hasValue]);

  const labelClasses = useMemo(() => {
    return `block text-sm font-medium mb-2 transition-colors duration-200 ${
      isFocused ? 'text-blue-600' : 'text-gray-700'
    }`;
  }, [isFocused]);

  const leftIconClasses = useMemo(() => {
    const baseClasses = "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200";
    
    if (isFocused) {
      return `${baseClasses} text-blue-500`;
    } else if (hasValue) {
      return `${baseClasses} text-blue-400`;
    } else {
      return `${baseClasses} text-gray-400`;
    }
  }, [isFocused, hasValue]);

  return (
    <div className="group">
      <label className={labelClasses}>
        <div className="flex items-center space-x-2">
          <Icon className={iconClasses} />
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
            className={inputClasses}
          >
            <option value="">{placeholder}</option>
            {options?.map((option) => {
              // Déterminer le texte à afficher selon le type d'objet
              let displayText = '';
              
              if (option.libelle) {
                // Années scolaires
                displayText = option.libelle;
              } else if (option.nom) {
                // Niveaux
                displayText = option.nom;
              } else if (option.user) {
                // Enseignants
                displayText = `${option.user.prenom} ${option.user.nom}`;
                if (option.specialite) {
                  displayText += ` (${option.specialite})`;
                }
              } else {
                displayText = option.name || option.title || `Option ${option.id}`;
              }

              return (
                <option key={option.id} value={option.id}>
                  {displayText}
                </option>
              );
            })}
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
            className={`${inputClasses} resize-none`}
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
            min={min}
            max={max}
            className={inputClasses}
          />
        )}
        
        <div className={leftIconClasses}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
});

InputField.displayName = 'InputField';
const MatiereForm = ({ 
  onSubmit, 
  onCancel, 
  niveaux = [],
  enseignants = [],
  anneesScolaires = [],
  initialData = null,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    nom: initialData?.nom || '',
    code: initialData?.code || '',
    coefficient: initialData?.coefficient || 1,
    niveau_id: initialData?.niveau_id || '',
    actif: initialData?.actif !== undefined ? initialData.actif : true
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  // Gestion des enseignants assignés
  const [enseignantsAssignes, setEnseignantsAssignes] = useState(
    initialData?.enseignants || []
  );
  console.log(enseignantsAssignes)
  const [nouvelEnseignant, setNouvelEnseignant] = useState({
    enseignant_id: '',
    annee_scolaire_id: ''
  });

  // Effet pour initialiser l'année scolaire par défaut
  useEffect(() => {
    if (anneesScolaires.length > 0 && !nouvelEnseignant.annee_scolaire_id) {
      const anneeCourante = anneesScolaires.find(a => a.actuelle);
      if (anneeCourante) {
        setNouvelEnseignant(prev => ({
          ...prev,
          annee_scolaire_id: anneeCourante.id
        }));
      }
    }
  }, [anneesScolaires, nouvelEnseignant.annee_scolaire_id]);

  // Charger les enseignants assignés si c'est une modification
  useEffect(() => {
    if (isEditing && initialData?.id) {
      loadEnseignantsAssignes();
    }
  }, [isEditing, initialData?.id]);

  const loadEnseignantsAssignes = async () => {
    try {
      // Cette fonction devra être fournie par le parent ou via une API
      // const response = await matiereService.getEnseignants(initialData.id);
      // setEnseignantsAssignes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
    }
  };
  // Handler optimisé avec useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Handlers pour focus/blur optimisés
  const handleFocus = useCallback((fieldName) => {
    setFocusedField(fieldName);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  // Handler pour toggle actif
  const handleToggleActif = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      actif: !prev.actif
    }));
  }, []);

  // Handlers pour la gestion des enseignants
  const handleNouvelEnseignantChange = useCallback((e) => {
    const { name, value } = e.target;
    setNouvelEnseignant(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const ajouterEnseignant = useCallback(() => {
    if (!nouvelEnseignant.enseignant_id || !nouvelEnseignant.annee_scolaire_id) {
      alert('Veuillez sélectionner un enseignant et une année scolaire');
      return;
    }

    // Vérifier si l'enseignant n'est pas déjà assigné pour cette année
    const dejaAssigne = enseignantsAssignes.some(
      e => e.enseignant_id == nouvelEnseignant.enseignant_id && 
           e.annee_scolaire_id == nouvelEnseignant.annee_scolaire_id
    );

    if (dejaAssigne) {
      alert('Cet enseignant est déjà assigné à cette matière pour cette année scolaire');
      return;
    }

    const enseignant = enseignants.find(e => e.id == nouvelEnseignant.enseignant_id);
    const anneeScolaire = anneesScolaires.find(a => a.id == nouvelEnseignant.annee_scolaire_id);

    const nouvelleAssignation = {
      id: Date.now(), // ID temporaire pour l'affichage
      enseignant_id: nouvelEnseignant.enseignant_id,
      annee_scolaire_id: nouvelEnseignant.annee_scolaire_id,
      enseignant: enseignant,
      annee_scolaire: anneeScolaire,
      nouveau: true // Marquer comme nouveau pour l'envoi à l'API
    };

    setEnseignantsAssignes(prev => [...prev, nouvelleAssignation]);
    
    // Réinitialiser le formulaire avec l'année courante
    const anneeCourante = anneesScolaires.find(a => a.actuelle);
    setNouvelEnseignant({
      enseignant_id: '',
      annee_scolaire_id: anneeCourante?.id || ''
    });
  }, [nouvelEnseignant, enseignantsAssignes, enseignants, anneesScolaires]);

  const supprimerEnseignant = useCallback((index) => {
    setEnseignantsAssignes(prev => prev.filter((_, i) => i !== index));
  }, []);
  // Handler pour submit optimisé
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Conversion des données pour l'API
      const submitData = {
        ...formData,
        coefficient: parseFloat(formData.coefficient),
        niveau_id: parseInt(formData.niveau_id) || null,
        // Envoyer les IDs des enseignants et l'année scolaire
        enseignants: enseignantsAssignes.map(e => parseInt(e.enseignant_id)),
        annee_scolaire_id: enseignantsAssignes.length > 0 ? 
          parseInt(enseignantsAssignes[0].annee_scolaire_id) : 
          (anneesScolaires.find(a => a.actuelle)?.id || null)
      };
      
      console.log('Données envoyées au backend:', submitData);
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  }, [formData, enseignantsAssignes, anneesScolaires, onSubmit]);

  // Calculs d'aperçu mémorisés
  const apercuData = useMemo(() => ({
    initiales: formData.code ? formData.code.substring(0, 2).toUpperCase() : '??',
    nom: formData.nom || 'Nom de la matière',
    code: formData.code || 'CODE',
    coefficient: formData.coefficient,
    niveauNom: niveaux.find(n => n.id == formData.niveau_id)?.nom || 'Aucun niveau',
    statut: formData.actif ? 'Actif' : 'Inactif',
    nbEnseignants: enseignantsAssignes.length
  }), [formData.nom, formData.code, formData.coefficient, formData.niveau_id, formData.actif, niveaux, enseignantsAssignes]);

  // Filtrer les enseignants disponibles (non encore assignés pour l'année sélectionnée)
  const enseignantsDisponibles = useMemo(() => {
    return enseignants.filter(enseignant => 
      !enseignantsAssignes.some(assignation => 
        assignation.enseignant_id == enseignant.id && 
        assignation.annee_scolaire_id == nouvelEnseignant.annee_scolaire_id
      )
    );
  }, [enseignants, enseignantsAssignes, nouvelEnseignant.annee_scolaire_id]);

  
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <InputField
              icon={BookOpen}
              label="Nom de la matière"
              name="nom"
              required
              placeholder="Ex: Mathématiques, Français..."
              value={formData.nom}
              onChange={handleInputChange}
              onFocus={() => handleFocus('nom')}
              onBlur={handleBlur}
              isFocused={focusedField === 'nom'}
              hasValue={!!formData.nom}
            />
            
            <InputField
              icon={Code}
              label="Code matière"
              name="code"
              required
              placeholder="Ex: MATH, FR, ANG..."
              value={formData.code}
              onChange={handleInputChange}
              onFocus={() => handleFocus('code')}
              onBlur={handleBlur}
              isFocused={focusedField === 'code'}
              hasValue={!!formData.code}
            />
            
            <InputField
              icon={Hash}
              label="Coefficient"
              name="coefficient"
              type="number"
              min="0.5"
              max="10"
              step="0.5"
              required
              placeholder="1"
              value={formData.coefficient}
              onChange={handleInputChange}
              onFocus={() => handleFocus('coefficient')}
              onBlur={handleBlur}
              isFocused={focusedField === 'coefficient'}
              hasValue={!!formData.coefficient}
            />

            <InputField
              icon={GraduationCap}
              label="Niveau"
              name="niveau_id"
              type="select"
              required
              placeholder="Sélectionner un niveau"
              value={formData.niveau_id}
              onChange={handleInputChange}
              onFocus={() => handleFocus('niveau_id')}
              onBlur={handleBlur}
              isFocused={focusedField === 'niveau_id'}
              hasValue={!!formData.niveau_id}
              options={niveaux}
            />
          </div>
        </div>
        {/* Section Gestion des Enseignants */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Enseignants assignés</h3>
          </div>

          {/* Ajouter un nouvel enseignant */}
          <div className="bg-white/60 rounded-xl p-4 border border-white/40 mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Assigner un enseignant
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                icon={UserCheck}
                label="Enseignant"
                name="enseignant_id"
                type="select"
                placeholder="Sélectionner un enseignant"
                value={nouvelEnseignant.enseignant_id}
                onChange={handleNouvelEnseignantChange}
                onFocus={() => handleFocus('nouvel_enseignant')}
                onBlur={handleBlur}
                isFocused={focusedField === 'nouvel_enseignant'}
                hasValue={!!nouvelEnseignant.enseignant_id}
                options={enseignantsDisponibles}
              />

              <InputField
                icon={Calendar}
                label="Année scolaire"
                name="annee_scolaire_id"
                type="select"
                placeholder="Sélectionner une année"
                value={nouvelEnseignant.annee_scolaire_id}
                onChange={handleNouvelEnseignantChange}
                onFocus={() => handleFocus('nouvel_annee')}
                onBlur={handleBlur}
                isFocused={focusedField === 'nouvel_annee'}
                hasValue={!!nouvelEnseignant.annee_scolaire_id}
                options={anneesScolaires}
              />

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={ajouterEnseignant}
                  disabled={!nouvelEnseignant.enseignant_id || !nouvelEnseignant.annee_scolaire_id}
                  className="w-full h-12 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>
          </div>
          {/* Liste des enseignants assignés */}
          <div className="bg-white/60 rounded-xl p-4 border border-white/40">
            <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center">
              <UserCheck className="w-4 h-4 mr-2" />
              Enseignants assignés ({enseignantsAssignes.length})
            </h4>

            {enseignantsAssignes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucun enseignant assigné à cette matière</p>
                <p className="text-sm">Utilisez le formulaire ci-dessus pour ajouter des enseignants</p>
              </div>
            ) : (
              <div className="space-y-3">
                {enseignantsAssignes.map((assignation, index) => (
                  <div 
                    key={assignation.id || index} 
                    className={`flex items-center justify-between p-3 bg-white rounded-lg border-2 transition-all duration-200 ${
                      assignation.nouveau ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {assignation?.user?.name?.charAt(0)}
                          {assignation?.user?.nom?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {assignation?.user?.name} {assignation?.user?.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignation.annee_scolaire?.libelle || 'Année non spécifiée'}
                          {assignation?.specialite && (
                            <span className="ml-2 text-purple-600">• {assignation.specialite}</span>
                          )}
                        </div>
                      </div>
                      {assignation.nouveau && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Nouveau
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => supprimerEnseignant(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Supprimer l'assignation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Section Statut */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              {formData.actif ? (
                <ToggleRight className="w-5 h-5 text-white" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-white" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">Statut de la matière</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white/40">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${formData.actif ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div>
                <p className="font-medium text-gray-900">
                  {formData.actif ? 'Matière active' : 'Matière inactive'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.actif 
                    ? 'La matière est disponible pour les enseignements' 
                    : 'La matière est masquée et indisponible'
                  }
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleToggleActif}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                formData.actif 
                  ? 'bg-green-500 focus:ring-green-500' 
                  : 'bg-gray-300 focus:ring-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  formData.actif ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    formData.actif ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    {apercuData.initiales}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {apercuData.nom}
                    </div>
                    <div className="text-sm text-gray-500">
                      {apercuData.code} • Coef. {apercuData.coefficient}
                    </div>
                    <div className="text-xs text-gray-400">
                      {apercuData.niveauNom}
                    </div>
                    <div className={`text-xs font-medium ${
                      formData.actif ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {apercuData.statut} • {apercuData.nbEnseignants} enseignant(s)
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
                    <span className="text-gray-600">Niveau :</span>
                    <span className="font-medium text-gray-900">
                      {apercuData.niveauNom}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enseignants :</span>
                    <span className="font-medium text-gray-900">
                      {apercuData.nbEnseignants} assigné(s)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut :</span>
                    <span className={`font-medium ${
                      formData.actif ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {apercuData.statut}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
            disabled={loading || !formData.nom || !formData.code || !formData.niveau_id}
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