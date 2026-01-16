# Configuration PostgreSQL - Guide Complet

## 📋 Prérequis

- PostgreSQL installé (version 14+)
- PHP 8.2+
- Composer

## 🔧 Configuration détaillée

### 1. **Vérifier l'installation de PostgreSQL**

```bash
psql --version
```

Si la commande n'est pas trouvée, ajoutez PostgreSQL au PATH Windows:
- Accédez à `C:\Program Files\PostgreSQL\16\bin` (ou votre version)
- Copiez le chemin
- Ajoutez-le aux variables d'environnement Windows

### 2. **Créer la base de données**

Ouvrez pgAdmin ou utilisez la ligne de commande:

```bash
psql -U postgres
```

Puis exécutez:

```sql
CREATE DATABASE app_db OWNER postgres;
\q
```

### 3. **Configuration du fichier .env.local**

Le fichier `.env.local` est déjà configuré avec:

```
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app_db?serverVersion=16&charset=utf8"
```

**Si votre mot de passe PostgreSQL est différent, modifiez:**
- Remplacez le deuxième `postgres` par votre mot de passe réel

### 4. **Installer les dépendances PHP**

```bash
cd backend
composer install
```

### 5. **Exécuter les migrations**

```bash
# Créer le schéma de base de données
php bin/console doctrine:migrations:migrate

# Ou créer depuis les entities
php bin/console doctrine:database:create
php bin/console doctrine:schema:create
```

### 6. **Charger les données de test (optionnel)**

```bash
php bin/console doctrine:fixtures:load
```

## 🗄️ Fichiers de configuration

### `.env`
- Configuration par défaut (commité)
- DATABASE_URL=postgresql://...

### `.env.local`
- Configuration locale (non commité)
- À personnaliser avec votre mot de passe

### `.env.dev`
- Configuration spécifique au développement

## 🐘 Commandes PostgreSQL utiles

```bash
# Lister les bases de données
psql -U postgres -l

# Accéder à une base de données spécifique
psql -U postgres -d app_db

# Sauvegarder la base de données
pg_dump -U postgres app_db > backup.sql

# Restaurer la base de données
psql -U postgres app_db < backup.sql
```

## ✅ Tester la connexion

```bash
cd backend

# Tester la connexion à la base de données
php bin/console doctrine:query:sql "SELECT 1"

# Afficher l'état des migrations
php bin/console doctrine:migrations:status
```

## 🐛 Troubleshooting

### Erreur: "FATAL: Ident authentication failed"
→ Modifiez `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
→ Remplacez `ident` par `md5` ou `trust`
→ Redémarrez PostgreSQL

### Erreur: "Database app_db does not exist"
→ Créez-la manuellement avec pgAdmin ou psql

### Erreur: "could not connect to server"
→ Vérifiez que le service PostgreSQL est en cours d'exécution
→ Windows: Services → PostgreSQL

## 📱 Configuration du frontend (si nécessaire)

L'API communiquera automatiquement avec PostgreSQL via le backend Symfony.
Aucune configuration supplémentaire n'est nécessaire côté frontend.

## 🚀 Démarrage du projet

```bash
# Terminal 1: Backend API
cd backend
php -S 127.0.0.1:8001

# Terminal 2: Frontend (dans la racine du projet)
npm run dev
```

## 📊 Vérifier le statut

```bash
# Statut des migrations
cd backend
php bin/console doctrine:migrations:status

# Lister les tables
php bin/console doctrine:query:sql "SELECT * FROM information_schema.tables WHERE table_schema='public'"
```

---

**Configuré le:** 2026-01-13
**PostgreSQL Version:** 16+
**Status:** ✅ Prêt pour le développement
