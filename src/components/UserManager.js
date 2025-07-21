import React, { useState } from 'react';
import { userService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useDataManager, useToast, usePagination, useFilter } from '../../hooks/customHooks';
import { validateUser } from '../../utils/validation';
import { formatDate, formatFullName } from '../../utils/helpers';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Composant de gestion des utilisateurs pour les administrateurs
 */
export default function UserManager() {
  const { user: currentUser } = useAuth();
  const { success, error: showError } = useToast();
  
  // Gestion des données utilisateurs
  const {
    data: users,
    loading,
    error,
    create,
    update,
    remove,
    refresh
  } = useDataManager('/users');

  // Pagination
  const {
    currentItems: paginatedUsers,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = usePagination(users, 10);

  // Filtres et recherche
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredItems: filteredUsers
  } = useFilter(users, ['name', 'email']);

  // États des modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Créer un utilisateur
  const handleCreateUser = async (userData) => {
    try {
      const validation = validateUser(userData, false);
      if (!validation.isValid) {
        showError('Veuillez corriger les erreurs dans le formulaire');
        return;
      }

      await create(userData);
      success('Utilisateur créé avec succès');
      setShowCreateModal(false);
    } catch (err) {
      showError('Erreur lors de la création de l\'utilisateur');
    }
  };

  // Modifier un utilisateur
  const handleUpdateUser = async (userData) => {
    try {
      const validation = validateUser(userData, true);
      if (!validation.isValid) {
        showError('Veuillez corriger les erreurs dans le formulaire');
        return;
      }

      await update(selectedUser.id, userData);
      success('Utilisateur modifié avec succès');
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      showError('Erreur lors de la modification de l\'utilisateur');
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async () => {
    try {
      await remove(selectedUser.id);
      success('Utilisateur supprimé avec succès');
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      showError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  // Basculer le statut d'un utilisateur
  const handleToggleUserStatus = async (userId) => {
    try {
      await userService.toggleUserStatus(userId);
      success('Statut de l\'utilisateur modifié');
      refresh();
    } catch (err) {
      showError('Erreur lors de la modification du statut');
    }
  };

  // Réinitialiser le mot de passe
  const handleResetPassword = async (userId) => {
    try {
      await userService.resetUserPassword(userId);
      success('Mot de passe réinitialisé avec succès');
    } catch (err) {
      showError('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <p className="text-gray-600 mt-2">
          Gérez les comptes utilisateurs de l'établissement
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total utilisateurs"
          value={users.length}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Administrateurs"
          value={users.filter(u => u.role === 'admin').length}
          icon="👑"
          color="purple"
        />
        <StatCard
          title="Enseignants"
          value={users.filter(u => u.role === 'enseignant').length}
          icon="👨‍🏫"
          color="green"
        />
        <StatCard
          title="Parents"
          value={users.filter(u => u.role === 'parent').length}
          icon="👪"
          color="orange"
        />
      </div>

      {/* Filtres et actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Recherche */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filtres par rôle */}
          <div className="flex gap-2">
            <select
              value={filters.role || ''}
              onChange={(e) => updateFilter('role', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="enseignant">Enseignants</option>
              <option value="parent">Parents</option>
              <option value="eleve">Élèves</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Effacer
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nouvel utilisateur
            </button>

            <button
              onClick={refresh}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Informations sur les filtres */}
        {(searchTerm || Object.keys(filters).some(k => filters[k])) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {filteredUsers.length} utilisateur(s) trouvé(s)
              {searchTerm && ` pour "${searchTerm}"`}
              {filters.role && ` • Rôle: ${filters.role}`}
            </p>
          </div>
        )}
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {error ? (
          <div className="p-6 text-center text-red-600">
            Erreur: {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.keys(filters).some(k => filters[k])
                ? 'Aucun utilisateur ne correspond aux critères de recherche'
                : 'Commencez par créer votre premier utilisateur'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Créer un utilisateur
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={user.status || 'actif'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login ? formatDate(user.last_login, { format: 'datetime' }) : 'Jamais'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Modifier
                          </button>
                          
                          {user.id !== currentUser?.id && (
                            <>
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={`${
                                  user.status === 'actif' 
                                    ? 'text-orange-600 hover:text-orange-900' 
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                              >
                                {user.status === 'actif' ? 'Désactiver' : 'Activer'}
                              </button>
                              
                              <button
                                onClick={() => handleResetPassword(user.id)}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                Reset MdP
                              </button>
                              
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                Supprimer
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={prevPage}
                      disabled={!hasPrevPage}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={!hasNextPage}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> à{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * 10, filteredUsers.length)}
                        </span>{' '}
                        sur <span className="font-medium">{filteredUsers.length}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={prevPage}
                          disabled={!hasPrevPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={nextPage}
                          disabled={!hasNextPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <UserFormModal
          title="Créer un utilisateur"
          onSubmit={handleCreateUser}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showEditModal && selectedUser && (
        <UserFormModal
          title="Modifier un utilisateur"
          user={selectedUser}
          isEdit={true}
          onSubmit={handleUpdateUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteConfirmModal
          user={selectedUser}
          onConfirm={handleDeleteUser}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * Composant carte de statistique
 */
function StatCard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}

/**
 * Badge de rôle
 */
function RoleBadge({ role }) {
  const getRoleConfig = () => {
    switch (role) {
      case 'admin':
        return { color: 'purple', text: 'Administrateur', icon: '👑' };
      case 'enseignant':
        return { color: 'green', text: 'Enseignant', icon: '👨‍🏫' };
      case 'parent':
        return { color: 'orange', text: 'Parent', icon: '👪' };
      case 'eleve':
        return { color: 'blue', text: 'Élève', icon: '🎓' };
      default:
        return { color: 'gray', text: 'Inconnu', icon: '❓' };
    }
  };

  const { color, text, icon } = getRoleConfig();
  
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    orange: 'bg-orange-100 text-orange-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      <span className="mr-1">{icon}</span>
      {text}
    </span>
  );
}

/**
 * Badge de statut
 */
function StatusBadge({ status }) {
  const isActive = status === 'actif';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        isActive ? 'bg-green-400' : 'bg-red-400'
      }`}></span>
      {isActive ? 'Actif' : 'Inactif'}
    </span>
  );
}

/**
 * Modal de formulaire utilisateur
 */
function UserFormModal({ title, user = null, isEdit = false, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    role: user?.role || 'parent'
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateUser(formData, isEdit);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="admin">Administrateur</option>
              <option value="enseignant">Enseignant</option>
              <option value="parent">Parent</option>
              <option value="eleve">Élève</option>
            </select>
          </div>

          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEdit ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Modal de confirmation de suppression
 */
function DeleteConfirmModal({ user, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Supprimer l'utilisateur
              </h3>
              <p className="text-gray-600">
                Cette action est irréversible
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
              <span className="font-medium">{user.name}</span> ?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Toutes les données associées à cet utilisateur seront définitivement supprimées.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
