# 🔄 Guide de Duplication - Boutique HashBurger

Ce guide vous permet de dupliquer facilement toute la boutique HashBurger pour créer une nouvelle boutique avec toutes les fonctionnalités.

## 📋 Pré-requis

- Compte GitHub
- Compte Vercel
- Compte MongoDB Atlas (gratuit)
- Compte Cloudinary (gratuit)

## 🚀 Étapes de Duplication

### 1. Fork du Repository

1. Allez sur : https://github.com/juniorrrrr345/HdhBurger
2. Cliquez sur **"Fork"** en haut à droite
3. Renommez le repository avec le nom de votre nouvelle boutique
4. Cliquez sur **"Create fork"**

### 2. Cloner votre Fork

```bash
git clone https://github.com/VOTRE_USERNAME/VOTRE_NOUVELLE_BOUTIQUE.git
cd VOTRE_NOUVELLE_BOUTIQUE
npm install
```

### 3. Configuration MongoDB

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (gratuit)
3. Créez un utilisateur avec accès lecture/écriture
4. Ajoutez votre IP à la whitelist
5. Récupérez votre connection string

### 4. Configuration Cloudinary

1. Allez sur [Cloudinary](https://cloudinary.com/)
2. Créez un compte gratuit
3. Récupérez vos credentials :
   - Cloud Name
   - API Key
   - API Secret

### 5. Variables d'Environnement

Créez un fichier `.env.local` :

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/VOTRE_BOUTIQUE_DB

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Admin (changez ces valeurs)
ADMIN_USERNAME=votre_admin
ADMIN_PASSWORD=votre_mot_de_passe_securise

# NextAuth Secret (générez une clé aléatoire)
NEXTAUTH_SECRET=votre_secret_key_aleatoire
```

### 6. Personnalisation de la Boutique

#### A. Informations de base

Modifiez `src/lib/contentCache.ts` ligne 108-116 :

```typescript
shopTitle: 'VOTRE_NOM_BOUTIQUE',
shopSubtitle: 'Votre Description',
titleStyle: 'glow', // ou 'graffiti'
bannerText: 'Votre message bannière',
scrollingText: 'VOTRE TEXTE DÉFILANT 📲 • CONTACT',
telegramLink: 'https://t.me/votre_channel'
```

#### B. Message de bienvenue

Modifiez `src/app/page.tsx` ligne 75 :

```typescript
Bienvenu(e)s chez VOTRE_BOUTIQUE 📲
```

#### C. Contenu des pages

**Page Info** - `src/lib/contentCache.ts` ligne 123 :
```markdown
# À propos de VOTRE_BOUTIQUE

**VOTRE_BOUTIQUE** est votre description...

## Vos Spécialités
- Votre produit 1
- Votre produit 2
- Votre produit 3
```

**Page Contact** - `src/lib/contentCache.ts` ligne 136 :
```markdown
# Contactez VOTRE_BOUTIQUE

## Contact
**Telegram:** @votre_channel  
**Email:** contact@votre-boutique.com

## Livraison
**Zone:** Votre zone de livraison
```

### 7. Déploiement sur Vercel

1. Allez sur [Vercel](https://vercel.com)
2. Connectez votre compte GitHub
3. Importez votre nouveau repository
4. Ajoutez vos variables d'environnement dans Vercel :
   - Settings → Environment Variables
   - Ajoutez toutes les variables de votre `.env.local`
5. Déployez !

### 8. Configuration Finale

1. Allez sur votre nouvelle boutique déployée
2. Ajoutez `/admin` à l'URL
3. Connectez-vous avec vos identifiants admin
4. Configurez :
   - ⚙️ **Configuration** : Titre, background, liens
   - 📦 **Produits** : Ajoutez vos produits
   - 🏷️ **Catégories** : Créez vos catégories
   - 🚜 **Farms** : Ajoutez vos fournisseurs
   - 📋 **Commandes** : Configurez le lien Telegram
   - 🌐 **Réseaux sociaux** : Ajoutez vos liens

## 🎨 Personnalisation Avancée

### Couleurs et Thème

Modifiez `src/app/globals.css` pour changer :
- Couleurs du thème graffiti (lignes 47-62)
- Animations et effets
- Styles des composants

### Logo et Favicon

Remplacez dans `public/` :
- `favicon.ico`
- `logo.png` (si vous en ajoutez un)

### Métadonnées SEO

Modifiez `src/app/layout.tsx` :
```typescript
title: 'VOTRE_BOUTIQUE - Description',
description: 'Votre description SEO',
```

## 📱 Fonctionnalités Incluses

✅ **Panel Admin Complet**
- Gestion produits, catégories, farms
- Upload d'images Cloudinary
- Configuration background et styles
- Gestion des pages Info/Contact
- Liens réseaux sociaux

✅ **Boutique Client**
- Affichage responsive (mobile/desktop)
- Filtres par catégories et farms
- Détail des produits avec galerie
- Pages Info et Contact dynamiques
- Texte défilant configurable

✅ **Performance**
- Cache instantané localStorage
- Chargement API optimisé
- Background responsive
- Navigation fluide

## 🔧 Maintenance

### Mises à jour du code source
```bash
# Ajouter le repository original comme remote
git remote add upstream https://github.com/juniorrrrr345/HdhBurger.git

# Récupérer les mises à jour
git fetch upstream
git merge upstream/main

# Résoudre les conflits si nécessaire
# Puis push vers votre fork
git push origin main
```

### Sauvegarde des données
- MongoDB Atlas fait des sauvegardes automatiques
- Exportez régulièrement vos produits depuis le panel admin

## 🆘 Support

En cas de problème :
1. Vérifiez vos variables d'environnement
2. Consultez les logs Vercel
3. Vérifiez la connection MongoDB
4. Testez en local avec `npm run dev`

## 🎉 Félicitations !

Votre nouvelle boutique est prête ! Vous avez maintenant :
- Une boutique complète et fonctionnelle
- Un panel admin professionnel
- Toutes les fonctionnalités d'HashBurger
- Votre propre branding et contenu

---

**Fait avec ❤️ par l'équipe HashBurger**