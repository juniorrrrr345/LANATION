# Variables d'environnement pour Vercel

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

1. **Installer Vercel CLI :**
```bash
npm i -g vercel
```

2. **Déployer :**
```bash
vercel
```

3. **Ou connecter votre repo GitHub et déployer automatiquement**

## 📝 Notes importantes

- ✅ Toutes les variables sont configurées pour la production
- ✅ Les identifiants sont sécurisés dans Vercel
- ✅ L'application est prête pour le déploiement
- ⚠️ N'oubliez pas de redéployer après avoir ajouté les variables d'environnement

## 🔗 URLs de test après déploiement

- `GET /` - Page d'accueil
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur
- `POST /api/upload` - Upload d'image vers Cloudinary