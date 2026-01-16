#!/bin/bash

# Script de test des endpoints API
# Utilisation: bash test_api.sh

BASE_URL="http://localhost:8000/api"

echo "🧪 Tests API - Backend Symfony"
echo "================================"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Check Email (devrait être libre)
echo -e "${BLUE}Test 1: Vérifier que l'email est libre${NC}"
EMAIL_TEST="testuser$(date +%s)@test.com"
curl -s -X POST "$BASE_URL/auth/check-email" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL_TEST\"}" | jq .

# Test 2: Inscription
echo -e "\n${BLUE}Test 2: Inscription avec email/password${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$EMAIL_TEST\",
    \"password\": \"TestPassword123!\"
  }")

echo "$RESPONSE" | jq .

# Extraire le token
TOKEN=$(echo "$RESPONSE" | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Erreur: Pas de token reçu!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Token reçu: ${TOKEN:0:30}...${NC}"

# Test 3: Vérifier que l'email existe maintenant
echo -e "\n${BLUE}Test 3: Vérifier que l'email existe maintenant${NC}"
curl -s -X POST "$BASE_URL/auth/check-email" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL_TEST\"}" | jq .

# Test 4: Essayer s'inscrire avec le même email (doit échouer)
echo -e "\n${BLUE}Test 4: Essayer s'inscrire avec le même email (doit échouer)${NC}"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Another User\",
    \"email\": \"$EMAIL_TEST\",
    \"password\": \"AnotherPassword123!\"
  }" | jq .

# Test 5: Connexion avec le bon mot de passe
echo -e "\n${BLUE}Test 5: Connexion avec le bon mot de passe${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL_TEST\",
    \"password\": \"TestPassword123!\"
  }")

echo "$LOGIN_RESPONSE" | jq .

LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

# Test 6: Connexion avec le mauvais mot de passe
echo -e "\n${BLUE}Test 6: Connexion avec le mauvais mot de passe (doit échouer)${NC}"
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL_TEST\",
    \"password\": \"WrongPassword123!\"
  }" | jq .

# Test 7: Obtenir le profil avec token
echo -e "\n${BLUE}Test 7: Obtenir le profil avec token valide${NC}"
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $LOGIN_TOKEN" | jq .

# Test 8: Essayer accéder au profil sans token
echo -e "\n${BLUE}Test 8: Essayer accéder au profil sans token (doit échouer)${NC}"
curl -s -X GET "$BASE_URL/auth/me" | jq .

# Test 9: Essayer accéder au profil avec token invalide
echo -e "\n${BLUE}Test 9: Essayer accéder au profil avec token invalide (doit échouer)${NC}"
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer invalid.token.here" | jq .

# Test 10: Logout
echo -e "\n${BLUE}Test 10: Logout${NC}"
curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $LOGIN_TOKEN" | jq .

echo -e "\n${GREEN}✅ Tous les tests sont terminés!${NC}"
