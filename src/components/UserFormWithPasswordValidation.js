import React, { useState } from 'react';
import { User, Mail, Shield, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { PasswordInputField, PasswordConfirmationField } from './common/PasswordField';
import { validateUser, validatePassword } from '../utils/validation';

/**
 * Formulaire amélioré de création/modification d'utilisateur - Amélioration pour l'audit
 * Intègre la validation renforcée des mots de passe
 */
export const UserFormWithPasswordValidation = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    password_confirmation: '',
    role: initialData?.role || 'eleve',
    statut: initialData?.statut || 'actif'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(!isEditing);

  const roles = [
    { value: 'administrateur', label: 'Administrateur', icon: Shield },
    { value: 'enseignant', label: 'Enseignant', icon: User },
    { value: 'parent', label: 'Parent', icon: User },
    { value: 'eleve', label: 'Élève', icon: User }
  ];

  const statuts = [
    { value: 'actif', label: 'Actif', color: 'green' },
    { value: 'inactif', label: 'Inactif', color: 'red' },
    { value: 'suspendu', label: 'Suspendu', color: 'yellow' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData(prev => ({
      ...prev,
      password
    }));
    
    // Validation en temps réel du mot de passe
    if (password) {
      const validation = validatePassword(password, {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      });
      
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          password: validation.errors[0] // Première erreur
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          password: null
        }));
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setFormData(prev => ({
      ...prev,
      password_confirmation: confirmPassword
    }));
    
    // Validation de la correspondance
    if (confirmPassword && formData.password !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        password_confirmation: 'Les mots de passe ne correspondent pas'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        password_confirmation: null
      }));
    }
  };

  const validateForm = () => {
    const validation = validateUser(formData, isEditing);
    
    // Validation supplémentaire du mot de passe si nécessaire
    if ((showPasswordFields || !isEditing) && formData.password) {
      const passwordValidation = validatePassword(formData.password, {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      });
      
      if (!passwordValidation.isValid) {
        validation.errors.password = passwordValidation.errors[0];
        validation.isValid = false;
      }
    }
    
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = { ...formData };
      
      // Ne pas envoyer les mots de passe vides en édition
      if (isEditing && !formData.password) {
        delete submitData.password;
        delete submitData.password_confirmation;
      }
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>
            {isEditing ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
          </span>
        </h3>
      </div>

      {/* Corps du formulaire */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nom et prénom"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Adresse email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="nom@exemple.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Rôle et Statut */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="w-4 h-4 inline mr-1" />
              Rôle *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuts.map((statut) => (
                <option key={statut.value} value={statut.value}>
                  {statut.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gestion des mots de passe - Amélioration pour l'audit */}
        {isEditing && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Modification du mot de passe
                </h4>
                <p className="text-sm text-blue-700">
                  Laissez vide pour conserver le mot de passe actuel
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                {showPasswordFields ? 'Annuler' : 'Modifier'}
              </button>
            </div>
          </div>
        )}

        {/* Champs de mot de passe avec validation renforcée */}
        {(showPasswordFields || !isEditing) && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Mot de passe {!isEditing && '*'}
            </h4>
            
            <PasswordInputField
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="Créez un mot de passe sécurisé"
              label="Nouveau mot de passe"
              required={!isEditing}
              showStrength={true}
              className="mb-4"
            />
            
            <PasswordConfirmationField
              password={formData.password}
              confirmPassword={formData.password_confirmation}
              onConfirmChange={handleConfirmPasswordChange}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 inline mr-1" />
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={loading || Object.values(errors).some(error => error)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>
              {loading ? 'Sauvegarde...' : isEditing ? 'Mettre à jour' : 'Créer'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFormWithPasswordValidation;