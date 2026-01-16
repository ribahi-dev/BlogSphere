# 🧪 Exemples de Tests API

Cet fichier contient des exemples pour tester tous les endpoints avec curl ou Postman.

---

## Base URL

```
http://localhost:8000/api
```

---

## 1️⃣ Inscription (POST /auth/register)

### Curl

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pierre Dupont",
    "email": "pierre@example.com",
    "password": "MyPassword123!"
  }'
```

### Réponse 201 Created

```json
{
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicGllcnJlQGV4YW1wbGUuY29tIiwibmFtZSI6IlBpZXJyZSBEdXBvbnQiLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNjczODk2NTM3LCJleHAiOjE2NzQ1MDEzMzd9.xxx",
  "user": {
    "id": 1,
    "email": "pierre@example.com",
    "name": "Pierre Dupont"
  }
}
```

### Postman

- **Method**: POST
- **URL**: http://localhost:8000/api/auth/register
- **Body** (raw JSON):
  ```json
  {
    "name": "Pierre Dupont",
    "email": "pierre@example.com",
    "password": "MyPassword123!"
  }
  ```

---

## 2️⃣ Connexion (POST /auth/login)

### Curl

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pierre@example.com",
    "password": "MyPassword123!"
  }'
```

### Réponse 200 OK

```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "pierre@example.com",
    "name": "Pierre Dupont"
  }
}
```

### Erreur 401 Unauthorized

```json
{
  "error": "Email ou mot de passe incorrect"
}
```

---

## 3️⃣ Obtenir Profil (GET /auth/me)

### Curl

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Réponse 200 OK

```json
{
  "id": 1,
  "email": "pierre@example.com",
  "name": "Pierre Dupont",
  "roles": ["ROLE_USER"]
}
```

### Erreur 401 (Token manquant ou invalide)

```json
{
  "error": "Missing token"
}
```

### Postman

- **Method**: GET
- **URL**: http://localhost:8000/api/auth/me
- **Headers**:
  - Key: `Authorization`
  - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 4️⃣ Vérifier si Email Existe (POST /auth/check-email)

### Curl

```bash
curl -X POST http://localhost:8000/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pierre@example.com"
  }'
```

### Réponse 200 OK

```json
{
  "exists": true
}
```

### Si email n'existe pas

```json
{
  "exists": false
}
```

---

## 5️⃣ Google OAuth Callback (GET /auth/google/callback)

### Curl (Normalement pas nécessaire - Google redirige)

```bash
# Simuler le callback de Google avec code d'autorisation
curl -X GET "http://localhost:8000/api/auth/google/callback?code=4/0AX4XfWg..." \
  -L  # Suivre la redirection
```

### Flux Réel

1. Frontend redirige vers Google
2. Google redirige vers ce endpoint avec `?code=...`
3. Backend échange le code pour tokens Google
4. Backend redirige frontend avec token JWT en localStorage

---

## 6️⃣ Déconnexion (POST /auth/logout)

### Curl

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### Réponse 200 OK

```json
{
  "message": "Logout successful. Please remove the token from localStorage."
}
```

---

## 🧪 Tests Complets (Scénario)

### Scénario 1: Inscription et Accès au Profil

```bash
#!/bin/bash

# 1. S'inscrire
RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }')

echo "Response: $RESPONSE"

# Extraire le token (jq requis)
TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

# 2. Utiliser le token pour accéder au profil
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Scénario 2: Connecter et Vérifier

```bash
#!/bin/bash

# 1. Connexion
RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')

# 2. Accéder au profil
curl -s -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## ⚠️ Codes de Réponse

| Code | Sens | Exemple |
|------|------|---------|
| **200 OK** | Requête réussie | Login, /me |
| **201 Created** | Ressource créée | Register |
| **400 Bad Request** | Données invalides | Email vide |
| **401 Unauthorized** | Auth échouée | Token expiré |
| **409 Conflict** | Ressource existe | Email déjà utilisé |
| **500 Server Error** | Erreur serveur | Exception |

---

## 🔑 Récupérer le Token de Test

### Depuis la Réponse de Register

```bash
curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "password": "Test123!"
  }' | jq '.token'

# Output:
# "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Stocker dans une Variable (Bash)

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "password": "Test123!"
  }' | jq -r '.token')

echo $TOKEN
```

---

## 🔍 Décoder un JWT (Pour Debug)

Token JWT: `header.payload.signature`

### Online
Aller à: https://jwt.io/

Coller votre token dans le "Encoded" input

### Avec jq

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicGllcnJlQGV4YW1wbGUuY29tIiwibmFtZSI6IlBpZXJyZSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE2NzM4OTY1MzcuImV4cCI6MTY3NDUwMTMzN30.xxx"

# Extraire le payload
echo $TOKEN | cut -d. -f2 | base64 -d | jq .

# Output:
# {
#   "sub": 1,
#   "email": "pierre@example.com",
#   "name": "Pierre",
#   "roles": ["ROLE_USER"],
#   "iat": 1673896537,
#   "exp": 1674501337
# }
```

---

## 📋 Checklist de Test

- [ ] ✅ Register crée un utilisateur
- [ ] ✅ Register retourne un token valide
- [ ] ✅ Login fonctionne avec bons credentials
- [ ] ✅ Login échoue avec mauvais password
- [ ] ✅ /me retourne les infos avec token valide
- [ ] ✅ /me échoue sans token
- [ ] ✅ /me échoue avec token expiré
- [ ] ✅ check-email retourne exists: true/false
- [ ] ✅ Pas possible de s'inscrire avec email existant
- [ ] ✅ Google OAuth flow fonctionne
- [ ] ✅ Token expiré après 7 jours

---

## 💡 Tips

- Installer `jq` pour parser JSON dans le terminal
  ```bash
  # Ubuntu/Debian
  sudo apt-get install jq
  
  # macOS
  brew install jq
  ```

- Créer un alias pour les tests
  ```bash
  alias curl_test='curl -H "Content-Type: application/json"'
  ```

- Exporter les variables d'environnement
  ```bash
  export BASE_URL="http://localhost:8000/api"
  export TOKEN="your-token-here"
  
  curl -X GET $BASE_URL/me -H "Authorization: Bearer $TOKEN"
  ```

---

**Fin des exemples de test**
