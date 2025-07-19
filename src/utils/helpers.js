// Utilitaires de formatage et helpers pour l'application

/**
 * Formatage des dates
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    short: { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    },
    datetime: { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit'
    }
  };

  return d.toLocaleDateString('fr-FR', options[format] || options.short);
};

/**
 * Formatage des notes et moyennes
 */
export const formatGrade = (grade, precision = 2) => {
  if (grade === null || grade === undefined || grade === '') return 'N/A';
  const num = parseFloat(grade);
  if (isNaN(num)) return 'N/A';
  return `${num.toFixed(precision)}/20`;
};

/**
 * Calcul de la mention selon la moyenne
 */
export const getMention = (moyenne) => {
  const moy = parseFloat(moyenne);
  if (isNaN(moy)) return 'N/A';
  
  if (moy >= 16) return { text: "Très Bien", color: "text-green-600", bg: "bg-green-100" };
  if (moy >= 14) return { text: "Bien", color: "text-blue-600", bg: "bg-blue-100" };
  if (moy >= 12) return { text: "Assez Bien", color: "text-yellow-600", bg: "bg-yellow-100" };
  if (moy >= 10) return { text: "Passable", color: "text-orange-600", bg: "bg-orange-100" };
  return { text: "Insuffisant", color: "text-red-600", bg: "bg-red-100" };
};

/**
 * Formatage des tailles de fichiers
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Formatage des numéros de téléphone
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Format sénégalais : +221 XX XXX XX XX ou 0X XXX XX XX
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('221')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }
  
  return phone;
};

/**
 * Génération d'initiales à partir d'un nom complet
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

/**
 * Validation d'email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Génération de couleurs pour les avatars
 */
export const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-gray-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Calcul de l'âge à partir de la date de naissance
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  if (isNaN(birth.getTime())) return null;
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Capitalisation de la première lettre
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formatage du nom complet
 */
export const formatFullName = (firstName, lastName, format = 'normal') => {
  const first = capitalize(firstName || '');
  const last = (lastName || '').toUpperCase();
  
  switch (format) {
    case 'lastFirst':
      return `${last} ${first}`.trim();
    case 'initialsLast':
      return `${first.charAt(0)}. ${last}`.trim();
    default:
      return `${first} ${last}`.trim();
  }
};

/**
 * Génération d'identifiant unique simple
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`;
};

/**
 * Debounce function pour optimiser les recherches
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validation des mots de passe
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Le mot de passe est requis');
    return errors;
  }
  
  if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return errors;
};

/**
 * Formatage des durées (en minutes vers heures/minutes)
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

/**
 * Conversion de notes en pourcentage
 */
export const gradeToPercentage = (grade, maxGrade = 20) => {
  if (!grade || !maxGrade) return 0;
  return Math.round((parseFloat(grade) / maxGrade) * 100);
};

/**
 * Génération de suggestions d'appréciations
 */
export const getAppreciationSuggestions = (grade) => {
  const suggestions = {
    excellent: [
      "Excellent travail, continuez ainsi !",
      "Très bonne maîtrise du sujet",
      "Félicitations pour ce résultat remarquable",
      "Travail exemplaire, bravo !"
    ],
    good: [
      "Bon travail, continuez vos efforts",
      "Bonne progression, persévérez",
      "Résultat satisfaisant, peut encore mieux faire",
      "Travail correct, maintenez ce niveau"
    ],
    average: [
      "Travail moyen, des efforts sont nécessaires",
      "Doit approfondir ses connaissances",
      "Peut mieux faire avec plus de travail",
      "Résultat mitigé, concentration requise"
    ],
    poor: [
      "Travail insuffisant, besoin d'aide",
      "Grandes difficultés, soutien nécessaire",
      "Doit revoir les bases fondamentales",
      "Travail très insuffisant, efforts urgents requis"
    ]
  };

  const gradeValue = parseFloat(grade);
  
  if (gradeValue >= 16) return suggestions.excellent;
  if (gradeValue >= 12) return suggestions.good;
  if (gradeValue >= 8) return suggestions.average;
  return suggestions.poor;
};

/**
 * Tri intelligent des données
 */
export const smartSort = (data, key, direction = 'asc') => {
  return [...data].sort((a, b) => {
    const aVal = getNestedValue(a, key);
    const bVal = getNestedValue(b, key);
    
    // Gestion des valeurs nulles/undefined
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return direction === 'asc' ? 1 : -1;
    if (bVal == null) return direction === 'asc' ? -1 : 1;
    
    // Tri numérique
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    // Tri des dates
    if (aVal instanceof Date && bVal instanceof Date) {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    // Tri alphabétique
    const aStr = aVal.toString().toLowerCase();
    const bStr = bVal.toString().toLowerCase();
    
    if (direction === 'asc') {
      return aStr.localeCompare(bStr, 'fr');
    } else {
      return bStr.localeCompare(aStr, 'fr');
    }
  });
};

/**
 * Accès aux propriétés imbriquées d'un objet
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Exportation en CSV
 */
export const exportToCSV = (data, filename = 'export.csv', columns = []) => {
  if (!data || data.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }

  // Utiliser les colonnes spécifiées ou toutes les clés du premier objet
  const headers = columns.length > 0 
    ? columns 
    : Object.keys(data[0]);

  // Créer le contenu CSV
  const csvContent = [
    headers.join(','), // En-têtes
    ...data.map(row => 
      headers.map(header => {
        const value = getNestedValue(row, header) || '';
        // Échapper les guillemets et entourer de guillemets si nécessaire
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  // Créer et télécharger le fichier
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Utilitaires pour les statistiques
 */
export const calculateStats = (numbers) => {
  if (!numbers || numbers.length === 0) {
    return { count: 0, sum: 0, average: 0, min: 0, max: 0 };
  }

  const validNumbers = numbers.filter(n => typeof n === 'number' && !isNaN(n));
  
  if (validNumbers.length === 0) {
    return { count: 0, sum: 0, average: 0, min: 0, max: 0 };
  }

  const sum = validNumbers.reduce((acc, num) => acc + num, 0);
  const average = sum / validNumbers.length;
  const min = Math.min(...validNumbers);
  const max = Math.max(...validNumbers);

  return {
    count: validNumbers.length,
    sum,
    average: Math.round(average * 100) / 100,
    min,
    max
  };
};

export default {
  formatDate,
  formatGrade,
  getMention,
  formatFileSize,
  formatPhone,
  getInitials,
  isValidEmail,
  getAvatarColor,
  calculateAge,
  capitalize,
  formatFullName,
  generateId,
  debounce,
  validatePassword,
  formatDuration,
  gradeToPercentage,
  getAppreciationSuggestions,
  smartSort,
  getNestedValue,
  exportToCSV,
  calculateStats
};
