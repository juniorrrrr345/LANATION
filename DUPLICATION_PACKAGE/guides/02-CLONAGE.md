# 🔄 ÉTAPE 2 - CLONAGE ET CONFIGURATION

## 🎯 Objectif
Créer une copie complète de la boutique et la configurer avec vos propres credentials.

---

## 📋 PRÉ-REQUIS

Avant de commencer, assurez-vous d'avoir :
- ✅ Tous les comptes créés (étape 1)
- ✅ Tous les credentials notés
- ✅ Git installé sur votre ordinateur
- ✅ Node.js installé (version 18+)

---

## 1. 🍴 FORK DU REPOSITORY

### Option A : Fork via GitHub (Recommandé)
1. Allez sur le repository original de la boutique
2. Cliquez sur **"Fork"** en haut à droite
3. **Renommez** le repository avec le nom de votre boutique :
   ```
   Nom : ma-nouvelle-boutique
   Description : Ma boutique personnalisée
   ```
4. Assurez-vous que le repository est **PUBLIC** (plan gratuit Vercel)
5. Cliquez sur **"Create fork"**

### Option B : Clone direct
```bash
# Cloner le repository
git clone [URL_DU_REPOSITORY_ORIGINAL]
cd [NOM_DU_DOSSIER]

# Supprimer l'origine et ajouter votre nouveau repository
git remote remove origin
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_NOUVELLE_BOUTIQUE.git
```

---

## 2. 💻 INSTALLATION LOCALE

### Cloner votre fork :
```bash
# Cloner votre nouveau repository
git clone https://github.com/VOTRE_USERNAME/VOTRE_NOUVELLE_BOUTIQUE.git
cd VOTRE_NOUVELLE_BOUTIQUE

# Installer les dépendances
npm install
```

### Vérification de l'installation :
```bash
# Tester que tout fonctionne
npm run dev
```
Ouvrez http://localhost:3000 - vous devriez voir la boutique avec les données par défaut.

**⚠️ Arrêtez le serveur (Ctrl+C) avant de continuer**

---

## 3. 🔧 CONFIGURATION AUTOMATIQUE

### Option A : Script Automatique (Recommandé)
```bash
# Lancer le script de configuration
npm run setup-new-shop
```

Le script vous demandera :
1. **Nom de votre boutique** : `Ma Super Boutique`
2. **Description** : `Vente de produits premium`
3. **Canal Telegram** : `@masuperboutique`
4. **Admin username** : `admin_boutique`
5. **Admin password** : `MonMotDePasse123!`
6. **MongoDB URI** : `mongodb+srv://...`
7. **Cloudinary credentials** : `nom, clé, secret`

### Option B : Configuration Manuelle

#### Créer le fichier .env.local :
```bash
# Copier le template
cp DUPLICATION_PACKAGE/templates/.env.template .env.local
```

#### Éditer .env.local avec vos vraies valeurs :
```env
# MongoDB - Remplacez par votre connection string
MONGODB_URI=mongodb+srv://votre_user:votre_pass@cluster0.xxxxx.mongodb.net/votre_boutique?retryWrites=true&w=majority

# Cloudinary - Vos credentials
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Admin - Vos identifiants uniques
ADMIN_USERNAME=votre_admin
ADMIN_PASSWORD=votre_mot_de_passe_securise

# NextAuth Secret - Générez avec: openssl rand -base64 32
NEXTAUTH_SECRET=votre_cle_secrete_aleatoire

NODE_ENV=production
```

---

## 4. 🏪 PERSONNALISATION DE BASE

### Modifier les informations de la boutique :

#### A. Fichier `src/lib/contentCache.ts` (lignes ~170) :
```typescript
shopTitle: 'VOTRE_NOM_BOUTIQUE',
shopSubtitle: 'Votre Description',
scrollingText: 'VOTRE_BOUTIQUE 📲 • CONTACT',
telegramLink: 'https://t.me/votre_channel'
```

#### B. Page d'accueil `src/app/page.tsx` (ligne ~75) :
```typescript
Bienvenu(e)s chez VOTRE_BOUTIQUE 📲
```

