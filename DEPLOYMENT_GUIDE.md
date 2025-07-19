# Guide de Déploiement - Portail Administratif Scolaire

## 🚀 Déploiement en Production

### Prérequis Système
- **Node.js** : Version 16.x ou supérieure
- **npm** : Version 8.x ou supérieure
- **Serveur Web** : Apache/Nginx (recommandé)
- **HTTPS** : Certificat SSL requis pour la production

### 1. Préparation du Build

```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd frontend-ecole

# Installer les dépendances
npm install

# Créer le build de production
npm run build
```

### 2. Configuration Nginx (Recommandé)

Créer le fichier `/etc/nginx/sites-available/portail-scolaire` :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # Certificats SSL
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Répertoire du build
    root /var/www/portail-scolaire/build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Configuration pour React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache pour les assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (si backend séparé)
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Configuration Apache (Alternative)

Créer le fichier `.htaccess` dans le dossier build :

```apache
RewriteEngine On
RewriteBase /

# HTTPS Redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

### 4. Variables d'Environnement

Créer le fichier `.env.production` :

```env
# Configuration de production
REACT_APP_API_URL=https://api.votre-domaine.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0

# Configuration EmailJS (notifications)
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key

# Configuration de l'établissement
REACT_APP_SCHOOL_NAME="École Moderne"
REACT_APP_SCHOOL_EMAIL=contact@ecole-moderne.com
REACT_APP_SCHOOL_PHONE=+221123456789

# Configuration de sécurité
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ERROR_REPORTING=true
```

### 5. Script de Déploiement Automatisé

Créer `deploy.sh` :

```bash
#!/bin/bash

# Script de déploiement automatisé
set -e

echo "🚀 Déploiement du Portail Scolaire"

# Variables
BUILD_DIR="build"
DEPLOY_DIR="/var/www/portail-scolaire"
BACKUP_DIR="/var/backups/portail-scolaire"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Sauvegarde de l'ancienne version
if [ -d "$DEPLOY_DIR" ]; then
    echo "📦 Sauvegarde de l'ancienne version..."
    sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR/backup_$TIMESTAMP"
fi

# Build de l'application
echo "🔨 Build de l'application..."
npm install --production
npm run build

# Vérification du build
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Erreur: Le dossier build n'existe pas"
    exit 1
fi

# Déploiement
echo "📂 Déploiement des fichiers..."
sudo rm -rf "$DEPLOY_DIR"
sudo mkdir -p "$DEPLOY_DIR"
sudo cp -r "$BUILD_DIR"/* "$DEPLOY_DIR/"

# Permissions
sudo chown -R www-data:www-data "$DEPLOY_DIR"
sudo chmod -R 755 "$DEPLOY_DIR"

# Redémarrage des services
echo "🔄 Redémarrage des services..."
sudo systemctl reload nginx

echo "✅ Déploiement terminé avec succès!"
echo "🌐 Application disponible sur: https://votre-domaine.com"
```

### 6. Monitoring et Logs

#### Configuration des logs Nginx
```nginx
# Dans le bloc server
access_log /var/log/nginx/portail-scolaire.access.log;
error_log /var/log/nginx/portail-scolaire.error.log;
```

#### Script de monitoring
```bash
#!/bin/bash
# monitor.sh - Surveillance de l'application

LOG_FILE="/var/log/portail-scolaire/monitor.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Vérifier la disponibilité du site
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://votre-domaine.com)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "[$TIMESTAMP] ✅ Site accessible (HTTP $HTTP_STATUS)" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] ❌ Site inaccessible (HTTP $HTTP_STATUS)" >> "$LOG_FILE"
    # Envoyer une alerte
    echo "Site portail-scolaire inaccessible" | mail -s "Alerte Site Down" admin@votre-domaine.com
fi

# Vérifier l'espace disque
DISK_USAGE=$(df /var/www/portail-scolaire | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "[$TIMESTAMP] ⚠️ Espace disque faible: ${DISK_USAGE}%" >> "$LOG_FILE"
fi
```

### 7. Sauvegarde et Restauration

#### Script de sauvegarde
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/portail-scolaire"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SOURCE_DIR="/var/www/portail-scolaire"

# Créer la sauvegarde
tar -czf "$BACKUP_DIR/portail_backup_$TIMESTAMP.tar.gz" -C "$SOURCE_DIR" .

# Nettoyer les anciennes sauvegardes (garder 30 jours)
find "$BACKUP_DIR" -name "portail_backup_*.tar.gz" -mtime +30 -delete

echo "Sauvegarde créée: portail_backup_$TIMESTAMP.tar.gz"
```

#### Script de restauration
```bash
#!/bin/bash
# restore.sh

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file>"
    exit 1
fi

BACKUP_FILE="$1"
RESTORE_DIR="/var/www/portail-scolaire"

# Arrêter le service temporairement
sudo systemctl stop nginx

# Restaurer
sudo rm -rf "$RESTORE_DIR"
sudo mkdir -p "$RESTORE_DIR"
sudo tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"

# Restaurer les permissions
sudo chown -R www-data:www-data "$RESTORE_DIR"
sudo chmod -R 755 "$RESTORE_DIR"

# Redémarrer le service
sudo systemctl start nginx

echo "Restauration terminée"
```

### 8. Optimisations de Performance

#### Configuration du cache navigateur
```javascript
// Dans le service worker (si utilisé)
const CACHE_NAME = 'portail-scolaire-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

#### Optimisation des images
```bash
# Compression des images (à faire avant le build)
find src/assets -name "*.jpg" -exec jpegoptim --max=80 {} \;
find src/assets -name "*.png" -exec optipng -o2 {} \;
```

### 9. Sécurité en Production

#### Checklist de sécurité
- [x] HTTPS activé avec certificat valide
- [x] Headers de sécurité configurés
- [x] Variables sensibles dans .env
- [x] Pas de console.log en production
- [x] CORS configuré correctement
- [x] Rate limiting activé
- [x] Monitoring des erreurs
- [x] Sauvegardes automatiques

#### Configuration du pare-feu
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 10. Maintenance

#### Tâches automatisées (crontab)
```bash
# Éditer les tâches cron
sudo crontab -e

# Ajouter ces lignes
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /path/to/backup.sh

# Monitoring toutes les 5 minutes
*/5 * * * * /path/to/monitor.sh

# Nettoyage des logs mensuellement
0 0 1 * * find /var/log/nginx -name "*.log" -mtime +30 -delete
```

### 11. Mise à Jour

#### Procédure de mise à jour
```bash
#!/bin/bash
# update.sh

echo "🔄 Mise à jour du Portail Scolaire"

# Sauvegarder l'ancienne version
./backup.sh

# Récupérer les dernières modifications
git pull origin main

# Installer les nouvelles dépendances
npm install

# Nouveau build
npm run build

# Déployer
./deploy.sh

echo "✅ Mise à jour terminée"
```

### 12. Dépannage

#### Problèmes courants
1. **Page blanche** : Vérifier les chemins dans build/index.html
2. **404 sur les routes** : Configurer le fallback vers index.html
3. **Erreurs CORS** : Vérifier la configuration du proxy
4. **Lenteur** : Activer la compression gzip/brotli

#### Logs utiles
```bash
# Logs Nginx
tail -f /var/log/nginx/portail-scolaire.error.log

# Logs système
journalctl -u nginx -f

# Vérifier l'état des services
systemctl status nginx
```

---

**Contact Support** : Pour toute assistance technique, contactez l'équipe de développement.

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025
