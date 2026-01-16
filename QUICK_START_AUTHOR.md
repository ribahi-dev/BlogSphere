# 🚀 Quick Start - Profil Auteur

## ⚡ Démarrage Rapide (2 minutes)

### Étape 1: Démarrer le Backend

```bash
cd backend
php bin/console cache:clear
php -S 127.0.0.1:8000 -t public public/index.php
```

ou avec Symfony CLI :
```bash
cd backend
symfony server:start --no-tls --port=8000
```

**✅ Vérifier :** http://127.0.0.1:8000/api/articles (devrait afficher du JSON)

---

### Étape 2: Démarrer le Frontend

Dans un **AUTRE terminal** :

```bash
npm run dev
```

**✅ Vérifier :** http://localhost:5173 (ou le port indiqué)

---

### Étape 3: Se Connecter en tant qu'Auteur

1. Cliquer "Login" (en haut à droite)
2. Entrer :
   - **Email:** author@test.com
   - **Mot de passe:** Password123
3. Cliquer "Se connecter"

---

### Étape 4: Créer un Article

1. Cliquer sur votre **profil** (en haut à droite)
2. Sélectionner **"Espace Auteur"** (ou aller à `/author`)
3. Cliquer **"Nouvel article"**
4. Remplir :
   - **Titre:** "Mon premier article"
   - **Description:** "Ceci est mon premier article"
   - **Contenu:** "# Bienvenue\n\nCeci est du **contenu en Markdown**"
5. Cliquer **"Publier"**

**✅ Résultat :** Article créé et visible dans le tableau !

---

## 📊 Tester les Fonctionnalités

### ✅ Voir vos articles
- L'article apparaît dans le tableau
- Statut: "Publié" (vert)

### ✅ Voir en public
- Cliquer "Voir" (icône 👁️)
- L'article s'affiche sur `/articles`

### ✅ Modifier
- Cliquer "Modifier" (icône ✏️)
- Changer le titre
- Cliquer "Brouillon"

### ✅ Supprimer
- Cliquer "..." (menu)
- Cliquer "Supprimer"
- Confirmer

---

## 📁 Fichiers Importants

| Fichier | Utilité |
|---------|---------|
| `src/pages/ArticleEditor.tsx` | Créer/modifier articles |
| `src/pages/AuthorDashboard.tsx` | Gérer ses articles |
| `src/services/api.ts` | Communication backend |
| `AUTHOR_GUIDE.md` | Guide complet utilisateur |
| `AUTHOR_SETUP.md` | Configuration technique |

---

## 🐛 Problèmes Courants

### Backend non accessible
```
Erreur: "Failed to fetch"
Solution: 
  1. Vérifier que backend tourne sur 8000
  2. Vérifier curl http://127.0.0.1:8000/api/articles
  3. Redémarrer si nécessaire
```

### Articles ne s'affichent pas
```
Erreur: "Aucun article trouvé"
Solution:
  1. Créer un nouvel article
  2. Cliquer "Publier" (pas "Brouillon")
  3. Rafraîchir la page
```

### Erreur "Unauthorized"
```
Erreur: "Unauthorized"
Solution:
  1. Se reconnecter
  2. Vérifier email/mot de passe
  3. Vérifier le token (F12 → Application → LocalStorage)
```

---

## 🧪 Vérifier le Système

```bash
bash verify_author_system.sh
```

Ce script vérifie :
- ✅ Backend accessible
- ✅ Base de données présente
- ✅ Comptes de test
- ✅ Fichiers frontend
- ✅ Documentation

---

## 📚 Documentation Complète

- **Pour l'utilisateur :** [AUTHOR_GUIDE.md](./AUTHOR_GUIDE.md)
- **Pour le développeur :** [AUTHOR_SETUP.md](./AUTHOR_SETUP.md)
- **Résumé technique :** [AUTHOR_README.md](./AUTHOR_README.md)

---

## 🎯 Comptes de Test

### Auteur
```
Email:    author@test.com
Password: Password123
```

### Admin (optionnel)
```
Email:    admin@test.com
Password: Password123
```

---

## ✅ Checklist

- [ ] Backend démarré et accessible
- [ ] Frontend démarré et accessible
- [ ] Connecté en tant que author@test.com
- [ ] Créé un article de test
- [ ] Publié l'article
- [ ] Vu l'article public
- [ ] Modifié l'article
- [ ] Supprimé l'article (optionnel)

---

## 🎉 C'est Tout !

Vous êtes prêt à utiliser le profil auteur !

**Maintenant :**
- ✏️ Écrivez vos articles
- 📤 Publiez-les
- 🎯 Gérez-les facilement

Bonne rédaction ! 📝

---

*Pour plus de détails, voir [AUTHOR_GUIDE.md](./AUTHOR_GUIDE.md)*
