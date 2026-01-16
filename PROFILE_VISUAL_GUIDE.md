# 📱 Guide Visuel - Gestion du Profil Utilisateur en Temps Réel

## 🎬 Flux Utilisateur Complet

### 1️⃣ Connexion
```
┌─────────────────────────────────────┐
│         PAGE DE CONNEXION            │
├─────────────────────────────────────┤
│ Email:     author1@example.com       │
│ Password:  password123              │
│                                     │
│        [Se Connecter]               │
└─────────────────────────────────────┘
            ↓
         JWT Token reçu et stocké
            ↓
    Redirection vers /profile
```

### 2️⃣ Page Profil - Vue d'Ensemble
```
┌──────────────────────────────────────────────────┐
│                                                  │
│   [Avatar]  Jean Dupont              [AUTEUR]   │
│             author1@example.com                  │
│             Je suis un auteur passionné...       │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   📄 Articles    👁️ Vues       💬 Commentaires  │
│      12            1,540            47          │
│                                                  │
├──────────────────────────────────────────────────┤
│ [Profil] [Sécurité] [Mes Articles]              │
│                                                  │
│         (Contenu du tab sélectionné)            │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 3️⃣ Onglet "Profil" - Modification
```
┌──────────────────────────────────────────────────┐
│ MODIFIER MON PROFIL                             │
│ Mettez à jour vos informations personnelles      │
├──────────────────────────────────────────────────┤
│                                                  │
│ Nom complet *                                   │
│ ┌────────────────────────────────────────────┐ │
│ │ Jean Dupont Updated           [Changé ✓]  │ │
│ └────────────────────────────────────────────┘ │
│                                                  │
│ Email                                           │
│ ┌────────────────────────────────────────────┐ │
│ │ author1@example.com        [Immuable]      │ │
│ └────────────────────────────────────────────┘ │
│                                                  │
│ Biographie                                      │
│ ┌────────────────────────────────────────────┐ │
│ │ Je suis un auteur passionné par la        │ │
│ │ technologie et l'écriture.                │ │
│ │                      [178/500 caractères] │ │
│ └────────────────────────────────────────────┘ │
│                                                  │
│ URL de la photo de profil                      │
│ ┌────────────────────────────────────────────┐ │
│ │ https://api.dicebear.com/...   [Changée] │ │
│ └────────────────────────────────────────────┘ │
│                                                  │
│        [💾 Sauvegarder le profil]              │
│                                                  │
│    ✅ Profil mis à jour avec succès             │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 4️⃣ Onglet "Sécurité" - Changement de Mot de Passe
```
┌──────────────────────────────────────────────────┐
│ CHANGER LE MOT DE PASSE                         │
│ Sécurisez votre compte en changeant régulièrement│
├──────────────────────────────────────────────────┤
│                                                  │
│ Mot de passe actuel *                          │
│ ┌────────────────────────────────────────────┐ │
│ │ 🔒 ••••••••••••                            │ │
│ └────────────────────────────────────────────┘ │
│                                                  │
│ Nouveau mot de passe *                         │
│ ┌────────────────────────────────────────────┐ │
│ │ 🔒 ••••••••••••••••                        │ │
│ │    8 caractères minimum                    │ │
│ └────────────────────────────────────────────┘ │
│                                                  │
│ Confirmer le mot de passe *                    │
│ ┌────────────────────────────────────────────┐ │
│ │ 🔒 ••••••••••••••••                        │ │
│ └────────────────────────────────────────────┘ │
│                                                  │
│        [🔒 Changer le mot de passe]            │
│                                                  │
│    ✅ Mot de passe changé avec succès           │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 5️⃣ Onglet "Mes Articles" - Articles de l'Utilisateur
```
┌──────────────────────────────────────────────────┐
│ Vous avez écrit 3 articles                       │
├──────────────────────────────────────────────────┤
│                                                  │
│ ┌─────────────────┐  ┌─────────────────┐       │
│ │ Titre Article 1 │  │ Titre Article 2 │       │
│ │ par Jean Dupont │  │ par Jean Dupont │       │
│ │ 2024-12-15      │  │ 2024-12-10      │       │
│ │ 523 lectures    │  │ 892 lectures    │       │
│ │ 12 commentaires │  │ 25 commentaires │       │
│ │ [Voir +]        │  │ [Voir +]        │       │
│ └─────────────────┘  └─────────────────┘       │
│                                                  │
│ ┌─────────────────┐                            │
│ │ Titre Article 3 │                            │
│ │ par Jean Dupont │                            │
│ │ 2024-12-05      │                            │
│ │ 145 lectures    │                            │
│ │ 5 commentaires  │                            │
│ │ [Voir +]        │                            │
│ └─────────────────┘                            │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🔄 Flux de Mise à Jour en Temps Réel

