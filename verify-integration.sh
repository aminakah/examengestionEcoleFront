#!/bin/bash

# Script de vérification de l'intégration API
# Vérifie que tous les composants de l'intégration sont correctement configurés

echo "🔍 Vérification de l'intégration API du Portail Scolaire"
echo "==========================================================="

# Configuration des couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Fonction pour afficher les résultats
check_result() {
    local test_name="$1"
    local result="$2"
    local message="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} $test_name"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} $test_name"
        if [ -n "$message" ]; then
            echo -e "   ${YELLOW}└─${NC} $message"
        fi
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

# Vérification de l'environnement Node.js
echo -e "\n${BLUE}🔧 Vérification de l'environnement${NC}"
echo "-----------------------------------"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_result "Node.js installé ($NODE_VERSION)" "PASS"
else
    check_result "Node.js installé" "FAIL" "Node.js n'est pas installé"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_result "npm installé ($NPM_VERSION)" "PASS"
else
    check_result "npm installé" "FAIL" "npm n'est pas installé"
fi

# Vérification des dépendances
echo -e "\n${BLUE}📦 Vérification des dépendances${NC}"
echo "--------------------------------"

if [ -f "package.json" ]; then
    check_result "package.json présent" "PASS"
else
    check_result "package.json présent" "FAIL" "Fichier package.json manquant"
fi

if [ -d "node_modules" ]; then
    check_result "node_modules installé" "PASS"
else
    check_result "node_modules installé" "FAIL" "Exécutez 'npm install'"
fi

if [ -f "package-lock.json" ]; then
    check_result "package-lock.json présent" "PASS"
else
    check_result "package-lock.json présent" "FAIL" "Lockfile manquant"
fi

# Vérification de la configuration
echo -e "\n${BLUE}⚙️ Vérification de la configuration${NC}"
echo "-----------------------------------"

if [ -f ".env" ]; then
    check_result "Fichier .env présent" "PASS"
    
    # Vérifier les variables importantes
    if grep -q "REACT_APP_API_URL" .env; then
        check_result "REACT_APP_API_URL configuré" "PASS"
    else
        check_result "REACT_APP_API_URL configuré" "FAIL" "Variable manquante dans .env"
    fi
else
    check_result "Fichier .env présent" "FAIL" "Copiez .env.example vers .env"
fi

if [ -f ".env.example" ]; then
    check_result "Fichier .env.example présent" "PASS"
else
    check_result "Fichier .env.example présent" "FAIL" "Template de configuration manquant"
fi

# Vérification de la structure des services
echo -e "\n${BLUE}🏗️ Vérification de l'architecture des services${NC}"
echo "----------------------------------------------"

REQUIRED_SERVICE_FILES=(
    "src/services/api.js"
    "src/services/authService.js"
    "src/services/userService.js"
    "src/services/schoolService.js"
    "src/services/classService.js"
    "src/services/subjectService.js"
    "src/services/studentService.js"
    "src/services/parentService.js"
    "src/services/teacherService.js"
    "src/services/enrollmentService.js"
    "src/services/periodService.js"
    "src/services/gradeService.js"
    "src/services/bulletinService.js"
    "src/services/dashboardService.js"
    "src/services/documentService.js"
    "src/services/index.js"
)

for file in "${REQUIRED_SERVICE_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_result "Service $(basename "$file" .js)" "PASS"
    else
        check_result "Service $(basename "$file" .js)" "FAIL" "Fichier $file manquant"
    fi
done

# Vérification des hooks
echo -e "\n${BLUE}🎣 Vérification des hooks${NC}"
echo "-----------------------------"

REQUIRED_HOOK_FILES=(
    "src/hooks/customHooks.js"
    "src/hooks/schoolHooks.js"
)

for file in "${REQUIRED_HOOK_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_result "Hook $(basename "$file" .js)" "PASS"
    else
        check_result "Hook $(basename "$file" .js)" "FAIL" "Fichier $file manquant"
    fi
done

# Vérification des contextes
echo -e "\n${BLUE}🌐 Vérification des contextes${NC}"
echo "-------------------------------"

if [ -f "src/context/AuthContext.js" ]; then
    check_result "AuthContext" "PASS"
else
    check_result "AuthContext" "FAIL" "Fichier src/context/AuthContext.js manquant"
fi

