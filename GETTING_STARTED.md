# 🚀 Guide de Démarrage du Projet

## Configuration Initiale

### 1. Variables d'Environnement Backend

Créer/mettre à jour `backend/.env.local` :

```dotenv
APP_ENV=dev
APP_SECRET=your-super-secret-key-minimum-32-chars
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'

FRONTEND_URL=http://localhost:5173

JWT_EXPIRATION=7

# Remplacer par vos vraies credentials Google
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### 2. Variables d'Environnement Frontend

Créer `.env` à la racine du projet :

```dotenv
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

---

## 🏃 Lancer le Projet

### Terminal 1 - Backend Symfony

```bash
cd backend

# Option 1: Avec Symfony CLI (recommandé)
symfony serve --port=8000

# Option 2: Avec PHP intégré
php bin/console server:run --port=8000
```

Backend disponible à: **http://localhost:8000**

### Terminal 2 - Frontend React

```bash
# À la racine du projet
npm run dev
```

Frontend disponible à: **http://localhost:5173**

---

## ✅ Vérifier que tout marche

### Test Backend

```bash
# Vérifier que le serveur répond
curl http://localhost:8000/api/auth/me
# Réponse attendue: {"error":"Missing token"}

# Test d'inscription
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "TestPassword123!"
  }'

# Sauvegardez le token retourné!
```

### Test Frontend

1. Ouvrir http://localhost:5173
2. Aller sur /login
3. Essayer le login avec les credentials créés en haut

---

## 📝 Endpoints Disponibles

### Authentification

| Méthode | Endpoint | Authentification | Description |
|---------|----------|------------------|-------------|
| POST | `/api/auth/register` | ❌ Non | Inscription email/password |
| POST | `/api/auth/login` | ❌ Non | Connexion email/password |
| GET | `/api/auth/google/callback` | ❌ Non | Callback Google OAuth |
| GET | `/api/auth/me` | ✅ Oui (Token JWT) | Obtenir profil utilisateur |
| POST | `/api/auth/check-email` | ❌ Non | Vérifier si email existe |
| POST | `/api/auth/logout` | ✅ Oui | Déconnexion |

---

## 🔧 Commandes Utiles

```bash
# Migrations
php bin/console doctrine:migrations:status
php bin/console doctrine:migrations:diff
php bin/console doctrine:migrations:migrate

# Cache
php bin/console cache:clear
php bin/console cache:warmup

# Database
php bin/console doctrine:database:create
php bin/console doctrine:database:drop --force
php bin/console doctrine:schema:update --force

# Dev
php bin/console debug:routes          # Voir toutes les routes
php bin/console debug:container       # Voir tous les services
```

---

## 🐛 Problèmes Courants

### Port déjà utilisé
```bash
# Utiliser un port différent
symfony serve --port=8001
```

### Base de données corrompue
```bash
# Supprimer et recréer
rm backend/var/data.db
cd backend && php bin/console doctrine:migrations:migrate
```

### CORS Error
- Vérifier que `CORS_ALLOW_ORIGIN` dans `.env.local` contient `localhost:5173`
- Restart le backend après changement d'env

### Token Expired
- Tokens expirent après 7 jours (configurable via `JWT_EXPIRATION`)
- Utilisateur doit se reconnecter

---

## 📚 Structure des Réponses

### Succès

```json
{
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Full Name"
  }
}
```

### Erreur

```json
{
  "error": "Cet email est déjà utilisé"
}
```

---

## 🔐 Points de Sécurité

✅ Passwords hachés avec Argon2  
✅ JWT token utilisé pour authentifier requêtes  
✅ CORS configuré pour localhost seulement  
✅ Messages d'erreur génériques (ne révèle pas si email existe)  
✅ Tokens expirables  

⚠️ À ajouter en production:
- HTTPS obligatoire
- Refresh tokens
- Rate limiting
- Vérification email
- 2FA

---

## 📊 Architecture

```
Frontend (React) ←→ Backend (Symfony)
   :5173              :8000
                │
          HTTP + JWT
                │
    ┌───────────┴───────────┐
    ↓                       ↓
Login/Register         Google OAuth
    │                       │
    └───────────┬───────────┘
                ↓
         AuthController
                ↓
    ┌──────────────────────┐
    │ JwtService          │
    │ GoogleOAuthService  │
    │ UserRepository      │
    └──────────────────────┘
                ↓
          SQLite DB
```

---

**Tout prêt à partir! Happy coding! 🚀**
