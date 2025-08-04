# 🚀 GUIDE DE DUPLICATION COMPLET - BOUTIQUE PLUGFR1

Ce guide vous permet de dupliquer et configurer une nouvelle boutique totalement indépendante.

## 📋 PRÉREQUIS

- Compte GitHub
- Compte Vercel
- Compte MongoDB Atlas (gratuit)

## 🔧 ÉTAPES DE DUPLICATION

### 1️⃣ CLONER LE REPOSITORY

```bash
# Cloner le repository
git clone https://github.com/juniorrrrr345/LMVRT2.git NOUVELLE_BOUTIQUE

# Entrer dans le dossier
cd NOUVELLE_BOUTIQUE

# Supprimer l'historique Git
rm -rf .git

# Initialiser un nouveau repository
git init
git add .
git commit -m "Initial commit - Nouvelle boutique"
```

### 2️⃣ CRÉER UNE BASE DE DONNÉES MONGODB INDÉPENDANTE

1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un nouveau cluster (gratuit)
3. Créer un utilisateur avec mot de passe
4. Récupérer l'URI de connexion qui ressemble à :
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
   ```

### 3️⃣ CONFIGURATION DE L'ENVIRONNEMENT

Créer un fichier `.env.local` à la racine :

```env
# MongoDB - IMPORTANT: Utiliser votre propre URI
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/MA_BOUTIQUE?retryWrites=true&w=majority

# Admin - Changer le mot de passe
ADMIN_PASSWORD=votre_mot_de_passe_securise

# Optionnel
NODE_ENV=production
```

### 4️⃣ PERSONNALISER LA BOUTIQUE

#### Modifier les informations de base :

1. **src/app/layout.tsx** - Changer le nom de la boutique :
```typescript
export const metadata: Metadata = {
  title: 'MA_BOUTIQUE - Boutique en ligne',
  description: 'MA_BOUTIQUE - Votre boutique en ligne...',
  // ...
}
```

2. **src/components/admin/AdminLogin.tsx** - Changer le logo admin :
```typescript
<h1 className="text-4xl font-black text-white mb-2">MA_BOUTIQUE</h1>
```

3. **src/app/page.tsx** - Personnaliser le message de chargement :
```typescript
<h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-8 tracking-wider animate-pulse">
  MA_BOUTIQUE
</h1>
// ...
<p className="text-white text-base sm:text-lg md:text-xl font-bold tracking-wider mt-6">
  BY MON_NOM 🔌
</p>
```

### 5️⃣ DÉPLOYER SUR VERCEL

1. Créer un nouveau repository GitHub :
   ```bash
   # Ajouter votre nouveau repository
   git remote add origin https://github.com/VOTRE_USERNAME/NOUVELLE_BOUTIQUE.git
   git push -u origin main
   ```

2. Aller sur [Vercel](https://vercel.com)
3. Importer le nouveau repository
4. Configurer les variables d'environnement :
   - `MONGODB_URI` : Votre URI MongoDB
   - `ADMIN_PASSWORD` : Votre mot de passe admin

### 6️⃣ CONFIGURATION POST-DÉPLOIEMENT

1. Accéder à votre boutique : `https://votre-boutique.vercel.app`
2. Aller sur `/admin`
3. Se connecter avec le mot de passe défini
4. Configurer :
   - Titre de la boutique
   - Image de fond
   - Produits
   - Catégories
   - Pages Info et Contact

## 🔐 SÉCURITÉ IMPORTANTE

- **NE JAMAIS** utiliser la même URI MongoDB que la boutique originale
- **TOUJOURS** changer le mot de passe admin
- **NE PAS** commit le fichier `.env.local`

## 📁 STRUCTURE DES FICHIERS À MODIFIER

```
NOUVELLE_BOUTIQUE/
├── src/
│   ├── app/
│   │   ├── layout.tsx (nom de la boutique)
│   │   └── page.tsx (message de chargement)
│   ├── components/
│   │   └── admin/
│   │       └── AdminLogin.tsx (logo admin)
│   └── lib/
│       ├── mongodb-runtime.ts (URI MongoDB)
│       └── mongodb-config.ts (URI MongoDB)
├── .env.local (variables d'environnement)
└── package.json (nom du projet)
```

## ⚡ COMMANDES UTILES

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Builder pour production
npm run build

# Vérifier le build
npm run start
```

## 🆘 DÉPANNAGE

### Erreur de connexion MongoDB
- Vérifier l'URI dans `.env.local`
- Vérifier que l'IP 0.0.0.0/0 est autorisée dans MongoDB Atlas
- Vérifier le nom d'utilisateur et mot de passe

### Page blanche
- Vérifier les logs dans Vercel
- Vérifier la console du navigateur
- S'assurer que toutes les variables d'environnement sont définies

### Mot de passe admin ne fonctionne pas
- Vérifier la variable `ADMIN_PASSWORD` dans Vercel
- Redéployer après avoir ajouté la variable

## ✅ CHECKLIST FINALE

- [ ] Repository GitHub créé et indépendant
- [ ] MongoDB Atlas configuré avec nouvelle base
- [ ] Variables d'environnement définies dans Vercel
- [ ] Nom de la boutique personnalisé partout
- [ ] Mot de passe admin changé
- [ ] Test de connexion admin réussi
- [ ] Test d'ajout de produit réussi

---

💡 **Astuce** : Gardez ce guide pour vos futures duplications !