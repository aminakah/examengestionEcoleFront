#!/bin/bash

echo "🎓 Démarrage du Portail Scolaire..."
echo "=================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer avec Node.js"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Installer les dépendances si le dossier node_modules n'existe pas
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dépendances installées avec succès"
    else
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
else
    echo "✅ Dépendances déjà installées"
fi

echo ""
echo "🚀 Démarrage de l'application..."
echo "📍 L'application sera accessible sur: http://localhost:3000"
echo ""
echo "👤 Comptes de test disponibles:"
echo "   Admin: admin@ecole.com / password"
echo "   Enseignant: prof@ecole.com / password" 
echo "   Parent: parent@ecole.com / password"
echo ""
echo "⏹️  Pour arrêter l'application: Ctrl+C"
echo "=================================="

# Démarrer l'application
npm start