# 🗄️ Création Base de Données - Symfony & PostgreSQL

## 📋 Configuration actuelle

Votre configuration dans `.env.local`:
```
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app_db?serverVersion=16&charset=utf8"
```

**Paramètres:**
- **Host:** 127.0.0.1 (localhost)
- **Port:** 5432 (ou changez selon votre installation)
- **Database:** app_db
- **User:** postgres
- **Password:** postgres

---

## ✅ Étape 1: Vérifier PostgreSQL

Ouvrez un terminal et vérifiez que PostgreSQL fonctionne:

```bash
psql --version
```

Si PostgreSQL n'est pas trouvé, ajoutez-le au PATH Windows:
- Cherchez: `C:\Program Files\PostgreSQL\16\bin` (ou votre version)
- Ajoutez ce chemin aux variables d'environnement Windows

---

## ✅ Étape 2: Créer la Base de Données

### Option A: Script automatique (Windows)

Double-cliquez sur:
```
backend/create_database.bat
```

Ou via le terminal:
```bash
cd backend
create_database.bat
```

### Option B: Script automatique (Linux/Mac)

```bash
cd backend
chmod +x create_database.sh
./create_database.sh
```

### Option C: Commande manuelle

```bash
psql -U postgres -h 127.0.0.1 -p 5432
```

Puis dans psql:
```sql
CREATE DATABASE app_db OWNER postgres;
\l                    -- Vérifier la création
\q                    -- Quitter
```

---

## ✅ Étape 3: Vérifier la Connexion

Depuis le dossier `backend/`:

```bash
# Installer les dépendances (si pas déjà fait)
composer install

# Vérifier la connexion à la base de données
php bin/console doctrine:query:sql "SELECT 1"
```

**Résultat attendu:**
```
Result set 1:
+----------+
| ?column? |
+----------+
| 1        |
+----------+
```

---

## ✅ Étape 4: Créer le Schéma de Base de Données

Deux options:

### Option A: Avec les Entities (recommandé)

```bash
# Créer les tables depuis vos Entity
php bin/console doctrine:database:create
php bin/console doctrine:schema:create
```

### Option B: Avec les Migrations

```bash
# Exécuter les migrations existantes
php bin/console doctrine:migrations:migrate
```

Vérifiez l'état:
```bash
php bin/console doctrine:migrations:status
```

---

## ✅ Étape 5: Charger les Données de Test (optionnel)

Si vous avez des fixtures:

```bash
php bin/console doctrine:fixtures:load
```

---

## 🔍 Commandes Utiles

### Vérifier les tables créées

```bash
php bin/console doctrine:query:sql "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
```

### Afficher la structure d'une table

```bash
php bin/console doctrine:query:sql "SELECT * FROM information_schema.columns WHERE table_name='articles'"
```

### Supprimer et recréer la base (développement uniquement!)

```bash
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:schema:create
```

---

## 🚨 Troubleshooting

### Erreur: "could not connect to server"

**Causes possibles:**
- PostgreSQL n'est pas en cours d'exécution
- Le port est incorrect
- Le host est incorrect

**Solution:**
```bash
# Vérifier que PostgreSQL est actif (Windows Services)
# Ou relancer le service:
pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start
```

### Erreur: "password authentication failed"

**Cause:** Mot de passe PostgreSQL incorrect

**Solution:**
1. Vérifiez le mot de passe dans `.env.local`
2. Testez manuellement:
   ```bash
   psql -U postgres -h 127.0.0.1 -p 5432
   ```

### Erreur: "database app_db does not exist"

**Cause:** Base de données non créée

**Solution:**
```bash
# Créer manuellement
psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE app_db OWNER postgres;"
```

### Erreur: "IDENT authentication failed"

**Cause:** Configuration pg_hba.conf

**Solution:**
1. Ouvrez `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
2. Remplacez les lignes avec `ident` par `md5` ou `trust`
3. Relancez PostgreSQL

---

## 📝 Fichiers de Configuration

### `.env` (commité)
Configuration par défaut du projet
```
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app_db?serverVersion=16&charset=utf8"
```

### `.env.local` (local, non commité)
Configuration personnelle
- Modifiez le mot de passe si différent
- Modifiez le port si nécessaire

### `config/packages/doctrine.yaml`
Configuration Doctrine ORM

---

## 🎯 Résumé des Commandes Principales

```bash
# 1. Aller au backend
cd backend

# 2. Installer les dépendances
composer install

# 3. Vérifier la connexion
php bin/console doctrine:query:sql "SELECT 1"

# 4. Créer la base de données
php bin/console doctrine:database:create

# 5. Créer le schéma
php bin/console doctrine:schema:create

# 6. Charger les migrations
php bin/console doctrine:migrations:migrate

# 7. Vérifier les migrations
php bin/console doctrine:migrations:status

# 8. Lancer le serveur
php -S 127.0.0.1:8001
```

---

## 🚀 Démarrer le Projet Complet

### Terminal 1: Backend
```bash
cd backend
php -S 127.0.0.1:8001
```

### Terminal 2: Frontend
```bash
npm run dev
```

L'API sera disponible sur: **http://localhost:8001**
Le frontend sur: **http://localhost:5173**

---

## ✅ Checklist de Vérification

- [ ] PostgreSQL installé et actif
- [ ] Base de données `app_db` créée
- [ ] `.env.local` configuré avec le bon mot de passe
- [ ] `composer install` exécuté
- [ ] `php bin/console doctrine:query:sql "SELECT 1"` fonctionne
- [ ] Tables créées avec `doctrine:schema:create` ou `doctrine:migrations:migrate`
- [ ] Backend démarre correctement
- [ ] Frontend démarre correctement

---

**Status: ✅ Prêt pour le développement**
**Date: 13 janvier 2026**
**Framework: Symfony 7.4 + PostgreSQL 16**
