# 🗄️ Guide d'installation PostgreSQL - Résumé rapide

## Étapes à suivre:

### 1️⃣ Installez PostgreSQL (si pas déjà fait)
https://www.postgresql.org/download/windows/

Lors de l'installation:
- Entrez un mot de passe pour l'utilisateur `postgres`
- Port par défaut: **5432**
- Cochez "Install pgAdmin" (optionnel mais recommandé)

### 2️⃣ Ajoutez PostgreSQL au PATH
1. Appuyez sur `Win + X` → Paramètres système avancés
2. Variables d'environnement → Ajouter une variable PATH
3. Chemin: `C:\Program Files\PostgreSQL\16\bin` (adaptez si nécessaire)
4. Redémarrez votre terminal

### 3️⃣ Vérifiez l'installation
```bash
psql --version
```

### 4️⃣ Créez la base de données
Deux options:

**Option A: Avec pgAdmin (Interface graphique)**
1. Ouvrez pgAdmin (http://localhost:5050)
2. Connectez-vous
3. Clic droit sur Databases → Create → Database
4. Nom: `app_db`

**Option B: Avec la ligne de commande**
```bash
psql -U postgres

# Dans psql:
CREATE DATABASE app_db OWNER postgres;
\q
```

### 5️⃣ Configurez votre mot de passe (IMPORTANT!)
Modifiez le fichier `.env.local` dans `backend/`:

```
DATABASE_URL="postgresql://postgres:VOTRE_PASSWORD@127.0.0.1:5432/app_db?serverVersion=16&charset=utf8"
```

Remplacez `VOTRE_PASSWORD` par le mot de passe que vous avez défini pendant l'installation.

### 6️⃣ Installez les dépendances
```bash
cd backend
composer install
```

### 7️⃣ Migrez la base de données
```bash
php bin/console doctrine:migrations:migrate
```

### 8️⃣ Vérifiez la connexion
```bash
php bin/console doctrine:query:sql "SELECT 1"
```

## ✅ Si tout fonctionne
Le message s'affichera:
```
Result set 1:
+---------+
| ?column?|
+---------+
|1        |
+---------+
```

## 📝 Fichiers configurés
- ✅ `.env` - Configuration par défaut PostgreSQL
- ✅ `.env.local` - Configuration locale (à personnaliser)
- ✅ `config/packages/doctrine.yaml` - Configuration Doctrine ORM
- ✅ `setup_postgresql.bat` - Script d'installation Windows
- ✅ `setup_postgresql.sh` - Script d'installation Linux/Mac

## 🚀 Démarrez votre projet
```bash
# Terminal 1 - Backend
cd backend
php -S 127.0.0.1:8001

# Terminal 2 - Frontend
npm run dev
```

## ❓ Besoin d'aide?
Consultez [POSTGRESQL_CONFIG.md](./POSTGRESQL_CONFIG.md) pour plus de détails.

---
**Status: ✅ Prêt pour le développement**
**Date: 13 janvier 2026**
