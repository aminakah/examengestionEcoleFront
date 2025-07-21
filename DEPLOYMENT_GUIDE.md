# 🚀 Guide de Déploiement - Portail de Gestion Scolaire

## 📋 Vue d'ensemble

Ce guide vous accompagne dans le déploiement complet du **Portail de Gestion Scolaire** avec ses **104 endpoints API** intégrés.

## ✅ Pré-requis

### Serveur de production
- **OS**: Ubuntu 20.04 LTS ou plus récent
- **Mémoire**: 4 GB RAM minimum (8 GB recommandé)
- **Stockage**: 20 GB espace libre
- **Réseau**: Connexion Internet stable

### Logiciels requis
- **Node.js**: Version 18+ ([Installation](https://nodejs.org/))
- **npm**: Version 8+ (inclus avec Node.js)
- **Nginx**: Pour le reverse proxy
- **PM2**: Pour la gestion des processus Node.js
- **Certbot**: Pour les certificats SSL (Let's Encrypt)

## 🏗️ Architecture de déploiement

```
Internet
    ↓
[Load Balancer/CDN]
    ↓
[Nginx Reverse Proxy] ← SSL/TLS
    ↓
[React App (Build)] ← Frontend
    ↓
[Laravel API] ← Backend (104 endpoints)
    ↓
[Base de données]
```

## 📦 Étape 1: Préparation du serveur

### 1.1 Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl wget git build-essential -y
```

### 1.2 Installation de Node.js

```bash
# Installer Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### 1.3 Installation de PM2

```bash
sudo npm install -g pm2
pm2 startup
```

### 1.4 Installation de Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 🎯 Étape 2: Déploiement du Frontend

### 2.1 Clonage et préparation

```bash
# Créer le répertoire de déploiement
sudo mkdir -p /var/www/portail-scolaire
sudo chown $USER:$USER /var/www/portail-scolaire

# Cloner le projet
cd /var/www/portail-scolaire
git clone <votre-repo-frontend> frontend

# Naviguer dans le projet
cd frontend
```

### 2.2 Configuration de production

```bash
# Copier la configuration de production
cp .env.example .env.production

# Éditer la configuration
nano .env.production
```

**Contenu du fichier .env.production :**

```bash
# API Configuration
REACT_APP_API_URL=https://api.votre-domaine.com/api
REACT_APP_ENV=production

# Security
REACT_APP_ENABLE_DEBUG=false
REACT_APP_SESSION_TIMEOUT=1800000

# Performance
REACT_APP_ITEMS_PER_PAGE=20
REACT_APP_API_TIMEOUT=15000

# Features
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_ANALYTICS=true

# UI Configuration
REACT_APP_THEME=default
REACT_APP_LANGUAGE=fr
```

### 2.3 Installation et build

```bash
# Installer les dépendances
npm ci --only=production

# Vérifier l'intégration
./verify-integration.sh

# Build de production
npm run build

# Vérifier le build
ls -la build/
```

### 2.4 Configuration Nginx pour le Frontend

```bash
sudo nano /etc/nginx/sites-available/portail-scolaire-frontend
```

**Configuration Nginx :**

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    root /var/www/portail-scolaire/frontend/build;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Cache des assets statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Configuration React Router
    location / {
        try_files $uri $uri/ /index.html;
        
        # Headers de sécurité
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
    
    # Proxy vers l'API (optionnel si API sur même domaine)
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Logs
    access_log /var/log/nginx/portail-scolaire-frontend_access.log;
    error_log /var/log/nginx/portail-scolaire-frontend_error.log;
}
```

### 2.5 Activation du site

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/portail-scolaire-frontend /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl reload nginx
```

## 🔒 Étape 3: Configuration SSL

### 3.1 Installation de Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 3.2 Génération du certificat SSL

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

### 3.3 Renouvellement automatique

```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Ajouter au crontab
sudo crontab -e

# Ajouter cette ligne pour renouvellement automatique
0 12 * * * /usr/bin/certbot renew --quiet
```

## ⚡ Étape 4: Optimisations de performance

### 4.1 Configuration avancée Nginx

```bash
sudo nano /etc/nginx/nginx.conf
```

**Optimisations importantes :**

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # Include mime types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # Include sites
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### 4.2 Configuration du cache

```bash
sudo mkdir -p /var/cache/nginx
sudo chown -R www-data:www-data /var/cache/nginx
```

## 📊 Étape 5: Monitoring et logging

### 5.1 Configuration des logs

```bash
# Créer les répertoires de logs
sudo mkdir -p /var/log/portail-scolaire
sudo chown www-data:www-data /var/log/portail-scolaire

# Rotation des logs
sudo nano /etc/logrotate.d/portail-scolaire
```

**Configuration logrotate :**

```
/var/log/nginx/portail-scolaire-frontend_*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

### 5.2 Monitoring avec PM2

```bash
# Si vous utilisez PM2 pour d'autres services
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 10
```

## 🔄 Étape 6: Script de déploiement automatisé

### 6.1 Création du script de déploiement

```bash
nano deploy.sh
chmod +x deploy.sh
```

**Contenu du script deploy.sh :**

```bash
#!/bin/bash

echo "🚀 Déploiement du Portail Scolaire - Frontend"
echo "=============================================="

# Configuration
REPO_URL="<votre-repo-url>"
APP_DIR="/var/www/portail-scolaire/frontend"
BACKUP_DIR="/var/backups/portail-scolaire"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Fonction de rollback
rollback() {
    echo "❌ Erreur détectée. Rollback en cours..."
    if [ -d "$BACKUP_DIR/build_$TIMESTAMP" ]; then
        sudo rm -rf $APP_DIR/build
        sudo mv $BACKUP_DIR/build_$TIMESTAMP $APP_DIR/build
        sudo systemctl reload nginx
        echo "✅ Rollback terminé"
    fi
    exit 1
}

# Traitement des erreurs
set -e
trap rollback ERR

echo "📦 Backup de la version actuelle..."
sudo mkdir -p $BACKUP_DIR
if [ -d "$APP_DIR/build" ]; then
    sudo cp -r $APP_DIR/build $BACKUP_DIR/build_$TIMESTAMP
fi

echo "📥 Récupération du code..."
cd $APP_DIR
git pull origin main

echo "🔧 Installation des dépendances..."
npm ci --only=production

echo "🔍 Vérification de l'intégration..."
./verify-integration.sh

echo "🏗️ Build de production..."
npm run build

echo "🔄 Rechargement de Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo "🧹 Nettoyage des anciens backups..."
find $BACKUP_DIR -name "build_*" -mtime +7 -exec rm -rf {} +

echo "✅ Déploiement terminé avec succès!"
echo "🌐 Application accessible sur: https://votre-domaine.com"
```

### 6.2 Test de santé post-déploiement

```bash
nano health-check.sh
chmod +x health-check.sh
```

**Script de vérification :**

```bash
#!/bin/bash

echo "🔍 Vérification de santé post-déploiement"
echo "========================================"

# Test de connectivité
echo "Test de connectivité..."
curl -f -s -o /dev/null https://votre-domaine.com/ && echo "✅ Frontend accessible" || echo "❌ Frontend inaccessible"

# Test API
echo "Test de l'API..."
curl -f -s -o /dev/null https://api.votre-domaine.com/test && echo "✅ API accessible" || echo "❌ API inaccessible"

# Test des resources statiques
echo "Test des resources statiques..."
curl -f -s -o /dev/null https://votre-domaine.com/static/css/ && echo "✅ CSS accessible" || echo "❌ CSS inaccessible"

# Test SSL
echo "Test SSL..."
curl -f -s -o /dev/null https://votre-domaine.com/ && echo "✅ SSL fonctionnel" || echo "❌ SSL défaillant"

echo "✅ Vérifications terminées"
```

## 🔧 Étape 7: Maintenance et mises à jour

### 7.1 Script de mise à jour

```bash
# Mise à jour manuelle
cd /var/www/portail-scolaire/frontend
git pull
npm ci --only=production
./verify-integration.sh
npm run build
sudo systemctl reload nginx

# Déploiement automatisé
./deploy.sh
```

### 7.2 Sauvegarde régulière

```bash
# Ajouter au crontab
0 2 * * * /var/www/portail-scolaire/frontend/backup.sh

# Script de sauvegarde
nano backup.sh
```

### 7.3 Monitoring continu

```bash
# Installation d'outils de monitoring (optionnel)
sudo apt install htop iotop netstat-nat -y

# Monitoring des performances Nginx
sudo tail -f /var/log/nginx/portail-scolaire-frontend_access.log
```

## 🚨 Dépannage

### Problèmes courants

1. **Build qui échoue**
   ```bash
   # Nettoyer et reinstaller
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Erreur 404 sur les routes React**
   ```bash
   # Vérifier la configuration Nginx
   sudo nginx -t
   # S'assurer que try_files est configuré
   ```

3. **Problèmes de performances**
   ```bash
   # Vérifier la compression Gzip
   curl -H "Accept-Encoding: gzip" -I https://votre-domaine.com/
   ```

4. **Erreurs SSL**
   ```bash
   # Renouveler le certificat
   sudo certbot renew
   sudo systemctl reload nginx
   ```

## ✅ Checklist de déploiement

- [ ] Serveur configuré et sécurisé
- [ ] Node.js et npm installés
- [ ] Code source cloné et configuré
- [ ] Variables d'environnement définies
- [ ] Build de production créé
- [ ] Nginx configuré et testé
- [ ] SSL configuré avec Let's Encrypt
- [ ] Monitoring et logs configurés
- [ ] Scripts de déploiement créés
- [ ] Tests de santé réussis
- [ ] Sauvegardes configurées
- [ ] Documentation équipe mise à jour

## 📞 Support et maintenance

### Contacts
- **Équipe technique** : tech@votre-ecole.com
- **Support urgent** : +33 X XX XX XX XX
- **Documentation** : [Wiki interne]

### Ressources
- **Monitoring** : https://monitor.votre-domaine.com
- **Logs** : /var/log/nginx/portail-scolaire-frontend_*.log
- **Métriques** : PM2 Dashboard (si applicable)

---

**🎉 Félicitations !** Votre Portail de Gestion Scolaire avec 104 endpoints API est maintenant déployé et opérationnel en production.

Pour toute question ou support, consultez la documentation technique ou contactez l'équipe de développement.
