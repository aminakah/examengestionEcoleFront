# Guide de Tests - Intégration API

## 🧪 Plan de Tests Complet

Ce guide décrit comment tester l'intégration des 104 endpoints API dans l'application frontend.

## 📋 Prérequis de Test

### 1. Configuration de l'environnement de test

```bash
# Backend Laravel démarré
cd /Users/kahtech/Documents/isi/laravel/examenDaneLo/backebd-ecole
php artisan serve

# Frontend React démarré
cd /Users/kahtech/Documents/isi/laravel/examenDaneLo/frontend-ecole
./start-with-api.sh
```

### 2. Données de test

Assurez-vous que le backend contient :
- [ ] Au moins 1 administrateur
- [ ] Au moins 1 enseignant 
- [ ] Au moins 1 parent avec enfants
- [ ] Au moins 1 élève
- [ ] Des classes, matières et périodes configurées

## 🔐 Tests d'Authentification

### Test 1 : Connexion Administrative
```javascript
// Compte : admin@ecole.com / password
// Vérifications :
- ✅ Connexion réussie
- ✅ Token JWT stocké
- ✅ Redirection vers /dashboard
- ✅ Menu admin accessible
- ✅ Profil utilisateur chargé
```

### Test 2 : Connexion Enseignant
```javascript
// Compte : prof@ecole.com / password
// Vérifications :
- ✅ Connexion réussie
- ✅ Menu enseignant accessible
- ✅ Accès refusé aux routes admin
- ✅ Mes classes chargées
```

### Test 3 : Gestion des erreurs d'auth
```javascript
// Tests :
- ❌ Mauvais identifiants
- ❌ Token expiré
- ✅ Refresh automatique du token
- ✅ Déconnexion automatique en cas d'erreur
```

## 👥 Tests de Gestion des Utilisateurs (Admin)

### Test 4 : CRUD Utilisateurs
```javascript
// Route : /admin/enseignants
// Actions testées :
- ✅ GET /api/users - Liste des utilisateurs
- ✅ POST /api/users - Création utilisateur
- ✅ PUT /api/users/{id} - Modification
- ✅ DELETE /api/users/{id} - Suppression
- ✅ POST /api/users/{id}/toggle-status - Activation/Désactivation
```

### Test 5 : Gestion des Élèves
```javascript
// Route : /admin/eleves
// Endpoints testés :
- ✅ GET /api/eleves - Liste paginée
- ✅ POST /api/eleves - Inscription nouvel élève
- ✅ GET /api/eleves/{id} - Détails élève
- ✅ PUT /api/eleves/{id} - Modification
- ✅ POST /api/eleves/{id}/changer-classe
```

## 📝 Tests de Gestion des Notes

### Test 6 : Saisie de Notes (Enseignant)
```javascript
// Route : /enseignant/notes
// Actions testées :
- ✅ GET /api/enseignant/mes-classes
- ✅ GET /api/notes/saisie-par-classe
- ✅ POST /api/notes - Saisie individuelle
- ✅ POST /api/notes/saisie-groupee - Saisie groupée
- ✅ PUT /api/notes/{id} - Modification note
```

### Test 7 : Consultation des Notes (Élève)
```javascript
// Route : /eleve/notes
// Endpoints testés :
- ✅ GET /api/eleve/mes-notes
- ✅ Affichage par matière
- ✅ Calcul des moyennes
- ✅ Graphiques de progression
```

## 📋 Tests de Bulletins

### Test 8 : Génération de Bulletins (Admin)
```javascript
// Route : /admin/bulletins
// Actions testées :
- ✅ GET /api/bulletins - Liste bulletins
- ✅ POST /api/bulletins/generer - Génération
- ✅ GET /api/bulletins/{id}/telecharger - Téléchargement PDF
- ✅ GET /api/bulletins/telecharger-groupe - ZIP classe
```

### Test 9 : Consultation Bulletins (Parent)
```javascript
// Route : /parent/bulletins
// Endpoints testés :
- ✅ GET /api/parent/mes-enfants
- ✅ GET /api/parent/enfant/{eleve}/bulletin
- ✅ Téléchargement bulletins enfants
```

## 📊 Tests des Tableaux de Bord

### Test 10 : Dashboard Intelligent
```javascript
// Route : /dashboard
// Endpoints testés :
- ✅ GET /api/dashboard/mon-tableau-bord
- ✅ GET /api/dashboard/statistiques-generales (Admin)
- ✅ GET /api/dashboard/statistiques-enseignant (Enseignant)
- ✅ GET /api/dashboard/statistiques-eleve (Élève)
- ✅ GET /api/dashboard/statistiques-parent (Parent)
```

## 🔄 Tests de Gestion des Données

### Test 11 : Classes et Matières
```javascript
// Routes : /admin/classes, /admin/matieres
// Endpoints testés :
- ✅ GET /api/classes
- ✅ POST /api/classes
- ✅ GET /api/classes/{id}/eleves
- ✅ POST /api/classes/{id}/assigner-enseignant
- ✅ GET /api/matieres
- ✅ POST /api/matieres/{id}/toggle-status
```

