#!/bin/bash

# Test complet du flux API: LOGIN → CREATE → PUBLISH

echo "🔐 ÉTAPE 1: LOGIN"
echo "================="
curl -s -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Password123"}' > login.json

TOKEN=$(sed -n 's/.*"token":"\([^"]*\)".*/\1/p' login.json)
USER_TYPE=$(sed -n 's/.*"userType":"\([^"]*\)".*/\1/p' login.json)

if [ -z "$TOKEN" ]; then
  echo "❌ ERREUR: Impossible de se connecter"
  exit 1
fi

echo "✅ Connecté avec succès"
echo "   Token: ${TOKEN:0:30}..."
echo "   UserType: $USER_TYPE"
echo ""

echo "📝 ÉTAPE 2: CRÉER UN ARTICLE"
echo "=============================="
curl -s -X POST http://127.0.0.1:8000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Article Test $(date +%s)\",\"description\":\"Test description\",\"content\":\"Contenu de test\"}" > article.json

ARTICLE_ID=$(sed -n 's/.*"id":\([0-9]*\).*/\1/p' article.json)

if [ -z "$ARTICLE_ID" ]; then
  echo "❌ ERREUR: Impossible de créer l'article"
  cat article.json
  exit 1
fi

echo "✅ Article créé avec succès"
echo "   ID: $ARTICLE_ID"
echo ""

echo "🚀 ÉTAPE 3: PUBLIER L'ARTICLE"
echo "=============================="
curl -s -X POST http://127.0.0.1:8000/api/articles/$ARTICLE_ID/publish \
  -H "Authorization: Bearer $TOKEN" > publish.json

PUBLISHED=$(sed -n 's/.*"published":\([^,}]*\).*/\1/p' publish.json)

if [ "$PUBLISHED" = "true" ]; then
  echo "✅ Article publié avec succès!"
else
  echo "❌ ERREUR: L'article n'a pas pu être publié"
  cat publish.json
  exit 1
fi

echo ""
echo "🎉 TOUS LES TESTS RÉUSSIS!"
echo ""
echo "Résumé:"
echo "  - Login: ✅ UserType=$USER_TYPE"
echo "  - Create: ✅ Article ID=$ARTICLE_ID"
echo "  - Publish: ✅ Article Published"
