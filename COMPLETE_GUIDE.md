# 🎉 GESTION DE PROFIL UTILISATEUR EN TEMPS RÉEL - GUIDE COMPLET

## 📋 Vue d'Ensemble

**Votre Demande**: "Je veux pouvoir changer et modifier les données de compte quand je me connecte avec un compte auteur et tout stocker dans la base de données comme une application réelle qui fonctionne en temps réel."

**Solution Livrée**: ✅ Système complet de gestion de profil avec:
- Modification du profil (nom, bio, avatar)
- Changement de mot de passe sécurisé
- Affichage des articles et statistiques
- Persistance temps réel en base de données
- Interface utilisateur professionnelle
- Authentification JWT
- Validations côté client et serveur

---

## 🚀 Démarrage Rapide

### 1. Préparation

```bash
# 1. Ouvrir deux terminaux

# Terminal 1 - Backend
cd "c:\Users\elmeh\Desktop\projet php\backend"
symfony server:start
# Écoute sur http://localhost:8000

# Terminal 2 - Frontend
cd "c:\Users\elmeh\Desktop\projet php"
npm run dev
# Accessible sur http://localhost:5173
```

### 2. Se Connecter

```
URL: http://localhost:5173/login

Email: author1@example.com
Password: password123
```

### 3. Accéder au Profil

```
URL: http://localhost:5173/profile
ou
Cliquez sur votre avatar/menu profil
```

### 4. Modifier les Données

#### Onglet "Profil" ✏️
- Changez votre nom
- Ajoutez/modifiez votre bio
- Mettez à jour votre photo de profil (URL)
- Cliquez "Sauvegarder le profil"
- ✅ Sauvegardé immédiatement en base de données

#### Onglet "Sécurité" 🔐
- Ancien mot de passe: `password123`
- Nouveau mot de passe: (minimum 8 caractères)
- Confirmez le nouveau mot de passe
- Cliquez "Changer le mot de passe"
- ✅ Mot de passe mis à jour et hashé

#### Onglet "Mes Articles" 📰
- Visualisez tous vos articles
- Voyez les statistiques (vues, commentaires)
- Créez un nouvel article si souhaité

---

## 📂 Fichiers Implémentés

### Backend

#### ✅ `backend/src/Controller/UserController.php` (NOUVEAU)
```php
// 3 endpoints REST

#[Route('/api/user/profile', methods: ['GET'])]
public function getProfile(): JsonResponse
// Retourne le profil complet de l'utilisateur connecté

#[Route('/api/user/profile', methods: ['PUT'])]
public function updateProfile(Request $request): JsonResponse
// Met à jour name, bio, avatar

#[Route('/api/user/change-password', methods: ['POST'])]
public function changePassword(Request $request): JsonResponse
// Change le mot de passe avec validation de l'ancien
```

#### ✅ `backend/src/Entity/User.php` (AUGMENTÉ)
```php
// Propriétés ajoutées:
private ?string $bio = null;                    // TEXT
private ?string $avatar = null;                 // VARCHAR(500)
private ?\DateTimeImmutable $updatedAt = null; // TIMESTAMP

// Avec getters/setters complètes
```

#### ✅ `backend/migrations/Version20260113185942.php` (APPLIQUÉ)
```sql
-- Migration exécutée avec succès
ALTER TABLE "user" ADD COLUMN bio TEXT;
ALTER TABLE "user" ADD COLUMN avatar VARCHAR(500);
ALTER TABLE "user" ADD COLUMN updated_at TIMESTAMP;
```

### Frontend

#### ✅ `src/services/api.ts` (AUGMENTÉ)
```typescript
export const userService = {
  // Récupère le profil utilisateur
  getProfile: () => apiRequest<any>("/user/profile"),
  
  // Met à jour le profil
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
    apiRequest<{ message: string; user: any }>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  // Change le mot de passe
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/user/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
```

#### ✅ `src/pages/Profile.tsx` (COMPLÈTEMENT REFACTORISÉE)
- 282 lignes de React/TypeScript
- Intégration React Query
- Mutations pour mise à jour et changement password
- Validation des formulaires
- Toasts notifications
- 3 onglets fonctionnels
- États de chargement
- Gestion d'erreurs

---

## 🔄 Architecture Flux Données

### 1. Chargement Initial
```
Utilisateur se connecte
    ↓
JWT Token récupéré et stocké
    ↓
Navigation vers /profile
    ↓
useQuery fetch userProfile
    ↓
GET /api/user/profile (JWT inclus)
    ↓
Backend valide JWT
    ↓
Récupère user depuis base de données
    ↓
JSON Response avec data complète
    ↓
Frontend affiche profil initial
```

