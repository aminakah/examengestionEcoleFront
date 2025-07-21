#!/bin/bash

# Script de démarrage intelligent pour le frontend avec intégration API

echo "🚀 Démarrage du Portail de Gestion Scolaire..."
echo "================================================"

# Configuration des couleurs pour les messages
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
    echo -e "${GREEN}[SUCCÈS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ATTENTION]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# Vérification de Node.js
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js détecté: $NODE_VERSION"
    else
        print_error "Node.js n'est pas installé"
        exit 1
    fi
}

# Vérification de npm
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm détecté: $NPM_VERSION"
    else
        print_error "npm n'est pas installé"
        exit 1
    fi
}

# Configuration de l'environnement
setup_env() {
    print_status "Configuration de l'environnement..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Fichier .env créé à partir de .env.example"
        else
            print_warning "Fichier .env.example non trouvé, création d'un .env minimal"
            cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_DEBUG=true
EOF
        fi
    else
        print_success "Fichier .env existant trouvé"
    fi
}

# Vérification de la connectivité au backend
check_backend() {
    print_status "Vérification de la connectivité au backend..."
    
    # Lire l'URL de l'API depuis le fichier .env
    if [ -f .env ]; then
        API_URL=$(grep REACT_APP_API_URL .env | cut -d '=' -f2)
        BACKEND_HOST=$(echo $API_URL | sed 's|/api||' | sed 's|http://||' | sed 's|https://||')
        
        # Test de connectivité basique
        if timeout 5 bash -c "</dev/tcp/${BACKEND_HOST%:*}/${BACKEND_HOST##*:}" 2>/dev/null; then
            print_success "Backend accessible sur $API_URL"
        else
            print_warning "Backend non accessible sur $API_URL"
            print_warning "L'application fonctionnera en mode fallback avec des données de démonstration"
        fi
    else
        print_warning "Impossible de vérifier le backend - fichier .env non trouvé"
    fi
}

# Installation des dépendances
install_dependencies() {
    print_status "Vérification des dépendances..."
    
    if [ ! -d "node_modules" ] || [ ! -f "package-lock.json" ]; then
        print_status "Installation des dépendances npm..."
        npm install
        if [ $? -eq 0 ]; then
            print_success "Dépendances installées avec succès"
        else
            print_error "Échec de l'installation des dépendances"
            exit 1
        fi
    else
        print_success "Dépendances déjà installées"
    fi
}

# Vérification de l'intégrité des services
check_services() {
    print_status "Vérification de l'intégrité des services API..."
    
    # Vérifier que les fichiers de services essentiels existent
    REQUIRED_FILES=(
        "src/services/api.js"
        "src/services/authService.js"
        "src/services/index.js"
        "src/context/AuthContext.js"
        "src/hooks/customHooks.js"
    )
    
    ALL_PRESENT=true
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "✓ $file"
        else
            print_error "✗ $file manquant"
            ALL_PRESENT=false
        fi
    done
    
    if [ "$ALL_PRESENT" = true ]; then
        print_success "Tous les services API sont présents"
    else
        print_error "Certains services API sont manquants"
        exit 1
    fi
}

# Affichage des informations de démarrage
show_startup_info() {
    echo ""
    echo "📊 Informations de l'application"
    echo "================================="
    echo "🏫 Nom: Portail de Gestion Scolaire"
    echo "🔢 Version: 2.0.0"
    echo "🔌 API Endpoints: 104"
    echo "👥 Rôles supportés: admin, enseignant, parent, élève"
    echo "🌐 URL Frontend: http://localhost:3000"
    
    if [ -f .env ]; then
        API_URL=$(grep REACT_APP_API_URL .env | cut -d '=' -f2)
        echo "🔗 URL Backend: $API_URL"
    fi
    
    echo ""
    echo "🔑 Comptes de démonstration:"
    echo "  👑 Admin: admin@ecole.com / password"
    echo "  👨‍🏫 Enseignant: prof@ecole.com / password"
    echo "  👪 Parent: parent@ecole.com / password"
    echo "  🎓 Élève: eleve@ecole.com / password"
    echo ""
}

# Démarrage du serveur de développement
start_server() {
    print_status "Démarrage du serveur de développement..."
    echo ""
    print_success "🎉 Application prête !"
    print_status "Ouverture automatique dans le navigateur..."
    echo ""
    
    # Démarrer l'application React
    npm start
}

# Fonction principale
main() {
    echo ""
    check_node
    check_npm
    setup_env
    install_dependencies
    check_services
    check_backend
    show_startup_info
    start_server
}

# Gestion des signaux pour un arrêt propre
cleanup() {
    echo ""
    print_status "Arrêt de l'application..."
    exit 0
}

trap cleanup SIGINT SIGTERM

# Exécution du script principal
main "$@"
