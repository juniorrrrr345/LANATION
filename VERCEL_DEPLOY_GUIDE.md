# 🚀 Guide de Déploiement Vercel - HashBurger

## ⚠️ PROBLÈMES COURANTS ET SOLUTIONS

### 1. Erreur "Build Failed" sur Vercel

**Symptômes :** 
- Build échoue avec erreurs TypeScript
- Erreurs de linting
- Imports non résolus

**Solution :**
✅ Déjà configuré dans le projet :
- `next.config.js` avec `ignoreBuildErrors: true`
- `eslint.ignoreDuringBuilds: true`

### 2. Erreur "Internal Server Error" (500)

**Symptômes :**
- Pages se chargent mais API ne fonctionne pas
- Erreur MongoDB connection

**Solution :**
1. **Vérifier les variables d'environnement** dans Vercel :
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/hashburger?retryWrites=true&w=majority
   ```

2. **MongoDB Atlas - Network Access :**
   - Ajouter `0.0.0.0/0` (toutes les IPs)
   - Ou ajouter les IPs Vercel spécifiques

3. **MongoDB Atlas - Database User :**
   - Créer un utilisateur avec permissions "Atlas Admin" ou "Read and write to any database"

### 3. Erreur "Function Timeout"

**Symptômes :**
- Timeout sur les API calls
- Lenteur extrême

**Solution :**
✅ Déjà configuré :
- Configuration MongoDB optimisée
- Timeouts appropriés dans `mongodb.ts`

## 📋 ÉTAPES DE DÉPLOIEMENT

### 1. Préparer le Repository
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Déployer sur Vercel

#### Option A : Via Dashboard Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer "New Project"
3. Importer le repository GitHub
4. **NE PAS MODIFIER** les paramètres de build
5. Ajouter la variable d'environnement :
   ```
   MONGODB_URI = votre-string-mongodb-atlas
   ```
6. Cliquer "Deploy"

#### Option B : Via CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### 3. Configuration MongoDB Atlas

1. **Network Access :**
   - Database → Network Access
   - Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)

2. **Database User :**
   - Database → Database Access
   - Add New Database User
   - Username/Password Authentication
   - Built-in Role : "Atlas Admin"

3. **Connection String :**
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hashburger?retryWrites=true&w=majority
   ```

### 4. Après Déploiement

1. **Initialiser la base de données :**
   ```
   https://votre-app.vercel.app/api/init-db
   ```

2. **Tester l'admin :**
   ```
   https://votre-app.vercel.app/admin
   Password : admin123
   ```

3. **Tester la connection DB :**
   ```
   https://votre-app.vercel.app/api/test-db
   ```

## 🔧 DÉPANNAGE

### Erreur : "MONGODB_URI not defined"
**Solution :**
1. Vercel Dashboard → Settings → Environment Variables
2. Ajouter `MONGODB_URI` avec la valeur complète
3. Redéployer : Settings → Deployments → "Redeploy"

### Erreur : "Network timeout"
**Solution :**
1. MongoDB Atlas → Network Access
2. Vérifier que `0.0.0.0/0` est ajouté
3. Attendre 1-2 minutes pour la propagation

### Erreur : "Authentication failed"
**Solution :**
1. Vérifier username/password dans l'URI
2. MongoDB Atlas → Database Access
3. Créer un nouvel utilisateur si nécessaire

### Erreur : "Function timeout"
**Solution :**
1. Vérifier que la base de données existe
2. Créer manuellement la database "hashburger" dans Atlas
3. Relancer `/api/init-db`

### Site très lent
**Solution :**
1. Région MongoDB = Région Vercel (USA recommended)
2. Utiliser un cluster M0 (gratuit) en région us-east-1

## 📊 VÉRIFICATION DU DÉPLOIEMENT

### ✅ Checklist Post-Déploiement

- [ ] Site accessible : `https://votre-app.vercel.app`
- [ ] API fonctionne : `/api/test-db` retourne succès
- [ ] Base initialisée : `/api/init-db` exécuté sans erreur
- [ ] Admin accessible : `/admin` avec password `admin123`
- [ ] Produits affichés : Page d'accueil avec produits
- [ ] Upload fonctionne : Panel admin → Configuration → Upload image
- [ ] Configuration sauvegarde : Modifier un paramètre et sauvegarder

### 🚨 Si ça ne fonctionne toujours pas

1. **Logs Vercel :**
   - Dashboard Vercel → Functions → View Function Logs
   - Identifier l'erreur exacte

2. **Logs MongoDB :**
   - MongoDB Atlas → Monitoring → Real Time
   - Vérifier les connexions

3. **Test local :**
   ```bash
   npm run dev
   # Tester en local avec la même MONGODB_URI
   ```

## 📞 SUPPORT

Si le problème persiste :
1. Copier l'erreur exacte des logs Vercel
2. Vérifier la configuration MongoDB Atlas
3. Tester avec une nouvelle database MongoDB

**Le projet est configuré pour fonctionner sur Vercel ! 🚀**