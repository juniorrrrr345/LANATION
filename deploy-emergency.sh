#!/bin/bash

# Script de déploiement d'urgence pour Vercel
echo "🚀 Déploiement d'urgence JBEL INDUSTRY"

# Vérifier que nous sommes sur main
git checkout main

# S'assurer que tous les fichiers sont présents
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json manquant!"
    exit 1
fi

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Construire le projet
npm run build

echo "✅ Build réussi! Prêt pour Vercel"