### Scénario: Modification du Profil

```
Timeline:
─────────────────────────────────────────────────

T=0s: Utilisateur clique "Sauvegarder le profil"
      ✓ Validation côté client
      
T=0.1s: Affichage du spinner "Sauvegarde en cours..."
        
T=0.2s: Envoi requête HTTP PUT /api/user/profile
        {
          "name": "Jean Dupont Updated",
          "bio": "Je suis un auteur...",
          "avatar": "https://..."
        }
        
T=0.3s: Backend reçoit
        ✓ Validation JWT
        ✓ Validation données
        
T=0.4s: Mise à jour base de données
        UPDATE user SET name=..., bio=..., 
        avatar=..., updated_at=NOW()
        WHERE id=3
        
T=0.5s: Réponse JSON envoyée au frontend
        {
          "message": "Profil mis à jour",
          "user": {...}
        }
        
T=0.6s: Frontend reçoit réponse
        ✓ Mutation React Query success
        ✓ setUser() avec nouvelle data
        ✓ Refetch du profil
        
T=0.7s: Spinner disparu
        Toast vert: "Profil mis à jour ✅"
        Formulaire rafraîchi avec les nouvelles données
        
Résultat: Changements immédiatement visibles
          Persisted en base de données
          Reflétés dans l'état React
          Valides pour la session actuelle
```

---

## 🛡️ Sécurité - Étape par Étape

### Modification de Mot de Passe

```
Frontend:
┌─────────────────────────────────────────┐
│ 1. Utilisateur entre ancien mot de passe │
│ 2. Utilisateur entre nouveau (8+ chars) │
│ 3. Confirmation doit correspondre        │
│ 4. Click "Changer"                      │
└─────────────────────────────────────────┘
            ↓
        Validations:
        ✓ Aucun champ vide?
        ✓ Nouveau == Confirmation?
        ✓ Longueur >= 8 caractères?
            ↓
        Si OK → Envoi requête
        Si NON → Erreur Toast
            ↓

Backend:
┌─────────────────────────────────────────┐
│ 1. Récupère utilisateur depuis JWT      │
│ 2. Récupère mot de passe hashé en BD    │
│ 3. Valide ancien mot de passe           │
│    (compare avec bcrypt)                │
│ 4. Si valide: Hash nouveau mot de passe │
│ 5. UPDATE user SET password=...         │
│ 6. Retour succès                        │
│ 7. Ancien mot de passe rejette           │
│ 8. Nouveau fonctionne pour login        │
└─────────────────────────────────────────┘
```

---

## 📊 Données Temps Réel - Avant & Après

### Avant Modification
```
Base de Données (PostgreSQL):
┌────┬──────────────────┬────────────┬─────────────────┐
│ id │ email            │ name       │ bio             │
├────┼──────────────────┼────────────┼─────────────────┤
│ 3  │ author1@...com   │ Jean       │ NULL            │
│    │                  │ Dupont     │                 │
└────┴──────────────────┴────────────┴─────────────────┘
```

### Après Modification
```
Base de Données (PostgreSQL):
┌────┬──────────────────┬──────────────────┬──────────────┐
│ id │ email            │ name             │ bio          │
├────┼──────────────────┼──────────────────┼──────────────┤
│ 3  │ author1@...com   │ Jean Dupont      │ Je suis un   │
│    │                  │ Updated          │ auteur...    │
└────┴──────────────────┴──────────────────┴──────────────┘
```

Les changements sont **immédiats** et **persisted**.

---

## 🎨 États et Transitions

