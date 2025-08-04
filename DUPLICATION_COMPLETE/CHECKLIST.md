# ✅ CHECKLIST DE DUPLICATION

## 🔐 AVANT DE COMMENCER

- [ ] Compte GitHub créé
- [ ] Compte Vercel créé
- [ ] Compte MongoDB Atlas créé

## 📁 DUPLICATION DU CODE

- [ ] Cloner le repository original
- [ ] Supprimer le dossier `.git`
- [ ] Renommer le dossier avec le nom de votre boutique
- [ ] Exécuter `setup-boutique.sh` OU modifier manuellement :
  - [ ] `src/app/layout.tsx` - Nom de la boutique
  - [ ] `src/components/admin/AdminLogin.tsx` - Logo admin
  - [ ] `src/app/page.tsx` - Message de chargement
  - [ ] `src/components/admin/SettingsManager.tsx` - Placeholder

## 🗄️ CONFIGURATION MONGODB

- [ ] Créer un nouveau cluster MongoDB Atlas (gratuit)
- [ ] Créer un utilisateur database
- [ ] Autoriser l'accès depuis n'importe où (0.0.0.0/0)
- [ ] Récupérer l'URI de connexion
- [ ] Modifier l'URI avec le nom de votre base de données
- [ ] NE PAS utiliser l'URI de PLUGFR1

## 🔧 CONFIGURATION LOCALE

- [ ] Créer `.env.local` avec :
  - [ ] `MONGODB_URI` - Votre URI MongoDB
  - [ ] `ADMIN_PASSWORD` - Votre mot de passe
- [ ] Supprimer toute référence à l'ancienne base dans :
  - [ ] `src/lib/mongodb-runtime.ts`
  - [ ] `src/lib/mongodb-config.ts`

## 📤 GITHUB

- [ ] Initialiser Git : `git init`
- [ ] Premier commit : `git add . && git commit -m "Initial commit"`
- [ ] Créer un nouveau repository sur GitHub
- [ ] Ajouter l'origine : `git remote add origin URL_DU_REPO`
- [ ] Pousser : `git push -u origin main`

## 🚀 DÉPLOIEMENT VERCEL

- [ ] Importer le projet depuis GitHub
- [ ] Ajouter les variables d'environnement :
  - [ ] `MONGODB_URI`
  - [ ] `ADMIN_PASSWORD`
- [ ] Déployer
- [ ] Attendre la fin du build
- [ ] Tester l'URL de production

## 🎨 CONFIGURATION ADMIN

- [ ] Accéder à `/admin`
- [ ] Se connecter avec le mot de passe
- [ ] Configuration → Définir :
  - [ ] Titre de la boutique
  - [ ] Image de fond
  - [ ] Texte de chargement
  - [ ] Liens sociaux
- [ ] Créer au moins une catégorie
- [ ] Créer au moins une farm
- [ ] Ajouter un produit test
- [ ] Modifier la page Info
- [ ] Modifier la page Contact

## 🧪 TESTS FINAUX

- [ ] Page d'accueil s'affiche correctement
- [ ] Fond d'écran visible
- [ ] Navigation entre les onglets fluide
- [ ] Ajout au panier fonctionne
- [ ] Pages Info/Contact affichent le bon contenu
- [ ] Panel admin accessible et fonctionnel

## 🔒 SÉCURITÉ

- [ ] `.env.local` dans `.gitignore`
- [ ] Mot de passe admin différent de "admin123"
- [ ] URI MongoDB unique et sécurisée
- [ ] Pas de credentials dans le code

## 📱 VÉRIFICATIONS MOBILE

- [ ] Test sur téléphone
- [ ] Test sur tablette
- [ ] Navigation tactile fluide
- [ ] Textes lisibles
- [ ] Boutons accessibles

## 🎉 FÉLICITATIONS !

Si toutes les cases sont cochées, votre boutique est prête !

### Support

En cas de problème, vérifier :
1. Les logs Vercel
2. La console du navigateur
3. Les guides fournis dans ce dossier

---

💡 **Conseil** : Gardez cette checklist pour vos prochaines duplications !