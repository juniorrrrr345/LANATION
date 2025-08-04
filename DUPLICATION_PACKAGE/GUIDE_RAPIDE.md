# ⚡ GUIDE RAPIDE - DUPLICATION EN 5 MINUTES

## 🎯 Pour les pressés !

Vous voulez dupliquer votre boutique rapidement ? Suivez ce guide express !

---

## ✅ PRÉ-REQUIS (À AVOIR SOUS LA MAIN)

```bash
# Comptes créés :
- GitHub ✅
- Vercel ✅  
- MongoDB Atlas ✅
- Cloudinary ✅

# Credentials prêts :
MONGODB_URI="mongodb+srv://..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
ADMIN_USERNAME="..."
ADMIN_PASSWORD="..."
```

---

## 🚀 ÉTAPES EXPRESS

### 1. FORK & CLONE (1 min)
```bash
# Sur GitHub : Fork le repository
# Puis :
git clone https://github.com/VOTRE_USERNAME/VOTRE_NOUVELLE_BOUTIQUE.git
cd VOTRE_NOUVELLE_BOUTIQUE
npm install
```

### 2. CONFIGURATION AUTO (2 min)
```bash
# Lancer le script magique :
npm run setup-new-shop

# Il vous demande :
# - Nom boutique
# - Description  
# - Telegram
# - Admin user/pass
# - MongoDB URI
# - Cloudinary credentials
```

### 3. TEST LOCAL (30 sec)
```bash
npm run dev
# Ouvrir http://localhost:3000
# Tester /admin avec vos identifiants
```

### 4. PUSH & DEPLOY (1 min)
```bash
git add .
git commit -m "Configuration nouvelle boutique"
git push origin main

# Sur Vercel.com :
# - Import GitHub repo
# - Add env variables (voir .env.local)
# - Deploy !
```

### 5. CONFIGURATION FINALE (30 sec)
```bash
# Sur votre-boutique.vercel.app/admin :
# - Ajouter catégories
# - Ajouter produits
# - Tester commande
```

---

## 🎉 TERMINÉ !

**Votre boutique est EN LIGNE en 5 minutes !**

```
🌐 Boutique : https://votre-boutique.vercel.app
🔧 Admin : https://votre-boutique.vercel.app/admin
```

---

## 🆘 PROBLÈME ?

### Script ne fonctionne pas :
```bash
# Configuration manuelle :
cp DUPLICATION_PACKAGE/templates/.env.template .env.local
# Éditez .env.local avec vos vraies valeurs
```

### Build échoue sur Vercel :
1. Vérifiez toutes les variables d'environnement
2. Testez `npm run build` en local
3. Consultez les logs Vercel

### Boutique ne s'affiche pas :
1. Vérifiez MongoDB URI
2. Vérifiez Cloudinary credentials
3. Regardez les Function Logs sur Vercel

---

## 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails, consultez :
- **[README_DUPLICATION.md]** - Guide complet
- **[guides/01-PREPARATION.md]** - Création des comptes
- **[guides/04-DEPLOIEMENT.md]** - Déploiement Vercel
- **[guides/05-ADMINISTRATION.md]** - Configuration boutique

---

## 🔧 COMMANDES UTILES

```bash
# Configuration automatique
npm run setup-new-shop

# Validation installation
npm run validate-setup

# Test local
npm run dev

# Nettoyage
npm run cleanup

# Build production
npm run build
```

---

**🚀 Bonne duplication ! Votre boutique vous attend !**