### 2. Modification du Profil
```
Utilisateur modifie nom/bio/avatar
    ↓
État React mis à jour localement
    ↓
Validation côté client (nom requis, etc)
    ↓
Click "Sauvegarder"
    ↓
useMutation lance la requête
    ↓
PUT /api/user/profile (JWT + data)
    ↓
Backend valide JWT
    ↓
Valide données reçues
    ↓
UPDATE user SET ... WHERE id
    ↓
Retourne message + user data
    ↓
Frontend: mutation onSuccess
    ↓
setUser() - met à jour auth context
    ↓
refetch() - recharge depuis API
    ↓
Toast vert: "Profil mis à jour ✅"
    ↓
Formulaire rafraîchi avec nouvelles données
```

### 3. Changement Mot de Passe
```
Utilisateur entre ancien + nouveau MP
    ↓
Validation: newPass == confirmPass?
    ↓
Validation: length >= 8?
    ↓
Click "Changer le mot de passe"
    ↓
useMutation POST /api/user/change-password
    ↓
Backend reçoit JWT + oldPass + newPass
    ↓
Valide JWT
    ↓
Récupère user depuis BD
    ↓
Compare oldPass avec password hashé (bcrypt)
    ↓
Si valid: Hash newPass avec bcrypt
    ↓
UPDATE user SET password=... WHERE id
    ↓
Retourne succès
    ↓
Frontend: mutation onSuccess
    ↓
Toast vert: "Mot de passe changé ✅"
    ↓
Formulaire vidé
    ↓
Utilisateur peut se reconnecter avec nouveau MP
```

---

## 📊 Requêtes API Détaillées

### GET /api/user/profile
```bash
Request:
GET /api/user/profile
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "id": 3,
  "email": "author1@example.com",
  "name": "Jean Dupont",
  "bio": "Développeur web passionné",
  "avatar": "https://api.dicebear.com/...",
  "role": "AUTHOR",
  "createdAt": "2025-01-08T16:10:59.000Z",
  "updatedAt": "2025-01-13T19:00:00.000Z"
}
```

### PUT /api/user/profile
```bash
Request:
PUT /api/user/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Jean Dupont Updated",
  "bio": "Je suis un auteur passionné",
  "avatar": "https://example.com/avatar.jpg"
}

Response (200):
{
  "message": "Profil mis à jour avec succès",
  "user": {
    "id": 3,
    "email": "author1@example.com",
    "name": "Jean Dupont Updated",
    "bio": "Je suis un auteur passionné",
    "avatar": "https://example.com/avatar.jpg",
    "updatedAt": "2025-01-13T19:15:30.000Z"
  }
}
```

### POST /api/user/change-password
```bash
Request:
POST /api/user/change-password
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}

Response (200):
{
  "message": "Mot de passe changé avec succès"
}

Response (400) - Ancien mot de passe invalide:
{
  "error": "Ancien mot de passe incorrect"
}
```

---

## ✅ Tests à Effectuer

### Test 1: Modification Simple
```
1. Se connecter comme author1@example.com
2. Aller à /profile
3. Changer le nom: "Test User" → "Test User Updated"
4. Cliquer "Sauvegarder le profil"
5. ✅ Toast vert apparaît
6. ✅ Rafraîchir la page → Nom persiste
7. ✅ Vérifier BD: SELECT name FROM user WHERE id=3
   → "Test User Updated"
```

### Test 2: Changement Mot de Passe
```
1. Page profil → Onglet Sécurité
2. Ancien MP: password123
3. Nouveau MP: newpass12345 (12 caractères)
4. Confirmation: newpass12345
5. Cliquer "Changer le mot de passe"
6. ✅ Toast: "Mot de passe changé ✅"
7. Se déconnecter
8. Se reconnecter ancien MP → ❌ Login échoue
9. Se reconnecter nouveau MP → ✅ Login réussit
```

### Test 3: Validation
```
1. Onglet Profil
2. Effacer le nom → Vide
3. Cliquer "Sauvegarder"
4. ✅ Message d'erreur: "Le nom est obligatoire"
```

### Test 4: Articles
```
1. Onglet Articles
2. ✅ Tous les articles de l'utilisateur affichés
3. ✅ Statistiques visibles (vues, commentaires)
```

---

## 🔐 Sécurité - Points Importants

✅ **JWT Authentication**
- Chaque requête validée côté serveur
- Token expirant (configurable)
- Stocké sécurisé en localStorage

✅ **Mot de Passe Sécurisé**
- Ancien mot de passe validé avant changement
- Nouveau mot de passe hashé avec bcrypt
- Jamais stocké en clair

✅ **Validation Côté Serveur**
- Tous les endpoints valident les données
- Injection SQL prévenue (Doctrine ORM)
- XSS prévenu (React échappe automatiquement)

✅ **HTTPS (Production)**
- À activer en production
- Utiliser `https://` au lieu de `http://`

---

## 📋 Vérification Complète

### Backend ✅
- [x] UserController créé avec 3 endpoints
- [x] Authentification JWT intégrée
- [x] Validation des données
- [x] Hachage sécurisé des mots de passe
- [x] Erreurs gérées correctement
- [x] Réponses JSON cohérentes

