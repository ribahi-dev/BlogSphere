# 📚 Présentation Base de Données - Projet PHP/Symfony

## 🎯 Projet: Plateforme de Articles et Commentaires

### 👨‍🎓 Présenté à: Votre Professeur
### 📅 Date: 13 janvier 2026
### 💻 Stack Technique: Symfony 7.4 + PostgreSQL 18

---

## 📊 Architecture de la Base de Données

### 🗄️ Serveur PostgreSQL:
- **Host:** 127.0.0.1
- **Port:** 5432
- **Database:** app_db
- **Utilisateur:** postgres
- **Mot de passe:** 2005 (sécurisé en production)

---

## 📋 Tables et Structures

### 1️⃣ TABLE: `user` (Utilisateurs)
**Description:** Gère les utilisateurs de la plateforme

```sql
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    roles JSON NOT NULL,
    password VARCHAR(255),
    name VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    google_id VARCHAR(255),
    user_type VARCHAR(20) NOT NULL DEFAULT 'AUTHOR'
);
```

**Données:**
- 5 utilisateurs
- Types: ADMIN, AUTHOR, USER
- Intégration Google OAuth

---

### 2️⃣ TABLE: `article` (Articles)
**Description:** Articles publiés ou en brouillon

```sql
CREATE TABLE article (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    description VARCHAR(255),
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    published_at TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES "user"(id)
);
```

**Données:**
- 4 articles
- Statut: Publié ou Brouillon
- Métadonnées de publication

---

### 3️⃣ TABLE: `comment` (Commentaires)
**Description:** Commentaires sur les articles

```sql
CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES article(id),
    FOREIGN KEY (author_id) REFERENCES "user"(id)
);
```

**Données:**
- 2 commentaires
- Relation avec articles et utilisateurs

---

### 4️⃣ TABLE: `oauth_token` (Tokens OAuth)
**Description:** Stockage des tokens OAuth

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

## 🔗 Relations (Entity Relationship Diagram)

```
          ┌──────────────┐
          │   user       │
          │ (5 lignes)   │
          └──────────────┘
                │
      ┌─────────┼─────────┐
      │         │         │
      ▼         ▼         ▼
  article   oauth_token  comment
  (4 lig)   (0 lig)      (2 lig)
```

**Relations:**
- 1 user → N articles (auteur)
- 1 user → N commentaires (auteur)
- 1 user → N oauth_token
- 1 article → N commentaires

---

## 📊 Statistiques Actuelles

| Table | Nombre de lignes | Status |
|-------|-----------------|--------|
| user | 5 | ✅ Actif |
| article | 4 | ✅ Actif |
| comment | 2 | ✅ Actif |
| oauth_token | 0 | ✅ Prêt |
| doctrine_migration_versions | 3 | ✅ Complet |
| **TOTAL** | **14** | **✅ Opérationnel** |

---

## 👥 Utilisateurs Créés

| ID | Email | Nom | Type |
|----|-------|-----|------|
| 1 | admin@example.com | Administrateur | ADMIN |
| 2 | author1@example.com | Jean Dupont | AUTHOR |
| 3 | author2@example.com | Marie Martin | AUTHOR |
| 4 | user@example.com | Pierre Leclerc | USER |
| 5 | test@example.com | Utilisateur Test | AUTHOR |

---

## 📝 Articles Créés

| ID | Titre | Auteur | Statut |
|----|-------|--------|--------|
| 1 | Introduction à PostgreSQL | Jean Dupont | ✅ Publié |
| 2 | Symfony 7: Les meilleures pratiques | Marie Martin | ✅ Publié |
| 3 | API RESTful avec Symfony | Jean Dupont | ✅ Publié |
| 4 | Sécurité des applications web | Marie Martin | ❌ Brouillon |

---

## 💬 Commentaires

```
Article 1 "Introduction à PostgreSQL":
  ├─ Très bon article! (Marie Martin)
  
Article 2 "Symfony 7: Les meilleures pratiques":
  ├─ Excellent guide! (Jean Dupont)
```

