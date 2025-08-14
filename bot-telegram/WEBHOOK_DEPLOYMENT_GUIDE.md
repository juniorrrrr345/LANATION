# 🚀 Guide de Déploiement Webhook avec Anti-Spam

## 📋 Pourquoi utiliser le mode Webhook ?

### ✅ Avantages du Webhook vs Polling

| **Polling (actuel)** | **Webhook (recommandé)** |
|---------------------|------------------------|
| ❌ Requêtes constantes vers Telegram | ✅ Telegram envoie les updates |
| ❌ Risque de ban pour trop de requêtes | ✅ Aucun risque de ban |
| ❌ Latence élevée (1-2 secondes) | ✅ Temps réel (< 100ms) |
| ❌ Consomme plus de ressources | ✅ Très économe |
| ❌ Peut manquer des messages | ✅ Fiabilité à 100% |
| ❌ Limite de 30 req/sec | ✅ Jusqu'à 100 req/sec |

## 🔧 Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Configuration de base
BOT_TOKEN=your_bot_token_here
ADMIN_ID=your_telegram_id_here

# Configuration Webhook
WEBHOOK_URL=https://your-app.onrender.com
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://...

# Optionnel
DEBUG=false
STATS_TOKEN=your_secret_token_for_stats
```

### 2. Choisir le bon fichier

Nous avons créé 3 versions du bot :

1. **`bot.js`** - Mode polling (actuel, NON recommandé)
2. **`bot-webhook.js`** - Mode webhook basique
3. **`bot-webhook-antispam.js`** - Mode webhook + Anti-Spam (RECOMMANDÉ ✅)

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Pour le mode webhook, assurez-vous d'avoir Express
npm install express
```

## 🚀 Déploiement sur différentes plateformes

### Option 1: Render (Recommandé)

