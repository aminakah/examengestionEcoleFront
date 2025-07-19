# 🎓 EduPortal - Application de Gestion Scolaire

Une application moderne de gestion scolaire développée avec React et Tailwind CSS, reprenant le design d'un dashboard bancaire adapté au contexte éducatif.

## 🎨 Design et Architecture

### Composants Principaux

#### `Dashboard` - Composant Principal
- **Localisation**: `src/components/dashboard/Dashboard.js`
- **Description**: Composant principal qui assemble tous les autres composants
- **Features**: 
  - Layout responsive (grid 12 colonnes)
  - État global pour la navigation
  - Gestion des statistiques en temps réel

#### `Sidebar` - Navigation Latérale
- **Localisation**: `src/components/dashboard/Sidebar.js`
- **Description**: Menu de navigation avec icônes Lucide
- **Features**:
  - Navigation contextuelle (étudiants, cours, planning, etc.)
  - États actifs avec animations
  - Logo et branding personnalisés

#### `Header` - En-tête Moderne
- **Localisation**: `src/components/dashboard/Header.js`
- **Description**: Barre supérieure avec recherche et profil
- **Features**:
  - Barre de recherche intelligente
  - Notifications en temps réel
  - Affichage date/heure automatique
  - Menu utilisateur

#### `StatsCard` - Cartes Statistiques
- **Localisation**: `src/components/dashboard/StatsCard.js`
- **Description**: Composant réutilisable pour afficher les métriques
- **Props**:
```jsx
<StatsCard
  title="Total Étudiants"
  value="1,247"
  icon={Users}
  bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
  trend="up"
  trendValue="+12%"
/>
```

### Composants Fonctionnels

#### `RecentActivities` - Activités Récentes
- **Features**: Liste des dernières actions du système
- **États**: success, warning, info avec codes couleur
- **Icônes**: Contextuelle selon le type d'activité

#### `QuickActions` - Actions Rapides
- **Features**: Boutons d'action pour les tâches courantes
- **Actions**: Inscription étudiant, création cours, planification
- **Interactions**: Hover effects et feedback visuel

#### `StudentOverview` - Aperçu Étudiants
- **Features**: Statistiques et liste des étudiants récents
- **Métriques**: Total, présents, absents avec tendances
- **Statuts**: Présence avec indicateurs visuels

#### `ClassSchedule` - Emploi du Temps
- **Features**: Planning des cours du jour
- **États**: En cours, à venir, planifié
- **Informations**: Professeur, salle, nombre d'étudiants

## 🚀 Installation et Configuration

### Prérequis
- Node.js 16+
- npm ou yarn
- React 19+

### Dépendances Installées
```bash
npm install lucide-react tailwindcss postcss autoprefixer
```

### Configuration Tailwind CSS
Le fichier `tailwind.config.js` inclut :
- Palette de couleurs personnalisée (`primary`, `school`)
- Extensions de thème pour l'école
- Configuration responsive

### Structure des Fichiers
```
src/
├── components/
│   └── dashboard/
│       ├── Dashboard.js          # Composant principal
│       ├── Sidebar.js           # Navigation
│       ├── Header.js            # En-tête
│       ├── StatsCard.js         # Cartes stats
│       ├── RecentActivities.js  # Activités
│       ├── QuickActions.js      # Actions rapides
│       ├── StudentOverview.js   # Aperçu étudiants
│       ├── ClassSchedule.js     # Planning
│       └── index.js             # Exports
└── pages/
    └── Dashboard.js             # Page wrapper
```

## 🎯 Utilisation des Composants

### Import des Composants
```jsx
import { Dashboard, StatsCard, Sidebar } from '../components/dashboard';
```

### Personnalisation des Couleurs
```jsx
// Dans tailwind.config.js
colors: {
  school: {
    50: '#fdf4ff',
    500: '#d946ef',
    900: '#701a75',
  }
}
```

### Ajout de Nouvelles Stats
```jsx
const newStat = {
  title: "Nouvelles Inscriptions",
  value: "42",
  icon: UserPlus,
  bgColor: "bg-gradient-to-r from-green-500 to-green-600",
  trend: "up",
  trendValue: "+15%"
};
```

## 🔧 Fonctionnalités Implémentées

### ✅ Fonctionnalités Actuelles
- Dashboard responsive avec grid system
- Navigation moderne avec états actifs
- Cartes statistiques interactives
- Système de notifications
- Emploi du temps dynamique
- Aperçu des étudiants
- Actions rapides contextuelles
- Thème sombre/clair (préparé)

### 🚧 Fonctionnalités à Développer
- Intégration API backend
- Système de routing complet
- Gestion des utilisateurs
- Rapports et analytics
- Module de messagerie
- Calendrier interactif
- Gestion des notes
- Export de données

## 🎨 Personnalisation

### Couleurs du Thème
```css
/* Variables CSS personnalisées */
:root {
  --primary-blue: #3b82f6;
  --school-purple: #d946ef;
  --success-green: #10b981;
  --warning-orange: #f59e0b;
}
```

### Animations Personnalisées
```css
.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
}
```

## 📱 Responsive Design

### Breakpoints Utilisés
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Grid Responsive
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cartes statistiques */}
</div>
```

## 🔄 État et Gestion des Données

### État Local
```jsx
const [activeItem, setActiveItem] = useState('dashboard');
const [stats, setStats] = useState(initialStats);
```

### Future Intégration API
```jsx
// Préparé pour l'intégration
const loadStats = async () => {
  const response = await api.get('/dashboard/stats');
  setStats(response.data);
};
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Variables d'Environnement
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=production
```

## 🤝 Contribution

### Structure de Commit
```
feat: Ajout composant StudentOverview
fix: Correction responsive sidebar
style: Amélioration animations hover
docs: Mise à jour README
```

### Bonnes Pratiques
1. Composants fonctionnels avec hooks
2. Props destructurées
3. Nommage explicite
4. Documentation inline
5. Gestion d'erreurs

## 📄 License

Projet éducatif - ISI Sénégal 2024

---

**Développé avec ❤️ pour l'éducation moderne**
