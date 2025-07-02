import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Simulation d'une connexion - à remplacer par l'API réelle
      const mockUsers = {
        'admin@ecole.com': { 
          id: 1, 
          name: 'Administrateur', 
          email: 'admin@ecole.com', 
          role: 'admin' 
        },
        'prof@ecole.com': { 
          id: 2, 
          name: 'Marie Dupont', 
          email: 'prof@ecole.com', 
          role: 'enseignant' 
        },
        'parent@ecole.com': { 
          id: 3, 
          name: 'Jean Martin', 
          email: 'parent@ecole.com', 
          role: 'parent' 
        }
      };

      const user = mockUsers[credentials.email];
      if (user && credentials.password === 'password') {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      } else {
        throw new Error('Identifiants incorrects');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};