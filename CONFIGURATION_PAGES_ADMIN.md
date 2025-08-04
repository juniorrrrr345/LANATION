# Configuration des Pages Admin - LANATIONDULAIT

## 🚀 Initialisation Rapide

Pour initialiser toutes les pages avec le contenu par défaut professionnel, visitez cette URL après le déploiement :

```
https://votre-domaine.vercel.app/api/init-default-pages
```

Cela créera automatiquement 3 pages avec du contenu professionnel :
- **Page Info** (À propos)
- **Page Contact**
- **Page Questions** (FAQ)

## 📄 Contenu des Pages Par Défaut

### 1. Page Info (À propos)
- Histoire de la boutique
- Valeurs de l'entreprise (Qualité, Service, Innovation, Confiance)
- Avantages (Produits authentiques, Livraison express, Prix compétitifs)
- Engagement et communauté

### 2. Page Contact
- Coordonnées complètes (Email, Téléphone, Adresse)
- Horaires d'ouverture
- Réseaux sociaux
- Information sur le service client

### 3. Page Questions (FAQ)
- Questions sur les commandes
- Informations de livraison
- Options de paiement
- Politique de retours
- Programme fidélité
- Contact et support

## 🛠️ Configuration Manuelle

Si vous préférez configurer manuellement :

1. **Accédez au Panel Admin**
   - Connectez-vous à `/admin`
   - Cliquez sur "Pages" dans le menu

2. **Éditez chaque page**
   - Sélectionnez l'onglet de la page à modifier
   - Modifiez le titre et le contenu
   - Utilisez le format Markdown pour la mise en forme

3. **Syntaxe Markdown Supportée**
   ```markdown
   # Titre principal
   ## Sous-titre
   ### Titre de section
   
   **Texte en gras**
   *Texte en italique*
   
   - Liste à puces
   1. Liste numérotée
   
   `Code inline`
   ```

## 🔄 Réinitialisation

Pour réinitialiser une page spécifique :

### Option 1 : Via l'API
```
/api/reset-info     # Réinitialise uniquement la page Info
/api/init-default-pages  # Réinitialise toutes les pages
```

### Option 2 : Copier-Coller
Les contenus par défaut sont disponibles dans :
- `/workspace/contenu-page-info.md`
- Ou directement depuis ce guide

## 📝 Personnalisation Recommandée

Après l'initialisation, personnalisez :

1. **Informations de contact**
   - Remplacez l'email et le téléphone
   - Mettez votre vraie adresse
   - Ajoutez vos vrais réseaux sociaux

2. **Horaires**
   - Adaptez selon vos disponibilités
   - Ajoutez les jours fériés si nécessaire

3. **FAQ**
   - Ajoutez des questions spécifiques à vos produits
   - Adaptez les politiques de livraison/retour
   - Personnalisez le programme fidélité

## 🎨 Style et Présentation

Le système utilise automatiquement :
- Fond sombre avec effet glassmorphism
- Texte blanc avec accents colorés
- Emojis pour une meilleure lisibilité
- Mise en page responsive

## ⚡ Cache et Performance

- Les pages sont mises en cache côté client
- Le cache est automatiquement invalidé lors des modifications
- Les changements sont visibles immédiatement

## 🆘 Dépannage

Si les pages ne s'affichent pas correctement :

1. Vérifiez la connexion MongoDB
2. Appelez `/api/init-default-pages` pour réinitialiser
3. Videz le cache du navigateur
4. Vérifiez les logs dans la console

## 📊 Structure de la Base de Données

Les pages sont stockées dans la collection `pages` avec la structure :
```json
{
  "slug": "info",
  "title": "À propos",
  "content": "# Contenu Markdown...",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

**Note** : Cette configuration est basée sur les meilleures pratiques du repository LAMAINVRTR, adaptée et améliorée pour LANATIONDULAIT.