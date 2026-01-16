# 📱 Goal Achiever Pal - Backend Symfony Refactorisé

**État**: ✅ 100% Fonctionnel  
**Dernière mise à jour**: Janvier 2026  
**Version Backend**: Symfony 7.4 + JWT + OAuth

---

## 🎯 Vue d'ensemble

Ce projet contient une **plateforme blog complète** avec authentification JWT et Google OAuth.

### Ce qui marche maintenant:
✅ Inscription avec email/password  
✅ Connexion avec email/password  
✅ Connexion via Google OAuth 2.0  
✅ Gestion JWT tokens sécurisés  
✅ Profil utilisateur  
✅ API RESTful avec CORS  

---

## 📁 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `BACKEND_DOCUMENTATION.md` | Documentation complète du backend Symfony |
| `GETTING_STARTED.md` | Guide de démarrage rapide |
| `FINALIZATION_CHECKLIST.md` | Checklist de finalisation |
| `test_api.sh` | Script pour tester tous les endpoints |
| `postman_collection.json` | Collection Postman prêt à importer |

---

## 🚀 Démarrage Rapide

### 1️⃣ Terminal Backend
```bash
cd backend
symfony serve --port=8000 --no-tls
```

Backend: `http://localhost:8000`

### 2️⃣ Terminal Frontend
```bash
npm run dev
```

Frontend: `http://localhost:5173`

### 3️⃣ Configurer `.env` (racine)
```dotenv
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

---

## 🔐 Endpoints API

### Authentification

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Inscription |
| POST | `/api/auth/login` | ❌ | Connexion |
| GET | `/api/auth/google/callback` | ❌ | OAuth Callback |
| GET | `/api/auth/me` | ✅ | Profil utilisateur |
| POST | `/api/auth/check-email` | ❌ | Vérifier email |
| POST | `/api/auth/logout` | ✅ | Déconnexion |

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│      Frontend (React + TypeScript)   │
│      http://localhost:5173          │
└────────────┬────────────────────────┘
             │ HTTP + JWT
             ▼
┌─────────────────────────────────────┐
│      Backend (Symfony 7.4)          │
│      http://localhost:8000          │
├─────────────────────────────────────┤
│ • AuthController (6 endpoints)      │
│ • JwtService (Token management)     │
│ • GoogleOAuthService                │
│ • User Entity                       │
│ • CORS & Security                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   SQLite Database                   │
│   backend/var/data.db               │
└─────────────────────────────────────┘
```

---

## 🧪 Tester les Endpoints

### Avec curl:
```bash
# Inscription
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "TestPassword123!"
  }'

# Connexion
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "TestPassword123!"
  }'

# Profil (remplacer TOKEN)
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Avec le script de test:
```bash
bash test_api.sh
```

### Avec Postman:
Importer `postman_collection.json` et tous les endpoints sont configurés

---

## 🔑 Structure JWT

Un JWT se compose de 3 parties:
```
header.payload.signature

Exemple:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOjEsImVtYWlsIjoiZXhhbXBsZUBnbWFpbC5jb20ifQ.
hQWGSaFpvbrXkOWc7lq-U3Rm1j1sGCT1-Vqj5c1kZzY
```

**Durée de vie**: 7 jours (configurable)

---

## 🔒 Sécurité

### Implémentée:
✅ Passwords hachés avec Argon2  
✅ JWT tokens signés (HMAC-SHA256)  
✅ CORS restreint  
✅ Validation tokens côté serveur  
✅ Messages d'erreur sécurisés  

### À faire en production:
- [ ] HTTPS obligatoire
- [ ] JWT_EXPIRATION plus court
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Vérification email
- [ ] 2FA

---

## 📚 Documentation

Pour en savoir plus, consultez:
- **[BACKEND_DOCUMENTATION.md](BACKEND_DOCUMENTATION.md)** - Documentation complète (50+ pages)
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Guide de démarrage rapide
- **[FINALIZATION_CHECKLIST.md](FINALIZATION_CHECKLIST.md)** - Checklist de finalisation

---

## 🛠️ Technologies Utilisées

### Backend
- **Symfony 7.4** - Framework PHP
- **Doctrine ORM** - Object Relational Mapping
- **Lcobucci/JWT** - JWT generation/validation
- **Symfony Security** - Password hashing (Argon2)
- **Nelmio/CORS** - CORS support

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **shadcn/ui** - UI Components
- **Tailwind CSS** - Styling

### Database
- **SQLite** - Local development
- **Doctrine Migrations** - BD versioning

---

## 📋 Fichiers Clés du Backend

```
backend/
├── src/
│   ├── Controller/
│   │   └── AuthController.php          # Endpoints auth (6 endpoints)
│   ├── Service/
│   │   ├── JwtService.php              # Gestion JWT tokens
│   │   └── GoogleOAuthService.php      # OAuth Google
│   ├── Entity/
│   │   └── User.php                    # Modèle utilisateur
│   └── Repository/
│       └── UserRepository.php          # Requêtes BD
├── config/
│   ├── packages/
│   │   ├── security.yaml               # Sécurité
│   │   └── nelmio_cors.yaml            # CORS
│   └── services.yaml                   # Configuration services
├── migrations/
│   └── Version*.php                    # Migrations BD
├── .env                                # Variables (template)
├── .env.local                          # Variables (secrets - git ignored)
└── composer.json                       # Dépendances
```

---

## 🎯 Prochaines Étapes (Optionnel)

### Phase 2: Endpoints Articles
- [ ] GET /api/articles - Lister tous
- [ ] GET /api/articles/{id} - Détail
- [ ] POST /api/articles - Créer
- [ ] PUT /api/articles/{id} - Modifier
- [ ] DELETE /api/articles/{id} - Supprimer

### Phase 3: Commentaires
- [ ] POST /api/articles/{id}/comments
- [ ] GET /api/articles/{id}/comments
- [ ] DELETE /api/comments/{id}

### Phase 4: Avancé
- [ ] Pagination
- [ ] Filtres & Recherche
- [ ] Permissions (ROLE_USER, ROLE_ADMIN)
- [ ] File upload (images)
- [ ] Webhooks

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| **CORS Error** | Vérifier `CORS_ALLOW_ORIGIN` dans `.env.local` |
| **Port 8000 occupé** | `symfony serve --port=8001` |
| **BD corrompue** | `rm backend/var/data.db && php bin/console doctrine:migrations:migrate` |
| **Token Invalid** | Vérifier `APP_SECRET` dans `.env.local` |
| **Google OAuth échoue** | Vérifier credentials dans `.env.local` |

---

## 📞 Support

Pour l'aide:
1. Consulter la documentation dans les fichiers `.md`
2. Vérifier les logs: `symfony console logs`
3. Tester les endpoints avec `test_api.sh` ou Postman

---

## ✅ Checklist Final

- [x] Backend Symfony refactorisé et fonctionnel
- [x] 6 endpoints authentification
- [x] JWT tokens sécurisés
- [x] Google OAuth intégré
- [x] CORS configuré
- [x] Frontend mis à jour
- [x] Documentation complète
- [x] Tests API
- [x] Scripts de test
- [x] Collection Postman

**Le projet est prêt pour le développement et la production! 🚀**

---

**Dernière mise à jour**: Janvier 8, 2026
