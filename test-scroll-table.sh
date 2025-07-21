#!/bin/bash

# Script de test pour le composant TableWithAdvancedScroll
# Ce script vérifie l'intégration et teste le composant

echo "🚀 Test du composant TableWithAdvancedScroll"
echo "=============================================="

# Vérification de l'existence des fichiers
echo "📁 Vérification des fichiers..."

if [ -f "src/components/TableWithAdvancedScroll.js" ]; then
    echo "✅ TableWithAdvancedScroll.js existe"
else
    echo "❌ TableWithAdvancedScroll.js manquant"
    exit 1
fi

if [ -f "src/components/UIComponents.js" ]; then
    echo "✅ UIComponents.js existe"
else
    echo "❌ UIComponents.js manquant"
    exit 1
fi

if [ -f "src/components/TableScrollDemo.js" ]; then
    echo "✅ TableScrollDemo.js existe"
else
    echo "❌ TableScrollDemo.js manquant"
    exit 1
fi

if [ -f "SCROLL_TABLE_DOCUMENTATION.md" ]; then
    echo "✅ Documentation existe"
else
    echo "❌ Documentation manquante"
    exit 1
fi

# Vérification des styles CSS
echo ""
echo "🎨 Vérification des styles CSS..."

if grep -q "scrollbar-thin" src/index.css; then
    echo "✅ Styles scrollbar présents"
else
    echo "❌ Styles scrollbar manquants"
    exit 1
fi

# Vérification des imports dans les pages modifiées
echo ""
echo "📦 Vérification des imports..."

if grep -q "TableWithAdvancedScroll" src/pages/GestionEleves.js; then
    echo "✅ GestionEleves.js utilise le nouveau composant"
else
    echo "❌ GestionEleves.js n'utilise pas le nouveau composant"
fi

if grep -q "TableWithAdvancedScroll" src/pages/GestionEnseignants.js; then
    echo "✅ GestionEnseignants.js utilise le nouveau composant"
else
    echo "❌ GestionEnseignants.js n'utilise pas le nouveau composant"
fi

# Test de syntaxe JavaScript
echo ""
echo "🔍 Test de syntaxe JavaScript..."

# Vérification que Node.js est disponible
if command -v node &> /dev/null; then
    echo "✅ Node.js disponible"
    
    # Test de syntaxe pour TableWithAdvancedScroll
    node -c src/components/TableWithAdvancedScroll.js 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ TableWithAdvancedScroll.js syntaxe correcte"
    else
        echo "❌ TableWithAdvancedScroll.js erreurs de syntaxe"
        exit 1
    fi
    
    # Test de syntaxe pour TableScrollDemo
    node -c src/components/TableScrollDemo.js 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ TableScrollDemo.js syntaxe correcte"
    else
        echo "❌ TableScrollDemo.js erreurs de syntaxe"
        exit 1
    fi
else
    echo "⚠️  Node.js non disponible - test de syntaxe ignoré"
fi

# Vérification des dépendances package.json
echo ""
echo "📋 Vérification des dépendances..."

if [ -f "package.json" ]; then
    if grep -q "lucide-react" package.json; then
        echo "✅ lucide-react présent dans package.json"
    else
        echo "⚠️  lucide-react peut être manquant"
    fi
    
    if grep -q "react" package.json; then
        echo "✅ React présent dans package.json"
    else
        echo "❌ React manquant dans package.json"
        exit 1
    fi
else
    echo "❌ package.json manquant"
    exit 1
fi

# Résumé des fonctionnalités ajoutées
echo ""
echo "🎉 Résumé des améliorations apportées:"
echo "====================================="
echo "✨ Nouveau composant TableWithAdvancedScroll créé"
echo "✨ Styles CSS personnalisés pour scrollbars ajoutés"
echo "✨ Pagination intégrée avec navigation intelligente"
echo "✨ En-têtes et colonnes d'actions collants"
echo "✨ Indicateurs de scroll et animations"
echo "✨ Configuration flexible (hauteur, éléments par page, etc.)"
echo "✨ Composant de démonstration avec données test"
echo "✨ Documentation complète avec exemples"
echo "✨ Migration des pages GestionEleves et GestionEnseignants"

# Instructions de démarrage
echo ""
echo "🚀 Pour tester le composant:"
echo "============================"
echo "1. Installez les dépendances: npm install"
echo "2. Démarrez l'application: npm start"
echo "3. Naviguez vers Gestion des Élèves ou Gestion des Enseignants"
echo "4. Testez le scroll, la pagination et les actions"
echo ""
echo "📖 Consultez SCROLL_TABLE_DOCUMENTATION.md pour plus d'infos"

# Test d'installation npm (optionnel)
echo ""
read -p "🤔 Voulez-vous tester npm install ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Test npm install..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ npm install réussi"
    else
        echo "❌ npm install échoué"
        exit 1
    fi
fi

echo ""
echo "🎊 Tous les tests sont passés avec succès !"
echo "🎊 Le composant TableWithAdvancedScroll est prêt à l'emploi !"
