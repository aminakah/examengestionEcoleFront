import React, { useState, useEffect } from 'react';
import { validatePassword } from '../../utils/validation';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Composant d'affichage de la force du mot de passe - Amélioration pour l'audit
 */
export const PasswordStrengthIndicator = ({ password, showDetails = true }) => {
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    if (password) {
      const result = validatePassword(password, {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      });
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [password]);

  if (!validation || !password) {
    return null;
  }

  const { strength, errors, warnings, recommendations } = validation;

  return (
    <div className="mt-2 space-y-2">
      {/* Barre de progression */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${strength.percentage}%`,
            backgroundColor: strength.color
          }}
        />
      </div>

      {/* Niveau et description */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Shield 
            className="w-4 h-4" 
            style={{ color: strength.color }}
          />
          <span 
            className="font-medium capitalize"
            style={{ color: strength.color }}
          >
            {strength.level}
          </span>
        </div>
        <span className="text-gray-600">
          {strength.score}/100
        </span>
      </div>

      {showDetails && (
        <>
          {/* Description */}
          <p className="text-sm text-gray-600">
            {strength.description}
          </p>

          {/* Erreurs */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">
                  Problèmes à corriger :
                </span>
              </div>
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avertissements */}
          {warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">
                  Avertissements :
                </span>
              </div>
              <ul className="text-sm text-yellow-600 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommandations */}
          {recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  Recommandations :
                </span>
              </div>
              <ul className="text-sm text-blue-600 space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Points positifs */}
          {strength.feedback.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">
                  Points forts :
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {strength.feedback.map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Composant de champ de mot de passe avec validation - Amélioration pour l'audit
 */
export const PasswordInputField = ({ 
  value, 
  onChange, 
  placeholder = "Saisissez votre mot de passe",
  label = "Mot de passe",
  required = false,
  showStrength = true,
  showToggle = true,
  className = "",
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Container du champ */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${showToggle ? 'pr-10' : ''}
            ${focused ? 'border-blue-300' : 'border-gray-300'}
          `}
          {...props}
        />

        {/* Bouton toggle visibilité */}
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Indicateur de force */}
      {showStrength && value && (
        <PasswordStrengthIndicator 
          password={value} 
          showDetails={focused || value.length > 0}
        />
      )}
    </div>
  );
};

/**
 * Composant de confirmation de mot de passe - Amélioration pour l'audit
 */
export const PasswordConfirmationField = ({ 
  password, 
  confirmPassword, 
  onConfirmChange,
  label = "Confirmer le mot de passe",
  placeholder = "Confirmez votre mot de passe",
  className = ""
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isMatching = password && confirmPassword && password === confirmPassword;
  const hasError = confirmPassword && password !== confirmPassword;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>

      {/* Container du champ */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={onConfirmChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-3 py-2 pr-10 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:border-blue-500
            ${hasError ? 
              'border-red-300 focus:ring-red-500 focus:border-red-500' : 
              isMatching ?
                'border-green-300 focus:ring-green-500 focus:border-green-500' :
                'border-gray-300 focus:ring-blue-500'
            }
          `}
        />

        {/* Bouton toggle visibilité */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Messages de validation */}
      {confirmPassword && (
        <div className="flex items-center space-x-2 text-sm">
          {isMatching ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600">Les mots de passe correspondent</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-red-600">Les mots de passe ne correspondent pas</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInputField;