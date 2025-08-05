# Guide de déploiement du Bot Telegram sur Render

## 🚀 Déploiement rapide

### 1. Préparer le code

1. **Créer un nouveau repository GitHub** pour votre bot
2. **Copier tous les fichiers** du dossier `bot-telegram` dans ce repo
3. **Commit et push** sur GitHub

### 2. Configuration MongoDB

Vous avez deux options :

#### Option A : Utiliser la même base MongoDB que votre boutique
- Utilisez la même `MONGODB_URI` que votre boutique LANATION
- Les collections seront séparées (BotConfig, BotUser, etc.)

#### Option B : Créer une nouvelle base MongoDB
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster gratuit
3. Créez un utilisateur et récupérez l'URI de connexion

### 3. Créer le bot sur Telegram

1. Ouvrez [@BotFather](https://t.me/botfather) sur Telegram
2. Envoyez `/newbot`
3. Choisissez un nom pour votre bot
4. Choisissez un username (doit finir par `bot`)
5. **Sauvegardez le token** donné par BotFather

### 4. Obtenir votre ID Telegram

1. Ouvrez [@userinfobot](https://t.me/userinfobot)
2. Il vous donnera votre ID (un nombre)
3. **Sauvegardez cet ID**

### 5. Déployer sur Render

1. Allez sur [render.com](https://render.com)
2. Connectez-vous avec GitHub
3. Cliquez sur **New +** → **Background Worker**
4. Sélectionnez votre repository
5. Configurez :
   - **Name** : `bot-telegram-lanation`
   - **Region** : Choisissez la plus proche
   - **Branch** : `main`
   - **Root Directory** : `bot-telegram` (si dans un sous-dossier)
   - **Build Command** : `npm install`
   - **Start Command** : `node bot-mongodb.js`

### 6. Variables d'environnement

Dans Render, ajoutez ces variables :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `BOT_TOKEN` | Token de votre bot | `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz` |
| `ADMIN_ID` | Votre ID Telegram | `123456789` |
| `MONGODB_URI` | URI MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |

### 7. Lancer le déploiement

1. Cliquez sur **Create Background Worker**
2. Render va construire et démarrer votre bot
3. Vérifiez les logs pour voir si tout fonctionne

## 📱 Tester le bot

1. Ouvrez votre bot sur Telegram
2. Envoyez `/start` - vous devriez voir le message d'accueil
3. Envoyez `/admin` - vous devriez voir le panel admin

## 🔧 Configuration du bot

Une fois déployé, utilisez `/admin` pour :

- 📝 Modifier le message d'accueil
- 🖼️ Ajouter une photo d'accueil
- 📱 Configurer une mini app (optionnel)
- 🌐 Ajouter vos réseaux sociaux
- ℹ️ Modifier le texte d'information

## ⚠️ Important

- **Les modifications sont sauvegardées dans MongoDB** et persistent après redémarrage
- Le bot se reconnecte automatiquement en cas de problème
- Les images sont stockées via l'ID Telegram (pas de stockage local)

## 🐛 Dépannage

### Le bot ne répond pas
- Vérifiez le token dans les variables d'environnement
- Vérifiez les logs sur Render
- Assurez-vous que MongoDB est accessible

### Erreur de connexion MongoDB
- Vérifiez l'URI MongoDB
- Assurez-vous que l'IP de Render est whitelistée (0.0.0.0/0 pour tout autoriser)

### Les modifications ne sont pas sauvegardées
- Vérifiez la connexion MongoDB dans les logs
- Assurez-vous que la collection BotConfig existe

## 💡 Tips

1. **Monitoring** : Utilisez [UptimeRobot](https://uptimerobot.com) pour surveiller votre bot
2. **Logs** : Consultez régulièrement les logs sur Render
3. **Backup** : MongoDB Atlas fait des backups automatiques
4. **Sécurité** : Ne partagez jamais votre token bot

## 🔄 Mise à jour

Pour mettre à jour le bot :
1. Push les changements sur GitHub
2. Render redéploiera automatiquement
3. La configuration est préservée dans MongoDB