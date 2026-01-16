# 🎉 Configuration PostgreSQL - COMPLETE!

## ✅ Étapes réalisées:

1. ✅ PostgreSQL 18 configuré
2. ✅ Base de données `app_db` créée
3. ✅ Mot de passe PostgreSQL: `2005`
4. ✅ Extensions PHP PostgreSQL activées
5. ✅ Composer installé

---

## 📋 Étapes restantes (À faire manuellement)

### Étape 1: Redémarrer PostgreSQL en Admin

Ouvrez **PowerShell en Admin** et exécutez:

```powershell
net stop postgresql-x64-18
Start-Sleep -Seconds 2
net start postgresql-x64-18
Start-Sleep -Seconds 3
```

### Étape 2: Exécuter les migrations

```bash
cd "c:\Users\elmeh\Desktop\projet php\backend"
php bin/console doctrine:migrations:migrate --no-interaction
```

### Étape 3: Vérifier l'état

```bash
php bin/console doctrine:migrations:status
```

### Étape 4: Vérifier la connexion à la BD

```bash
php bin/console doctrine:query:sql "SELECT 1"
```

### Étape 5: Lancer le serveur

**Terminal 1 - Backend:**
```bash
cd "c:\Users\elmeh\Desktop\projet php\backend"
php -S 127.0.0.1:8001
```

**Terminal 2 - Frontend:**
```bash
cd "c:\Users\elmeh\Desktop\projet php"
npm run dev
```

---

## 📝 Informations de Connexion

- **Host:** 127.0.0.1
- **Port:** 5432
- **Database:** app_db
- **User:** postgres
- **Password:** 2005

---

## 🔧 Si vous avez des problèmes:

### PostgreSQL ne démarre pas

```powershell
# En Admin:
net stop postgresql-x64-18
Start-Sleep -Seconds 3
net start postgresql-x64-18
```

### Erreur de connexion à la BD

Vérifiez les permissions dans `pg_hba.conf`:

```
C:\Program Files\PostgreSQL\18\data\pg_hba.conf
```

Doit contenir:
```
host    all             all             127.0.0.1/32            md5
```

### Extension PostgreSQL non chargée

Vérifiez `php.ini`:

```
C:\xampp\php\php.ini
```

Doit contenir (sans le ;):
```
extension=pgsql
extension=pdo_pgsql
```

---

## ✅ Checklist Final

- [ ] PostgreSQL en cours d'exécution
- [ ] Base de données `app_db` créée
- [ ] Migrations exécutées
- [ ] Backend démarre sur http://localhost:8001
- [ ] Frontend démarre sur http://localhost:5173
- [ ] Les APIs répondent correctement

---

**Status: ✅ Configuration PostgreSQL Terminée**
**Date: 13 janvier 2026**
**Prêt pour le développement!**
