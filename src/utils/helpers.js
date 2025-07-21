/**
 * Utilitaires pour le formatage et la manipulation des données
 */

/**
 * Formatage des dates
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const {
    locale = 'fr-FR',
    format = 'full' // 'full', 'short', 'medium', 'custom'
  } = options;

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';

  switch (format) {
    case 'full':
      return dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
    case 'short':
      return dateObj.toLocaleDateString(locale);
    
    case 'medium':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    
    case 'time':
      return dateObj.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'datetime':
      return `${formatDate(date, { format: 'short' })} ${formatDate(date, { format: 'time' })}`;
    
    default:
      return dateObj.toLocaleDateString(locale);
  }
};

/**
 * Formatage des notes
 */
export const formatGrade = (grade, options = {}) => {
  const {
    precision = 1,
    showOutOf = true,
    outOf = 20,
    showCoefficient = false,
    coefficient = null
  } = options;

  if (grade === null || grade === undefined) return 'N/A';

  const formattedGrade = parseFloat(grade).toFixed(precision);
  let result = formattedGrade;

  if (showOutOf) {
    result += `/${outOf}`;
  }

  if (showCoefficient && coefficient) {
    result += ` (coef. ${coefficient})`;
  }

  return result;
};

/**
 * Calcul de moyennes
 */
export const calculateAverage = (grades, options = {}) => {
  const {
    useCoefficients = true,
    precision = 2,
    excludeNull = true
  } = options;

  if (!grades || grades.length === 0) return null;

  let filteredGrades = grades;
  
  if (excludeNull) {
    filteredGrades = grades.filter(g => g.note !== null && g.note !== undefined);
  }

  if (filteredGrades.length === 0) return null;

  if (useCoefficients) {
    const totalPoints = filteredGrades.reduce((sum, grade) => {
      const note = parseFloat(grade.note) || 0;
      const coef = parseFloat(grade.coefficient) || 1;
      return sum + (note * coef);
    }, 0);

    const totalCoefficients = filteredGrades.reduce((sum, grade) => {
      const coef = parseFloat(grade.coefficient) || 1;
      return sum + coef;
    }, 0);

    return totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(precision) : null;
  } else {
    const total = filteredGrades.reduce((sum, grade) => sum + (parseFloat(grade.note) || 0), 0);
    return (total / filteredGrades.length).toFixed(precision);
  }
};

/**
 * Formatage des noms complets
 */
export const formatFullName = (person, options = {}) => {
  const {
    format = 'first_last', // 'first_last', 'last_first', 'initials'
    uppercase = false
  } = options;

  if (!person) return '';

  const { nom = '', prenom = '' } = person;
  let result = '';

  switch (format) {
    case 'first_last':
      result = `${prenom} ${nom}`.trim();
      break;
    
    case 'last_first':
      result = `${nom}, ${prenom}`.trim();
      break;
    
    case 'initials':
      const firstInitial = prenom.charAt(0).toUpperCase();
      const lastInitial = nom.charAt(0).toUpperCase();
      result = `${firstInitial}.${lastInitial}.`;
      break;
    
    default:
      result = `${prenom} ${nom}`.trim();
  }

  return uppercase ? result.toUpperCase() : result;
};

/**
 * Formatage des numéros de téléphone
 */
export const formatPhoneNumber = (phone, format = 'dots') => {
  if (!phone) return '';
  
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');
  
  // Vérifier que c'est un numéro français (10 chiffres)
  if (cleaned.length !== 10) return phone;

  switch (format) {
    case 'dots':
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1.$2.$3.$4.$5');
    
    case 'spaces':
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    
    case 'dashes':
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3-$4-$5');
    
    default:
      return cleaned;
  }
};

/**
 * Statistiques sur un ensemble de notes
 */
