# 🛍️ BOUTIQUE LMVRT2 - VERSION INDÉPENDANTE

Cette boutique est une version **complètement indépendante** de LMVRT2, configurée avec vos propres services.

## 📋 Configuration Actuelle

### 🔧 Services Configurés

1. **MongoDB Atlas**
   - Base de données : `lmvrtt_shop`
   - Cluster : `lmvrtt.km9x4q9.mongodb.net`
   - Utilisateur : `lmvrtt2`

2. **Cloudinary**
   - Cloud Name : `dagnmkw0e`
   - Upload Preset : `boutique_ilage` (à configurer)

3. **Authentification Admin**
   - Username : `admin`
   - Password : `JuniorAdmin123`

## 🚀 Installation Locale

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev
```

La boutique sera accessible sur : http://localhost:3000

## 📱 Déploiement sur Vercel

### Étape 1 : Préparer le Repository GitHub

1. Créez un nouveau repository sur GitHub
2. Poussez ce code :

```bash
git init
git add .
git commit -m "Initial commit - Boutique LMVRT2 indépendante"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git push -u origin main
```

### Étape 2 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Configurez les variables d'environnement :

```env
MONGODB_URI=mongodb+srv://lmvrtt2:ALcWY4mLHwvtz1X2@lmvrtt.km9x4q9.mongodb.net/?retryWrites=true&w=majority&appName=LMVRTT
CLOUDINARY_CLOUD_NAME=dagnmkw0e
CLOUDINARY_API_KEY=656387237536358
CLOUDINARY_API_SECRET=APJe9o-RlgaWWHq9zLQ0JztpACI
ADMIN_USERNAME=admin
ADMIN_PASSWORD=JuniorAdmin123
NEXTAUTH_SECRET=QPsLBwVZRvPG7kH8gXdq3hyD9JjU4smB5rrVrEbD6hs=
NEXTAUTH_URL=https://lamainvrtr.vercel.app
```

5. Cliquez sur "Deploy"

### Étape 3 : Configurer Cloudinary

1. Connectez-vous à Cloudinary avec vos identifiants
2. Allez dans Settings > Upload
3. Créez un nouveau preset :
   - Preset name : `boutique_ilage`
   - Signing Mode : `Unsigned`
   - Folder : `boutique`
4. Sauvegardez

## 🔐 Sécurité

⚠️ **IMPORTANT** : Changez immédiatement ces éléments après le déploiement :

1. **Mot de passe admin** : Le mot de passe est déjà configuré comme `JuniorAdmin123`
2. **NEXTAUTH_SECRET** : Générez un nouveau secret avec :
   ```bash
   openssl rand -base64 32
   ```
3. **NEXTAUTH_URL** : Déjà configuré avec `https://lamainvrtr.vercel.app`

## 📂 Structure du Projet

```
LMVRT2_INDEPENDENT/
├── src/
│   ├── app/              # Pages Next.js
│   ├── components/       # Composants React
│   ├── lib/             # Utilitaires et configurations
│   └── models/          # Modèles MongoDB
├── public/              # Assets statiques
├── .env.local          # Variables d'environnement (ne pas commit)
└── package.json        # Dépendances
```

## 🛠️ Personnalisation

### Changer le nom de la boutique

1. Éditez `src/app/layout.tsx` :
   - Remplacez `PLUGFR1` par votre nom
   
2. Éditez `src/components/admin/AdminLogin.tsx` :
   - Ligne 48 : Remplacez `PLUGFR1`

3. Dans l'admin, allez dans Paramètres pour configurer :
   - Titre de la boutique
   - Sous-titre
   - Image de fond
   - Liens sociaux

### Ajouter des produits

1. Connectez-vous à `/admin`
2. Allez dans "Produits"
3. Cliquez sur "Ajouter un produit"
4. Remplissez les informations
5. Uploadez les images

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans Vercel
2. Assurez-vous que toutes les variables d'environnement sont configurées
3. Vérifiez que l'upload preset Cloudinary est créé
4. Testez la connexion MongoDB depuis MongoDB Compass

## 📝 Notes

- Cette boutique est **indépendante** de l'original
- Toutes les données sont stockées dans votre propre MongoDB
- Les images sont hébergées sur votre compte Cloudinary
- Aucune dépendance avec d'autres projets

---

✨ Votre boutique est prête à être déployée !