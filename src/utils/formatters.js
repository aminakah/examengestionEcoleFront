// Utilitaires pour l'interface utilisateur

/**
 * Obtient les initiales d'un prénom et nom de manière sécurisée
 * @param {string} prenom - Le prénom
 * @param {string} nom - Le nom
 * @returns {string} Les initiales (ex: "JD" pour "John Doe")
 */
export const getInitials = (prenom, nom) => {
  const prenomInitial = prenom && typeof prenom === 'string' ? prenom.charAt(0).toUpperCase() : '';
  const nomInitial = nom && typeof nom === 'string' ? nom.charAt(0).toUpperCase() : '';
  return prenomInitial + nomInitial || '??';
};

/**
 * Obtient l'initiale d'un texte de manière sécurisée
 * @param {string} text - Le texte
 * @returns {string} La première lettre en majuscule
 */
export const getInitial = (text) => {
  return text && typeof text === 'string' ? text.charAt(0).toUpperCase() : '?';
};

/**
 * Formate un nom complet de manière sécurisée
 * @param {string} prenom - Le prénom
 * @param {string} nom - Le nom
 * @returns {string} Le nom complet formaté
 */
export const formatFullName = (prenom, nom) => {
  const prenomStr = prenom && typeof prenom === 'string' ? prenom.trim() : '';
  const nomStr = nom && typeof nom === 'string' ? nom.trim() : '';
  
  if (prenomStr && nomStr) {
    return `${prenomStr} ${nomStr}`;
  } else if (prenomStr) {
    return prenomStr;
  } else if (nomStr) {
    return nomStr;
  } else {
    return 'Nom non renseigné';
  }
};

/**
 * Vérifie si une valeur est définie et non vide
 * @param {any} value - La valeur à vérifier
 * @returns {boolean} True si la valeur est valide
 */
export const isValidValue = (value) => {
  return value !== null && value !== undefined && value !== '';
};

/**
 * Formate une date de manière sécurisée
 * @param {string|Date} date - La date à formater
 * @returns {string} La date formatée ou "Non renseignée"
 */
export const formatDate = (date) => {
  if (!date) return 'Non renseignée';
  
  try {
    return new Date(date).toLocaleDateString('fr-FR');
  } catch (error) {
    return 'Date invalide';
  }
};

/**
 * Formate un email de manière sécurisée
 * @param {string} email - L'email à formater
 * @returns {string} L'email formaté ou "Email non renseigné"
 */
export const formatEmail = (email) => {
  return email && typeof email === 'string' ? email.trim() : 'Email non renseigné';
};

/**
 * Formate un numéro de téléphone de manière sécurisée
 * @param {string} phone - Le numéro de téléphone
 * @returns {string} Le numéro formaté ou "Téléphone non renseigné"
 */
export const formatPhone = (phone) => {
  return phone && typeof phone === 'string' ? phone.trim() : 'Téléphone non renseigné';
};
