#!/bin/bash

echo "🧹 NETTOYAGE DES RÉFÉRENCES MONGODB"
echo "==================================="

# Fichiers à nettoyer
FILES=(
  "src/lib/mongodb-runtime.ts"
  "src/lib/mongodb-config.ts"
  "src/lib/mongodb-fixed.ts"
)

# Remplacer les URIs MongoDB codées en dur
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Nettoyage de $file..."
    
    # Remplacer l'URI complète par une variable d'environnement
    sed -i "s|mongodb+srv://LTDM:[^'\"]*|process.env.MONGODB_URI || 'mongodb://localhost:27017/ma_boutique|g" "$file"
    
    # Remplacer les références à ltdm30_shop
    sed -i "s/ltdm30_shop/ma_boutique/g" "$file"
    
    # Remplacer LTDM3.0
    sed -i "s/LTDM3\.0/MA_BOUTIQUE/g" "$file"
    sed -i "s/LTDM/MA_BOUTIQUE/g" "$file"
  fi
done

# Nettoyer aussi les commentaires
echo "📝 Nettoyage des commentaires..."
find src -type f -name "*.ts" -o -name "*.tsx" | while read file; do
  sed -i "s/LTDM3\.0/MA_BOUTIQUE/g" "$file" 2>/dev/null || true
  sed -i "s/ltdm30_shop/ma_boutique/g" "$file" 2>/dev/null || true
done

echo ""
echo "✅ Nettoyage terminé !"
echo ""
echo "⚠️  IMPORTANT :"
echo "1. Vérifier que MONGODB_URI est défini dans .env.local"
echo "2. Ne jamais commiter de credentials MongoDB"
echo "3. Chaque boutique doit avoir sa propre base de données"
echo ""