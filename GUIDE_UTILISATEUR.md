# 📚 Guide d'Utilisation - Portail Scolaire École Moderne

## 🏠 **Vue d'ensemble**

Bienvenue dans le Portail Administratif Scolaire ! Cette application vous permet de gérer facilement tous les aspects de la vie scolaire selon votre rôle dans l'établissement.

### 🔐 **Connexion à l'application**

1. **Accédez à l'application** via : `http://localhost:3000` (développement) ou votre URL de production
2. **Saisissez vos identifiants** fournis par l'administration
3. **Cliquez sur "Se connecter"**

> **💡 Astuce** : Vos identifiants vous donnent accès uniquement aux fonctionnalités correspondant à votre rôle.

---

## 👨‍💼 **Guide Administrateur**

*Accès complet à toutes les fonctionnalités du système*

### 🎯 **Tableau de bord**
- **Vue d'ensemble** : Statistiques générales de l'établissement
- **Indicateurs clés** : Nombre d'élèves, enseignants, moyennes générales
- **Graphiques** : Évolution des performances par classe

### 👥 **Gestion des élèves**

#### ➕ **Ajouter un nouvel élève**
1. Cliquez sur **"Nouvel élève"**
2. Remplissez le formulaire d'inscription :
   - Informations personnelles (nom, prénom, date de naissance)
   - Contact (email, téléphone, adresse)
   - Informations des parents (obligatoire)
   - Affectation à une classe
3. **Téléchargez les documents justificatifs** (acte de naissance, etc.)
4. Cliquez sur **"Enregistrer"**

#### ✏️ **Modifier un élève**
1. Recherchez l'élève dans la liste
2. Cliquez sur l'icône **"Modifier"** (crayon)
3. Modifiez les informations nécessaires
4. Sauvegardez les modifications

#### 📎 **Gérer les documents**
1. Accédez à **"Documents"** dans le menu
2. Consultez les documents en attente d'approbation
3. **Approuvez** ou **rejetez** selon les critères
4. Ajoutez des commentaires si nécessaire

### 👨‍🏫 **Gestion des enseignants**

#### ➕ **Ajouter un enseignant**
1. Cliquez sur **"Nouvel enseignant"**
2. Saisissez les informations :
   - Identité et contact
   - Spécialité d'enseignement
   - Date d'embauche
3. **Affectez aux matières et classes**
4. Enregistrez

### 🏫 **Gestion des classes**

#### 📚 **Créer une classe**
1. Accédez à **"Gestion des classes"**
2. Cliquez sur **"Nouvelle classe"**
3. Définissez :
   - Nom de la classe (ex: 6ème A)
   - Niveau scolaire
   - Salle de cours
   - Enseignant principal
4. Sauvegardez

### 📖 **Gestion des matières**

#### ➕ **Configurer une matière**
1. Allez dans **"Gestion des matières"**
2. Créez une nouvelle matière :
   - Nom de la matière
   - Coefficient (importance dans la moyenne)
   - Nombre d'heures par semaine
   - Niveau concerné
3. Assignez un enseignant responsable

### 📄 **Gestion des bulletins**

#### 📊 **Générer les bulletins**
1. Accédez à **"Bulletins scolaires"**
2. Sélectionnez :
   - La période (Trimestre 1, 2 ou 3)
   - La classe concernée
3. **Actions disponibles** :
   - **Aperçu** : Voir le bulletin avant génération
   - **Télécharger PDF** : Bulletin individuel
   - **Génération groupée** : Tous les bulletins de la classe
   - **Notifier parents** : Envoi email automatique

#### 📧 **Notifications aux parents**
1. Sélectionnez la classe
2. Cliquez sur **"Notifier Parents"**
3. Le système envoie automatiquement les emails
4. Consultez le rapport d'envoi

---

## 👨‍🏫 **Guide Enseignant**

*Accès à la saisie des notes et gestion de vos classes*

### 📝 **Saisie des notes**

#### ✍️ **Saisir les notes**
1. Accédez à **"Saisie des notes"**
2. **Filtrez** :
   - Votre classe
   - Votre matière
   - La période (trimestre)
3. **Saisissez les notes** :
   - Note sur 20 (décimales autorisées)
   - Appréciation personnalisée
4. **Suggestions automatiques** : Le système propose des appréciations selon la note
5. Cliquez sur **"Sauvegarder notes"**

#### 📊 **Statistiques en temps réel**
- **Moyenne de la classe** automatiquement calculée
- **Répartition des notes** (graphique)
- **Taux de réussite** (notes ≥ 10)

#### 📧 **Notification aux parents**
1. Après saisie des notes
2. Cliquez sur **"Notifier Parents"**
3. Les parents reçoivent un email avec la nouvelle note

### 📄 **Générer vos bulletins**

#### 📋 **Bulletins de vos élèves**
1. Allez dans **"Bulletins scolaires"**
2. Consultez les bulletins de vos matières
3. **Actions** :
   - Aperçu avant impression
   - Téléchargement PDF
   - Validation des moyennes