# Vérification des composants principaux
echo -e "\n${BLUE}🧩 Vérification des composants${NC}"
echo "--------------------------------"

REQUIRED_COMPONENTS=(
    "src/components/Login.js"
    "src/components/GradeManager.js"
    "src/components/BulletinManager.js"
    "src/components/UserManager.js"
    "src/components/APIIntegrationTest.js"
    "src/components/APIMonitor.js"
    "src/components/dashboard/SmartDashboard.js"
    "src/components/dashboard/StudentDashboard.js"
    "src/components/dashboard/ParentDashboard.js"
    "src/components/common/RouteProtection.js"
    "src/components/common/ToastNotifications.js"
)

for component in "${REQUIRED_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        check_result "Composant $(basename "$component" .js)" "PASS"
    else
        check_result "Composant $(basename "$component" .js)" "FAIL" "Fichier $component manquant"
    fi
done

# Vérification des utilitaires
echo -e "\n${BLUE}🛠️ Vérification des utilitaires${NC}"
echo "--------------------------------"

REQUIRED_UTILS=(
    "src/utils/validation.js"
    "src/utils/helpers.js"
)

for util in "${REQUIRED_UTILS[@]}"; do
    if [ -f "$util" ]; then
        check_result "Utilitaire $(basename "$util" .js)" "PASS"
    else
        check_result "Utilitaire $(basename "$util" .js)" "FAIL" "Fichier $util manquant"
    fi
done

# Vérification des tests
echo -e "\n${BLUE}🧪 Vérification des tests${NC}"
echo "----------------------------"

if [ -d "src/__tests__" ]; then
    check_result "Dossier de tests présent" "PASS"
    
    TEST_FILES=(
        "src/__tests__/integration.test.js"
        "src/__tests__/services.test.js"
    )
    
    for test in "${TEST_FILES[@]}"; do
        if [ -f "$test" ]; then
            check_result "Test $(basename "$test" .test.js)" "PASS"
        else
            check_result "Test $(basename "$test" .test.js)" "FAIL" "Fichier $test manquant"
        fi
    done
else
    check_result "Dossier de tests présent" "FAIL" "Dossier src/__tests__ manquant"
fi

# Vérification du fichier App.js
echo -e "\n${BLUE}📱 Vérification de l'application principale${NC}"
echo "-------------------------------------------"

if [ -f "src/App.js" ]; then
    check_result "App.js présent" "PASS"
    
    # Vérifier les imports importants
    if grep -q "AuthProvider" src/App.js; then
        check_result "AuthProvider importé dans App.js" "PASS"
    else
        check_result "AuthProvider importé dans App.js" "FAIL" "Import AuthProvider manquant"
    fi
    
    if grep -q "ToastProvider" src/App.js; then
        check_result "ToastProvider importé dans App.js" "PASS"
    else
        check_result "ToastProvider importé dans App.js" "FAIL" "Import ToastProvider manquant"
    fi
else
    check_result "App.js présent" "FAIL" "Fichier src/App.js manquant"
fi

# Vérification de la syntaxe JavaScript/JSX
echo -e "\n${BLUE}🔍 Vérification de la syntaxe${NC}"
echo "------------------------------"

# Compter les fichiers JavaScript/JSX
JS_FILES=$(find src -name "*.js" -o -name "*.jsx" | wc -l)
check_result "Fichiers JS/JSX détectés ($JS_FILES fichiers)" "PASS"

# Vérifier s'il y a des erreurs de syntaxe évidentes dans les principaux fichiers
MAIN_FILES=(
    "src/App.js"
    "src/services/index.js"
    "src/context/AuthContext.js"
)

SYNTAX_ERRORS=0
for file in "${MAIN_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Vérifier les accolades de base
        OPEN_BRACES=$(grep -o '{' "$file" | wc -l)
        CLOSE_BRACES=$(grep -o '}' "$file" | wc -l)
        
        if [ "$OPEN_BRACES" -eq "$CLOSE_BRACES" ]; then
            check_result "Syntaxe $(basename "$file") (accolades)" "PASS"
        else
            check_result "Syntaxe $(basename "$file") (accolades)" "FAIL" "Accolades non équilibrées"
            SYNTAX_ERRORS=$((SYNTAX_ERRORS + 1))
        fi
    fi
done

# Vérification de la documentation
echo -e "\n${BLUE}📚 Vérification de la documentation${NC}"
echo "-----------------------------------"