### États du Formulaire Profil
```
         ┌──────────────┐
         │   IDLE       │  ← État initial, données chargées
         └──────────────┘
              │
              │ [Utilisateur change un champ]
              ↓
         ┌──────────────┐
         │  MODIFIED    │  ← Utilisateur a modifié quelque chose
         └──────────────┘
              │
              │ [Click Sauvegarder]
              ↓
         ┌──────────────┐
         │  LOADING     │  ← Spinner actif, requête envoyée
         │  "Sauvegarde │
         │   en cours"  │
         └──────────────┘
              │
         ┌────┴────┐
         │         │
         ↓         ↓
    ✅ SUCCESS   ❌ ERROR
    ┌──────────┐ ┌──────────┐
    │  SUCCESS │ │  ERROR   │
    │ Toast +  │ │ Toast +  │
    │ Refresh  │ │ Keep     │
    └──────────┘ │ data     │
                 └──────────┘
```

---

## 🔗 Intégrations API

### Points de Terminaison

```
┌─────────────────────────────────────────────────────┐
│              API ENDPOINTS - PROFILE                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ GET /api/user/profile                              │
│ ├─ Authentification: JWT Token requis              │
│ ├─ Réponse: Profil utilisateur complet             │
│ └─ Usage: Charger données profil au démarrage     │
│                                                     │
│ PUT /api/user/profile                              │
│ ├─ Authentification: JWT Token requis              │
│ ├─ Body: {name?, bio?, avatar?}                   │
│ ├─ Réponse: {message, user}                        │
│ └─ Usage: Mettre à jour profil                     │
│                                                     │
│ POST /api/user/change-password                     │
│ ├─ Authentification: JWT Token requis              │
│ ├─ Body: {currentPassword, newPassword}            │
│ ├─ Réponse: {message}                              │
│ └─ Usage: Changer le mot de passe                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Cas de Test - Vérifiez Vous-même

### ✅ Test 1: Modifier le Nom
```
1. Se connecter comme author1@example.com
2. Aller à /profile
3. Changer "Jean Dupont" → "Jean Updated"
4. Cliquer "Sauvegarder le profil"
5. ✅ Toast vert: "Profil mis à jour"
6. Rafraîchir la page → Le nom persiste
7. SQL: SELECT name FROM user WHERE id=3
   → Devrait retourner "Jean Updated"
```

### ✅ Test 2: Changer le Mot de Passe
```
1. Page profil → Onglet Sécurité
2. Ancien MP: password123
3. Nouveau MP: newpassword456 (8+ chars)
4. Confirmation: newpassword456
5. Cliquer "Changer le mot de passe"
6. ✅ Toast vert: "Mot de passe changé"
7. Se déconnecter
8. Se reconnecter avec ancien MP → ❌ Fail
9. Se reconnecter avec nouveau MP → ✅ Success
```

### ✅ Test 3: Articles et Statistiques
```
1. Page profil → Onglet Articles
2. ✅ Voir tous les articles de l'utilisateur
3. ✅ Voir les statistiques (nombre, vues, commentaires)
4. Les articles se chargent depuis l'API
5. Refléter les données réelles en base de données
```

---

## 📝 Validation des Données

### Profil - Validations
```
Champ      | Requis | Min    | Max    | Format
-----------|--------|--------|--------|----------
name       | OUI    | 1      | 255    | Text
bio        | NON    | 0      | 500    | Text
avatar     | NON    | -      | 500    | URL
email      | -      | -      | -      | Lecture seule
```

### Mot de Passe - Validations
```
Champ               | Requis | Min | Max | Règles
--------------------|--------|-----|-----|-------------------
currentPassword     | OUI    | 1   | ∞   | Doit être validé
newPassword         | OUI    | 8   | 255 | Doit correspondre
confirmPassword     | OUI    | 8   | 255 | Doit être identique
```

---

## ✨ Caractéristiques Principales

- ✅ **Temps Réel**: Modifications immédiates
- ✅ **Persistance**: Base de données mise à jour
- ✅ **Sécurité**: JWT + HTTPS (prod)
- ✅ **Validation**: Client + Serveur
- ✅ **UX**: Toasts, loaders, feedback
- ✅ **Responsive**: Mobile & Desktop
- ✅ **Accessible**: ARIA labels, contraste
- ✅ **Performance**: React Query caching
- ✅ **Erreurs**: Messages clairs et utiles

---

## 🎯 Vous Pouvez Maintenant

✅ Modifier votre profil en tant qu'auteur
✅ Changer votre mot de passe en sécurité
✅ Voir vos articles et statistiques
✅ Avoir toutes vos modifications sauvegardées
✅ Accéder à votre profil à tout moment
✅ Une expérience utilisateur complète et professionnelle

**L'application fonctionne comme une application réelle en temps réel!**
