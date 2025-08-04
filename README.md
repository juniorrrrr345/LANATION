# 🚀 API MongoDB + Cloudinary

Application Node.js avec MongoDB Atlas et Cloudinary, prête pour le déploiement sur Vercel.

## 📋 Fonctionnalités

- ✅ **MongoDB Atlas** - Base de données cloud
- ✅ **Cloudinary** - Upload et gestion d'images
- ✅ **Express.js** - API REST
- ✅ **Multer** - Gestion des uploads de fichiers
- ✅ **Interface web** - Test des fonctionnalités

## 🔧 Installation locale

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Ou démarrer en production
npm start
```

## 🌐 Déploiement sur Vercel

### 1. Variables d'environnement à configurer

Dans votre dashboard Vercel → Settings → Environment Variables, ajoutez :

| Variable | Valeur |
|----------|---------|
| `MONGODB_URI` | `mongodb+srv://Intd7117:Junior50300.@lanation.cgsbvus.mongodb.net/?retryWrites=true&w=majority&appName=lanation` |
| `CLOUDINARY_CLOUD_NAME` | `dwez3etsh` |
| `CLOUDINARY_API_KEY` | `567536976535776` |
| `CLOUDINARY_API_SECRET` | `RRiC4Hdh50szrTQMDHSRi3kxZZE` |
| `NODE_ENV` | `production` |

### 2. Déploiement

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ou connecter votre repo GitHub pour déploiement automatique
```

## 📡 Endpoints API

### Utilisateurs
- `GET /api/users` - Liste tous les utilisateurs
- `POST /api/users` - Créer un nouvel utilisateur

### Upload d'images
- `POST /api/upload` - Upload d'image vers Cloudinary

### Exemple de création d'utilisateur
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://res.cloudinary.com/dwez3etsh/image/upload/v123/avatar.jpg"
}
```

## 🎨 Interface web

L'application inclut une interface web pour tester toutes les fonctionnalités :
- Formulaire de création d'utilisateur
- Upload d'images vers Cloudinary
- Affichage des utilisateurs

## 🔐 Sécurité

- ✅ Variables d'environnement sécurisées
- ✅ Fichier `.env` ignoré par Git
- ✅ Validation des fichiers uploadés
- ✅ Limite de taille des fichiers (10MB)

## 📁 Structure du projet

```
├── index.js              # Serveur Express principal
├── package.json          # Dépendances
├── vercel.json          # Configuration Vercel
├── .env                 # Variables locales (non commité)
├── .gitignore           # Fichiers ignorés
├── public/              # Fichiers statiques
│   └── index.html       # Interface web
└── uploads/             # Dossier temporaire uploads
```

## 🚀 URLs après déploiement

- **Page d'accueil** : `https://votre-app.vercel.app/`
- **API utilisateurs** : `https://votre-app.vercel.app/api/users`
- **Upload images** : `https://votre-app.vercel.app/api/upload`

## ⚠️ Notes importantes

1. **Redéployez** après avoir ajouté les variables d'environnement
2. **Testez** l'interface web pour vérifier le fonctionnement
3. **Vérifiez** les logs Vercel en cas de problème
4. **Changez** régulièrement vos clés API pour la sécurité

## 🛠️ Développement

```bash
# Mode développement avec nodemon
npm run dev

# Mode production
npm start

# Tester l'API
curl http://localhost:3000/api/users
```

---

**Prêt pour le déploiement ! 🎉**