### Frontend ✅
- [x] Services API créés (userService)
- [x] Profile.tsx complètement refactorisée
- [x] React Query pour requêtes
- [x] Mutations pour PUT/POST
- [x] Validation côté client
- [x] Toasts notifications
- [x] États de chargement
- [x] Redirection non-authentifiés

### Base de Données ✅
- [x] Migration appliquée
- [x] Colonnes créées: bio, avatar, updated_at
- [x] Pas de perte de données
- [x] Requêtes SQL optimisées

### Build & Compilation ✅
- [x] TypeScript compile sans erreurs
- [x] Vite build successful
- [x] Aucun warning critique
- [x] Assets générés correctement

---

## 🎯 Cas d'Usage Couverts

### ✅ Cas 1: Profil Utilisateur
```
Auteur se connecte
  ↓
Accède à /profile
  ↓
Voit son profil complet
  ↓
Peut modifier nom, bio, avatar
  ↓
Changements persisted en BD
```

### ✅ Cas 2: Sécurité
```
Auteur veut changer son mot de passe
  ↓
Fournit ancien + nouveau MP
  ↓
Système valide l'ancien
  ↓
Hash le nouveau
  ↓
Sauvegarde en BD
  ↓
Ancien MP ne fonctionne plus
  ↓
Nouveau MP fonctionne pour se connecter
```

### ✅ Cas 3: Visibilité Articles
```
Auteur va à /profile
  ↓
Onglet Articles
  ↓
Voit tous ses articles
  ↓
Voir statistiques (vues, commentaires)
  ↓
Peut en créer d'autres si souhaité
```

### ✅ Cas 4: Persistance Session
```
Auteur modifie profil
  ↓
Ferme navigateur
  ↓
Revient le jour suivant
  ↓
Se reconnecte
  ↓
Ses modifications sont toujours là
  ↓
Stockées en BD
```

---

## 🚨 Troubleshooting

### Backend ne répond pas
```bash
cd backend
symfony server:start

# Ou utiliser:
php -S localhost:8000 -t public/
```

### Frontend erreurs de compilation
```bash
npm install
npm run build
npm run dev
```

### Problèmes d'authentification
- Vérifier que le JWT est envoyé
- Vérifier que le backend reçoit le token
- Logs: `symfony console debug:router`

### Profil ne se met pas à jour
- Vérifier les logs backend: `symfony console server:log`
- Vérifier la base de données: Migration appliquée?
- Console browser (F12) pour les erreurs réseau

### Mot de passe ne change pas
- Vérifier ancien MP correct
- Vérifier nouveau MP >= 8 caractères
- Vérifier confirmation MP identique

---

## 📞 Support & Ressources

### Documentation
- [Profile Management Complete](PROFILE_MANAGEMENT_COMPLETE.md)
- [Visual Guide](PROFILE_VISUAL_GUIDE.md)
- [Technical Summary](TECHNICAL_SUMMARY.md)

### Fichiers Clés
- Backend: `backend/src/Controller/UserController.php`
- Frontend: `src/pages/Profile.tsx`
- Services: `src/services/api.ts`
- Entity: `backend/src/Entity/User.php`

### Commandes Utiles
```bash
# Backend - Check migrations
symfony console doctrine:migrations:status

# Backend - Query BD
symfony console doctrine:query:sql "SELECT * FROM \"user\" LIMIT 1"

# Frontend - Build
npm run build

# Frontend - Dev server
npm run dev
```

---

## ✨ Résumé Final

**La fonctionnalité est 100% complète et prête à l'emploi.**

### Ce que vous pouvez faire maintenant:

✅ **Modifier votre profil**
- Nom, bio, photo
- Sauvegarde instantanée
- Validation sécurisée

✅ **Changer votre mot de passe**
- Validation de l'ancien
- Hachage sécurisé
- Nouveau MP immédiatement actif

✅ **Voir vos données**
- Profil complet
- Tous les articles
- Statistiques (vues, commentaires)

✅ **Expérience Professionnelle**
- Interface moderna et responsive
- Feedback utilisateur (toasts)
- Chargements fluides
- Gestion d'erreurs claire

✅ **Persistance Temps Réel**
- Base de données PostgreSQL
- Migrations appliquées
- Données consistantes
- Scalable et maintenable

### Architecture Finale:
```
Frontend (React)
    ↓ (API REST + JWT)
Backend (Symfony)
    ↓ (Doctrine ORM)
Database (PostgreSQL)
```

**Tout fonctionne ensemble en temps réel comme une vraie application!** 🎉

---

## 🎓 Prochaines Étapes (Optionnelles)

Si vous voulez améliorer davantage:

1. **Upload d'Images** - Permettre upload au lieu d'URL
2. **Avatar Auto-Généré** - DiceBear pour les nouveaux utilisateurs
3. **Profil Public** - Voir le profil des autres auteurs
4. **Historique** - Tracker les changements
5. **2FA** - Authentification à deux facteurs
6. **Notifications Email** - Alertes pour changements importants

**Mais pour l'instant, vous avez un système complet et fonctionnel!**
