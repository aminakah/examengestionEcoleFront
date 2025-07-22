# Guide de test et dépannage - Emploi du Temps

## 🔍 Dépannage de l'erreur "Token not provided"

### Problème identifié
L'API Laravel fonctionne correctement, mais l'erreur vient du fait que les requêtes ne contiennent pas de token JWT valide.

### ✅ Modifications apportées

1. **Service API amélioré** (`/src/services/api.js`)
   - Ajout de logs de debug pour tracer les requêtes
   - Vérification automatique de l'authentification
   - Gestion améliorée des erreurs 401 (token expiré)

2. **Service emploi du temps** (`/src/services/emploiTempsService.js`)
   - Adaptation au service API existant (utilise fetch au lieu d'axios)
   - Suppression des références à `.data` inadéquates

3. **Composant React** (`/src/pages/GestionEmploiDuTemps.js`)
   - Vérification de l'authentification au chargement
   - Affichage d'un message si l'utilisateur n'est pas connecté
   - Gestion améliorée des erreurs

### 🔧 Tests à effectuer

#### 1. Vérifier l'authentification
Ouvrez la console de votre navigateur et vérifiez s'il y a un token dans localStorage :

```javascript
// Dans la console du navigateur
localStorage.getItem('authToken')
```

Si le résultat est `null`, vous devez vous connecter d'abord.

#### 2. Tester l'API d'authentification
Créez un utilisateur de test dans Laravel :

```bash
cd /Users/kahtech/Documents/isi/laravel/examenDaneLo/backebd-ecole

# Via artisan tinker
php artisan tinker

# Dans tinker, créer un utilisateur admin
$user = new \App\Models\User();
$user->nom = 'Admin';
$user->prenom = 'Test';
$user->email = 'admin@test.com';
$user->password = bcrypt('password123');
$user->role = 'administrateur';
$user->statut = 'actif';
$user->save();
```

#### 3. Tester la connexion via API
Testez l'endpoint de connexion :

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

Vous devriez recevoir une réponse avec un token :
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {...}
}
```

#### 4. Tester avec le token
Une fois que vous avez un token, testez l'endpoint emploi du temps :

```bash
curl -X GET "http://localhost:8000/api/emploi-temps-semaine" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

### 🛠 Solutions selon les cas

#### Cas 1: Pas d'utilisateur en base
Si vous n'avez pas d'utilisateur en base, créez-en un avec le script tinker ci-dessus.

#### Cas 2: L'utilisateur existe mais pas de token
1. Allez sur la page de connexion de votre application React
2. Connectez-vous avec les identifiants créés
3. Le token sera automatiquement stocké dans localStorage

#### Cas 3: Token expiré
1. Supprimez le token actuel : `localStorage.removeItem('authToken')`
2. Reconnectez-vous

#### Cas 4: Problème de CORS
Si vous avez des erreurs CORS, vérifiez le fichier `config/cors.php` dans Laravel.

### 📋 Checklist de vérification

- [ ] Backend Laravel démarré sur port 8000
- [ ] Frontend React démarré sur port 3000
- [ ] Utilisateur admin créé en base de données
- [ ] Page de connexion fonctionnelle
- [ ] Token JWT stocké dans localStorage après connexion
- [ ] Console navigateur sans erreurs d'authentification

### 🔄 Prochaines étapes

1. **Créer un utilisateur admin** avec le script tinker
2. **Se connecter** via l'interface React
3. **Accéder** à la page gestion emploi du temps
4. **Vérifier** les logs dans la console pour voir les requêtes API

### 📞 Si le problème persiste

1. Vérifiez les logs Laravel : `tail -f storage/logs/laravel.log`
2. Vérifiez la console navigateur pour les erreurs JavaScript
3. Vérifiez que le token JWT est bien envoyé dans les headers de requête
4. Testez les endpoints manuellement avec curl/Postman

### 🎯 Test rapide

Voici un test JavaScript à exécuter dans la console navigateur pour débugger :

```javascript
// Test de l'API service
const { api } = await import('./services/api.js');

// Vérifier l'authentification
console.log('Authentifié:', api.isAuthenticated());
console.log('Token:', localStorage.getItem('authToken'));

// Tester une requête
api.get('/emploi-temps-semaine')
  .then(response => console.log('✅ Succès:', response))
  .catch(error => console.error('❌ Erreur:', error));
```

Une fois l'authentification résolue, l'application devrait fonctionner parfaitement !
