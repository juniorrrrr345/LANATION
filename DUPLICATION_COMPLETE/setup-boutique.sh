#!/bin/bash

echo "🚀 CONFIGURATION AUTOMATIQUE DE LA NOUVELLE BOUTIQUE"
echo "===================================================="

# Demander les informations
read -p "📝 Nom de votre boutique : " SHOP_NAME
read -p "👤 Votre nom/signature (ex: BY JOHN) : " SIGNATURE
read -p "🔐 Mot de passe admin : " ADMIN_PASSWORD
read -p "🌐 Nom du repository GitHub (ex: ma-boutique) : " REPO_NAME
read -p "👤 Votre username GitHub : " GITHUB_USERNAME

echo ""
echo "📋 Récapitulatif :"
echo "- Boutique : $SHOP_NAME"
echo "- Signature : $SIGNATURE 🔌"
echo "- Repository : $GITHUB_USERNAME/$REPO_NAME"
echo ""
read -p "✅ Continuer ? (y/n) : " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ Installation annulée"
    exit 1
fi

echo ""
echo "🔧 Configuration en cours..."

# Remplacer dans layout.tsx
sed -i "s/PLUGFR1/$SHOP_NAME/g" src/app/layout.tsx

# Remplacer dans AdminLogin.tsx
sed -i "s/PLUGFR1/$SHOP_NAME/g" src/components/admin/AdminLogin.tsx

# Remplacer dans page.tsx
sed -i "s/PLUGFR1/$SHOP_NAME/g" src/app/page.tsx
sed -i "s/BY PLGSCRTF/$SIGNATURE/g" src/app/page.tsx

# Remplacer dans SettingsManager.tsx
sed -i "s/PLUGFR1/$SHOP_NAME/g" src/components/admin/SettingsManager.tsx

# Créer le fichier .env.local
cat > .env.local << EOF
# MongoDB - IMPORTANT: Remplacer par votre URI
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/${SHOP_NAME,,}?retryWrites=true&w=majority

# Admin
ADMIN_PASSWORD=$ADMIN_PASSWORD

# Environnement
NODE_ENV=production
EOF

# Supprimer les références à l'ancienne base MongoDB
sed -i "s/mongodb+srv:\/\/LTDM:[^@]*@[^\/]*\/ltdm30_shop/mongodb+srv:\/\/USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net\/${SHOP_NAME,,}/g" src/lib/mongodb-runtime.ts
sed -i "s/mongodb+srv:\/\/LTDM:[^@]*@[^\/]*\/ltdm30_shop/mongodb+srv:\/\/USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net\/${SHOP_NAME,,}/g" src/lib/mongodb-config.ts

# Initialiser Git
rm -rf .git
git init
git add .
git commit -m "Initial commit - $SHOP_NAME"

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📝 PROCHAINES ÉTAPES :"
echo "1. Créer une base MongoDB Atlas et récupérer l'URI"
echo "2. Modifier .env.local avec votre URI MongoDB"
echo "3. Créer le repository sur GitHub :"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "   git push -u origin main"
echo "4. Déployer sur Vercel avec les variables d'environnement"
echo ""
echo "🔐 Mot de passe admin : $ADMIN_PASSWORD"
echo ""