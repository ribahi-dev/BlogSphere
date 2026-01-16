# 📚 Documentation Backend Symfony - Rapport du Projet

**Projet**: Goal Achiever Pal - Blog avec Authentification OAuth & JWT  
**Date**: Janvier 2026  
**Framework**: Symfony 7.4  
**Langage**: PHP 8.2+

---

## 📋 Table des matières

1. [Architecture Générale](#architecture-générale)
2. [Structure du Projet](#structure-du-projet)
3. [Authentification](#authentification)
4. [Services](#services)
5. [Endpoints API](#endpoints-api)
6. [Configuration](#configuration)
7. [Exécution et Test](#exécution-et-test)
8. [Flux de Fonctionnement](#flux-de-fonctionnement)

---

## 🏗️ Architecture Générale

Le backend est construit selon une **architecture en couches Symfony** :

```
┌─────────────────────────────────────┐
│         Frontend (React)             │ (localhost:5173)
├─────────────────────────────────────┤
│    HTTP Requests / JSON Response    │
├─────────────────────────────────────┤
│       API Routes (@Route)            │
│       ↓                              │
│    AuthController                    │ (Reçoit les requêtes)
│       ↓                              │
│    Services (JWT, GoogleOAuth)       │ (Logique métier)
│       ↓                              │
│    Entities (User, OAuthToken)       │ (Modèles BD)
│       ↓                              │
│    Doctrine ORM                      │ (Requêtes BD)
├─────────────────────────────────────┤
│      SQLite Database                 │ (Données persistantes)
└─────────────────────────────────────┘
```

---

## 📁 Structure du Projet

```
backend/
├── bin/
│   └── console              # Commandes Symfony (migrations, cache, etc.)
├── config/
│   ├── packages/
│   │   ├── nelmio_cors.yaml        # Configuration CORS (autoriser requêtes cross-origin)
│   │   └── framework.yaml           # Framework Symfony
│   ├── services.yaml                # Configuration des services (DI/Injection de dépendances)
│   ├── routes.yaml                  # Routes API
│   └── security.yaml                # Configuration sécurité
├── migrations/
│   └── Version*.php                 # Migrations Doctrine (gestion versions BD)
├── public/
│   └── index.php                    # Point d'entrée (Front Controller)
├── src/
│   ├── Controller/
│   │   └── AuthController.php       # Endpoints authentification
│   ├── Entity/
│   │   ├── User.php                 # Modèle utilisateur
│   │   └── OAuthToken.php           # Modèle tokens OAuth
│   ├── Repository/
│   │   └── UserRepository.php       # Requêtes BD pour User
│   ├── Service/
│   │   ├── JwtService.php           # Service pour gérer JWT (génération/validation)
│   │   └── GoogleOAuthService.php   # Service pour Google OAuth
│   └── Kernel.php                   # Bootstrap application
├── var/
│   ├── cache/                       # Cache Symfony
│   └── data.db                      # Base de données SQLite
├── .env                             # Variables d'environnement (fichier template)
├── .env.local                       # Variables d'environnement locales (secrets)
├── composer.json                    # Dépendances PHP
└── composer.lock                    # Lock file pour versions exactes
```

---

## 🔐 Authentification

### 1️⃣ JWT (JSON Web Token)

**Qu'est-ce que JWT ?**
C'est un standard sécurisé pour représenter les revendications de manière compacte et auto-contenue.

**Structure d'un JWT**:
```
header.payload.signature

Exemple:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOjEsImVtYWlsIjoicGllcnJlQGV4ZW1wbGUuY29tIiwiaWF0IjoxNjczMzI1MzMzLCJleHAiOjE2NzM5MzAxMzN9.
hQWGSaFpvbrXkOWc7lq-U3Rm1j1sGCT1-Vqj5c1kZzY
```

**Flux JWT**:
```
1. Utilisateur s'inscrit/connecte
    ↓
2. Backend reçoit email/password
    ↓
3. Vérifie les credentials
    ↓
4. Génère un JWT token
    ↓
5. Envoie le token au frontend
    ↓
6. Frontend stocke le token dans localStorage
    ↓
7. À chaque requête, frontend envoie: Authorization: Bearer <token>
    ↓
8. Backend valide le token avant de traiter la requête
```

**Service JWT** (`JwtService.php`):
```php
- generateToken(User $user)      // Crée un JWT pour un utilisateur
- validateToken(string $token)   // Valide et décrypte un token
- extractTokenFromHeader()       // Extrait le token du header Authorization
```

**Clé secrète**: Stockée dans `APP_SECRET` du `.env.local` (jamais publique!)

---

### 2️⃣ Google OAuth 2.0

**Qu'est-ce que OAuth ?**
Standard qui permet aux utilisateurs de se connecter via un service tiers (Google) sans partager leur mot de passe.

**Flux OAuth Google**:
```
1. Utilisateur clique "Continuer avec Google"
    ↓
2. Frontend redirige vers Google:
   https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...
    ↓
3. Utilisateur s'authentifie chez Google
    ↓
4. Google redirige vers backend avec code d'autorisation:
   http://localhost:8000/api/auth/google/callback?code=...
    ↓
5. Backend échange le code pour un access_token Google
    ↓
6. Backend récupère les infos de l'utilisateur (email, name) via Google API
    ↓
7. Backend crée/met à jour l'utilisateur en BD
    ↓
8. Backend génère un JWT token
    ↓
9. Backend redirige le frontend avec le token:
   http://localhost:5173/?token=...
    ↓
10. Frontend stocke le token dans localStorage
    ↓
11. Utilisateur est maintenant connecté
```

**Service GoogleOAuth** (`GoogleOAuthService.php`):
```php
- exchangeCodeForTokens(string $code)    // Échange code Google pour tokens
- getUserInfo(string $accessToken)       // Récupère infos utilisateur Google
```

---

## 🛠️ Services

### JwtService.php

**Responsabilités**:
- Générer des tokens JWT sécurisés
- Valider les tokens à l'arrivée
- Vérifier l'expiration des tokens
- Extraire le token du header Authorization

**Dépendances**:
- `Lcobucci\JWT` - Bibliothèque JWT professionnelle

**Configuration**:
```yaml
# services.yaml
App\Service\JwtService:
    arguments:
        $jwtSecret: '%env(APP_SECRET)%'          # Clé secrète
        $jwtExpiration: '%env(JWT_EXPIRATION)%'  # Durée en jours
```

---

### GoogleOAuthService.php

**Responsabilités**:
- Communiquer avec les serveurs Google
- Échanger les codes contre des tokens
- Récupérer les infos utilisateur

**Configuration**:
```yaml
# services.yaml
App\Service\GoogleOAuthService:
    arguments:
        $googleClientId: '%env(GOOGLE_CLIENT_ID)%'
        $googleClientSecret: '%env(GOOGLE_CLIENT_SECRET)%'
        $googleRedirectUri: '%env(GOOGLE_REDIRECT_URI)%'
```

---

## 📡 Endpoints API

### Authentification

#### 1. **POST /api/auth/register** - Inscription

**Requête**:
```json
{
  "name": "Pierre Dupont",
  "email": "pierre@exemple.com",
  "password": "MotDePasse123!"
}
```

**Réponse (201 Created)**:
```json
{
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "pierre@exemple.com",
    "name": "Pierre Dupont"
  }
}
```

**Processus interne**:
1. Valide que email, password, name sont fournis
2. Vérifie que l'email n'existe pas
3. Crée nouvel utilisateur
4. **Hache le mot de passe** avec Argon2 (sécurisé)
5. Sauvegarde en BD
6. Génère JWT token
7. Retourne le token

---

#### 2. **POST /api/auth/login** - Connexion

**Requête**:
```json
{
  "email": "pierre@exemple.com",
  "password": "MotDePasse123!"
}
```

**Réponse (200 OK)**:
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "pierre@exemple.com",
    "name": "Pierre Dupont"
  }
}
```

**Processus interne**:
1. Cherche l'utilisateur par email
2. Si trouvé, vérifie le mot de passe (compare avec le hash)
3. Si correct, génère JWT token
4. Retourne le token

---

#### 3. **GET /api/auth/google/callback** - Callback Google

**Paramètres (depuis Google)**:
```
?code=4/0AX4XfWg...&state=...
```

**Réponse (302 Redirect)**:
```html
Redirection vers http://localhost:5173/ avec localStorage.setItem('auth_token', token)
```

**Processus interne**:
1. Reçoit le code d'autorisation de Google
2. Échange le code pour access_token Google
3. Récupère infos utilisateur (googleId, email, name)
4. Cherche l'utilisateur par googleId
5. Si n'existe pas, crée nouvel utilisateur
6. Si existe, met à jour ses infos
7. Génère JWT token
8. Redirige le frontend avec le token

---

#### 4. **GET /api/auth/me** - Profil Utilisateur

**En-têtes requis**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse (200 OK)**:
```json
{
  "id": 1,
  "email": "pierre@exemple.com",
  "name": "Pierre Dupont",
  "roles": ["ROLE_USER"]
}
```

**Processus interne**:
1. Extrait le token du header Authorization
2. Valide le token JWT
3. Extrait l'ID utilisateur du token
4. Charge l'utilisateur de la BD
5. Retourne les infos

---

#### 5. **POST /api/auth/check-email** - Vérifier Email

**Requête**:
```json
{
  "email": "pierre@exemple.com"
}
```

**Réponse (200 OK)**:
```json
{
  "exists": true
}
```

**Utilité**: Valider l'email avant inscription sans créer d'utilisateur

---

#### 6. **POST /api/auth/logout** - Déconnexion

**Réponse (200 OK)**:
```json
{
  "message": "Logout successful. Please remove the token from localStorage."
}
```

**Note**: Le logout est côté frontend (suppression du localStorage). Le token expire naturellement après 7 jours.

---

## ⚙️ Configuration

### Variables d'environnement (`.env.local`)

```dotenv
# Environnement
APP_ENV=dev                                          # dev ou prod
APP_SECRET=your-secret-key-change-in-production     # Clé secrète (jamais en dur!)

# Base de données
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"  # SQLite local

# CORS
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'

# Frontend
FRONTEND_URL=http://localhost:5173                   # URL du frontend

# JWT
JWT_EXPIRATION=7                                     # Durée token en jours

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### Configuration CORS (`config/packages/nelmio_cors.yaml`)

```yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['%env(CORS_ALLOW_ORIGIN)%']           # Origines autorisées
        allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE']
        allow_headers: ['Content-Type', 'Authorization']     # Headers autorisés
        expose_headers: ['Link']
        max_age: 3600                                         # Cache preflight 1h
    paths:
        '^/': null                                            # Applique à tous les paths
```

**Pourquoi CORS ?**
- Frontend = http://localhost:5173
- Backend = http://localhost:8000
- Les navigateurs bloquent les requêtes cross-origin par défaut
- CORS déverrouille cette restriction

---

## 🚀 Exécution et Test

### Démarrer le Backend

```bash
cd backend

# Option 1: Avec Symfony CLI (recommandé)
symfony serve --port=8000

# Option 2: Avec PHP intégré
php bin/console server:run --port=8000
```

Le backend tourne à `http://localhost:8000`

### Vérifier que le serveur fonctionne

```bash
curl http://localhost:8000/api/auth/me
# Response: {"error": "Missing token"}  ✅ = Serveur répond
```

### Tester avec Postman/Curl

#### Teste Inscription
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pierre",
    "email": "pierre@test.com",
    "password": "Pass123!"
  }'
```

#### Test Connexion
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pierre@test.com",
    "password": "Pass123!"
  }'
```

#### Test Profil (avec token)
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔄 Flux de Fonctionnement Complet

### Scénario 1: Inscription avec Email/Password

```
┌─────────────────┐
│    Frontend     │
│  React/TypeScript│
└────────┬────────┘
         │ 1. Utilisateur remplit formulaire
         │    et clique "S'inscrire"
         │
         ├──────→ POST /api/auth/register
         │        { name, email, password }
         │
┌────────┴─────────────────────┐
│   AuthController             │
│  register()                  │
├──────────────────────────────┤
│ 2. Valide les données        │
│ 3. Cherche user par email    │
│ 4. Si existe: erreur 409     │
│ 5. Sinon: crée nouvel user   │
│ 6. Hache password (Argon2)   │
│ 7. Sauvegarde en BD          │
│ 8. Génère JWT token          │
└────────┬─────────────────────┘
         │
         ├──────→ { token, user, message }
         │
┌────────┴────────┐
│    Frontend     │
│                 │
│ 9. localStorage │
│    .setItem(    │
│    'auth_token',│
│    token)       │
│                 │
│ 10. Redirige    │
│     vers Home   │
└─────────────────┘
```

### Scénario 2: Connexion avec Google OAuth

```
┌──────────────────┐
│     Frontend     │
│   React/TypeScript│
└────────┬─────────┘
         │ 1. Clique "Continuer avec Google"
         │
         ├──────→ Redirige vers Google
         │        https://accounts.google.com/o/oauth2/v2/auth?
         │        client_id=...&redirect_uri=...
         │
    ┌────┴─────────────────────┐
    │   Google Servers         │
    │                          │
    │ 2. Utilisateur s'auth    │
    │ 3. Google génère code    │
    │ 4. Redirige vers backend │
    └────┬──────────────────────┘
         │
         ├──────→ GET /api/auth/google/callback?code=...
         │
┌────────┴──────────────────────────────┐
│     AuthController                    │
│   googleCallback()                    │
├───────────────────────────────────────┤
│ 5. Reçoit code                        │
│ 6. Valide le code                     │
│ 7. Échange code → Google access_token │
│ 8. Récupère infos user (sub, email)   │
│ 9. Cherche user par googleId          │
│ 10. Si n'existe pas: crée user        │
│ 11. Sinon: met à jour                 │
│ 12. Génère JWT token                  │
│ 13. Redirige avec token en HTML       │
└────────┬──────────────────────────────┘
         │
         ├──────→ HTML page + localStorage.setItem(token)
         │
┌────────┴────────┐
│    Frontend     │
│                 │
│ 14. localStorage│
│     a le token  │
│ 15. Redirige    │
│     vers Home   │
└─────────────────┘
```

### Scénario 3: Requête Authentifiée

```
┌─────────────────┐
│    Frontend     │
│  React/TypeScript│
│                 │
│ 1. Veut charger │
│    profil user  │
└────────┬────────┘
         │
         ├──────→ GET /api/auth/me
         │        Header: Authorization: Bearer token
         │
┌────────┴──────────────────────────────┐
│     AuthController                    │
│   getMe()                             │
├───────────────────────────────────────┤
│ 2. Extrait token du header            │
│ 3. Valide le token JWT:               │
│    - Vérifie signature                │
│    - Vérifie expiration               │
│ 4. Si invalide: 401 Unauthorized      │
│ 5. Extrait ID user du token           │
│ 6. Charge user de la BD               │
│ 7. Retourne infos user                │
└────────┬──────────────────────────────┘
         │
         ├──────→ { id, email, name, roles }
         │
┌────────┴────────┐
│    Frontend     │
│                 │
│ 8. Affiche      │
│    le profil    │
└─────────────────┘
```

---

## 🔒 Sécurité

### Bonnes Pratiques Implémentées

| Aspect | Implémentation |
|--------|-----------------|
| **Hachage Password** | Argon2 (via Symfony Security) |
| **JWT Secret** | Stocké en variable d'env, jamais hardcodé |
| **CORS** | Configuré pour autoriser seulement localhost |
| **Authorization Header** | Validé à chaque requête |
| **Token Expiration** | 7 jours (configurable) |
| **Erreurs** | Messages génériques (ne révèle pas si email existe) |
| **HTTPS** | À activer en production |

### À Faire en Production

```diff
+ HTTPS obligatoire (SSL certificate)
+ APP_SECRET très complexe et aléatoire
+ JWT_EXPIRATION plus court (1 jour)
+ Implementer refresh tokens
+ Logging des tentatives échouées
+ Rate limiting sur endpoints auth
+ Vérification email (confirmation par lien)
+ 2FA (Two-Factor Authentication)
+ Rotation des secrets régulièrement
```

---

## 📊 Modèle de Données

### Entity User

```php
class User
{
    private ?int $id = null;
    private ?string $email = null;
    private array $roles = [];
    private ?string $password = null;       // Hachée
    private ?string $name = null;
    private ?\DateTimeImmutable $createdAt = null;
    private ?string $googleId = null;       // Pour OAuth
}
```

**Table BD**:
```sql
CREATE TABLE `user` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(180) UNIQUE NOT NULL,
  roles JSON NOT NULL DEFAULT '[]',
  password VARCHAR(255),
  name VARCHAR(255),
  created_at DATETIME IMMUTABLE,
  google_id VARCHAR(255)
);
```

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| **CORS Error** | Vérifier CORS_ALLOW_ORIGIN dans .env.local |
| **Token Invalid** | Vérifier APP_SECRET identique frontend/backend |
| **Email Exists Error** | Email déjà utilisé, utiliser autre ou récupérer password |
| **Google OAuth Fails** | Vérifier GOOGLE_CLIENT_ID/SECRET dans .env.local |
| **Database Lock** | Supprimer `var/data.db` et relancer migrations |
| **Port 8000 Occupé** | `symfony serve --port=8001` |

---

## 📚 Ressources

- **Symfony Docs**: https://symfony.com/doc/
- **JWT.io**: https://jwt.io/
- **Lcobucci JWT**: https://github.com/lcobucci/jwt
- **Google OAuth 2.0**: https://developers.google.com/identity/protocols/oauth2
- **CORS**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## ✅ Checklist d'Implémentation

- [x] Installation Symfony 7.4
- [x] Configuration JWT (Lcobucci)
- [x] Service JwtService pour gérer tokens
- [x] Service GoogleOAuthService
- [x] Entity User avec UserInterface
- [x] AuthController complet
- [x] Endpoints: register, login, google/callback, /me, check-email, logout
- [x] Hachage password sécurisé
- [x] CORS configuré
- [x] Migrations Doctrine
- [x] Variables d'environnement
- [x] Validation des tokens sur requêtes authentifiées
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Documentation Postman/Swagger
- [ ] Déploiement en production

---

**Fin de la documentation - Dernière mise à jour: Janvier 2026**
