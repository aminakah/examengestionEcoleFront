#!/bin/bash

# Script de démarrage pour le Portail Scolaire
# Ce script configure et lance l'application en mode développement

echo "🎓 Portail Administratif Scolaire - École Moderne"
echo "================================================="
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier la version de Node.js
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js détecté: $NODE_VERSION"
        
        # Extraire le numéro de version majeure
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        
        if [ "$MAJOR_VERSION" -lt 16 ]; then
            print_error "Node.js version 16+ requis. Version actuelle: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js n'est pas installé. Veuillez installer Node.js 16+ depuis https://nodejs.org/"
        exit 1
    fi
}

# Vérifier si npm est disponible
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm détecté: v$NPM_VERSION"
    else
        print_error "npm n'est pas disponible. Veuillez installer Node.js avec npm."
        exit 1
    fi
}

# Installer les dépendances si nécessaire
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        print_status "Installation des dépendances..."
        npm install
        
        if [ $? -eq 0 ]; then
            print_success "Dépendances installées avec succès!"
        else
            print_error "Erreur lors de l'installation des dépendances"
            exit 1
        fi
    else
        print_status "Dépendances déjà installées"
    fi
}

# Vérifier les dépendances critiques
check_dependencies() {
    print_status "Vérification des dépendances critiques..."
    
    CRITICAL_DEPS=("react" "jspdf" "lucide-react" "tailwindcss")
    
    for dep in "${CRITICAL_DEPS[@]}"; do
        if npm list "$dep" &> /dev/null; then
            print_success "✓ $dep installé"
        else
            print_warning "✗ $dep manquant - installation en cours..."
            npm install "$dep"
        fi
    done
}

# Afficher les informations de configuration
show_config() {
    echo ""
    echo "📋 Configuration de l'application:"
    echo "   • Port: 3000"
    echo "   • Environnement: Développement"
    echo "   • Proxy API: http://localhost:8000"
    echo ""
    echo "👥 Comptes de test disponibles:"
    echo "   📧 Admin: admin@ecole.com / password"
    echo "   👨‍🏫 Enseignant: prof@ecole.com / password"
    echo "   👨‍👩‍👧‍👦 Parent: parent@ecole.com / password"
    echo ""
}

# Fonction pour démarrer l'application
start_app() {
    print_status "Démarrage de l'application..."
    print_success "🚀 Application disponible sur: http://localhost:3000"
    echo ""
    echo "Pour arrêter l'application, appuyez sur Ctrl+C"
    echo ""
    
    npm start
}

# Menu interactif
show_menu() {
    echo ""
    echo "🔧 Options disponibles:"
    echo "   1) Démarrer l'application (mode développement)"
    echo "   2) Construire pour la production"
    echo "   3) Lancer les tests"
    echo "   4) Nettoyer et réinstaller les dépendances"
    echo "   5) Afficher les informations de débogage"
    echo "   6) Quitter"
    echo ""
    read -p "Choisissez une option (1-6): " choice
    
    case $choice in
        1)
            start_app
            ;;
        2)
            print_status "Construction de l'application pour la production..."
            npm run build
            if [ $? -eq 0 ]; then
                print_success "Build réussi! Fichiers dans le dossier 'build/'"
            else
                print_error "Erreur lors du build"
            fi
            show_menu
            ;;
        3)
            print_status "Lancement des tests..."
            npm test
            show_menu
            ;;
        4)
            print_status "Nettoyage et réinstallation..."
            rm -rf node_modules package-lock.json
            npm install
            print_success "Réinstallation terminée!"
            show_menu
            ;;
        5)
            show_debug_info
            show_menu
            ;;
        6)
            print_success "👋 Au revoir!"
            exit 0
            ;;
        *)
            print_error "Option invalide. Veuillez choisir entre 1 et 6."
            show_menu
            ;;
    esac
}

# Informations de débogage
show_debug_info() {
    echo ""
    echo "🐛 Informations de débogage:"
    echo "   • Système: $(uname -s)"
    echo "   • Architecture: $(uname -m)"
    echo "   • Node.js: $(node --version)"
    echo "   • npm: v$(npm --version)"
    echo "   • Répertoire: $(pwd)"
    echo "   • Dossier node_modules: $([ -d "node_modules" ] && echo "Présent" || echo "Absent")"
    echo "   • package.json: $([ -f "package.json" ] && echo "Présent" || echo "Absent")"
    echo ""
    
    if [ -f "package.json" ]; then
        echo "📦 Dépendances principales:"
        npm list --depth=0 | head -20
    fi
    echo ""
}

# Script principal
main() {
    echo "🔍 Vérification de l'environnement..."
    check_node
    check_npm
    
    print_status "Installation et configuration..."
    install_dependencies
    check_dependencies
    
    show_config
    
    # Si un argument est passé, démarrer directement
    if [ "$1" = "start" ] || [ "$1" = "dev" ]; then
        start_app
    else
        show_menu
    fi
}

# Gestion des signaux pour un arrêt propre
trap 'echo -e "\n${YELLOW}[INFO]${NC} Arrêt de l'application..."; exit 0' INT TERM

# Lancement du script principal
main "$@"
