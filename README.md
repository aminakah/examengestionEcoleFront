# 🏫 Portail de Gestion Scolaire - Frontend React

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![API Endpoints](https://img.shields.io/badge/API%20Endpoints-104-green.svg)](./GUIDE_INTEGRATION_API.md)
[![TypeScript Ready](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 📋 Vue d'ensemble

Application frontend React complète pour la gestion d'un établissement scolaire, intégrant **104 endpoints API** du backend Laravel. L'application propose des interfaces spécialisées pour les administrateurs, enseignants, parents et élèves.

## ✨ Fonctionnalités principales

### 🔐 Authentification sécurisée
- Connexion/déconnexion avec JWT
- Gestion automatique des tokens
- Rafraîchissement automatique des sessions
- Protection des routes par rôle et permissions

### 👥 Gestion multi-rôles
- **Administrateurs** : Gestion complète de l'établissement
- **Enseignants** : Saisie de notes, gestion des classes
- **Parents** : Suivi de la scolarité des enfants
- **Élèves** : Consultation des notes et bulletins

### 📊 Tableaux de bord intelligents
- Dashboard adaptatif selon le rôle utilisateur
- Statistiques en temps réel
- Graphiques et métriques personnalisées

### 📝 Gestion pédagogique
- Saisie de notes individuelle et groupée
- Génération automatique de bulletins
- Gestion des périodes et évaluations
- Suivi des progressions

### 🔧 Architecture moderne
- Services API modulaires (104 endpoints)
- Hooks React personnalisés
- Context API pour l'état global
- Composants réutilisables
- Protection granulaire des routes

## 🚀 Démarrage rapide

### Prérequis
- Node.js 16+ et npm
- Backend Laravel démarré sur `http://localhost:8000`

### Installation express

```bash
# Cloner et naviguer
git clone <repo-url>
cd frontend-ecole

# Démarrage intelligent avec vérifications
chmod +x start-with-api.sh
./start-with-api.sh
```

Le script `start-with-api.sh` :
- ✅ Vérifie Node.js et npm
- ✅ Configure l'environnement
- ✅ Installe les dépendances
- ✅ Teste la connectivité backend
- ✅ Valide l'intégrité des services
- 🚀 Lance l'application

### Installation manuelle

```bash
# Installation des dépendances
npm install

# Configuration
cp .env.example .env

# Démarrage
npm start
```

## 🔗 Intégration API

### Services disponibles

L'application intègre **15 services spécialisés** couvrant **104 endpoints** :

```javascript
import {
  authService,      // 7 endpoints - Authentification
  userService,      // 7 endpoints - Gestion utilisateurs
  schoolService,    // 14 endpoints - Années/Niveaux
  classService,     // 10 endpoints - Classes
  subjectService,   // 8 endpoints - Matières
  studentService,   // 12 endpoints - Élèves
  parentService,    // 9 endpoints - Parents
  teacherService,   // 9 endpoints - Enseignants
  enrollmentService,// 7 endpoints - Inscriptions
  periodService,    // 7 endpoints - Périodes
  gradeService,     // 6 endpoints - Notes
  bulletinService,  // 6 endpoints - Bulletins
  dashboardService, // 5 endpoints - Tableaux de bord
  documentService   // 5 endpoints - Documents
} from './services';
```

### Utilisation des services

```javascript
// Exemple: Gestion des notes
import { gradeService } from './services';

const createGrade = async () => {
  try {
    await gradeService.createGrade({
      eleve_id: 1,
      matiere_id: 2,
      note: 15.5,
      coefficient: 2
    });
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## 🎯 Architecture des composants

### Structure des dossiers

```
src/
├── components/           # Composants réutilisables
│   ├── common/          # Composants communs
│   │   ├── RouteProtection.js    # Protection routes
│   │   ├── ToastNotifications.js # Notifications
│   │   └── ...
│   ├── dashboard/       # Tableaux de bord
│   │   ├── SmartDashboard.js     # Dashboard principal
│   │   ├── StudentDashboard.js   # Dashboard élève
│   │   ├── ParentDashboard.js    # Dashboard parent
│   │   └── ...
│   ├── GradeManager.js  # Gestionnaire de notes
│   ├── Login.js         # Connexion
│   └── ...
├── services/            # Services API
│   ├── api.js          # Service de base
│   ├── authService.js  # Authentification
│   ├── *Service.js     # Services métier
│   └── index.js        # Point d'entrée
├── hooks/              # Hooks personnalisés
│   ├── customHooks.js  # Hooks génériques
│   └── schoolHooks.js  # Hooks métier école
├── context/            # Contextes React
│   └── AuthContext.js  # Contexte authentification
├── pages/              # Pages principales
└── utils/              # Utilitaires
```

### Hooks spécialisés

```javascript
// Hook pour la gestion des élèves
const { students, loading, createStudent } = useStudents();

// Hook pour les notes avec filtres
const { grades, stats, createGrade } = useGrades(studentId, filters);

// Hook authentification
const { user, login, logout, isAuthenticated } = useAuth();
```

## 🛡️ Sécurité et autorisations

### Protection des routes

```javascript
// Protection par authentification
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Protection par rôle
<RoleProtectedRoute allowedRoles={['admin', 'enseignant']}>
  <GradeManager />
</RoleProtectedRoute>

// Protection par permission granulaire
<PermissionProtectedRoute resource="students" action="write">
  <StudentForm />
</PermissionProtectedRoute>
```

### Gestion des permissions

```javascript
const { hasRole, canAccess } = usePermission();

if (hasRole('admin')) {
  // Interface administrateur
}

if (canAccess('grades', 'write')) {
  // Saisie de notes autorisée
}
```

## 📱 Interfaces par rôle

### 👑 Administrateur
- Gestion complète des utilisateurs
- Configuration des classes et matières
- Génération des bulletins
- Statistiques globales
- Gestion des documents

### 👨‍🏫 Enseignant
- Saisie de notes (individuelle/groupée)
- Gestion de ses classes
- Consultation des élèves
- Statistiques de ses matières

### 👪 Parent
- Suivi de ses enfants
- Consultation des notes et bulletins
- Prise de rendez-vous
- Communication avec l'école

### 🎓 Élève
- Consultation de ses notes
- Téléchargement des bulletins
- Emploi du temps
- Devoirs à faire

## 🧪 Tests et qualité

### Test d'intégration API

L'application inclut un composant de test complet :

```javascript
import APIIntegrationTest from './components/APIIntegrationTest';

// Teste automatiquement les 104 endpoints
<APIIntegrationTest />
```

Accessible via `/admin/api-test` pour les administrateurs.

### Comptes de démonstration

```
👑 Admin:      admin@ecole.com / password
👨‍🏫 Enseignant: prof@ecole.com / password  
👪 Parent:     parent@ecole.com / password
🎓 Élève:      eleve@ecole.com / password
```

## ⚙️ Configuration

### Variables d'environnement

```bash
# Backend API
REACT_APP_API_URL=http://localhost:8000/api

# Features
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_DEBUG=true

# Sécurité
REACT_APP_SESSION_TIMEOUT=3600000
REACT_APP_AUTO_LOGOUT=true

# Interface
REACT_APP_ITEMS_PER_PAGE=10
REACT_APP_TOAST_DURATION=3000
```

### Configuration des services

```javascript
import { configureServices } from './services';

configureServices({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000
});
```

## 🔧 Développement

### Scripts disponibles

```bash
npm start              # Démarrage développement
npm run build          # Build production
npm test               # Tests unitaires
npm run eject          # Éjection Create React App

./start-with-api.sh    # Démarrage intelligent avec vérifications
```

### Structure des services

Chaque service suit le même pattern :

```javascript
export class ServiceName {
  async getItems(params) {
    return api.get('/endpoint', params);
  }
  
  async createItem(data) {
    return api.post('/endpoint', data);
  }
  
  // ... autres méthodes CRUD
}
```

### Hooks personnalisés

```javascript
export const useDataManager = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const create = async (item) => {
    // Logique de création
  };
  
  return { data, loading, create, update, delete };
};
```

## 📚 Documentation

- [Guide d'intégration API](./GUIDE_INTEGRATION_API.md) - Documentation complète des 104 endpoints
- [Guide utilisateur](./GUIDE_UTILISATEUR.md) - Manuel d'utilisation
- [Guide de déploiement](./DEPLOYMENT_GUIDE.md) - Instructions de déploiement

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

### Variables d'environnement production

```bash
REACT_APP_API_URL=https://votre-api.com/api
REACT_APP_ENV=production
REACT_APP_ENABLE_DEBUG=false
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- 📧 Email: support@ecole.com
- 📚 Documentation: [Wiki du projet](wiki-url)
- 🐛 Bugs: [Issues GitHub](issues-url)

## 🎉 Remerciements

- Équipe de développement
- Établissements pilotes
- Communauté React

---

**Système de Gestion Scolaire** - Une solution complète pour l'éducation moderne
