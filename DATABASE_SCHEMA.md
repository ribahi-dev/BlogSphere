# 📊 Schéma Complet de la Base de Données

## 🔌 Connexion
```
Serveur:    localhost
Port:       5432
Base:       app_db
User:       postgres
Pass:       postgres
```

---

## 📋 Tables et Structures

### 1️⃣ TABLE: `user` (Utilisateurs)
```sql
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    roles JSON NOT NULL,
    password VARCHAR(255),
    name VARCHAR(255),
    bio TEXT,
    avatar VARCHAR(500),
    google_id VARCHAR(255),
    user_type VARCHAR(20) NOT NULL DEFAULT 'AUTHOR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Colonnes:**
- `id` - ID unique
- `email` - Email (unique)
- `password` - Hash bcrypt du mot de passe
- `name` - Nom de l'utilisateur
- `bio` - Biographie
- `avatar` - URL de l'avatar
- `roles` - Rôles (JSON): ROLE_ADMIN, ROLE_AUTHOR, ROLE_USER
- `user_type` - Type: AUTHOR ou ADMIN
- `google_id` - ID Google OAuth
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

**Utilisateurs Test:**
```
Email: admin@test.com
Pass:  password123
Type:  ADMIN
---
Email: author1@test.com
Pass:  password123
Type:  AUTHOR
---
Email: author2@test.com
Pass:  password123
Type:  AUTHOR
```

---

### 2️⃣ TABLE: `article` (Articles)
```sql
CREATE TABLE article (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255),
    author_id INTEGER NOT NULL,
    category_id INTEGER,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    published_at TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES "user"(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);
```

**Colonnes:**
- `id` - ID unique
- `title` - Titre de l'article
- `content` - Contenu (texte complet)
- `slug` - URL-friendly (ex: "mon-premier-article")
- `description` - Courte description
- `author_id` - Référence à l'auteur
- `category_id` - Catégorie
- `published` - Est publié (true/false)
- `created_at` - Date de création
- `updated_at` - Date de modification
- `published_at` - Date de publication

---

### 3️⃣ TABLE: `category` (Catégories)
```sql
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Catégories de Test:**
- `Technologie`
- `Web`
- `PHP`
- `JavaScript`

---

### 4️⃣ TABLE: `tag` (Tags/Étiquettes)
```sql
CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tags de Test:**
- `react`
- `symfony`
- `database`
- `frontend`
- `backend`

---

### 5️⃣ TABLE: `article_tag` (Relation Article-Tags)
```sql
CREATE TABLE article_tag (
    article_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);
```

---

### 6️⃣ TABLE: `comment` (Commentaires)
```sql
CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES "user"(id)
);
```

**Colonnes:**
- `id` - ID unique
- `article_id` - Article commenté
- `author_id` - Auteur du commentaire
- `content` - Texte du commentaire
- `created_at` - Date de création
- `updated_at` - Date de modification

---

### 7️⃣ TABLE: `message` (Messages/Réclamations)
```sql
CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES "user"(id) ON DELETE CASCADE
);
```

**Colonnes:**
- `id` - ID unique
- `sender_id` - Auteur du message
- `subject` - Sujet
- `content` - Contenu
- `is_read` - Message lu (true/false)
- `created_at` - Date d'envoi

---

### 8️⃣ TABLE: `oauth_token` (Tokens OAuth Google)
```sql
CREATE TABLE oauth_token (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    provider VARCHAR(50) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);
```

---

## 🔗 Relations Entre Tables

```
user (1) ──┬─→ (∞) article
           ├─→ (∞) comment
           └─→ (∞) message

article (1) ──┬─→ (∞) comment
              ├─→ (∞) article_tag
              └─→ (1) category

tag (1) ──→ (∞) article_tag
category (1) ──→ (∞) article
```

---

## 💾 Données de Test

**Articles créés:**
- "Bienvenue sur le Blog" (publié)
- "Guide Complet Symfony" (publié)
- "React et REST API" (brouillon)

**Catégories:**
- Technologie
- Web
- PHP
- JavaScript

**Tags:**
- react, symfony, database, frontend, backend

---

## 🛠️ Fichiers Pertinents

**Entités (Définition du schéma):**
- `backend/src/Entity/User.php`
- `backend/src/Entity/Article.php`
- `backend/src/Entity/Category.php`
- `backend/src/Entity/Tag.php`
- `backend/src/Entity/Comment.php`
- `backend/src/Entity/Message.php`

**Migrations SQL:**
- `backend/migrations/Version*.php`

**Script d'initialisation:**
- `backend/init.php` - Crée les données de test

---

## ✅ Commandes Utiles

```bash
# Voir l'état de la DB
php bin/console doctrine:migrations:status

# Créer une migration
php bin/console make:migration

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Réinitialiser la DB
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php init.php

# Accéder à PostgreSQL directement
psql -h localhost -U postgres -d app_db
```

---

## 🚀 Prochaines Étapes

1. **DBeaver** - Télécharge et connecte-toi à la DB
2. **Voir les données** - Browse les tables
3. **Modifier les données** - Ajoute tes propres articles
4. **Exporter/Importer** - Sauvegarde tes données

C'est tout! Ta base de données est complète et prête à fonctionner! 🎉