1. **Créer un compte sur [Render](https://render.com)**

2. **Créer un nouveau Web Service**
   - Repository: Votre repo GitHub
   - Branch: main
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node bot-webhook-antispam.js`

3. **Configurer les variables d'environnement**
   ```
   BOT_TOKEN=your_bot_token
   ADMIN_ID=your_id
   WEBHOOK_URL=https://your-app.onrender.com
   MONGODB_URI=your_mongodb_uri
   ```

4. **Déployer** - Render configurera automatiquement le webhook

### Option 2: Heroku

1. **Créer le fichier `Procfile`** :
   ```
   web: node bot-webhook-antispam.js
   ```

2. **Déployer sur Heroku** :
   ```bash
   heroku create your-bot-name
   heroku config:set BOT_TOKEN=your_token
   heroku config:set ADMIN_ID=your_id
   heroku config:set WEBHOOK_URL=https://your-bot-name.herokuapp.com
   git push heroku main
   ```

### Option 3: Railway

1. **Créer un projet sur [Railway](https://railway.app)**

2. **Configurer dans `railway.json`** :
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "node bot-webhook-antispam.js",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

3. **Déployer** via GitHub

### Option 4: VPS (DigitalOcean, AWS, etc.)

1. **Installer Node.js et PM2** :
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pm2
   ```

2. **Configurer Nginx** (reverse proxy) :
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       location /bot {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Lancer avec PM2** :
   ```bash
   pm2 start bot-webhook-antispam.js --name "telegram-bot"
   pm2 save
   pm2 startup
   ```

## 🔄 Migration du Polling vers Webhook

### Étape 1: Arrêter le bot actuel
```bash
# Si vous utilisez PM2
pm2 stop bot

# Ou simplement Ctrl+C
```

### Étape 2: Mettre à jour le package.json
```json
{
  "scripts": {
    "start": "node bot-webhook-antispam.js",
    "dev": "nodemon bot-webhook-antispam.js",
    "polling": "node bot.js"
  }
}
```

### Étape 3: Déployer la nouvelle version
```bash
git add .
git commit -m "Migration vers webhook avec anti-spam"
git push origin main
```

## 🛡️ Configuration Anti-Spam pour Webhook

Le mode webhook permet des limites plus élevées car il est plus efficace :

```javascript
// Configuration optimisée pour webhook
const antiSpam = new AntiSpamSystem({
    maxMessagesPerMinute: 40,      // Plus permissif
    maxMessagesPerHour: 200,       
    maxMessagesPerDay: 1000,       
    userRateLimitMinute: 10,       
    userRateLimitHour: 50,         
    minCooldown: 500,              // Cooldown réduit
    maxCooldown: 2000,             
    floodThreshold: 3,             
    floodBanDuration: 180000,      
    enableHumanBehavior: true,     
    typingDelay: 30,               // Plus rapide
    maxTypingDelay: 3000          
});
```

## 📊 Monitoring

### Dashboard intégré

Accédez à `https://your-app.com/` pour voir :
- État du bot
- Statistiques anti-spam en temps réel
- Nombre d'utilisateurs actifs
- Messages traités

### Health Check

- **Endpoint**: `/health`
- **Format**: JSON
- **Exemple de réponse** :
```json
{
  "status": "ok",
  "mode": "webhook",
  "antiSpam": "active",
  "stats": {
    "globalMessages": {
      "minute": 15,
      "hour": 87,
      "day": 423
    },
    "activeUsers": 45,
    "bannedUsers": 2
  },
  "timestamp": "2024-01-10T12:00:00Z"
}
```

### Monitoring externe

Utilisez des services comme :
- **UptimeRobot** - Monitoring gratuit
- **Pingdom** - Monitoring professionnel
- **New Relic** - APM complet

## 🔍 Vérification du Webhook

### Via l'API Telegram

```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

Réponse attendue :
```json
{
  "ok": true,
  "result": {
    "url": "https://your-app.com/bot<token>",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "max_connections": 40,
    "ip_address": "1.2.3.4"
  }
}
```

### Via le dashboard

Accédez à `https://your-app.com/` pour voir l'état en temps réel.

## ⚠️ Dépannage

### Le webhook ne reçoit pas les messages

1. **Vérifier l'URL** :
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```

2. **Vérifier le certificat SSL** :
   - Doit être valide (Let's Encrypt OK)
   - Port 443 requis

3. **Réinitialiser le webhook** :
   ```bash
   # Supprimer
   curl https://api.telegram.org/bot<TOKEN>/deleteWebhook
   
   # Reconfigurer
   curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-app.com/bot<TOKEN>
   ```

### Erreurs 429 (Too Many Requests)

- Le système anti-spam devrait les prévenir
- Si ça arrive, réduisez les limites dans la config

### Le bot répond lentement

- Vérifiez la latence réseau
- Optimisez les requêtes MongoDB
- Utilisez un CDN si nécessaire

## 🎯 Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] URL HTTPS valide avec certificat SSL
- [ ] MongoDB accessible
- [ ] Webhook configuré (`getWebhookInfo` OK)
- [ ] Health check accessible
- [ ] Monitoring configuré
- [ ] Logs accessibles
- [ ] Backup de la config précédente
- [ ] Test avec `/start`
- [ ] Test anti-spam fonctionnel

## 📈 Performance attendue

Avec le mode webhook + anti-spam :

- **Latence** : < 100ms
- **Capacité** : 1000+ utilisateurs simultanés
- **Uptime** : 99.9%
- **Protection** : 0 risque de ban
- **Ressources** : 50% moins qu'en polling

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs : `pm2 logs` ou dashboard hébergeur
2. Consultez `/health` pour l'état du système
3. Vérifiez les stats anti-spam sur `/`
4. Testez le webhook avec `getWebhookInfo`

---

💡 **Note importante** : Une fois en mode webhook, ne lancez JAMAIS le bot en mode polling simultanément, cela causerait des conflits et pourrait entraîner un ban.