---

## 👨‍👩‍👧‍👦 **Guide Parent/Élève**

*Consultation des résultats scolaires et suivi de la scolarité*

### 👶 **Sélection de l'enfant**
1. **Connectez-vous** avec vos identifiants parent
2. Si vous avez plusieurs enfants, **sélectionnez** celui dont vous voulez consulter les résultats
3. Choisissez la **période** (trimestre)

### 📊 **Consultation des notes**

#### 📈 **Tableau des notes**
- **Notes par matière** avec coefficients
- **Appréciation** de l'enseignant
- **Moyenne par matière** automatiquement calculée
- **Moyenne générale** de la période

#### 📋 **Informations détaillées**
- **Rang dans la classe** (si disponible)
- **Mention obtenue** (Très Bien, Bien, etc.)
- **Évolution** par rapport aux périodes précédentes

### 📄 **Téléchargement des bulletins**

#### 📥 **Bulletins PDF**
1. Dans la section **"Bulletins disponibles"**
2. **Actions pour chaque période** :
   - **Aperçu** : Voir le bulletin dans le navigateur
   - **Télécharger PDF** : Sauvegarder sur votre appareil
3. **Historique complet** : Accès à tous les bulletins de l'année

### 📈 **Suivi de l'évolution**

#### 📊 **Statistiques personnelles**
- **Graphique d'évolution** des moyennes
- **Comparaison** entre les trimestres
- **Points forts et difficultés** par matière

---

## 🛠 **Fonctionnalités communes**

### 🔍 **Recherche et filtres**
- **Barre de recherche** : Trouvez rapidement élèves, enseignants, classes
- **Filtres avancés** : Par classe, matière, période, statut
- **Tri** : Cliquez sur les en-têtes de colonnes pour trier

### 📱 **Interface responsive**
- **Mobile friendly** : Utilisable sur smartphone et tablette
- **Navigation intuitive** : Menu adaptatif selon la taille d'écran
- **Chargement rapide** : Interface optimisée

### 🔔 **Notifications**
- **Alertes en temps réel** : Nouvelles notes, bulletins disponibles
- **Emails automatiques** : Notifications importantes
- **Centre de notifications** : Historique des messages

---

## ❓ **Aide et dépannage**

### 🆘 **Problèmes courants**

#### **🔐 Problème de connexion**
- Vérifiez vos identifiants (majuscules/minuscules)
- Contactez l'administration si oubli de mot de passe
- Vérifiez votre connexion internet

#### **📄 Bulletin non disponible**
- Les bulletins sont générés après saisie de toutes les notes
- Contactez l'enseignant si notes manquantes
- Patientez si génération en cours

#### **📧 Emails non reçus**
- Vérifiez votre dossier spam/courrier indésirable
- Confirmez votre adresse email auprès de l'administration
- Vérifiez les paramètres de notification

### 📞 **Support technique**
- **Email** : support@ecole-moderne.com
- **Téléphone** : +221 XX XXX XX XX
- **Heures** : Lundi-Vendredi 8h-17h

### 💡 **Conseils d'utilisation**

#### **🔒 Sécurité**
- **Ne partagez jamais** vos identifiants
- **Déconnectez-vous** après utilisation sur ordinateur partagé
- **Utilisez HTTPS** (cadenas dans l'adresse du navigateur)

#### **📊 Optimisation**
- **Actualisez** la page si problème d'affichage
- **Utilisez Chrome, Firefox ou Safari** pour une meilleure expérience
- **Activez JavaScript** dans votre navigateur

---

## 🎓 **Bonnes pratiques pédagogiques**

### 👨‍🏫 **Pour les enseignants**
- **Saisie régulière** : Entrez les notes rapidement après évaluation
- **Appréciations constructives** : Commentaires personnalisés et encourageants
- **Communication** : Prévenez les parents des difficultés importantes

### 👨‍👩‍👧‍👦 **Pour les parents**
- **Suivi régulier** : Consultez les notes chaque semaine
- **Dialogue** : Discutez avec votre enfant des résultats
- **Contact école** : N'hésitez pas à prendre rendez-vous si besoin

### 📚 **Pour les élèves**
- **Consultation autonome** : Suivez vos propres résultats
- **Objectifs** : Fixez-vous des objectifs de progression
- **Aide** : Demandez de l'aide en cas de difficultés

---

## 📋 **Récapitulatif des fonctionnalités**

| Rôle | Fonctionnalités principales |
|------|---------------------------|
| **Administrateur** | Gestion complète, statistiques, bulletins, documents |
| **Enseignant** | Saisie notes, génération bulletins, notifications |
| **Parent/Élève** | Consultation notes, téléchargement bulletins, suivi |

---

**🎯 Cette application est conçue pour simplifier la gestion scolaire tout en maintenant la qualité pédagogique et la communication école-famille.**

**Version** : 1.0.0 | **Dernière mise à jour** : Janvier 2025  
**Support** : support@ecole-moderne.com | **École Moderne** - Portail Scolaire
