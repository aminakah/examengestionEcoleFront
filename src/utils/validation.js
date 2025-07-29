/**
 * Utilitaires pour la validation des données
 */

/**
 * Validation des données d'élève
 */
export const validateStudent = (studentData) => {
  const errors = {};

  if (!studentData.nom || studentData.nom.trim().length < 2) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères';
  }

  if (!studentData.prenom || studentData.prenom.trim().length < 2) {
    errors.prenom = 'Le prénom doit contenir au moins 2 caractères';
  }

  if (!studentData.email || !isValidEmail(studentData.email)) {
    errors.email = 'Adresse email invalide';
  }

  if (!studentData.date_naissance) {
    errors.date_naissance = 'Date de naissance requise';
  } else {
    const birthDate = new Date(studentData.date_naissance);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 3 || age > 25) {
      errors.date_naissance = 'Âge invalide (3-25 ans)';
    }
  }

  if (!studentData.classe_id) {
    errors.classe_id = 'Classe requise';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données de note
 */
export const validateGrade = (gradeData) => {
  const errors = {};

  if (!gradeData.eleve_id) {
    errors.eleve_id = 'Élève requis';
  }

  if (!gradeData.matiere_id) {
    errors.matiere_id = 'Matière requise';
  }

  if (!gradeData.periode_id) {
    errors.periode_id = 'Période requise';
  }

  if (gradeData.note === undefined || gradeData.note === null) {
    errors.note = 'Note requise';
  } else {
    const note = parseFloat(gradeData.note);
    if (isNaN(note) || note < 0 || note > 20) {
      errors.note = 'Note invalide (0-20)';
    }
  }

  if (!gradeData.coefficient || gradeData.coefficient < 1 || gradeData.coefficient > 10) {
    errors.coefficient = 'Coefficient invalide (1-10)';
  }

  if (!gradeData.type_note || !['devoir', 'controle', 'examen', 'oral'].includes(gradeData.type_note)) {
    errors.type_note = 'Type de note invalide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données utilisateur
 */
export const validateUser = (userData, isUpdate = false) => {
  const errors = {};

  if (!userData.name || userData.name.trim().length < 2) {
    errors.name = 'Le nom doit contenir au moins 2 caractères';
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    errors.email = 'Adresse email invalide';
  }

  if (!isUpdate) {
    if (!userData.password || userData.password.length < 6) {
      errors.password = 'Mot de passe requis (6 caractères minimum)';
    }

    if (userData.password !== userData.password_confirmation) {
      errors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }
  }

  if (!userData.role || !['admin', 'enseignant', 'parent', 'eleve'].includes(userData.role)) {
    errors.role = 'Rôle invalide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validation téléphone français
 */
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

/**
 * Validation des données de classe
 */
export const validateClass = (classData) => {
  const errors = {};

  if (!classData.nom || classData.nom.trim().length < 2) {
    errors.nom = 'Le nom de classe doit contenir au moins 2 caractères';
  }

  if (!classData.niveau_id) {
    errors.niveau_id = 'Niveau requis';
  }

  if (!classData.annee_scolaire_id) {
    errors.annee_scolaire_id = 'Année scolaire requise';
  }

  if (classData.effectif_max && (classData.effectif_max < 1 || classData.effectif_max > 50)) {
    errors.effectif_max = 'Effectif maximum invalide (1-50)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données de matière
 */
export const validateSubject = (subjectData) => {
  const errors = {};

  if (!subjectData.nom || subjectData.nom.trim().length < 2) {
    errors.nom = 'Le nom de matière doit contenir au moins 2 caractères';
  }

  if (!subjectData.code || subjectData.code.trim().length < 2) {
    errors.code = 'Le code matière doit contenir au moins 2 caractères';
  }

  if (subjectData.coefficient && (subjectData.coefficient < 1 || subjectData.coefficient > 10)) {
    errors.coefficient = 'Coefficient invalide (1-10)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitisation des données
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .trim()
    .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul
    .replace(/[<>]/g, ''); // Supprime les caractères < et >
};

/**
 * Formatage des noms propres
 */
export const formatProperName = (name) => {
  if (typeof name !== 'string') return name;
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Validation des fichiers uploadés
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB par défaut
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'],
    allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
  } = options;

  const errors = [];

  if (file.size > maxSize) {
    errors.push(`Fichier trop volumineux (max: ${Math.round(maxSize / 1024 / 1024)}MB)`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Type de fichier non autorisé: ${file.type}`);
  }

  const extension = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    errors.push(`Extension non autorisée: .${extension}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validation des dates
 */
export const validateDate = (date, options = {}) => {
  const {
    minDate,
    maxDate,
    required = true
  } = options;

  if (!date && required) {
    return { isValid: false, error: 'Date requise' };
  }

  if (!date) {
    return { isValid: true };
  }

  const parsedDate = new Date(date);
  
  if (isNaN(parsedDate.getTime())) {
    return { isValid: false, error: 'Date invalide' };
  }

  if (minDate && parsedDate < new Date(minDate)) {
    return { isValid: false, error: `Date antérieure au minimum autorisé (${minDate})` };
  }

  if (maxDate && parsedDate > new Date(maxDate)) {
    return { isValid: false, error: `Date postérieure au maximum autorisé (${maxDate})` };
  }

  return { isValid: true };
};

/**
 * Validation renforcée des mots de passe - Amélioration pour l'audit
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    maxLength = 64,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
    preventCommonPatterns = true,
    preventPersonalInfo = false,
    personalInfo = []
  } = options;

  const errors = [];
  const warnings = [];

  // Validation de base
  if (!password || password.length === 0) {
    errors.push('Mot de passe requis');
    return { isValid: false, errors, warnings, strength: 'invalide' };
  }

  if (password.length < minLength) {
    errors.push(`Minimum ${minLength} caractères requis`);
  }

  if (password.length > maxLength) {
    errors.push(`Maximum ${maxLength} caractères autorisés`);
  }

  // Validation des caractères
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Au moins une lettre majuscule requise');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Au moins une lettre minuscule requise');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Au moins un chiffre requis');
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\\/]/.test(password)) {
    errors.push('Au moins un caractère spécial requis (!@#$%^&*...)');
  }

  // Validation des motifs interdits
  if (preventCommonPatterns) {
    const commonPatterns = [
      /(.)\1{2,}/,              // 3+ caractères identiques consécutifs
      /123456|654321/,          // Séquences numériques
      /abcdef|fedcba/,          // Séquences alphabétiques
      /azerty|qwerty/i,         // Motifs clavier courants
      /password|motdepasse/i,   // Mots "password"
      /admin|root|user/i,       // Mots administratifs
      /\d{4,}/,                 // Plus de 3 chiffres consécutifs
    ];

    commonPatterns.forEach((pattern, index) => {
      if (pattern.test(password)) {
        const patternNames = [
          'caractères répétitifs',
          'séquence numérique',
          'séquence alphabétique',
          'motif clavier',
          'mot "password"',
          'terme administratif',
          'trop de chiffres consécutifs'
        ];
        warnings.push(`Évitez les ${patternNames[index]}`);
      }
    });
  }

  // Validation des informations personnelles
  if (preventPersonalInfo && personalInfo.length > 0) {
    personalInfo.forEach(info => {
      if (info && password.toLowerCase().includes(info.toLowerCase())) {
        warnings.push('Évitez d\'utiliser des informations personnelles');
      }
    });
  }

  // Validation des caractères non printables
  if (/[\x00-\x1f\x7f-\x9f]/.test(password)) {
    errors.push('Caractères de contrôle non autorisés');
  }

  // Calcul de la force améliorée
  const strength = calculateAdvancedPasswordStrength(password);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    strength,
    score: strength.score,
    recommendations: generatePasswordRecommendations(password, errors, warnings)
  };
};

/**
 * Calcul avancé de la force d'un mot de passe - Amélioration pour l'audit
 */
const calculateAdvancedPasswordStrength = (password) => {
  let score = 0;
  let feedback = [];
  
  // Longueur (0-25 points)
  if (password.length >= 8) score += 5;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  
  // Variété des caractères (0-40 points)
  if (/[a-z]/.test(password)) { score += 5; feedback.push('minuscules'); }
  if (/[A-Z]/.test(password)) { score += 5; feedback.push('majuscules'); }
  if (/\d/.test(password)) { score += 10; feedback.push('chiffres'); }
  if (/[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\\/]/.test(password)) { 
    score += 15; 
    feedback.push('caractères spéciaux'); 
  }
  if (/[À-ÿ]/.test(password)) { score += 5; feedback.push('caractères accentués'); }
  
  // Complexité (0-20 points)
  const uniqueChars = new Set(password.split('')).size;
  if (uniqueChars >= password.length * 0.6) score += 10; // Faible répétition
  if (!/(.)\1{2,}/.test(password)) score += 5; // Pas de répétition
  if (!/012|123|234|345|456|567|678|789|890/.test(password)) score += 5; // Pas de séquence
  
  // Imprévisibilité (0-15 points)
  if (!/password|123456|qwerty|azerty|admin/i.test(password)) score += 10;
  if (password.length > 0 && !/^[a-zA-Z]+$/.test(password)) score += 5; // Pas que des lettres
  
  // Détermination du niveau
  let level, color, description;
  if (score < 30) {
    level = 'très faible';
    color = '#ef4444';
    description = 'Mot de passe très vulnérable';
  } else if (score < 50) {
    level = 'faible';
    color = '#f97316';
    description = 'Mot de passe facilement cassable';
  } else if (score < 70) {
    level = 'moyen';
    color = '#eab308';
    description = 'Mot de passe acceptable';
  } else if (score < 85) {
    level = 'fort';
    color = '#22c55e';
    description = 'Bon mot de passe';
  } else {
    level = 'très fort';
    color = '#059669';
    description = 'Excellent mot de passe';
  }
  
  return {
    score,
    level,
    color,
    description,
    feedback,
    percentage: Math.min(Math.round((score / 100) * 100), 100)
  };
};

/**
 * Génération de recommandations pour améliorer le mot de passe
 */
const generatePasswordRecommendations = (password, errors, warnings) => {
  const recommendations = [];
  
  if (password.length < 12) {
    recommendations.push('Utilisez au moins 12 caractères pour plus de sécurité');
  }
  
  if (!/[A-Z]/.test(password)) {
    recommendations.push('Ajoutez des lettres majuscules');
  }
  
  if (!/[a-z]/.test(password)) {
    recommendations.push('Ajoutez des lettres minuscules');
  }
  
  if (!/\d/.test(password)) {
    recommendations.push('Ajoutez des chiffres');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\\/]/.test(password)) {
    recommendations.push('Ajoutez des caractères spéciaux (!@#$%...)');
  }
  
  if (/(.)\1{2,}/.test(password)) {
    recommendations.push('Évitez les caractères répétitifs (aaa, 111...)');
  }
  
  if (/123|abc|qwe/i.test(password)) {
    recommendations.push('Évitez les suites logiques (123, abc, qwerty...)');
  }
  
  if (password.length > 0 && new Set(password.split('')).size < password.length * 0.6) {
    recommendations.push('Utilisez plus de caractères différents');
  }
  
  return recommendations;
};

/**
 * Validation en lot
 */
export const validateBatch = (items, validationFunction) => {
  const results = items.map((item, index) => ({
    index,
    item,
    validation: validationFunction(item)
  }));

  const validItems = results.filter(r => r.validation.isValid);
  const invalidItems = results.filter(r => !r.validation.isValid);

  return {
    isValid: invalidItems.length === 0,
    validItems: validItems.map(r => r.item),
    invalidItems: invalidItems.map(r => ({
      index: r.index,
      item: r.item,
      errors: r.validation.errors
    })),
    summary: {
      total: items.length,
      valid: validItems.length,
      invalid: invalidItems.length
    }
  };
};
