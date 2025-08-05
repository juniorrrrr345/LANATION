# 🤖 Bot Telegram LANATION - Version Complète

Bot Telegram professionnel avec panel d'administration complet, intégration MongoDB et toutes les fonctionnalités premium.

## ✨ Fonctionnalités

### Pour les utilisateurs
- ✅ Message d'accueil personnalisé avec photo
- ✅ Réseaux sociaux directement dans le menu principal
- ✅ Page d'informations avec image
- ✅ Mini application intégrée (optionnel)
- ✅ Interface propre sans accumulation de messages

### Pour les administrateurs (/admin)
- 📝 Modifier le message d'accueil
- 🖼️ Modifier la photo d'accueil
- 📱 Configurer une mini application
- 🌐 Gérer les réseaux sociaux (ajouter/supprimer/organiser)
- ℹ️ Modifier les informations
- 📢 Envoyer un message à tous les utilisateurs
- 👥 Gérer les administrateurs (super-admin uniquement)
- 📊 Statistiques détaillées du bot

## 🚀 Installation Rapide

### 1. Prérequis
- Node.js 14+ installé
- Compte MongoDB (gratuit sur MongoDB Atlas)
- Bot Telegram créé via @BotFather

### 2. Configuration

1. **Cloner/Copier ce dossier**
```bash
git clone [votre-repo]
cd [votre-dossier]
npm install
```

2. **Créer le fichier .env**
```bash
cp .env.example .env
```

3. **Remplir le fichier .env**
```env
BOT_TOKEN=7637213437:AAEuUpvO9JJaFRfoqt7JN60Mlt2OGTlTNtE  # Votre token
ADMIN_ID=7670522278                                         # Votre ID
MONGODB_URI=mongodb+srv://...                               # Votre MongoDB
```

### 3. Lancer le bot

**En local :**
```bash
npm start
```

**En développement :**
```bash
npm run dev
```

## 📦 Déploiement sur Render

### Option 1 : Déploiement automatique

1. Fork ce repository sur GitHub
2. Allez sur [render.com](https://render.com)
3. Créez un nouveau **Web Service** (gratuit)
4. Connectez votre GitHub
5. Configuration :
   - **Build Command** : `npm install`
   - **Start Command** : `node bot-mongodb.js`
   - **Root Directory** : (laisser vide ou mettre le chemin si dans un sous-dossier)
6. Ajoutez les variables d'environnement
7. Déployez !

### Option 2 : Déploiement manuel

Voir le fichier `DEPLOY_GUIDE.md` pour plus de détails.

## 🎯 Utilisation

### Commandes utilisateur
- `/start` - Affiche le menu principal avec photo et réseaux sociaux

### Commandes admin
- `/admin` - Accède au panel d'administration (admin uniquement)

### Navigation
- Tous les boutons "Retour" ramènent au menu approprié
- Les messages sont automatiquement supprimés pour garder le chat propre
- Les modifications sont instantanées

## 🔧 Configuration initiale

Après le premier lancement, utilisez `/admin` pour :

1. **Définir le message d'accueil**
   - Utilisez `{firstname}` pour personnaliser

2. **Ajouter une photo d'accueil**
   - Envoyez simplement une photo

3. **Configurer les réseaux sociaux**
   - Nom, URL et emoji pour chaque réseau
   - Organisez l'affichage (1-6 boutons par ligne)

4. **Ajouter des informations**
   - Texte affiché avec le bouton ℹ️

## 📁 Structure du projet

```
bot-telegram/
├── bot-mongodb.js      # Fichier principal du bot
├── config.js           # Gestion de la configuration MongoDB
├── models.js           # Modèles MongoDB (Users, Images)
├── keyboards.js        # Claviers Telegram
├── package.json        # Dépendances
├── .env.example        # Template des variables
├── .gitignore          # Fichiers à ignorer
└── README.md           # Ce fichier
```

## 🛠️ Personnalisation

### Modifier les textes par défaut
Éditez `bot-mongodb.js` et cherchez les textes entre guillemets.

### Ajouter de nouvelles fonctionnalités
1. Ajoutez un nouveau bouton dans `keyboards.js`
2. Créez le handler dans `bot-mongodb.js`
3. Ajoutez la logique métier

### Changer le style
Modifiez les emojis et la mise en forme HTML dans les messages.

## 🐛 Dépannage

### Le bot ne répond pas
- Vérifiez le token dans .env
- Vérifiez la connexion MongoDB
- Regardez les logs pour les erreurs

### Erreur 409 Conflict
- Une autre instance du bot tourne
- Arrêtez toutes les autres instances
- Le bot réessaiera automatiquement

### Les modifications ne sont pas sauvegardées
- Vérifiez la connexion MongoDB
- Vérifiez les permissions de la base

## 📊 Base de données

Le bot utilise MongoDB avec les collections suivantes :
- `botconfigs` - Configuration du bot
- `botusers` - Utilisateurs du bot
- `botimages` - Images uploadées (optionnel)

## 🔒 Sécurité

- Ne partagez jamais votre `BOT_TOKEN`
- Gardez votre `MONGODB_URI` privée
- Utilisez des variables d'environnement
- Ne committez jamais le fichier `.env`

## 📝 Changelog

### Version 1.0.0
- ✅ Panel admin complet
- ✅ Intégration MongoDB
- ✅ Gestion des conflits automatique
- ✅ Interface sans spam
- ✅ Réseaux sociaux dans le menu principal
- ✅ Support des images
- ✅ Multi-admin
- ✅ Broadcast messages
- ✅ Statistiques détaillées

## 🤝 Support

Pour toute question ou problème :
1. Vérifiez d'abord ce README
2. Consultez les guides inclus
3. Vérifiez les logs d'erreur

## 📜 License

Ce projet est sous license MIT. Vous êtes libre de l'utiliser et de le modifier.

---

**Créé avec ❤️ pour LANATION**