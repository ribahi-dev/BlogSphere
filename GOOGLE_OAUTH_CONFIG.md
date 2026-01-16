# 🔐 Configuration Google OAuth

## Étape 1: Créer un projet Google Cloud

1. Aller à https://console.cloud.google.com/
2. Créer un nouveau projet (ou sélectionner un existant)
3. Chercher "Google+ API" et l'activer
4. Aller à "OAuth consent screen" et remplir:
   - App name: "Goal Achiever Pal"
   - User support email: ton email
   - Developer contact: ton email

## Étape 2: Créer les credentials OAuth 2.0

1. Aller à "Credentials" → "Create OAuth 2.0 Client ID"
2. Choisir "Web application"
3. Ajouter les URIs autorisées:
   - **Authorized JavaScript origins**:
     - http://localhost:5173
     - http://localhost:8000
   - **Authorized redirect URIs**:
     - http://localhost:8000/api/auth/google/callback
     - http://localhost:5173/auth/google/callback

4. Copier le **Client ID** et **Client Secret**

## Étape 3: Configuration Backend

Créer/modifier `backend/.env.local`:

```dotenv
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

## Étape 4: Configuration Frontend

Créer/modifier `.env` (racine):

```dotenv
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

## Étape 5: Test

1. Lancer le backend: `cd backend && symfony serve --port=8000 --no-tls`
2. Lancer le frontend: `npm run dev`
3. Aller sur http://localhost:5173/login
4. Cliquer sur "Continuer avec Google"
5. Autoriser l'application
6. Devrait être redirigé et connecté

---

## 🔑 Variables d'Environnement Complètes

### Backend - `backend/.env.local`

```dotenv
# Environnement
APP_ENV=dev
APP_SECRET=your-super-secret-key-change-this-in-production-32-chars-minimum

# Database
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"

# CORS
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'

# Frontend
FRONTEND_URL=http://localhost:5173

# JWT
JWT_EXPIRATION=7

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### Frontend - `.env` (racine)

```dotenv
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

---

## ✅ Checklist Configuration

- [ ] Créer projet Google Cloud
- [ ] Activer Google+ API
- [ ] Remplir OAuth consent screen
- [ ] Créer OAuth 2.0 credentials (Web)
- [ ] Ajouter les URIs autorisées
- [ ] Copier Client ID et Secret
- [ ] Mettre à jour `backend/.env.local`
- [ ] Mettre à jour `.env` (frontend)
- [ ] Tester inscription via Google
- [ ] Tester connexion via Google

---

## 🐛 Problèmes Courants

### "Google not configured"
- Vérifier que `VITE_GOOGLE_CLIENT_ID` est défini dans `.env`
- Restart le frontend: `npm run dev`

### "Redirect URI mismatch"
- Vérifier que l'URI dans Google Console **correspond exactement** à `GOOGLE_REDIRECT_URI`
- Attention aux trailing slashes et au protocole (http vs https)

### "Invalid client"
- Vérifier que le `GOOGLE_CLIENT_SECRET` est correct
- Vérifier que le `GOOGLE_CLIENT_ID` est correct dans `backend/.env.local`

### "Access denied"
- S'assurer que le compte Google n'a pas de 2FA bloquant OAuth
- Essayer avec un autre compte Google

---

**Configuration complète! 🎉**