## 📄 Tests de Documents

### Test 12 : Gestion des Documents
```javascript
// Route : /admin/documents
// Actions testées :
- ✅ GET /api/documents
- ✅ POST /api/documents - Upload
- ✅ GET /api/documents/{id}/telecharger
- ✅ DELETE /api/documents/{id}
```

## 🛡️ Tests de Sécurité

### Test 13 : Protection des Routes
```javascript
// Vérifications de sécurité :
- ✅ Routes admin bloquées pour non-admin
- ✅ Routes enseignant protégées
- ✅ Données élève accessibles aux parents
- ✅ Permissions granulaires respectées
```

### Test 14 : Gestion des Erreurs
```javascript
// Tests d'erreurs :
- ✅ 401 - Non autorisé
- ✅ 403 - Accès refusé
- ✅ 404 - Ressource non trouvée
- ✅ 500 - Erreur serveur
- ✅ Timeout de requête
```

## 📱 Tests d'Interface Utilisateur

### Test 15 : Responsive Design
```javascript
// Tests sur différentes tailles :
- ✅ Mobile (320px+)
- ✅ Tablette (768px+)
- ✅ Desktop (1024px+)
- ✅ Navigation intuitive
- ✅ Formulaires adaptatifs
```

### Test 16 : Notifications Toast
```javascript
// Tests des notifications :
- ✅ Succès (création, modification)
- ✅ Erreurs (échecs API)
- ✅ Avertissements (validation)
- ✅ Informations (état système)
```

## 🔄 Tests de Performance

### Test 17 : Chargement des Données
```javascript
// Métriques de performance :
- ✅ Temps de chargement < 2s
- ✅ Pagination efficace
- ✅ Cache des données
- ✅ Lazy loading des images
```

### Test 18 : Optimisation Réseau
```javascript
// Tests réseau :
- ✅ Compression gzip
- ✅ Requêtes parallèles
- ✅ Retry automatique
- ✅ Gestion hors ligne
```

## 🧪 Automatisation des Tests

### Configuration Jest (frontend)

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/serviceWorker.js'
  ]
};
```

### Tests Unitaires

```javascript
// src/__tests__/services/authService.test.js
import { authService } from '../../services/authService';

describe('AuthService', () => {
  test('should login successfully', async () => {
    const credentials = {
      email: 'admin@ecole.com',
      password: 'password'
    };
    
    const result = await authService.login(credentials);
    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
  });
});
```

### Tests d'Intégration

```javascript
// src/__tests__/integration/dashboard.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import SmartDashboard from '../../components/dashboard/SmartDashboard';

describe('Dashboard Integration', () => {
  test('should load admin dashboard', async () => {
    render(
      <AuthProvider>
        <SmartDashboard />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
    });
  });
});
```

## 📊 Métriques de Qualité

### Couverture de Code
```bash
npm test -- --coverage
# Target: > 80% coverage
```

### Performance Lighthouse
```bash
# Scores cibles :
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 85
```

## 🐛 Tests de Régression

### Test 19 : Compatibilité Navigateurs
```javascript
// Navigateurs supportés :
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
```

### Test 20 : Données Corrompues
```javascript
// Tests de robustesse :
- ✅ Données nulles/undefined
- ✅ Formats de date invalides
- ✅ Nombres négatifs inattendus
- ✅ Chaînes trop longues
```

## 📝 Checklist de Validation Finale

### ✅ Fonctionnalités Core
- [ ] Authentification complète
- [ ] Gestion des utilisateurs
- [ ] Saisie et consultation des notes
- [ ] Génération des bulletins
- [ ] Tableaux de bord personnalisés

### ✅ Sécurité
- [ ] Protection des routes
- [ ] Validation des permissions
- [ ] Chiffrement des données
- [ ] Gestion des sessions

### ✅ Qualité
- [ ] Tests unitaires passants
- [ ] Tests d'intégration OK
- [ ] Performance optimisée
- [ ] Accessibilité respectée

### ✅ Documentation
- [ ] Guide utilisateur complet
- [ ] Documentation API
- [ ] Guide de déploiement
- [ ] Procédures de maintenance

## 🚀 Commandes de Test Rapide

```bash
# Test complet de l'application
npm test

# Test avec coverage
npm test -- --coverage --watchAll=false

# Test e2e (si configuré)
npm run test:e2e

# Build de production
npm run build

# Vérification de sécurité
npm audit

# Linting du code
npm run lint
```

## 📞 Support et Débogage

### Logs de Debug
```javascript
// Variables d'environnement pour le debug :
REACT_APP_ENABLE_DEBUG=true
REACT_APP_API_TIMEOUT=30000
```

### Outils de Développement
- React DevTools
- Redux DevTools (si utilisé)
- Network tab pour les requêtes API
- Console pour les erreurs JS

---

**Note :** Ce guide de tests garantit la qualité et la fiabilité de l'intégration des 104 endpoints API dans l'application de gestion scolaire.
