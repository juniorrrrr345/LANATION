# JBEL INDUSTRY Shop - Boutique E-commerce Moderne

<!-- Deploy: 2025-01-29 20:16 - NOUVEAU CHARGEMENT MODERNE ACTIVÉ -->

Une boutique e-commerce moderne et élégante avec panel d'administration complet.

## 🚀 Nouveau Chargement Moderne
- Logo animé ⚡
- Titre "JBEL INDUSTRY"
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
git clone https://github.com/juniorrrrr345/HdhBurger.git
cd HdhBurger
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

## 🔄 Duplication pour Nouvelle Boutique

### Méthode Automatique (Recommandée)
```bash
# 1. Fork ce repository sur GitHub
# 2. Cloner votre fork
git clone https://github.com/VOTRE_USERNAME/VOTRE_BOUTIQUE.git
cd VOTRE_BOUTIQUE

# 3. Installer les dépendances
npm install

# 4. Lancer l'assistant de configuration
npm run setup-new-shop

# 5. Suivre les instructions à l'écran
```

### Méthode Manuelle
Consultez [DUPLICATION_GUIDE.md](DUPLICATION_GUIDE.md) pour le guide complet.

## 📱 Technologies Utilisées

- **Frontend** - Next.js 14, React 18, TypeScript
- **Styling** - Tailwind CSS, CSS animations
- **Backend** - Next.js API Routes
- **Base de données** - MongoDB Atlas
- **Upload d'images** - Cloudinary
- **Déploiement** - Vercel
- **Cache** - localStorage + API optimisé

## 🎯 Cas d'Usage

Cette boutique est parfaite pour :
- **Boutiques en ligne** - Vente de produits physiques
- **Catalogues numériques** - Présentation de services
- **Marketplaces** - Multi-vendeurs avec farms
- **Showrooms** - Galeries de produits
- **Sites vitrines** - Avec système de commande

## 📋 Structure du Projet

```
src/
├── app/                 # Pages Next.js 14
├── components/          # Composants React
│   ├── admin/          # Panel d'administration
│   └── ui/             # Composants UI
├── lib/                # Utilitaires et configuration
├── models/             # Modèles MongoDB
└── hooks/              # Hooks React personnalisés

scripts/
└── duplicate-setup.js  # Assistant de duplication

docs/
└── DUPLICATION_GUIDE.md # Guide de duplication complet
```

## 🔐 Sécurité

- **Authentification admin** - Username/password sécurisé
- **Variables d'environnement** - Credentials protégés
- **Validation** - Sanitisation des entrées
- **HTTPS** - Déploiement sécurisé via Vercel

## 🆘 Support

### Documentation
- [Guide de Duplication](DUPLICATION_GUIDE.md)
- [Configuration MongoDB](docs/mongodb-setup.md)
- [Configuration Cloudinary](docs/cloudinary-setup.md)

### Dépannage
- Vérifiez vos variables d'environnement
- Consultez les logs Vercel
- Testez en local avec `npm run dev`

## 🎉 Exemples de Boutiques

Créées avec ce template :
- **HashBurger** - Boutique originale
- **VotreMarque** - Personnalisée avec l'assistant
- **MonShop** - Version customisée

## 📄 Licence

MIT License - Libre d'utilisation pour vos projets commerciaux.

## 🤝 Contribution

Les contributions sont les bienvenues ! 
1. Fork le projet
2. Créez votre branche feature
3. Committez vos changements
4. Push vers la branche
5. Ouvrez une Pull Request

---

**Fait avec ❤️ pour la communauté e-commerce**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/juniorrrrr345/HdhBurger)