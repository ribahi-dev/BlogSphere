#!/bin/bash

# Script de test pour les articles de l'auteur
# Cet script teste la création, la récupération et la publication d'articles

API_URL="http://127.0.0.1:8000/api"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=================================================="
echo "     TEST API ARTICLES - PROFIL AUTEUR"
echo "=================================================="
echo ""

# Test 1: Récupérer le token en se connectant
echo -e "${YELLOW}[Test 1] Connexion de l'auteur...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@test.com",
    "password": "Password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}[ERREUR] Impossible de se connecter${NC}"
  echo "Réponse: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}[OK] Connexion réussie${NC}"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Test 2: Créer un article
echo -e "${YELLOW}[Test 2] Création d'un article...${NC}"
ARTICLE_RESPONSE=$(curl -s -X POST "$API_URL/articles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Mon premier article",
    "description": "Ceci est la description de mon article",
    "content": "# Contenu\n\nCeci est le contenu complet de mon article avec du **texte en gras** et du *texte en italique*."
  }')

ARTICLE_ID=$(echo $ARTICLE_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$ARTICLE_ID" ]; then
  echo -e "${RED}[ERREUR] Impossible de créer l'article${NC}"
  echo "Réponse: $ARTICLE_RESPONSE"
  exit 1
fi

echo -e "${GREEN}[OK] Article créé avec l'ID: $ARTICLE_ID${NC}"
echo "Réponse complète: $ARTICLE_RESPONSE"
echo ""

# Test 3: Récupérer mes articles
echo -e "${YELLOW}[Test 3] Récupération de mes articles...${NC}"
MY_ARTICLES=$(curl -s -X GET "$API_URL/articles/my-articles" \
  -H "Authorization: Bearer $TOKEN")

ARTICLES_COUNT=$(echo $MY_ARTICLES | grep -o '"id"' | wc -l)

if [ "$ARTICLES_COUNT" -gt 0 ]; then
  echo -e "${GREEN}[OK] Vous avez $ARTICLES_COUNT article(s)${NC}"
  echo "Articles: $MY_ARTICLES"
else
  echo -e "${RED}[ERREUR] Aucun article trouvé${NC}"
fi
echo ""

# Test 4: Publier l'article
echo -e "${YELLOW}[Test 4] Publication de l'article...${NC}"
PUBLISH_RESPONSE=$(curl -s -X POST "$API_URL/articles/$ARTICLE_ID/publish" \
  -H "Authorization: Bearer $TOKEN")

if echo $PUBLISH_RESPONSE | grep -q '"published":true'; then
  echo -e "${GREEN}[OK] Article publié avec succès${NC}"
  echo "Réponse: $PUBLISH_RESPONSE"
else
  echo -e "${RED}[ERREUR] Impossible de publier l'article${NC}"
  echo "Réponse: $PUBLISH_RESPONSE"
fi
echo ""

# Test 5: Récupérer tous les articles publiés
echo -e "${YELLOW}[Test 5] Récupération des articles publiés...${NC}"
ALL_ARTICLES=$(curl -s -X GET "$API_URL/articles")

PUBLISHED_COUNT=$(echo $ALL_ARTICLES | grep -o '"id"' | wc -l)

if [ "$PUBLISHED_COUNT" -gt 0 ]; then
  echo -e "${GREEN}[OK] $PUBLISHED_COUNT article(s) publié(s)${NC}"
  echo "Articles: $ALL_ARTICLES"
else
  echo -e "${RED}[ERREUR] Aucun article publié trouvé${NC}"
fi
echo ""

echo "=================================================="
echo -e "${GREEN}Tests terminés avec succès!${NC}"
echo "=================================================="
