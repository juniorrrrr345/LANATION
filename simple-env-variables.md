# 🌐 Variables d'environnement pour Vercel

## 🔧 Configuration dans Vercel Dashboard

Allez dans votre projet Vercel → Settings → Environment Variables

### 📋 Variables à ajouter :

| Nom de la variable | Valeur | Description |
|-------------------|---------|-------------|
| `MONGODB_URI` | `mongodb+srv://Intd7117:Junior50300.@lanation.cgsbvus.mongodb.net/?retryWrites=true&w=majority&appName=lanation` | Connection string MongoDB Atlas |
| `CLOUDINARY_CLOUD_NAME` | `dwez3etsh` | Nom du cloud Cloudinary |
| `CLOUDINARY_API_KEY` | `567536976535776` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | `RRiC4Hdh50szrTQMDHSRi3kxZZE` | Secret API Cloudinary |
| `NODE_ENV` | `production` | Environnement de production |

## 🚀 Déploiement

1. **Ajoutez ces 5 variables dans Vercel**
2. **Déployez votre application**
3. **Testez l'interface web**

## 🔗 URLs après déploiement

- **Page d'accueil** : `https://votre-app.vercel.app/`
- **API utilisateurs** : `https://votre-app.vercel.app/api/users`
- **Upload images** : `https://votre-app.vercel.app/api/upload`

## ✅ C'est tout !

Avec ces 5 variables, votre application MongoDB + Cloudinary fonctionnera parfaitement sur Vercel.