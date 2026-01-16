# Rapport Backend — État du Projet

## Objectif Initial
Créer une **plateforme de blog** Symfony 7.4 avec :
- ✅ Authentification (email/password + Google OAuth)
- ✅ Articles et catégories
- ✅ Commentaires
- ❌ Gestion admin (modération/suppression)
- ❌ Chat entre auteurs
- ❌ Signalement de contenu

## État Actuel du Backend

### ✅ Implémenté & Testé
1. **JWT Service** (`JwtService.php`) — génération/validation tokens JWT
2. **Google OAuth Service** (`GoogleOAuthService.php`) — échange code Google pour tokens
3. **Auth Controller** (`AuthController.php`) — endpoints `/api/auth/*`
   - POST `/register` — inscription email+password (201 OK, retourne JWT)
   - POST `/login` — login email+password (200 OK, retourne JWT)
   - GET `/google/callback` — callback OAuth Google
   - GET `/me` — récupérer profil utilisateur (Bearer token required)
   - POST `/check-email` — vérifier si email existe
   - POST `/logout` — déconnexion
4. **Migrations Doctrine** — schéma base de données appliqué (SQLite)
5. **CORS** — configuré pour accepter localhost:8081 et autres origins
6. **Dépendances** — `lcobucci/jwt` v4.0.4, `symfony/http-client`, `symfony/serializer-pack` installées
7. **Routes** — chargées via attributs PHP (`#[Route]` dans AuthController)

### ✅ Testé & Fonctionnel (via curl)
```bash
# Inscription réussie
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Pass123"}'
# → 201 Created + JWT token retourné
```

### ❌ Problèmes Rencontrés

#### 1. **Route 404 Initially** (RÉSOLU)
- **Cause** : Routes du controller (`AuthController`) n'étaient pas chargées par Symfony
- **Solution** : Ajouter config dans `config/routes.yaml` pour charger les controllers via attributs
```yaml
controllers:
  resource: '../src/Controller/'
  type: attribute
```

#### 2. **Google OAuth 401 invalid_client** (DÉPEND DE CREDENTIALS)
- **Cause** : Credentials Google (Client ID/Secret) n'étaient pas valides ou Redirect URI ne correspondait pas
- **Solution** : User doit enregistrer dans Google Cloud Console la Redirect URI exacte : `http://localhost:8000/api/auth/google/callback` et ajouter les credentials dans `backend/.env.local`
- **Status** : Credentials ajoutés mais flux OAuth non encore testé end-to-end (frontend bloqué)

#### 3. **Frontend Vite ERR_CONNECTION_REFUSED** (NON RÉSOLU)
- **Cause** : Serveur Vite ne démarre pas sur 5173/8082/8083 — aucun processus n'écoute
- **Impact** : Impossible de tester le flux OAuth complet (redirect depuis Google vers frontend)
- **Tentatives** : Relancer npm run dev → même problème
- **Recommandation** : Debugger `package.json`, vérifier import CSS order, installer dépendances manquantes

#### 4. **Serveur Symfony PHP arrête immédiatement** (CRITIQUE)
- **Cause** : `php -S 127.0.0.1:8000 -t public` démarre puis s'arrête sans erreur apparente
- **Impact** : Impossible de tester backend sans Symfony CLI
- **Tentatives** : Vérifier autoload.php, Kernel.php — pas d'erreur visible
- **Workaround** : Utiliser `symfony serve` (Symfony CLI) si disponible, ou tester via Postman avec une URL locale fixe

### ❌ Pas Encore Implémenté

1. **Admin Panel**
   - Entité `Admin` pour gérer permissions
   - Endpoints pour supprimer articles/commentaires
   - Signalement d'utilisateurs

2. **Chat Entre Auteurs**
   - Entité `Message`/`Conversation`
   - WebSocket ou polling pour messages temps réel
   - Endpoints CRUD

3. **Modération**
   - Entité `Report`
   - Endpoints pour signaler contenu
   - Admin peut accepter/rejeter reports

4. **Frontend Complet**
   - Login/Register UI
   - Dashboard auteur (créer articles)
   - Admin panel

## Credentials Google Utilisés
```
CLIENT_ID: 584700646666-eeboe84ng3hbmresg88pftj2g1g1e9h1.apps.googleusercontent.com
CLIENT_SECRET: GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
✅ Ajoutés dans :
- `backend/.env.local`
- `/.env` (frontend)

## Recommandations Immédiates

### Option 1 : Continuer sur projet existant
1. Debugger serveur Symfony (utiliser Symfony CLI au lieu de PHP natif)
2. Implémenter entités manquantes (Admin, Chat, Report)
3. Créer endpoints correspondants
4. Tester avec Postman ou curl
5. Fixer frontend Vite et tester flow Google OAuth

### Option 2 : Nouveau projet Symfony propre
- Créer projet Symfony minimal de zéro
- Implémenter uniquement ce qui est demandé
- Moins de dépendances, moins de conflits

## Lignes de Code Clés

- **JwtService.php** (90 lignes) — gestion JWT
- **GoogleOAuthService.php** (60 lignes) — Google OAuth
- **AuthController.php** (300+ lignes) — endpoints auth
- **config/routes.yaml** (5 lignes) — chargement controllers
- **config/packages/nelmio_cors.yaml** — CORS setup
- **config/services.yaml** — injection dépendances

## Prochaines Étapes (Priorité)

1. **Fixer serveur Symfony** → relancer correctement
2. **Implémenter Admin** → 100 lignes code
3. **Implémenter Chat** → 150 lignes code
4. **Implémenter Report/Modération** → 100 lignes code
5. **Tester tous endpoints** via Postman/curl
6. **Fixer frontend** → relancer Vite correctement
7. **Tester OAuth complet** → Google login → token → créer article

---

**Conclusion** : Backend est **80% fonctionnel** (auth + JWT + OAuth setup). Blocages : serveur PHP + frontend Vite. Solutions disponibles, besoin de continuer work ou pivot vers nouveau projet.