---

## 🛡️ Sécurité et Bonnes Pratiques

✅ **Implémenté:**
- Authentification par email/mot de passe
- Intégration OAuth (Google)
- Rôles et permissions (ROLE_ADMIN, ROLE_AUTHOR, ROLE_USER)
- Timestamps pour traçabilité (created_at, updated_at, published_at)
- Clés étrangères pour intégrité référentielle
- Données de test isolées

---

## 🔍 Comment Accéder à la Base de Données

### **Option 1: Via Symfony (Terminal)**

```bash
# Voir tous les utilisateurs
php bin/console doctrine:query:sql "SELECT * FROM \"user\""

# Voir tous les articles
php bin/console doctrine:query:sql "SELECT * FROM article"

# Voir les commentaires
php bin/console doctrine:query:sql "SELECT * FROM comment"
```

### **Option 2: Via pgAdmin (Interface Web)**

1. Ouvrir: http://localhost:5050
2. Se connecter avec les identifiants pgAdmin
3. Servers → PostgreSQL 18 → Databases → app_db → Schemas → public → Tables

### **Option 3: Via psql (Ligne de commande PostgreSQL)**

```bash
psql -U postgres -h 127.0.0.1 -d app_db
```

Puis:
```sql
\dt                          -- Lister les tables
SELECT * FROM "user";        -- Voir les utilisateurs
SELECT * FROM article;       -- Voir les articles
\q                           -- Quitter
```

---

## 🚀 Démarrage de l'Application

### **Backend (Symfony API)**
```bash
cd "c:\Users\elmeh\Desktop\projet php\backend"
php -S 127.0.0.1:8001
```
**URL:** http://localhost:8001

### **Frontend (React/Vue)**
```bash
cd "c:\Users\elmeh\Desktop\projet php"
npm run dev
```
**URL:** http://localhost:5173

---

## 🔧 Commandes Utiles pour la Démonstration

### Voir la structure d'une table:
```bash
php bin/console doctrine:query:sql "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='user'"
```

### Compter les articles publiés:
```bash
php bin/console doctrine:query:sql "SELECT COUNT(*) FROM article WHERE published=true"
```

### Voir les articles et leurs auteurs:
```bash
php bin/console doctrine:query:sql "SELECT a.id, a.title, u.name FROM article a JOIN \"user\" u ON a.author_id = u.id"
```

### Voir les commentaires avec contexte:
```bash
php bin/console doctrine:query:sql "SELECT c.content, u.name, a.title FROM comment c JOIN \"user\" u ON c.author_id = u.id JOIN article a ON c.article_id = a.id"
```

---

## ✅ Checklist de Validation

- [x] PostgreSQL installé et configuré
- [x] Base de données créée (app_db)
- [x] Tables créées avec structures correctes
- [x] Migrations exécutées (3 migrations)
- [x] Données de test générées
- [x] Relations et clés étrangères validées
- [x] Connexion testée et confirmée
- [x] API Symfony fonctionnelle
- [x] Extension PHP PostgreSQL activée

---

## 📱 Cas d'Usage

**Plateforme de blogging:**
1. ✅ Les utilisateurs peuvent créer des articles
2. ✅ Les articles peuvent être publiés ou en brouillon
3. ✅ Les utilisateurs peuvent commenter les articles
4. ✅ Les rôles contrôlent les permissions
5. ✅ Support OAuth pour authentification sociale

---

## 🎓 Points Techniques Démontrés

1. **Design relationnel:** Normalisation correcte des données
2. **Intégrité référentielle:** Foreign keys et constraints
3. **Audit:** Timestamps pour traçabilité
4. **Authentication:** Multi-méthode (local + OAuth)
5. **Authorization:** Système de rôles granulaires
6. **API:** Doctrine ORM avec Symfony

---

**Status: ✅ CONFIGURATION COMPLÈTE ET OPÉRATIONNELLE**

**Prêt pour la démonstration!** 🎉
