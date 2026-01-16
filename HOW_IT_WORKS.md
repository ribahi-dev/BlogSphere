# 🎬 COMMENT ÇA MARCHE - Profil Auteur

## 📺 En 30 Secondes

1. **Démarrer le backend**
   ```bash
   cd backend && php -S 127.0.0.1:8000 -t public public/index.php
   ```

2. **Démarrer le frontend**
   ```bash
   npm run dev
   ```

3. **Se connecter**
   - Email: `author@test.com`
   - Password: `Password123`

4. **Créer un article**
   - Aller à `/author`
   - Cliquer "Nouvel article"
   - Remplir le formulaire
   - Cliquer "Publier"

**✅ C'est tout ! Votre article est créé et visible ! 📝**

---

## 🎯 Ce Qui Fonctionne

### ✅ Créer un Article
- Titre (obligatoire)
- Description (optionnel)
- Contenu (obligatoire) - Support Markdown

**Résultat:** Article en brouillon (non visible au public)

### ✅ Publier un Article
- Cliquer "Publier"
- L'article devient immédiatement public

**Résultat:** Article visible dans `/articles` et au public

### ✅ Gérer vos Articles
- Voir tous vos articles dans le dashboard (`/author`)
- Modifier n'importe quel article
- Supprimer les articles

**Résultat:** Tableau de bord avec toutes vos actions

### ✅ Rechercher un Article
- Utiliser la barre de recherche
- Filter par titre en temps réel

**Résultat:** Trouvez rapidement votre article

---

## 📊 Votre Espace Auteur

```
Vous connecté (author@test.com)
        ↓
/author (Tableau de bord)
├─ Profil (Nom, email, rôle)
├─ Statistiques (Total, publiés, brouillons)
├─ Barre de recherche
└─ Tableau de vos articles
   ├─ Article 1 [Publié]     - Voir | Modifier | Supprimer
   ├─ Article 2 [Brouillon]  - Voir | Modifier | Supprimer
   └─ Article 3 [Publié]     - Voir | Modifier | Supprimer
```

---

## ✨ Fonctionnalités

| Fonction | Chemin | Temps |
|----------|--------|-------|
| Créer article | `/author/new` | 1 min |
| Voir articles | `/author` | Instantané |
| Modifier article | `/author/edit/:id` | 1 min |
| Publier article | L'article | 0.5s |
| Supprimer article | L'article | 0.5s |
| Voir en public | `/articles/:id` | Instantané |

---

## 🎓 Exemple Pratique

### Étape 1 : Créer un Article

**Aller à `/author/new`**

```
Titre:       "Mon Premier Article"
Description: "Ceci est mon premier article"
Contenu:     "# Bienvenue

             Ceci est mon premier article !
             
             ## Pourquoi je l'écris
             - C'est simple
             - C'est amusant
             - C'est professionnel"
```

### Étape 2 : Choisir une Action

- **Cliquer "Brouillon"** → Article non public (vous seul le voyez)
- **Cliquer "Publier"** → Article public (tout le monde le voit)

### Étape 3 : Voir le Résultat

- Vous êtes redirigé à `/author`
- L'article apparaît dans le tableau
- Statut: "Publié" (si vous avez cliqué Publier)

### Étape 4 : Partagez !

- Cliquer "Voir" dans le menu
- Voir la version publique
- Partager l'URL avec vos amis

---

## 🔧 Troubleshooting Rapide

### L'article ne s'affiche pas
```
1. Vérifier "Publier" (pas "Brouillon")
2. Rafraîchir la page (F5)
3. Vérifier backend tourne : curl http://127.0.0.1:8000/api/articles
```

### Erreur "Network Error"
```
1. Backend pas accessible
2. Vérifier port 8000
3. Redémarrer backend
```

### Erreur "Unauthorized"
```
1. Vous reconnecter
2. Vérifier email/password
3. Token expiré ? Se reconnecter
```

---

## 💡 Tips & Astuces

### Pour un Bon Article
✅ Titre clair et descriptif  
✅ Description pertinente  
✅ Contenu bien structuré avec Markdown  
✅ Relire avant publication  

### Formater Votre Texte avec Markdown
```markdown
# Titre principal
## Sous-titre
### Sous-sous-titre

**Texte en gras**
*Texte en italique*

- Point 1
- Point 2

1. Première chose
2. Deuxième chose

[Lien](https://example.com)
```

### Workflow Recommandé
1. Créer l'article (Brouillon)
2. Modifier/Relire
3. Publier quand prêt
4. Partager !

---

## 📈 Statistiques Temps Réel

Votre dashboard montre :
- **Total** : Nombre d'articles (publiés + brouillons)
- **Publiés** : Nombre visible au public
- **Brouillons** : Nombre non visible (réservé)

---

## 🎯 Actions Possibles

### Sur Chaque Article

| Action | Résultat | Confirmable |
|--------|----------|------------|
| Voir | Ouvre version publique | Non |
| Modifier | Édite l'article | Non |
| Supprimer | Supprime définitivement | **OUI** |

⚠️ **Attention:** La suppression est définitive !

---

## 📱 Responsive Design

✅ Mobile (téléphone)  
✅ Tablet (tablette)  
✅ Desktop (ordinateur)  

Fonctionne sur tous les appareils !

---

## 🔐 Sécurité

- ✅ Vous ne pouvez modifier que vos articles
- ✅ Les autres auteurs ne peuvent pas modifier vos articles
- ✅ Admin peut modifier/supprimer tous les articles
- ✅ Authentification par token JWT
- ✅ Données chiffrées en transit

---

## 🚀 C'est Tout !

Vous avez maintenant :
- ✅ Un système de publication d'articles
- ✅ Un tableau de bord professionnel
- ✅ La possibilité de gérer votre contenu
- ✅ Une interface moderne et intuitive

**Commencez à écrire ! 📝**

---

## 📚 Besoin de Plus d'Aide ?

| Besoin | Fichier |
|--------|---------|
| Démarrage rapide | QUICK_START_AUTHOR.md |
| Guide complet | AUTHOR_GUIDE.md |
| Comprendre visuellement | AUTHOR_VISUAL_GUIDE.md |
| Configuration technique | AUTHOR_SETUP.md |
| Tous les documents | DOCUMENTATION_INDEX.md |

---

**Amusez-vous ! Écrivez ! Partagez ! 🎉**
