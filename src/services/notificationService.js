// Service de notification pour gérer les messages
export const notificationService = {
  success: (message) => {
    // Vous pouvez remplacer ceci par votre bibliothèque de notification préférée
    console.log('✅ Succès:', message);
    // Exemple avec react-toastify : toast.success(message);
  },

  error: (message) => {
    console.error('❌ Erreur:', message);
    // Exemple avec react-toastify : toast.error(message);
  },

  warning: (message) => {
    console.warn('⚠️ Attention:', message);
    // Exemple avec react-toastify : toast.warning(message);
  },

  info: (message) => {
    console.info('ℹ️ Info:', message);
    // Exemple avec react-toastify : toast.info(message);
  }
};

export default notificationService;
