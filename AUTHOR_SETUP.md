# Mise à Jour - Profil Auteur Amélioré

## 🎉 Améliorations Apportées

### Pages Mises à Jour

#### 1. **ArticleEditor.tsx** ✨
- ✅ Intégration complète avec l'API Symfony
- ✅ Création et modification d'articles via API
- ✅ Gestion automatique des brouillons et publications
- ✅ Affichage des statuts de chargement
- ✅ Messages de succès/erreur améliorés
- ❌ Suppression des fonctionnalités non essentielles (tags, catégories complexes, images)

**Formulaire simplifié :**
- Titre * (obligatoire)
- Description (optionnel)
- Contenu * (obligatoire) - Support Markdown

**Actions :**
- Brouillon : Sauvegarder sans publier
- Publier : Rendre immédiatement public

---

#### 2. **AuthorDashboard.tsx** ✨
- ✅ Intégration complète avec l'API Symfony
- ✅ Affichage des articles de l'utilisateur depuis le backend
- ✅ Suppression d'articles via API
- ✅ Gestion des rôles et permissions
- ✅ Affichage du profil utilisateur
- ✅ Recherche en temps réel
- ❌ Filtres complexes supprimés pour simplifier

**Nouvelles fonctionnalités :**
- Affichage des infos utilisateur (nom, email, rôle)
- Statistiques en temps réel (total, publiés, brouillons)
- Suppression sécurisée avec confirmation
- Chargement des données au démarrage

**Statuts des articles :**
- Publié (vert)
- Brouillon (gris)

---

### API Backend Utilisée

```
GET    /api/articles              → Lister tous les articles publiés
GET    /api/articles/my-articles  → Lister mes articles
GET    /api/articles/{id}         → Récupérer un article
POST   /api/articles              → Créer un nouvel article
PUT    /api/articles/{id}         → Modifier un article
POST   /api/articles/{id}/publish → Publier un article
DELETE /api/articles/{id}         → Supprimer un article
```

---

## 🚀 Comment Démarrer

### 1. Démarrer le Backend

```bash
cd backend
php bin/console cache:clear
php -S 127.0.0.1:8000 -t public public/index.php
```

**Ou avec Symfony CLI :**
```bash
cd backend
symfony server:start --no-tls --port=8000
```

### 2. Démarrer le Frontend

```bash
npm run dev
```

Le frontend s'ouvrira généralement sur `http://localhost:5173` ou `http://localhost:8082`

### 3. Se Connecter en tant qu'Auteur

**Email :** author@test.com  
**Mot de passe :** Password123

---

## 📝 Workflow Utilisateur

### Créer un Article

1. Se connecter avec un compte auteur
2. Cliquer sur "Espace Auteur" (profil → Espace Auteur ou `/author`)
3. Cliquer sur "Nouvel article" ou aller à `/author/new`
4. Remplir le formulaire
5. Cliquer "Brouillon" pour sauvegarder (non public)
6. Cliquer "Publier" pour rendre public

### Gérer vos Articles

1. Dans l'Espace Auteur, voir tous vos articles
2. **Voir** : Consulter l'article public
3. **Modifier** : Éditer le titre, description ou contenu
4. **Supprimer** : Supprimer définitivement (après confirmation)

### Rechercher un Article

Utiliser la barre de recherche pour filtrer par titre

---

## 🔧 Configuration Requise

### Backend (.env.local)

```env
APP_ENV=dev
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
JWT_SECRET="votre-secret-jwt"
CORS_ALLOW_ORIGIN="*"  # Pour le développement
```

### Frontend (.env)

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 📊 Routes Frontend

| Route | Page | Rôle Requis |
|-------|------|------------|
| `/` | Accueil | Tous |
| `/login` | Connexion | Anonyme |
| `/register` | Inscription | Anonyme |
| `/articles` | Tous les articles | Tous |
| `/articles/:id` | Détail article | Tous |
| `/author` | Espace Auteur | Auteur+ |
| `/author/new` | Nouvel article | Auteur+ |
| `/author/edit/:id` | Modifier article | Auteur+ (propriétaire) |
| `/admin` | Panel Admin | Admin |

---

## 🔒 Permissions

### Articles

| Action | Auteur | Propriétaire | Admin |
|--------|--------|-------------|-------|
| Lire (publié) | ✅ | ✅ | ✅ |
| Lister (siens) | ✅ | ✅ | ✅ |
| Créer | ✅ | ✅ | ✅ |
| Modifier | ❌ | ✅ | ✅ |
| Publier | ❌ | ✅ | ✅ |
| Supprimer | ❌ | ✅ | ✅ |

---

## 🧪 Tests

### Tester manuellement via cURL

```bash
# Créer un article
curl -X POST http://127.0.0.1:8000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Mon article",
    "description": "Description",
    "content": "Contenu"
  }'

# Récupérer mes articles
curl -X GET http://127.0.0.1:8000/api/articles/my-articles \
  -H "Authorization: Bearer YOUR_TOKEN"

# Publier un article
curl -X POST http://127.0.0.1:8000/api/articles/1/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Script de test

```bash
bash test_articles_author.sh
```

---

## 📚 Documentation Complète

Pour plus d'informations sur le profil auteur, voir [AUTHOR_GUIDE.md](./AUTHOR_GUIDE.md)

---

## ⚠️ Notes Importantes

1. **Authentification :** Tous les endpoints exceptés `/articles` (list public) requièrent un JWT valide
2. **Permissions :** Vous ne pouvez modifier/supprimer que vos propres articles (sauf si admin)
3. **Markdown :** Le contenu supporte le Markdown complet
4. **Brouillons :** Les articles non publiés ne sont visibles que par leur auteur (et admin)
5. **Cache :** Les modifications sont immédiatement synchronisées avec le backend

---

## 🐛 Dépannage

### L'article n'apparaît pas après création
- Vérifier que vous êtes connecté (token valide)
- Vérifier que le backend répond : `curl http://127.0.0.1:8000/api/articles`
- Vérifier les logs du navigateur (F12 → Console)

### Erreur "Unauthorized" ou "Forbidden"
- Vérifier que votre token JWT est valide
- Vous reconnecter
- Vérifier que vous avez le rôle "AUTHOR" ou "ADMIN"

### Erreur "Article not found"
- Vérifier que l'ID de l'article est correct
- L'article n'existe pas ou a été supprimé

---

## ✅ Checklist

- [x] ArticleEditor intégré avec l'API
- [x] AuthorDashboard intégré avec l'API
- [x] Routes frontend configurées
- [x] Endpoints backend fonctionnels
- [x] Gestion des rôles (AUTHOR/ADMIN)
- [x] Permissions vérifiées
- [x] Messages d'erreur améliorés
- [x] Guide utilisateur créé
- [ ] Tests end-to-end passés
- [ ] Déploiement en production

---

**Créé le :** Janvier 11, 2026  
**Dernier update :** Janvier 11, 2026