#### C. Métadonnées `src/app/layout.tsx` :
```typescript
title: 'VOTRE_BOUTIQUE',
description: 'VOTRE_BOUTIQUE - Votre Description',
```

---

## 5. 🧪 TEST EN LOCAL

### Démarrer le serveur de développement :
```bash
npm run dev
```

### Vérifications importantes :
1. **Page d'accueil** : http://localhost:3000
   - Le nom de votre boutique s'affiche
   - Pas d'erreurs dans la console

2. **Panel admin** : http://localhost:3000/admin
   - Connectez-vous avec vos identifiants
   - Vous devez voir le dashboard admin

3. **Base de données** :
   - Ajoutez une catégorie de test
   - Ajoutez un produit de test
   - Vérifiez que tout se sauvegarde

4. **Upload d'images** :
   - Testez l'upload d'une image produit
   - Vérifiez qu'elle apparaît sur Cloudinary

### ✅ Tests réussis ?
Si tout fonctionne, arrêtez le serveur et passez à l'étape suivante.

---

## 6. 🧹 NETTOYAGE ET PRÉPARATION

### Supprimer les anciennes données :
```bash
# Nettoyer le cache
rm -rf .next
rm -rf node_modules/.cache
rm tsconfig.tsbuildinfo

# Réinstaller proprement
npm install
```

### Commits de vos changements :
```bash
# Ajouter tous les fichiers
git add .

# Commit avec message descriptif
git commit -m "Configuration initiale de [VOTRE_BOUTIQUE]"

# Pousser vers votre repository
git push origin main
```

---

## 7. 📝 VÉRIFICATION FINALE

### Checklist avant déploiement :
- [ ] **Fichier .env.local** créé avec tous vos credentials
- [ ] **Nom de la boutique** personnalisé
- [ ] **Admin credentials** définis et testés
- [ ] **MongoDB** connecté et fonctionnel
- [ ] **Cloudinary** upload testé
- [ ] **Test local** réussi (npm run dev)
- [ ] **Code committé** sur GitHub
- [ ] **Pas d'erreurs** dans la console

### Structure des fichiers créés :
```
votre-boutique/
├── .env.local                    # Vos variables d'environnement
├── CREDENTIALS_[BOUTIQUE].txt    # Sauvegarde des credentials
├── DEPLOIEMENT_GUIDE.md         # Guide suivant
└── ... (reste du code)
```

---

## 8. 🔐 SÉCURITÉ

### Fichiers à NE JAMAIS committer :
```bash
# Vérifiez que .env.local est dans .gitignore
echo ".env.local" >> .gitignore
```

### Sauvegarde des credentials :
- Gardez le fichier `CREDENTIALS_[BOUTIQUE].txt` en sécurité
- Sauvegardez vos informations dans un gestionnaire de mots de passe
- Ne partagez jamais vos clés secrètes

---

## 🚀 PROCHAINE ÉTAPE

Votre boutique est maintenant configurée et prête !

Passez au guide **[04-DEPLOIEMENT.md]** pour la déployer sur Vercel.

**Temps estimé pour cette étape : 10-15 minutes**

---

## 🆘 PROBLÈMES COURANTS

### `npm install` échoue :
```bash
# Nettoyer le cache npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Erreur MongoDB en local :
- Vérifiez votre connection string
- Assurez-vous que votre IP est whitelistée
- Testez la connexion depuis MongoDB Compass

### Erreur Cloudinary :
- Vérifiez vos credentials API
- Assurez-vous d'être sur le bon account
- Testez l'upload depuis leur interface

### Le script setup-new-shop ne fonctionne pas :
```bash
# Lancer manuellement
node DUPLICATION_PACKAGE/setup-new-shop.js
```

### Erreurs de compilation :
```bash
# Vérifier la syntaxe TypeScript
npm run lint
npm run build
```

---

## 📊 VALIDATION

### Comment savoir que tout est OK :
1. ✅ `npm run dev` démarre sans erreur
2. ✅ Le admin panel est accessible
3. ✅ Vous pouvez créer un produit avec image
4. ✅ Les données se sauvegardent dans MongoDB
5. ✅ Le code est pushé sur GitHub

---

**✅ Configuration terminée ? Passez au déploiement !**