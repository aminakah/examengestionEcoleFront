# Portail Administratif Scolaire

## Description
Application web React pour la gestion d'un établissement scolaire avec trois types d'utilisateurs :
- **Administrateur** : Gestion complète (élèves, enseignants, classes, matières, notes)
- **Enseignant** : Saisie des notes et génération des bulletins
- **Parent** : Consultation des bulletins de leurs enfants

## Fonctionnalités

### Module Administrateur
- ✅ Gestion des élèves (inscription, affectation)
- ✅ Gestion des enseignants (création, affectation matières/classes)
- ✅ Gestion des classes (création, niveaux)
- ✅ Gestion des matières (création, coefficients)
- ✅ Tableau de bord avec statistiques
- ✅ Génération et consultation des bulletins

### Module Enseignant
- ✅ Saisie des notes par matière et classe
- ✅ Génération des bulletins
- ✅ Consultation des bulletins générés

### Module Parent
- ✅ Consultation des bulletins de leurs enfants
- ✅ Téléchargement des bulletins en PDF (simulation)
- ✅ Accès sécurisé aux données

## Installation et démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation
```bash
# Se rendre dans le dossier du projet
cd frontend-ecole

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

## Comptes de test

### Administrateur
- **Email** : admin@ecole.com
- **Mot de passe** : password
- **Accès** : Toutes les fonctionnalités

### Enseignant
- **Email** : prof@ecole.com  
- **Mot de passe** : password
- **Accès** : Saisie notes, bulletins

### Parent
- **Email** : parent@ecole.com
- **Mot de passe** : password
- **Accès** : Consultation bulletins enfants

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Login.js        # Page de connexion
│   ├── Navbar.js       # Barre de navigation
│   ├── Sidebar.js      # Menu latéral
│   └── MainLayout.js   # Layout principal
├── pages/              # Pages de l'application
│   ├── Dashboard.js    # Tableau de bord
│   ├── GestionEleves.js
│   ├── GestionEnseignants.js
│   ├── GestionClasses.js
│   ├── GestionMatieres.js
│   ├── SaisieNotes.js
│   ├── Bulletins.js
│   └── BulletinsParent.js
├── context/            # Contextes React
│   └── AuthContext.js  # Gestion de l'authentification
├── services/           # Services API
│   └── apiService.js   # API simulée avec données mock
├── utils/              # Utilitaires
│   └── mockData.js     # Données de test
├── App.js             # Composant principal
└── index.js           # Point d'entrée
```

## Technologies utilisées

- **React 18** - Framework frontend
- **React Context** - Gestion d'état global
- **CSS-in-JS** - Styling des composants
- **Données Mock** - Simulation API backend

## Fonctionnalités avancées (à implémenter)

- [ ] Intégration avec API Laravel backend
- [ ] Génération PDF réelle des bulletins
- [ ] Système de notifications par email
- [ ] Upload de documents justificatifs
- [ ] Calculs automatiques des moyennes et mentions
- [ ] Export Excel des données
- [ ] Système de réclamations/tickets
- [ ] Gestion des frais bancaires

## Notes de développement

- L'application utilise actuellement des **données mock** pour simuler les appels API
- Les téléchargements PDF sont simulés (alertes)
- L'authentification est basique (à remplacer par JWT)
- Tous les styles sont inline pour éviter les dépendances CSS externes

## Pour la production

1. Configurer les vraies URLs d'API dans `apiService.js`
2. Implémenter l'authentification JWT
3. Ajouter la gestion d'erreurs avancée
4. Optimiser les performances avec React.memo
5. Ajouter les tests unitaires
6. Configurer le build de production

```bash
npm run build
```

## Support

Pour toute question ou problème :
- Vérifier la console navigateur pour les erreurs
- S'assurer que tous les packages sont installés
- Vérifier la compatibilité Node.js

---

**Développé pour le projet étudiant ISI - Portail Scolaire 2025**