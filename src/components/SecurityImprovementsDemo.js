import React, { useState } from 'react';
import { Shield, Clock, CheckCircle, AlertTriangle, Users, Key } from 'lucide-react';
import { PasswordInputField } from './common/PasswordField';
import UserFormWithPasswordValidation from './UserFormWithPasswordValidation';
import { SessionIndicator } from './common/SessionComponents';
import { useAuth } from '../context/AuthContext';

/**
 * Page de démonstration des améliorations de sécurité - Amélioration pour l'audit
 * Montre la validation des mots de passe et la gestion de session
 */
export const SecurityImprovementsDemo = () => {
  const { sessionInfo, extendSession } = useAuth();
  const [activeDemo, setActiveDemo] = useState('password');
  const [testPassword, setTestPassword] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);

  const demos = [
    {
      id: 'password',
      title: 'Validation des mots de passe',
      icon: Key,
      description: 'Validation renforcée avec indicateur de force en temps réel'
    },
    {
      id: 'session',
      title: 'Gestion des sessions',
      icon: Clock,
      description: 'Monitoring automatique et avertissements d\'expiration'
    },
    {
      id: 'form',
      title: 'Formulaire complet',
      icon: Users,
      description: 'Formulaire utilisateur avec toutes les validations'
    }
  ];

  const handleUserSubmit = async (userData) => {
    console.log('Données utilisateur validées:', userData);
    alert('Utilisateur créé avec succès ! (Démo - pas de sauvegarde réelle)');
    setShowUserForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Améliorations de Sécurité Implémentées
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Démonstration des nouvelles fonctionnalités de validation des mots de passe 
            et de gestion des sessions ajoutées suite à l'audit.
          </p>
        </div>

        {/* Indicateur de session */}
        {sessionInfo && (
          <div className="mb-8 flex justify-center">
            <SessionIndicator 
              sessionInfo={sessionInfo}
              onExtend={extendSession}
            />
          </div>
        )}

        {/* Navigation des démos */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {demos.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    activeDemo === demo.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{demo.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu des démos */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Démo validation mot de passe */}
          {activeDemo === 'password' && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Key className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Validation Renforcée des Mots de Passe
                  </h2>
                  <p className="text-gray-600">
                    Test en temps réel de la complexité et de la sécurité
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Zone de test */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Testez un mot de passe :</h3>
                  <PasswordInputField
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="Tapez un mot de passe pour voir la validation..."
                    label="Mot de passe de test"
                    showStrength={true}
                  />
                </div>

                {/* Critères de validation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">
                      Critères obligatoires :
                    </h3>
                    <ul className="space-y-2">
                      {[
                        'Minimum 8 caractères',
                        'Au moins une majuscule',
                        'Au moins une minuscule', 
                        'Au moins un chiffre',
                        'Au moins un caractère spécial'
                      ].map((criteria, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">
                      Vérifications de sécurité :
                    </h3>
                    <ul className="space-y-2">
                      {[
                        'Détection de motifs communs',
                        'Évitement des séquences (123, abc)',
                        'Blocage des mots interdits',
                        'Calcul de force avancé',
                        'Recommandations personnalisées'
                      ].map((security, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span>{security}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Démo gestion session */}
          {activeDemo === 'session' && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Gestion Automatique des Sessions
                  </h2>
                  <p className="text-gray-600">
                    Surveillance et expiration automatique pour la sécurité
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Informations de session */}
                {sessionInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 text-blue-900">
                      État actuel de votre session :
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {sessionInfo.isActive ? '✅' : '❌'}
                        </div>
                        <div className="text-blue-700">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.ceil(sessionInfo.timeUntilExpiration / (60 * 1000))}
                        </div>
                        <div className="text-blue-700">Minutes restantes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {sessionInfo.inWarningPeriod ? '⚠️' : '✅'}
                        </div>
                        <div className="text-blue-700">État</div>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={extendSession}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Prolonger
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fonctionnalités */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">
                      Monitoring automatique :
                    </h3>
                    <ul className="space-y-2">
                      {[
                        'Détection d\'activité utilisateur',
                        'Vérification toutes les 30 secondes',
                        'Avertissement 5 min avant expiration',
                        'Déconnexion automatique après 30 min',
                        'Possibilité de prolonger la session'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">
                      Notifications :
                    </h3>
                    <ul className="space-y-2">
                      {[
                        'Toast discret (> 2 min restantes)',
                        'Modal d\'urgence (< 2 min)',
                        'Compteur en temps réel',
                        'Actions de prolongation',
                        'Déconnexion sécurisée'
                      ].map((notification, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span>{notification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Démo formulaire complet */}
          {activeDemo === 'form' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Formulaire Utilisateur Sécurisé
                    </h2>
                    <p className="text-gray-600">
                      Intégration complète des validations
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserForm(!showUserForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {showUserForm ? 'Masquer' : 'Tester le formulaire'}
                </button>
              </div>

              {showUserForm && (
                <UserFormWithPasswordValidation
                  onSubmit={handleUserSubmit}
                  onCancel={() => setShowUserForm(false)}
                />
              )}

              {!showUserForm && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Formulaire d'utilisateur avancé
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Validation en temps réel, indicateurs de force, 
                    et gestion complète des erreurs
                  </p>
                  <button
                    onClick={() => setShowUserForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Tester maintenant
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Résumé des améliorations */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              Améliorations Implémentées ✅
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-900 mb-2">
                🔐 Validation des mots de passe :
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Validation de complexité renforcée</li>
                <li>• Calcul de force en temps réel</li>
                <li>• Détection de motifs dangereux</li>
                <li>• Recommandations personnalisées</li>
                <li>• Interface utilisateur intuitive</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-green-900 mb-2">
                ⏰ Gestion des sessions :
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Expiration automatique après inactivité</li>
                <li>• Notifications d'avertissement</li>
                <li>• Prolongation facile</li>
                <li>• Monitoring en arrière-plan</li>
                <li>• Sécurité renforcée</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityImprovementsDemo;