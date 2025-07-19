// Utilitaires de validation pour les formulaires

export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Ce champ est obligatoire';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Format d\'email invalide';
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^(\+221|00221)?\s?[0-9]{9}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Format de téléphone invalide (ex: 771234567)';
    }
    return null;
  },

  minLength: (minLength) => (value) => {
    if (!value) return null;
    if (value.length < minLength) {
      return `Minimum ${minLength} caractères requis`;
    }
    return null;
  },

  maxLength: (maxLength) => (value) => {
    if (!value) return null;
    if (value.length > maxLength) {
      return `Maximum ${maxLength} caractères autorisés`;
    }
    return null;
  },

  grade: (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const grade = parseFloat(value);
    if (isNaN(grade) || grade < 0 || grade > 20) {
      return 'La note doit être comprise entre 0 et 20';
    }
    return null;
  },

  positiveNumber: (value) => {
    if (!value) return null;
    const number = parseFloat(value);
    if (isNaN(number) || number <= 0) {
      return 'Doit être un nombre positif';
    }
    return null;
  },

  date: (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Format de date invalide';
    }
    return null;
  },

  birthDate: (value) => {
    if (!value) return null;
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (isNaN(birthDate.getTime())) {
      return 'Format de date invalide';
    }
    
    if (birthDate > today) {
      return 'La date de naissance ne peut pas être dans le futur';
    }
    
    if (age < 3 || age > 25) {
      return 'L\'âge doit être compris entre 3 et 25 ans';
    }
    
    return null;
  },

  password: (value) => {
    if (!value) return null;
    if (value.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    return null;
  },

  confirmPassword: (password) => (value) => {
    if (!value) return null;
    if (value !== password) {
      return 'Les mots de passe ne correspondent pas';
    }
    return null;
  }
};

export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    const value = data[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        isValid = false;
        break; // Arrêter à la première erreur pour ce champ
      }
    }
  });

  return { isValid, errors };
};

// Validations spécifiques pour l'application scolaire
export const studentValidationRules = {
  nom: [validationRules.required, validationRules.minLength(2), validationRules.maxLength(50)],
  prenom: [validationRules.required, validationRules.minLength(2), validationRules.maxLength(50)],
  email: [validationRules.required, validationRules.email],
  date_naissance: [validationRules.required, validationRules.birthDate],
  telephone: [validationRules.phone],
  adresse: [validationRules.required, validationRules.minLength(10)],
  parent_nom: [validationRules.required, validationRules.minLength(2)],
  parent_prenom: [validationRules.required, validationRules.minLength(2)],
  parent_email: [validationRules.required, validationRules.email],
  telephone_parent: [validationRules.required, validationRules.phone],
  classe_id: [validationRules.required]
};

export const teacherValidationRules = {
  nom: [validationRules.required, validationRules.minLength(2), validationRules.maxLength(50)],
  prenom: [validationRules.required, validationRules.minLength(2), validationRules.maxLength(50)],
  email: [validationRules.required, validationRules.email],
  telephone: [validationRules.required, validationRules.phone],
  specialite: [validationRules.required],
  date_embauche: [validationRules.required, validationRules.date]
};

export const gradeValidationRules = {
  note: [validationRules.required, validationRules.grade],
  appreciation: [validationRules.maxLength(200)]
};

export const classValidationRules = {
  nom: [validationRules.required, validationRules.minLength(2), validationRules.maxLength(20)],
  niveau: [validationRules.required],
  salle: [validationRules.required]
};

export const subjectValidationRules = {
  nom: [validationRules.required, validationRules.minLength(2), validationRules.maxLength(50)],
  coefficient: [validationRules.required, validationRules.positiveNumber],
  heures_semaine: [validationRules.required, validationRules.positiveNumber]
};

// Fonction utilitaire pour valider en temps réel
export const validateField = (value, rules) => {
  const fieldRules = Array.isArray(rules) ? rules : [rules];
  
  for (const rule of fieldRules) {
    const error = rule(value);
    if (error) {
      return error;
    }
  }
  return null;
};

// Hook personnalisé pour la validation de formulaire
export const useFormValidation = (initialData, validationRules) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    const fieldRules = validationRules[field];
    if (!fieldRules) return null;

    const rules = Array.isArray(fieldRules) ? fieldRules : [fieldRules];
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Valider le champ si il a été touché
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, data[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));

    return isValid;
  };

  const reset = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
  };
};

// Composant de champ de saisie avec validation
export const ValidatedInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  onBlur, 
  error, 
  required = false,
  placeholder,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur && onBlur(name)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Composant de sélection avec validation
export const ValidatedSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur, 
  error, 
  required = false,
  options = [],
  placeholder = 'Sélectionner...',
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur && onBlur(name)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Composant de zone de texte avec validation
export const ValidatedTextarea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur, 
  error, 
  required = false,
  placeholder,
  rows = 3,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur && onBlur(name)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
