# 🎓 GUIDE: Comment Montrer Votre Base de Données au Prof

## 📍 Option 1: Démonstration Interactive (RECOMMANDÉE)

### Étape 1: Ouvrir un Terminal
Appuyez sur **Win + R** et tapez:
```
cmd
```

### Étape 2: Aller au dossier backend
```bash
cd "c:\Users\elmeh\Desktop\projet php\backend"
```

### Étape 3: Lancer l'outil de démonstration
```bash
php demo_database.php
```

### Étape 4: Naviguer dans le menu
L'outil vous proposera des options:
1. Voir les utilisateurs
2. Voir les articles
3. Voir les commentaires
4. Statistiques
5. Etc.

**Avantages:** Interface claire, professionnelle, interactive

---

## 📍 Option 2: Commandes Symfony Directes

### Voir tous les utilisateurs:
```bash
php bin/console doctrine:query:sql "SELECT * FROM \"user\""
```

### Voir tous les articles:
```bash
php bin/console doctrine:query:sql "SELECT * FROM article"
```

### Voir tous les commentaires:
```bash
php bin/console doctrine:query:sql "SELECT * FROM comment"
```

### Voir les articles avec leurs auteurs:
```bash
php bin/console doctrine:query:sql "SELECT a.id, a.title, u.name FROM article a JOIN \"user\" u ON a.author_id = u.id"
```

### Voir les commentaires avec contexte:
```bash
php bin/console doctrine:query:sql "SELECT c.content, u.name, a.title FROM comment c JOIN \"user\" u ON c.author_id = u.id JOIN article a ON c.article_id = a.id"
```

---

## 📍 Option 3: pgAdmin (Interface Web)

### Étape 1: Ouvrir pgAdmin
1. Ouvrez votre navigateur
2. Allez à: **http://localhost:5050**

### Étape 2: Se connecter
Utilisez les identifiants pgAdmin

### Étape 3: Naviguer
- Servers → PostgreSQL 18 → Databases → app_db
- Cliquez sur **Schemas** → **public** → **Tables**
- Vous verrez toutes les tables avec leurs données

---

## 📍 Option 4: pgAdmin (Query Tool)

### Étape 1: Ouvrir l'éditeur de requêtes
Dans pgAdmin: Tools → Query Tool

### Étape 2: Exécuter des requêtes SQL
```sql
-- Voir les utilisateurs
SELECT * FROM "user";

-- Voir les articles
SELECT * FROM article;

-- Voir les commentaires
SELECT * FROM comment;

-- Voir la structure
\dt
```

---

## 🎯 SCÉNARIO DE PRÉSENTATION RECOMMANDÉ

### 📊 Structure (5 minutes)

**Montrer au prof:**

1. **Présentation générale** (30 sec)
   ```bash
   php demo_database.php
   # Puis sélectionner option 4: Statistiques
   ```
   Affiche: 5 utilisateurs, 4 articles, 2 commentaires

2. **Les utilisateurs** (1 min)
   ```bash
   # Sélectionner option 1 dans le menu
   ```
   Montrez: Rôles (ADMIN, AUTHOR, USER)

3. **Les articles** (1 min)
   ```bash
   # Sélectionner option 2 dans le menu
   ```
   Montrez: Articles publiés vs brouillons, auteurs

4. **Les relations** (1 min)
   ```bash
   # Sélectionner option 5: Articles avec auteurs
   ```
   Montrez: Comment chaque article est lié à un auteur

5. **Les commentaires** (1 min)
   ```bash
   # Sélectionner option 6: Commentaires avec contexte
   ```
   Montrez: Qui a commenté quel article, avec quel contenu

---

## 💡 POINTS À SOULIGNER AUPRÈS DU PROF

### ✅ Points Techniques Forts:

1. **Normalisation correcte:**
   - Tables bien séparées
   - Pas de redondance de données
   - Clés primaires et étrangères

2. **Intégrité référentielle:**
   - Articles liés aux utilisateurs
   - Commentaires liés aux articles ET aux utilisateurs
   - Foreign keys correctement configurées

3. **Types de données appropriés:**
   - TEXT pour les contenus longs
   - VARCHAR pour les textes courts
   - JSON pour les rôles (flexible)
   - BOOLEAN pour published
   - TIMESTAMP pour audit

4. **Traçabilité:**
   - created_at, updated_at, published_at
   - Permet de voir qui a fait quoi, quand

5. **Système de rôles:**
   - ADMIN, AUTHOR, USER
   - Extensible et sécurisé

---

## 📝 CE QU'IL FAUT AVOIR PRÊT

1. **Ce document:** GUIDE_DEMO.md ✅
2. **Présentation:** PRESENTATION_BD_PROF.md ✅
3. **Données actuelles:** 5 utilisateurs, 4 articles, 2 commentaires ✅
4. **Outils:** Symfony CLI (php) ✅
5. **PostgreSQL:** Fonctionnel ✅

---

## 🚨 EN CAS DE PROBLÈME

### Si pgAdmin ne fonctionne pas:
→ Utilisez l'option Symfony (Option 2) ou le script interactif (Option 1)

### Si les données ne s'affichent pas:
→ Relancez le script de finalisation:
```bash
php finalize_db_simple.php
```

### Si PostgreSQL n'est pas en cours d'exécution:
```powershell
net start postgresql-x64-18
```

---

## ✅ CHECKLIST PRE-PRÉSENTATION

- [ ] PostgreSQL est en cours d'exécution
- [ ] Les données sont finalisées (5 utilisateurs, 4 articles)
- [ ] Vous avez accès à un terminal
- [ ] Vous avez les fichiers de présentation ouverts
- [ ] Vous avez testé au moins une commande
- [ ] Vous connaissez les relations entre les tables

---

## 🎤 SCRIPT D'INTRODUCTION (À adapter)

```
"Bonjour [Professeur],

Je vous présente mon projet: une **plateforme de articles avec commentaires**.

Elle est construite avec:
- **Symfony 7.4** pour l'API
- **PostgreSQL 18** pour la base de données
- **React** pour le frontend (optionnel)

La base de données contient:
- 5 utilisateurs avec différents rôles
- 4 articles (publiés et en brouillon)
- 2 commentaires
- Système de relations pour intégrité des données

Voulez-vous que je vous la montre?"
```

---

**Bonne présentation! 🎓🚀**
