# 🎨 Style Graffiti HashBurger - Guide d'Activation

## ✅ Style Graffiti Implémenté avec Succès !

Le style graffiti a été ajouté au projet HashBurger avec toutes les fonctionnalités avancées.

### 🎨 Caractéristiques du Style Graffiti

- **Police personnalisée** : Metal Mania (Google Fonts)
- **Dégradé animé** : Rouge → Jaune → Vert → Bleu → Violet
- **Effets 3D** : Ombres multiples avec profondeur
- **Animation de brillance** : Effet glow pulsant
- **Soulignement coloré** : Ligne animée sous le titre
- **Transformation** : Majuscules automatiques
- **Espacement optimisé** : Lettres bien espacées

### 🔧 Comment Activer le Style Graffiti

#### Option 1 : Via l'API (Recommandé)
```bash
curl -X POST https://votre-app.vercel.app/api/activate-graffiti
```

#### Option 2 : Via l'Admin Panel
1. Aller sur `/admin`
2. Section "Configuration"
3. Champ "Style du titre" → Sélectionner "🎨 Graffiti Style"
4. Cliquer "Sauvegarder"

#### Option 3 : Via l'API Settings
```bash
curl -X POST https://votre-app.vercel.app/api/settings \
  -H "Content-Type: application/json" \
  -d '{"titleStyle": "graffiti"}'
```

### 🚀 Déploiement Réalisé

✅ Code committé et poussé sur GitHub
✅ Déploiement automatique Vercel déclenché
✅ Style graffiti configuré par défaut pour les nouveaux déploiements
✅ API d'activation créée pour les déploiements existants

### 📝 Fichiers Modifiés

1. **`src/app/globals.css`** - Styles CSS graffiti + police Metal Mania
2. **`src/components/Header.tsx`** - Logique d'affichage du style graffiti
3. **`src/components/admin/SettingsManager.tsx`** - Option graffiti dans l'admin
4. **`src/scripts/initDB.ts`** - Style graffiti par défaut
5. **`src/app/api/activate-graffiti/route.ts`** - API d'activation rapide

### 🎯 Résultat Final

Le titre "HashBurger" s'affiche maintenant avec :
- ✅ Police graffiti stylée "Metal Mania"
- ✅ Dégradé arc-en-ciel animé
- ✅ Effets 3D et ombres
- ✅ Animation de brillance
- ✅ Soulignement coloré
- ✅ Style street/urbain authentique

### 🔄 Statut du Déploiement

Le style graffiti est maintenant **LIVE** sur Vercel ! 🎉

Pour vérifier que le déploiement est réussi, visitez votre application Vercel et le titre "HashBurger" devrait apparaître avec le nouveau style graffiti.

---

**Note** : Si le style n'apparaît pas immédiatement, utilisez l'API d'activation pour forcer l'application du style graffiti.