export const calculateGradeStats = (grades) => {
  if (!grades || grades.length === 0) {
    return {
      count: 0,
      average: null,
      min: null,
      max: null,
      median: null,
      standardDeviation: null
    };
  }

  const validGrades = grades
    .map(g => parseFloat(g.note))
    .filter(note => !isNaN(note))
    .sort((a, b) => a - b);

  if (validGrades.length === 0) {
    return {
      count: 0,
      average: null,
      min: null,
      max: null,
      median: null,
      standardDeviation: null
    };
  }

  const sum = validGrades.reduce((acc, note) => acc + note, 0);
  const average = sum / validGrades.length;
  
  const median = validGrades.length % 2 === 0
    ? (validGrades[validGrades.length / 2 - 1] + validGrades[validGrades.length / 2]) / 2
    : validGrades[Math.floor(validGrades.length / 2)];

  const variance = validGrades.reduce((acc, note) => acc + Math.pow(note - average, 2), 0) / validGrades.length;
  const standardDeviation = Math.sqrt(variance);

  return {
    count: validGrades.length,
    average: parseFloat(average.toFixed(2)),
    min: validGrades[0],
    max: validGrades[validGrades.length - 1],
    median: parseFloat(median.toFixed(2)),
    standardDeviation: parseFloat(standardDeviation.toFixed(2))
  };
};

/**
 * Grouper des éléments par critère
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = getNestedValue(item, key);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

/**
 * Obtenir une valeur imbriquée dans un objet
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Tri intelligent des tableaux
 */
export const smartSort = (array, sortKey, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = getNestedValue(a, sortKey);
    const bValue = getNestedValue(b, sortKey);

    // Gestion des valeurs nulles/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? 1 : -1;
    if (bValue == null) return direction === 'asc' ? -1 : 1;

    // Tri numérique
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Tri par date
    if (aValue instanceof Date && bValue instanceof Date) {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Tri alphabétique (insensible à la casse)
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (direction === 'asc') {
      return aStr.localeCompare(bStr, 'fr', { numeric: true });
    } else {
      return bStr.localeCompare(aStr, 'fr', { numeric: true });
    }
  });
};

/**
 * Formatage des tailles de fichier
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Génération de couleurs pour les graphiques
 */
export const generateColors = (count, options = {}) => {
  const { opacity = 1, hueStart = 0, saturation = 70, lightness = 50 } = options;
  
  const colors = [];
  const hueStep = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const hue = (hueStart + i * hueStep) % 360;
    colors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`);
  }
  
  return colors;
};

/**
 * Debounce pour les recherches
 */
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Pagination des données
 */
export const paginate = (array, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    items: array.slice(startIndex, endIndex),
    totalItems: array.length,
    totalPages: Math.ceil(array.length / itemsPerPage),
    currentPage: page,
    hasNextPage: endIndex < array.length,
    hasPrevPage: page > 1
  };
};

/**
 * Recherche floue dans un tableau
 */
export const fuzzySearch = (array, searchTerm, searchFields) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase().trim();
  
  return array.filter(item => {
    return searchFields.some(field => {
      const value = getNestedValue(item, field);
      if (!value) return false;
      
      return String(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Conversion d'objets en CSV
 */
export const objectsToCSV = (objects, delimiter = ',') => {
  if (!objects || objects.length === 0) return '';
  
  const headers = Object.keys(objects[0]);
  const csvHeaders = headers.join(delimiter);
  
  const csvRows = objects.map(obj => {
    return headers.map(header => {
      const value = obj[header];
      // Échapper les guillemets et ajouter des guillemets si nécessaire
      if (value && typeof value === 'string' && (value.includes(delimiter) || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(delimiter);
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Téléchargement de fichier
 */
export const downloadFile = (content, filename, contentType = 'text/plain') => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.URL.revokeObjectURL(url);
};

/**
 * Formatage des adresses
 */
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [
    address.numero,
    address.rue,
    address.ville,
    address.code_postal
  ].filter(Boolean);
  
  return parts.join(', ');
};

/**
 * Calcul d'âge à partir d'une date de naissance
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
 * Génération d'identifiants uniques
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}_${random}`;
};

/**
 * Capitalisation de la première lettre
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Raccourcissement de texte avec ellipses
 */
export const truncate = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};
