# 🚀 GUIDE DE DÉPLOIEMENT VERCEL

## 📋 PRÉREQUIS

- Repository GitHub avec le code de la boutique
- Compte Vercel (gratuit)
- URI MongoDB Atlas configurée
- Mot de passe admin choisi

## 1️⃣ IMPORTER LE PROJET

1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Cliquer sur "New Project"
4. Sélectionner votre repository
5. Cliquer sur "Import"

## 2️⃣ CONFIGURER LES VARIABLES D'ENVIRONNEMENT

Dans la page de configuration, ajouter :

### MONGODB_URI (Obligatoire)
```
Name: MONGODB_URI
Value: mongodb+srv://user:pass@cluster.mongodb.net/ma_boutique?retryWrites=true&w=majority
```

### ADMIN_PASSWORD (Obligatoire)
```
Name: ADMIN_PASSWORD
Value: votre_mot_de_passe_securise
```

### NODE_ENV (Optionnel)
```
Name: NODE_ENV
Value: production
```

## 3️⃣ PARAMÈTRES DE BUILD

Laisser les paramètres par défaut :
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

## 4️⃣ DÉPLOYER

1. Cliquer sur "Deploy"
2. Attendre 2-3 minutes
3. Cliquer sur "Visit" pour voir votre boutique

## 5️⃣ DOMAINE PERSONNALISÉ (OPTIONNEL)

1. Dans Vercel → Settings → Domains
2. Ajouter votre domaine
3. Suivre les instructions DNS

## 🔧 MISE À JOUR

Pour mettre à jour votre boutique :

```bash
git add .
git commit -m "Mise à jour"
git push origin main
```

Vercel redéploiera automatiquement !

## 🆘 DÉPANNAGE

### Erreur de build
- Vérifier les logs dans Vercel
- Vérifier que toutes les variables sont définies
- Vérifier la syntaxe du code

### Page blanche
- Vérifier MONGODB_URI
- Vérifier la console du navigateur (F12)
- Attendre 1-2 minutes après le déploiement

### Erreur 500
- Vérifier les Function Logs dans Vercel
- Souvent lié à MongoDB (URI incorrecte)

## ✅ VÉRIFICATION POST-DÉPLOIEMENT

1. **Page d'accueil** : https://votre-app.vercel.app
   - Doit afficher le chargement puis la boutique

2. **Panel admin** : https://votre-app.vercel.app/admin
   - Doit afficher la page de connexion

3. **Se connecter** avec votre mot de passe
   - Configurer le titre
   - Ajouter une image de fond
   - Créer des catégories
   - Ajouter des produits

## 📱 OPTIMISATIONS

### Performance
- Vercel optimise automatiquement les images
- Le cache est géré automatiquement
- CDN global inclus

### Analytics (Optionnel)
- Activer Vercel Analytics
- Voir les statistiques de visite
- Monitoring des performances

---

💡 **Astuce** : Activez les notifications GitHub dans Vercel pour être alerté des déploiements !