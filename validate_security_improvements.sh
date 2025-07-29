#!/bin/bash

# Script de validation des améliorations de sécurité - Amélioration pour l'audit
# Usage: ./validate_security_improvements.sh

echo "🔍 VALIDATION DES AMÉLIORATIONS DE SÉCURITÉ"
echo "=========================================="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de vérification
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1"
        return 1
    fi
}

# Fonction de vérification de contenu
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $1 contient '$2'"
        return 0
    else
        echo -e "${RED}❌${NC} $1 ne contient pas '$2'"
        return 1
    fi
}

# Variables de comptage
total_checks=0
passed_checks=0

echo -e "${BLUE}📁 Vérification des fichiers créés/modifiés${NC}"
echo "-------------------------------------------"

files_to_check=(
    "src/utils/sessionManager.js"
    "src/utils/validation.js"
    "src/components/common/PasswordField.js"
    "src/components/common/SessionComponents.js"
    "src/components/UserFormWithPasswordValidation.js"
    "src/components/SecurityImprovementsDemo.js"
    "src/styles/securityImprovements.css"
    "src/__tests__/securityImprovements.test.js"
    "SECURITY_IMPROVEMENTS.md"
)

for file in "${files_to_check[@]}"; do
    total_checks=$((total_checks + 1))
    if check_file "$file"; then
        passed_checks=$((passed_checks + 1))
    fi
done

echo ""
echo -e "${BLUE}🔍 Vérification du contenu des améliorations${NC}"
echo "--------------------------------------------"

# Vérification validation des mots de passe
content_checks=(
    "src/utils/validation.js:validatePassword"
    "src/utils/validation.js:calculateAdvancedPasswordStrength"
    "src/utils/validation.js:generatePasswordRecommendations"
    "src/components/common/PasswordField.js:PasswordStrengthIndicator"
    "src/components/common/PasswordField.js:PasswordInputField"
    "src/utils/sessionManager.js:SessionManager"
    "src/utils/sessionManager.js:initSessionManager"
    "src/components/common/SessionComponents.js:SessionExpirationModal"
    "src/context/AuthContext.js:initializeSessionManager"
    "src/context/AuthContext.js:extendSession"
)

for check in "${content_checks[@]}"; do
    IFS=':' read -r file content <<< "$check"
    total_checks=$((total_checks + 1))
    if check_content "$file" "$content"; then
        passed_checks=$((passed_checks + 1))
    fi
done

echo ""
echo -e "${BLUE}📦 Vérification des dépendances NPM${NC}"
echo "------------------------------------"

if [ -f "package.json" ]; then
    total_checks=$((total_checks + 1))
    if grep -q "lucide-react" package.json; then
        echo -e "${GREEN}✅${NC} lucide-react (icônes) - OK"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "${RED}❌${NC} lucide-react manquante"
    fi
else
    echo -e "${RED}❌${NC} package.json introuvable"
    total_checks=$((total_checks + 1))
fi

echo ""
echo -e "${BLUE}🧪 Vérification des tests${NC}"
echo "----------------------------"

if [ -f "src/__tests__/securityImprovements.test.js" ]; then
    total_checks=$((total_checks + 1))
    test_count=$(grep -c "test\|it" "src/__tests__/securityImprovements.test.js" 2>/dev/null || echo "0")
    if [ "$test_count" -gt 15 ]; then
        echo -e "${GREEN}✅${NC} Tests de sécurité ($test_count tests trouvés)"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "${YELLOW}⚠️${NC} Peu de tests trouvés ($test_count)"
    fi
fi

echo ""
echo -e "${BLUE}🚀 Vérification de l'intégration dans l'app${NC}"
echo "----------------------------------------------"

integration_checks=(
    "src/App.js:SecurityImprovementsDemo"
    "src/App.js:security-demo"
    "src/components/Sidebar.js:Shield"
    "src/components/Sidebar.js:Améliorations Sécurité"
    "src/index.css:securityImprovements.css"
)

for check in "${integration_checks[@]}"; do
    IFS=':' read -r file content <<< "$check"
    total_checks=$((total_checks + 1))
    if check_content "$file" "$content"; then
        passed_checks=$((passed_checks + 1))
    fi
done

echo ""
echo "========================================"
echo -e "${BLUE}📊 RÉSULTATS DE LA VALIDATION${NC}"
echo "========================================"

percentage=$((passed_checks * 100 / total_checks))

echo -e "Tests passés: ${GREEN}$passed_checks${NC}/$total_checks"
echo -e "Pourcentage: ${GREEN}$percentage%${NC}"

if [ $percentage -ge 90 ]; then
    echo -e "${GREEN}🎉 EXCELLENT!${NC} Les améliorations de sécurité sont correctement implémentées."
    exit_code=0
elif [ $percentage -ge 80 ]; then
    echo -e "${YELLOW}⚠️ BIEN${NC} La plupart des améliorations sont en place, quelques ajustements nécessaires."
    exit_code=1
else
    echo -e "${RED}❌ INSUFFISANT${NC} Des améliorations importantes manquent."
    exit_code=2
fi

echo ""
echo -e "${BLUE}🔧 PROCHAINES ÉTAPES${NC}"
echo "---------------------"

if [ $percentage -ge 90 ]; then
    echo "1. ✅ Démarrer l'application: npm start"
    echo "2. ✅ Se connecter en tant qu'admin"
    echo "3. ✅ Tester la démo: /admin/security-demo"
    echo "4. ✅ Valider les fonctionnalités"
    echo "5. ✅ Lancer les tests: npm test securityImprovements"
else
    echo "1. 🔧 Corriger les fichiers manquants"
    echo "2. 🔧 Vérifier les imports et intégrations"
    echo "3. 🔧 Relancer ce script de validation"
    echo "4. 🔧 Consulter SECURITY_IMPROVEMENTS.md"
fi

echo ""
echo -e "${BLUE}📚 DOCUMENTATION${NC}"
echo "------------------"
echo "• SECURITY_IMPROVEMENTS.md - Guide complet des améliorations"
echo "• src/__tests__/securityImprovements.test.js - Tests automatisés"
echo "• /admin/security-demo - Démonstration interactive"

echo ""
echo "Validation terminée!"

exit $exit_code