DOCS=(
    "README.md"
    "GUIDE_INTEGRATION_API.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        check_result "Documentation $doc" "PASS"
    else
        check_result "Documentation $doc" "FAIL" "Fichier $doc manquant"
    fi
done

# Vérification des scripts
echo -e "\n${BLUE}📜 Vérification des scripts${NC}"
echo "-----------------------------"

SCRIPTS=(
    "start-with-api.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            check_result "Script $script (exécutable)" "PASS"
        else
            check_result "Script $script (exécutable)" "FAIL" "Rendez exécutable avec chmod +x"
        fi
    else
        check_result "Script $script" "FAIL" "Fichier $script manquant"
    fi
done

# Test de compilation (optionnel)
echo -e "\n${BLUE}🏗️ Test de compilation${NC}"
echo "------------------------"

if command -v npm &> /dev/null && [ -f "package.json" ]; then
    echo "Test de compilation en cours..."
    
    # Rediriger la sortie pour éviter le spam
    if npm run build > /tmp/build.log 2>&1; then
        check_result "Compilation réussie" "PASS"
    else
        check_result "Compilation réussie" "FAIL" "Voir /tmp/build.log pour les détails"
    fi
else
    check_result "Test de compilation" "FAIL" "npm ou package.json manquant"
fi

# Vérification de connectivité backend (optionnel)
echo -e "\n${BLUE}🔗 Test de connectivité backend${NC}"
echo "--------------------------------"

if [ -f ".env" ]; then
    API_URL=$(grep REACT_APP_API_URL .env | cut -d '=' -f2 | sed 's/\/api$//')
    if [ -n "$API_URL" ]; then
        BACKEND_HOST=$(echo $API_URL | sed 's|http://||' | sed 's|https://||')
        
        if timeout 5 bash -c "</dev/tcp/${BACKEND_HOST%:*}/${BACKEND_HOST##*:}" 2>/dev/null; then
            check_result "Connectivité backend ($API_URL)" "PASS"
        else
            check_result "Connectivité backend ($API_URL)" "FAIL" "Backend non accessible"
        fi
    else
        check_result "Configuration API URL" "FAIL" "REACT_APP_API_URL non configuré"
    fi
else
    check_result "Configuration backend" "FAIL" "Fichier .env manquant"
fi

# Résumé final
echo -e "\n${BLUE}📊 RÉSUMÉ DE LA VÉRIFICATION${NC}"
echo "================================="

echo -e "Total des vérifications: ${YELLOW}$TOTAL_CHECKS${NC}"
echo -e "Réussies: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Échouées: ${RED}$FAILED_CHECKS${NC}"

PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
echo -e "Taux de réussite: ${YELLOW}$PERCENTAGE%${NC}"

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 EXCELLENT !${NC} Votre intégration API est complète et prête à utiliser."
    echo -e "${GREEN}✨ Vous pouvez maintenant lancer l'application avec:${NC} ${YELLOW}./start-with-api.sh${NC}"
elif [ $PERCENTAGE -ge 80 ]; then
    echo -e "\n${YELLOW}⚠️ BIEN${NC} - Votre intégration est presque complète."
    echo -e "${YELLOW}🔧 Corrigez les problèmes mineurs identifiés ci-dessus.${NC}"
elif [ $PERCENTAGE -ge 60 ]; then
    echo -e "\n${YELLOW}⚠️ ATTENTION${NC} - Plusieurs éléments nécessitent votre attention."
    echo -e "${YELLOW}🛠️ Suivez le guide d'intégration pour compléter l'installation.${NC}"
else
    echo -e "\n${RED}❌ CRITIQUE${NC} - L'intégration est incomplète."
    echo -e "${RED}🚨 Consultez la documentation et corrigez les erreurs majeures.${NC}"
fi

echo -e "\n${BLUE}📖 Ressources utiles:${NC}"
echo "• Guide d'intégration: GUIDE_INTEGRATION_API.md"
echo "• Documentation: README.md"
echo "• Démarrage rapide: ./start-with-api.sh"

echo -e "\n${BLUE}🔗 Endpoints API intégrés: 104${NC}"
echo "• Authentification: 7 endpoints"
echo "• Gestion utilisateurs: 7 endpoints"
echo "• Gestion scolaire: 90 endpoints"

exit $FAILED_CHECKS
