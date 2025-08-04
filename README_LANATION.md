# 🛍️ LANATION SHOP - Boutique E-commerce Moderne

<!-- Deploy: 2025-01-29 20:16 - NOUVEAU CHARGEMENT MODERNE ACTIVÉ -->

Une boutique e-commerce moderne et élégante avec panel d'administration complet.

## 🚀 Nouveau Chargement Moderne
- Logo animé ⚡
- Titre "LANATION SHOP"
- Barre de progression colorée
- Fond sans écran noir

## ✨ Fonctionnalités

### 🏪 Boutique Client
- **Responsive Design** - Mobile, tablette, desktop
- **Catalogue produits** - Avec filtres par catégories et farms
- **Galerie d'images** - Upload et gestion via Cloudinary
- **Pages dynamiques** - Info et Contact modifiables
- **Texte défilant** - Configurable depuis l'admin
- **Background personnalisé** - Upload d'image de fond
- **Performance optimisée** - Cache instantané et chargement rapide

### 🔧 Panel Admin Complet
- **Gestion Produits** - CRUD complet avec upload d'images
- **Gestion Catégories** - Organisation des produits
- **Gestion Farms** - Fournisseurs/producteurs
- **Configuration** - Titre, sous-titre, background, styles
- **Pages** - Édition du contenu Info et Contact
- **Réseaux sociaux** - Gestion des liens
- **Commandes** - Configuration lien Telegram

### 🎨 Personnalisation
- **Thèmes visuels** - Style "glow" ou "graffiti"
- **Background dynamique** - Image avec opacité et flou réglables
- **Branding complet** - Logo, couleurs, textes
- **SEO optimisé** - Métadonnées configurables

## 🚀 Déploiement Rapide

### Prérequis
- Node.js 18+
- Compte MongoDB Atlas (gratuit)
- Compte Cloudinary (gratuit)
- Compte Vercel (gratuit)

### Installation
```bash
git clone https://github.com/juniorrrrr345/LAMAINVRTR.git
cd LAMAINVRTR
npm install
```

### Configuration
```bash
# Utiliser l'assistant automatique
npm run setup-new-shop

# Ou créer manuellement le fichier .env.local
cp .env.example .env.local
# Puis éditer avec vos valeurs
```

### Développement local
```bash
npm run dev
# Ouvrir http://localhost:3000
# Admin : http://localhost:3000/admin
```

### Déploiement Vercel
1. Push votre code sur GitHub
2. Connecter le repository sur Vercel
3. Ajouter les variables d'environnement
4. Déployer !

## 🔄 Variables d'environnement pour Vercel

### 📋 Variables à ajouter dans Vercel Dashboard :

| Nom de la variable | Valeur |
|-------------------|---------|
| `MONGODB_URI` | `mongodb+srv://Intd7117:Junior50300.@lanation.cgsbvus.mongodb.net/?retryWrites=true&w=majority&appName=lanation` |
| `CLOUDINARY_CLOUD_NAME` | `dwez3etsh` |
| `CLOUDINARY_API_KEY` | `567536976535776` |
| `CLOUDINARY_API_SECRET` | `RRiC4Hdh50szrTQMDHSRi3kxZZE` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `Admin123!` |
| `NEXTAUTH_SECRET` | `QPsLBwVZRvPG7kH8gXdq3hyD9JjU4smB5rrVrEbD6hs=` |
| `NEXTAUTH_URL` | `https://votre-app.vercel.app` |

## 📱 Technologies Utilisées

- **Frontend** - Next.js 14, React 18, TypeScript
- **Styling** - Tailwind CSS
- **Base de données** - MongoDB Atlas
- **Images** - Cloudinary
- **Déploiement** - Vercel
- **Authentification** - NextAuth.js

## 🔗 URLs importantes

- **Frontend** : `https://votre-app.vercel.app`
- **Admin** : `https://votre-app.vercel.app/admin`
- **API** : `https://votre-app.vercel.app/api`

## 📊 Panel Admin

**URL Admin** : `https://votre-app.vercel.app/admin`
**Username** : `admin`
**Password** : `Admin123!`

## ⚠️ Notes importantes

1. **Changez** le mot de passe admin après le premier login
2. **Générez** un nouveau NEXTAUTH_SECRET pour la production
3. **Configurez** vos vraies URLs dans NEXTAUTH_URL
4. **Redéployez** après avoir ajouté les variables d'environnement

## 🎯 Fonctionnalités clés

### 🛒 Gestion des produits
- Ajout/modification/suppression de produits
- Upload d'images via Cloudinary
- Catégorisation et organisation
- Prix et descriptions

### 📱 Interface responsive
- Design adaptatif mobile/desktop
- Navigation intuitive
- Chargement optimisé
- Animations fluides

### 🔧 Administration complète
- Panel d'administration sécurisé
- Gestion des contenus
- Configuration des paramètres
- Statistiques et monitoring

## 🚀 Prêt pour le déploiement !

Votre boutique LANATION SHOP est maintenant configurée et prête pour le déploiement sur Vercel avec tous vos identifiants intégrés.

---

**LANATION SHOP** - Votre boutique en ligne de confiance 🛍️