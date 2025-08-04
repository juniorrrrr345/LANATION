# 🔧 Configuration des Variables d'Environnement sur Vercel

## ⚠️ IMPORTANT : Les variables d'environnement doivent être configurées dans Vercel

### 📋 Étapes pour configurer les variables :

1. **Allez sur votre projet Vercel** : https://vercel.com/dashboard
2. **Cliquez sur votre projet** `lamainvrtr`
3. **Allez dans Settings** → **Environment Variables**
4. **Ajoutez TOUTES ces variables** :

```
MONGODB_URI=mongodb+srv://lmvrtt2:ALcWY4mLHwvtz1X2@lmvrtt.km9x4q9.mongodb.net/?retryWrites=true&w=majority&appName=LMVRTT
CLOUDINARY_CLOUD_NAME=dagnmkw0e
CLOUDINARY_API_KEY=656387237536358
CLOUDINARY_API_SECRET=APJe9o-RlgaWWHq9zLQ0JztpACI
ADMIN_USERNAME=admin
ADMIN_PASSWORD=JuniorAdmin123
NEXTAUTH_SECRET=QPsLBwVZRvPG7kH8gXdq3hyD9JjU4smB5rrVrEbD6hs=
NEXTAUTH_URL=https://lamainvrtr.vercel.app
```

5. **Cliquez sur "Save"** pour chaque variable
6. **IMPORTANT** : Redéployez votre application après avoir ajouté les variables

### 🔄 Pour redéployer :

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** à côté du dernier déploiement
3. Cliquez sur **Redeploy**
4. Attendez que le déploiement soit terminé

### ✅ Vérification :

Après le redéploiement, testez :
- https://lamainvrtr.vercel.app/admin
- Username : `admin`
- Password : `JuniorAdmin123`

### 🐛 Debug :

Si ça ne fonctionne toujours pas :
1. Vérifiez dans Vercel que les variables sont bien visibles
2. Assurez-vous qu'il n'y a pas d'espaces avant/après les valeurs
3. Vérifiez les logs dans Vercel (onglet Functions)

### 💡 Note :

Le fichier `.env.local` n'est utilisé qu'en développement local. En production sur Vercel, seules les variables configurées dans le dashboard Vercel sont utilisées.