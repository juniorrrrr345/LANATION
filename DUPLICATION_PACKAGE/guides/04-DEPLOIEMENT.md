# 🚀 ÉTAPE 4 - DÉPLOIEMENT SUR VERCEL

## 🎯 Objectif
Déployer votre boutique sur Vercel pour qu'elle soit accessible en ligne 24h/24.

---

## 📋 PRÉ-REQUIS

Avant de commencer :
- ✅ Configuration locale terminée (étape 2)
- ✅ Tests locaux réussis
- ✅ Code pushé sur GitHub
- ✅ Compte Vercel connecté à GitHub
- ✅ Tous vos credentials prêts

---

## 1. 🔗 IMPORTATION DU PROJET

### Se connecter à Vercel :
1. Allez sur https://vercel.com
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur **"Add New Project"**

### Importer votre repository :
1. Trouvez votre repository `votre-nouvelle-boutique`
2. Cliquez sur **"Import"**
3. **NE PAS** modifier les settings pour l'instant
4. Cliquez sur **"Deploy"**

**⚠️ Le premier déploiement va ÉCHOUER - c'est normal !**
Il manque les variables d'environnement.

---

## 2. ⚙️ CONFIGURATION DES VARIABLES D'ENVIRONNEMENT

### Accéder aux settings :
1. Dans votre projet Vercel, cliquez sur **"Settings"**
2. Allez dans **"Environment Variables"**

### Ajouter TOUTES les variables :

#### Variables obligatoires :
```bash
# MongoDB
MONGODB_URI
Valeur : mongodb+srv://votre_user:votre_pass@cluster0.xxxxx.mongodb.net/votre_boutique?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME
Valeur : votre_cloud_name

CLOUDINARY_API_KEY
Valeur : votre_api_key

CLOUDINARY_API_SECRET
Valeur : votre_api_secret

# Admin
ADMIN_USERNAME
Valeur : votre_admin_username

ADMIN_PASSWORD
Valeur : votre_mot_de_passe_securise

# NextAuth
NEXTAUTH_SECRET
Valeur : votre_cle_secrete_aleatoire

# Environment
NODE_ENV
Valeur : production
```

### ⚠️ Pour chaque variable :
1. Cliquez **"Add New"**
2. Name : `NOM_DE_LA_VARIABLE`
3. Value : `votre_valeur` (SANS guillemets)
4. Environments : Cochez **ALL** (Production, Preview, Development)
5. Cliquez **"Save"**

---

## 3. 🔄 REDÉPLOIEMENT

### Forcer un nouveau déploiement :
1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les **trois points** du dernier déploiement
3. Cliquez **"Redeploy"**
4. Confirmez avec **"Redeploy"**

### Ou via un nouveau commit :
```bash
# Depuis votre code local
git add .
git commit -m "Add environment variables for Vercel"
git push origin main
```

---

## 4. ✅ VÉRIFICATION DU DÉPLOIEMENT

### Attendre la fin du build :
- Le processus prend 2-5 minutes
- Vous verrez les logs en temps réel
- Attendre que le statut passe à **"Ready"**

### Tester votre boutique :
1. Cliquez sur **"Visit"** ou sur l'URL de votre projet
2. Votre boutique doit s'afficher correctement
3. Le nom de votre boutique doit être visible

### Tests essentiels :
1. **Page d'accueil** : `https://votre-boutique.vercel.app`
   - ✅ La boutique se charge
   - ✅ Pas d'erreurs 500
   - ✅ Le nom de votre boutique s'affiche

2. **Panel admin** : `https://votre-boutique.vercel.app/admin`
   - ✅ La page de connexion s'affiche
   - ✅ Connexion avec vos identifiants
   - ✅ Dashboard admin accessible

3. **Base de données** :
   - ✅ Créer une catégorie de test
   - ✅ Créer un produit de test
   - ✅ Upload d'une image

---

## 5. 🌐 CONFIGURATION DOMAINE (OPTIONNEL)

### Si vous avez un domaine personnalisé :

1. Dans Vercel, allez dans **"Settings" > "Domains"**
2. Cliquez **"Add"**
3. Entrez votre domaine : `votre-boutique.com`
4. Suivez les instructions DNS

### Domaine gratuit Vercel :
Votre boutique sera accessible via :
```
https://votre-projet.vercel.app
```

---

