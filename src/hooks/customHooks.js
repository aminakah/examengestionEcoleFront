import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { authService, setupAPIInterceptors } from '../services/index';

// Hook pour gérer les données avec CRUD
export const useDataManager = (endpoint, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données');
      console.error(`Erreur chargement ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const create = useCallback(async (newItem) => {
    try {
      setCreating(true);
      setError(null);
      const response = await apiService.post(endpoint, newItem);
      setData(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setCreating(false);
    }
  }, [endpoint]);

  const update = useCallback(async (id, updatedItem) => {
    try {
      setUpdating(true);
      setError(null);
      const response = await apiService.put(`${endpoint}/${id}`, updatedItem);
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...response.data } : item
      ));
      return response.data;
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [endpoint]);

  const remove = useCallback(async (id) => {
    try {
      setDeleting(true);
      setError(null);
      await apiService.delete(`${endpoint}/${id}`);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setDeleting(false);
    }
  }, [endpoint]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData, ...dependencies]);

  return {
    data,
    loading,
    error,
    creating,
    updating,
    deleting,
    create,
    update,
    remove,
    refresh,
    setData
  };
};

// Hook pour la pagination
export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const reset = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

// Hook pour les filtres et recherche
export const useFilter = (items, searchFields = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredItems = items.filter(item => {
    // Recherche textuelle
    const matchesSearch = searchTerm === '' || searchFields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Filtres spécifiques
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value || value === '') return true;
      const itemValue = getNestedValue(item, key);
      return itemValue && itemValue.toString() === value.toString();
    });

    return matchesSearch && matchesFilters;
  });

  // Tri
  const sortedItems = sortBy ? filteredItems.sort((a, b) => {
    const aValue = getNestedValue(a, sortBy);
    const bValue = getNestedValue(b, sortBy);
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  }) : filteredItems;

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    sortOrder,
    toggleSort,
    filteredItems: sortedItems,
    totalItems: items.length,
    filteredCount: sortedItems.length
  };
};

// Hook pour la gestion des modals
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const open = (modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setData(null);
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    data,
    open,
    close,
    toggle
  };
};

// Hook pour les notifications toast
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    // Auto-suppression après la durée spécifiée
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};

// Hook pour les statistiques
export const useStats = (data, calculations = {}) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!data || data.length === 0) {
      setStats({});
      return;
    }

    const newStats = {};

    // Calculs par défaut
    newStats.total = data.length;
    newStats.isEmpty = data.length === 0;

    // Calculs personnalisés
    Object.entries(calculations).forEach(([key, calcFunction]) => {
      try {
        newStats[key] = calcFunction(data);
      } catch (error) {
        console.error(`Erreur calcul stat ${key}:`, error);
        newStats[key] = null;
      }
    });

    setStats(newStats);
  }, [data, calculations]);

  return stats;
};

// Hook pour la persistance local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lecture localStorage pour ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur écriture localStorage pour ${key}:`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur suppression localStorage pour ${key}:`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Hook pour l'authentification
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialisation de l'authentification
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Configurer les intercepteurs API
        setupAPIInterceptors();
        
        // Vérifier si l'utilisateur est déjà connecté
        if (authService.isAuthenticated()) {
          const profile = await authService.getProfile();
          setUser(profile.data || profile);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
        // En cas d'erreur, déconnecter l'utilisateur
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Connexion
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Inscription
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error('Erreur register:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Déconnexion
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Changement de mot de passe
  const changePassword = useCallback(async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      throw error;
    }
  }, []);

  // Rafraîchir le profil utilisateur
  const refreshProfile = useCallback(async () => {
    try {
      if (isAuthenticated) {
        const profile = await authService.getProfile();
        setUser(profile.data || profile);
      }
    } catch (error) {
      console.error('Erreur refresh profile:', error);
      // En cas d'erreur, déconnecter l'utilisateur
      logout();
    }
  }, [isAuthenticated]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    changePassword,
    refreshProfile
  };
};

// Fonction utilitaire pour accéder aux propriétés imbriquées
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export default {
  useDataManager,
  usePagination,
  useFilter,
  useModal,
  useToast,
  useStats,
  useLocalStorage,
  useAuth
};
