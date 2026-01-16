# 📊 Vue Base de Données PostgreSQL - Symfony

## ✅ Votre base de données est créée!

---

## 📋 Tables créées:

### 1️⃣ **Table: user** (Utilisateurs)
```
Colonnes:
  - id (INTEGER) - Clé primaire
  - email (VARCHAR) - Email unique
  - roles (JSON) - Rôles utilisateur
  - password (VARCHAR) - Mot de passe
  - name (VARCHAR) - Nom
  - created_at (TIMESTAMP) - Date création
  - google_id (VARCHAR) - ID Google OAuth
  - user_type (VARCHAR) - Type: AUTHOR ou autre

Lignes: 0
```

---

### 2️⃣ **Table: article** (Articles)
```
Colonnes:
  - id (INTEGER) - Clé primaire
  - author_id (INTEGER) - Auteur (FK user.id)
  - title (VARCHAR) - Titre
  - content (TEXT) - Contenu
  - description (VARCHAR) - Description
  - published (BOOLEAN) - Publié?
  - created_at (TIMESTAMP) - Date création
  - updated_at (TIMESTAMP) - Date mise à jour
  - published_at (TIMESTAMP) - Date publication

Lignes: 0
```

---

### 3️⃣ **Table: comment** (Commentaires)
```
Colonnes:
  - id (INTEGER) - Clé primaire
  - article_id (INTEGER) - Article (FK article.id)
  - author_id (INTEGER) - Auteur (FK user.id)
  - content (TEXT) - Contenu
  - created_at (TIMESTAMP) - Date création
  - updated_at (TIMESTAMP) - Date mise à jour

Lignes: 0
```

---

### 4️⃣ **Table: oauth_token** (Tokens OAuth)
```
Colonnes:
  - id (INTEGER) - Clé primaire
  - user_id (INTEGER) - Utilisateur (FK user.id)
  - provider (VARCHAR) - Fournisseur (Google, etc)
  - access_token (TEXT) - Token d'accès
  - refresh_token (TEXT) - Refresh token
  - expires_at (TIMESTAMP) - Expiration

Lignes: 0
```

---

### 5️⃣ **Table: doctrine_migration_versions** (Migrations)
```
Historique des migrations exécutées
Statut: Toutes les migrations complétées ✅
```

---

## 🔗 Relations (Foreign Keys):

```
user (1) ──→ (N) article (author_id)
user (1) ──→ (N) oauth_token (user_id)
user (1) ──→ (N) comment (author_id)
article (1) ──→ (N) comment (article_id)
```

---

## 🚀 Commandes Symfony pour explorer:

### Lister toutes les tables:
```bash
php bin/console doctrine:query:sql "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
```

### Voir la structure d'une table:
```bash
php bin/console doctrine:query:sql "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='user'"
```

### Compter les lignes:
```bash
php bin/console doctrine:query:sql "SELECT COUNT(*) FROM \"user\""
php bin/console doctrine:query:sql "SELECT COUNT(*) FROM article"
php bin/console doctrine:query:sql "SELECT COUNT(*) FROM comment"
```

### Voir tous les utilisateurs:
```bash
php bin/console doctrine:query:sql "SELECT * FROM \"user\""
```

### Voir tous les articles:
```bash
php bin/console doctrine:query:sql "SELECT * FROM article"
```

### Voir les commentaires:
```bash
php bin/console doctrine:query:sql "SELECT * FROM comment"
```

---

## 📊 Résumé de l'état:

| Table | Lignes | Status |
|-------|--------|--------|
| user | 0 | ✅ Vide (prêt) |
| article | 0 | ✅ Vide (prêt) |
| comment | 0 | ✅ Vide (prêt) |
| oauth_token | 0 | ✅ Vide (prêt) |
| doctrine_migration_versions | 3 | ✅ Complet |

---

## 🔧 Prochaines étapes:

1. **Créer des utilisateurs**
   ```bash
   php bin/console make:user
   ```

2. **Créer des articles** (via API ou fixtures)

3. **Tester les APIs**

---

**Status: ✅ Base de données opérationnelle**
**Driver: PostgreSQL 18**
**Framework: Symfony 7.4**