## 6. 🔧 CONFIGURATION AVANCÉE

### Headers de sécurité (Recommandé) :

Créer un fichier `vercel.json` à la racine :
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Règles de redirection (Si besoin) :
```json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

---

## 7. 📊 MONITORING ET ANALYTICS

### Vercel Analytics (Gratuit) :
1. Dans votre projet, allez dans **"Analytics"**
2. Activez **"Enable Analytics"**
3. Vous aurez les statistiques de visite

### Vercel Speed Insights :
```bash
# Ajouter le package
npm install @vercel/speed-insights

# Dans votre layout.tsx, ajouter :
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## 8. 🔄 MISES À JOUR AUTOMATIQUES

### Déploiement automatique :
- ✅ Chaque `git push` sur la branche `main` redéploie automatiquement
- ✅ Vous recevez une notification de succès/échec
- ✅ URL de prévisualisation pour chaque Pull Request

### Workflow recommandé :
```bash
# Développement local
npm run dev

# Tests et modifications
# ...

# Commit et push
git add .
git commit -m "Mise à jour de [fonctionnalité]"
git push origin main

# Vercel redéploie automatiquement
```

---

## 9. 🛡️ SÉCURITÉ PRODUCTION

### Variables sensibles :
- ✅ Toutes vos clés sont sécurisées dans Vercel
- ✅ Jamais exposées côté client
- ✅ Accessibles uniquement côté serveur

### Bonnes pratiques :
1. **Jamais** de credentials dans le code
2. **Toujours** utiliser les variables d'environnement
3. **Rotation** périodique des clés API
4. **Monitoring** des accès suspects

---

## 10. 📱 TEST MOBILE

### Tests responsives :
1. Ouvrez votre boutique sur mobile
2. Testez la navigation
3. Vérifiez l'affichage des produits
4. Testez le panel admin sur mobile

### Outils de test :
- Chrome DevTools (F12 > mode mobile)
- Vrai smartphone
- https://responsivedesignchecker.com

---

## 🎉 FÉLICITATIONS !

### Votre boutique est EN LIGNE ! 🚀

Vous avez maintenant :
- ✅ **Boutique en ligne** accessible 24h/24
- ✅ **Panel admin** fonctionnel
- ✅ **Base de données** séparée et sécurisée
- ✅ **Stockage images** indépendant
- ✅ **Déploiement automatique** à chaque mise à jour

### Informations importantes :
```
🌐 URL Boutique : https://votre-projet.vercel.app
🔧 Admin Panel : https://votre-projet.vercel.app/admin
👤 Admin Login : [votre_username]
🔐 Admin Pass : [votre_password]
```

---

## 🚀 PROCHAINE ÉTAPE

Passez au guide **[05-ADMINISTRATION.md]** pour configurer votre boutique et ajouter vos produits.

**Temps estimé pour cette étape : 10-15 minutes**

---

## 🆘 PROBLÈMES COURANTS

### Build échoue sur Vercel :
1. **Vérifiez les logs** dans l'onglet "Functions"
2. **Erreurs TypeScript** : `npm run build` en local
3. **Variables manquantes** : vérifiez toutes les env vars

### Error 500 sur la boutique :
1. **Vérifiez MongoDB** : connection string correct ?
2. **Vérifiez Cloudinary** : credentials corrects ?
3. **Logs Vercel** : onglet "Functions" > "View Function Logs"

### Admin panel inaccessible :
1. **Variables admin** : `ADMIN_USERNAME` et `ADMIN_PASSWORD` définies ?
2. **NextAuth secret** : `NEXTAUTH_SECRET` défini ?
3. **URL callback** : Vercel configure automatiquement

### Images ne se chargent pas :
1. **Cloudinary config** : vérifiez les 3 variables
2. **CORS policy** : vérifiez les settings Cloudinary
3. **Upload test** : testez depuis le panel admin

### Performance lente :
1. **Plan Vercel** : vous êtes sur Hobby (gratuit) ?
2. **Base MongoDB** : cluster M0 gratuit a des limites
3. **Images optimization** : activé dans next.config.js ?

---

## 🔧 COMMANDES UTILES

```bash
# Logs en temps réel
vercel logs votre-projet

# Redéployer manuellement
vercel --prod

# Lister vos projets
vercel list

# Variables d'environnement
vercel env ls
```

---

**✅ Déploiement réussi ? Configurez votre boutique !**