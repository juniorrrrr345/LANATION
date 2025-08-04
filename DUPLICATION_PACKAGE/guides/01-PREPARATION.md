# 📋 ÉTAPE 1 - PRÉPARATION DES COMPTES

## 🎯 Objectif
Créer tous les comptes nécessaires et récupérer les credentials requis pour votre nouvelle boutique.

---

## 1. 🐙 COMPTE GITHUB (GRATUIT)

### Si vous n'avez pas de compte GitHub :
1. Allez sur https://github.com
2. Cliquez sur **"Sign up"**
3. Créez votre compte avec :
   - Username unique
   - Email valide
   - Mot de passe fort

### Si vous avez déjà un compte :
✅ Parfait ! Passez à l'étape suivante.

---

## 2. 🚀 COMPTE VERCEL (GRATUIT)

Vercel va héberger votre boutique gratuitement.

### Étapes :
1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"**
3. **IMPORTANT** : Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories
5. Choisissez le plan **"Hobby"** (gratuit)

### ✅ Vérification :
- Vous devez voir le dashboard Vercel
- Votre compte GitHub doit être connecté

---

## 3. 🗄️ MONGODB ATLAS (GRATUIT)

MongoDB Atlas va stocker toutes les données de votre boutique.

### Création du compte :
1. Allez sur https://www.mongodb.com/cloud/atlas
2. Cliquez sur **"Try Free"**
3. Créez votre compte
4. Confirmez votre email

### Configuration du cluster :
1. **Créer un cluster** :
   - Choisissez **"M0 Sandbox"** (gratuit)
   - Provider : **AWS**
   - Région : **Choisissez la plus proche**
   - Nom du cluster : `Cluster0` (ou personnalisé)

2. **Créer un utilisateur** :
   - Username : `votre_username`
   - Password : **GÉNÉREZ un mot de passe fort**
   - **⚠️ NOTEZ BIEN ces identifiants !**

3. **Configurer l'accès réseau** :
   - Cliquez sur **"Network Access"**
   - **"Add IP Address"**
   - Choisissez **"Allow access from anywhere"** (0.0.0.0/0)
   - **Confirmer**

4. **Récupérer la Connection String** :
   - Cliquez sur **"Connect"** dans votre cluster
   - Choisissez **"Connect your application"**
   - Copiez la connection string qui ressemble à :
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - **Remplacez `<password>` par votre vraie mot de passe**
   - **Ajoutez le nom de votre base à la fin :**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ma_boutique?retryWrites=true&w=majority
   ```

### ✅ À Noter :
```
MongoDB URI : mongodb+srv://...
Username : [votre_username]
Password : [votre_password]
Database : [nom_de_votre_boutique]
```

---

## 4. ☁️ CLOUDINARY (GRATUIT)

Cloudinary va stocker toutes les images de vos produits.

### Création du compte :
1. Allez sur https://cloudinary.com
2. Cliquez sur **"Sign up for free"**
3. Créez votre compte
4. Confirmez votre email

### Récupération des credentials :
1. Connectez-vous à votre dashboard
2. En haut à droite, vous verrez vos **Account Details** :
   - **Cloud name** : `votre_cloud_name`
   - **API Key** : `123456789012345`
   - **API Secret** : `abcdef123456789` (cliquez sur "reveal" pour voir)

### ✅ À Noter :
```
Cloud Name : [votre_cloud_name]
API Key : [votre_api_key]
API Secret : [votre_api_secret]
```

---

## 5. 📱 CANAL TELEGRAM (OPTIONNEL)

Si vous voulez recevoir les commandes via Telegram :

### Création du canal :
1. Ouvrez Telegram
2. Créez un nouveau canal public
3. Choisissez un nom unique : `@votre_boutique_channel`
4. Activez les commentaires si souhaité

### ✅ À Noter :
```
Canal Telegram : @votre_boutique_channel
```

---

## 📝 RÉCAPITULATIF DES INFORMATIONS

Avant de passer à l'étape suivante, assurez-vous d'avoir :

### ✅ Comptes créés :
- [ ] GitHub (connecté à Vercel)
- [ ] Vercel (plan Hobby gratuit)
- [ ] MongoDB Atlas (cluster M0 gratuit)
- [ ] Cloudinary (plan gratuit)
- [ ] Telegram (canal optionnel)

### ✅ Credentials récupérés :
```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Cloudinary
CLOUD_NAME=[votre_cloud_name]
API_KEY=[votre_api_key]
API_SECRET=[votre_api_secret]

# Telegram (optionnel)
CANAL=@votre_boutique_channel
```

### ✅ Informations boutique :
```bash
NOM_BOUTIQUE=[nom_de_votre_boutique]
DESCRIPTION=[description_courte]
ADMIN_USERNAME=[nom_admin_unique]
ADMIN_PASSWORD=[mot_de_passe_fort]
```

---

## 🔧 CONSEILS DE SÉCURITÉ

### Mots de passe forts :
- Au moins 12 caractères
- Mélange de lettres, chiffres, symboles
- Uniques pour chaque service
- Utiliser un gestionnaire de mots de passe

### Exemples de mots de passe forts :
```
MonBoutique2024@Secure!
VendreEnLigne#2024$
ECommerce_Top!123
```

### Sauvegarde des credentials :
- Notez tout dans un fichier sécurisé
- Ne partagez jamais vos clés secrètes
- Faites une sauvegarde de vos informations

---

## ⚠️ POINTS IMPORTANTS

### Isolation complète :
- **Utilisez des comptes DIFFÉRENTS** de votre ancienne boutique
- **Credentials UNIQUES** pour éviter les conflits
- **Base de données SÉPARÉE**
- **Stockage images SÉPARÉ**

### Vérifications finales :
- [ ] Tous les comptes sont créés et vérifiés
- [ ] Tous les credentials sont notés et testés
- [ ] La connection MongoDB fonctionne
- [ ] Cloudinary upload autorisé
- [ ] Vercel connecté à GitHub

---

## 🚀 PROCHAINE ÉTAPE

Une fois tout préparé, passez au guide **[02-CLONAGE.md]** pour cloner et configurer votre boutique.

**Temps estimé pour cette étape : 15-20 minutes**

---

## 🆘 PROBLÈMES COURANTS

### MongoDB ne se connecte pas :
- Vérifiez que votre IP est dans la whitelist
- Vérifiez le mot de passe dans la connection string
- Assurez-vous que le cluster est démarré

### Cloudinary refuse l'upload :
- Vérifiez vos credentials API
- Assurez-vous d'être sur le bon account
- Vérifiez les limites du plan gratuit

### Vercel ne se connecte pas :
- Réautorisez l'accès GitHub
- Vérifiez les permissions de repository
- Reconnectez votre compte

---

**✅ Préparation terminée ? Passez à l'étape 2 !**