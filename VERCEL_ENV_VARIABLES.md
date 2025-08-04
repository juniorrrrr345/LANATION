# 🌐 Variables d'environnement pour Vercel - LANATION SHOP

## 🔧 Configuration dans Vercel Dashboard

Allez dans votre projet Vercel → Settings → Environment Variables

### 📋 Variables à ajouter :

| Nom de la variable | Valeur | Description |
|-------------------|---------|-------------|
| `MONGODB_URI` | `mongodb+srv://Intd7117:Junior50300.@lanation.cgsbvus.mongodb.net/?retryWrites=true&w=majority&appName=lanation` | Connection string MongoDB Atlas |
| `CLOUDINARY_CLOUD_NAME` | `dwez3etsh` | Nom du cloud Cloudinary |
| `CLOUDINARY_API_KEY` | `567536976535776` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | `RRiC4Hdh50szrTQMDHSRi3kxZZE` | Secret API Cloudinary |
| `ADMIN_USERNAME` | `admin` | Nom d'utilisateur admin |
| `ADMIN_PASSWORD` | `Admin123!` | Mot de passe admin |
| `NEXTAUTH_SECRET` | `QPsLBwVZRvPG7kH8gXdq3hyD9JjU4smB5rrVrEbD6hs=` | Secret NextAuth |
| `NEXTAUTH_URL` | `https://votre-app.vercel.app` | URL de votre app Vercel |

## 🚀 Déploiement

### 1. Ajoutez toutes ces variables dans Vercel
### 2. Déployez votre application
### 3. Testez le panel admin

## 📊 Panel Admin

**URL Admin** : `https://votre-app.vercel.app/admin`
**Username** : `admin`
**Password** : `Admin123!`

## 🔗 URLs importantes

- **Frontend** : `https://votre-app.vercel.app`
- **Admin** : `https://votre-app.vercel.app/admin`

## ⚠️ Notes importantes

1. **Changez** le mot de passe admin après le premier login
2. **Générez** un nouveau NEXTAUTH_SECRET pour la production
3. **Configurez** vos vraies URLs dans NEXTAUTH_URL
4. **Redéployez** après avoir ajouté les variables d'environnement

## ✅ Configuration terminée

Avec ces 8 variables, votre boutique LANATION SHOP fonctionnera parfaitement sur Vercel !