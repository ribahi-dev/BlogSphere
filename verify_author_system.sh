#!/bin/bash

# Script de vérification rapide du système

echo "=================================="
echo "   VÉRIFICATION DU SYSTÈME"
echo "=================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Vérifier si le backend est accessible
echo -e "${YELLOW}1. Vérification du backend...${NC}"
if timeout 2 curl -s http://127.0.0.1:8000/api/articles > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend accessible sur http://127.0.0.1:8000${NC}"
else
    echo -e "${RED}❌ Backend NON accessible${NC}"
    echo "   Démarrer le backend :"
    echo "   cd backend && php -S 127.0.0.1:8000 -t public public/index.php"
fi
echo ""

# 2. Vérifier la base de données
echo -e "${YELLOW}2. Vérification de la base de données...${NC}"
if [ -f "backend/var/data.db" ]; then
    echo -e "${GREEN}✅ Base de données trouvée${NC}"
    FILE_SIZE=$(du -h "backend/var/data.db" | cut -f1)
    echo "   Taille : $FILE_SIZE"
else
    echo -e "${RED}❌ Base de données non trouvée${NC}"
    echo "   Créer la base de données :"
    echo "   cd backend && php bin/console doctrine:database:create"
fi
echo ""

# 3. Vérifier les comptes de test
echo -e "${YELLOW}3. Vérification des comptes de test...${NC}"
if timeout 3 curl -s -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"author@test.com","password":"Password123"}' | grep -q "token"; then
    echo -e "${GREEN}✅ Compte auteur fonctionnel${NC}"
else
    echo -e "${YELLOW}⚠️  Compte auteur non accessible${NC}"
    echo "   Créer les comptes :"
    echo "   cd backend && php create_test_accounts.php"
fi
echo ""

# 4. Vérifier les fichiers frontend
echo -e "${YELLOW}4. Vérification des fichiers frontend...${NC}"
FILES=("src/pages/ArticleEditor.tsx" "src/pages/AuthorDashboard.tsx" "src/services/api.ts")
MISSING=0
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file (MANQUANT)${NC}"
        MISSING=$((MISSING + 1))
    fi
done
echo ""

# 5. Vérifier les fichiers de documentation
echo -e "${YELLOW}5. Vérification de la documentation...${NC}"
DOCS=("AUTHOR_GUIDE.md" "AUTHOR_SETUP.md" "AUTHOR_README.md" "AUTHOR_IMPLEMENTATION_SUMMARY.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅ $doc${NC}"
    else
        echo -e "${RED}❌ $doc (MANQUANT)${NC}"
    fi
done
echo ""

# Résumé
echo "=================================="
if [ "$MISSING" -eq 0 ] && timeout 2 curl -s http://127.0.0.1:8000/api/articles > /dev/null 2>&1; then
    echo -e "${GREEN}✅ SYSTÈME PRÊT !${NC}"
    echo ""
    echo "Prochaines étapes :"
    echo "1. Démarrer le frontend : npm run dev"
    echo "2. Accéder à http://localhost:5173"
    echo "3. Se connecter : author@test.com / Password123"
else
    echo -e "${YELLOW}⚠️  VÉRIFICATION À TERMINER${NC}"
    echo ""
    echo "Actions requises :"
    if ! timeout 2 curl -s http://127.0.0.1:8000/api/articles > /dev/null 2>&1; then
        echo "- Démarrer le backend"
    fi
    if [ "$MISSING" -gt 0 ]; then
        echo "- Créer les fichiers frontend manquants"
    fi
fi
echo "=================================="
