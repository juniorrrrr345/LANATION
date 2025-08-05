# 🚀 Guide d'Installation Rapide - Bot Telegram

## 📋 En 5 minutes, votre bot sera opérationnel !

### 1️⃣ Créer votre bot Telegram (2 min)

1. Ouvrez [@BotFather](https://t.me/botfather) sur Telegram
2. Envoyez `/newbot`
3. Choisissez un nom (ex: "Ma Boutique Bot")
4. Choisissez un username (ex: `maboutique_bot`)
5. **Copiez le token** qui ressemble à : `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2️⃣ Obtenir votre ID Telegram (30 sec)

1. Ouvrez [@userinfobot](https://t.me/userinfobot)
2. **Copiez votre ID** (un nombre comme : `123456789`)

### 3️⃣ Créer une base MongoDB gratuite (2 min)

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit
3. Créez un cluster gratuit (M0)
4. Créez un utilisateur
5. **Copiez l'URI** qui ressemble à :
   ```
   mongodb+srv://username:password@cluster.mongodb.net/botdb?retryWrites=true&w=majority
   ```

### 4️⃣ Configurer le bot (30 sec)

1. **Renommez** `.env.example` en `.env`
2. **Ouvrez** `.env` et remplacez :
   ```env
   BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ADMIN_ID=123456789
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/botdb
   ```

### 5️⃣ Lancer le bot

**Option A : En local**
```bash
npm install
npm start
```

**Option B : Sur Render (gratuit)**
1. Push sur GitHub
2. Connectez sur [Render](https://render.com)
3. Créez un Web Service
4. Ajoutez les variables d'environnement
5. Déployez !

## ✅ C'est fait !

Votre bot est maintenant actif. Testez avec :
- `/start` - Menu principal
- `/admin` - Panel d'administration

## 🎯 Première configuration

1. Allez sur Telegram
2. Envoyez `/admin` à votre bot
3. Configurez :
   - 📝 Message d'accueil
   - 🖼️ Photo d'accueil
   - 🌐 Réseaux sociaux
   - ℹ️ Informations

## ❓ Besoin d'aide ?

- Token invalide ? → Vérifiez avec @BotFather
- MongoDB erreur ? → Vérifiez l'URI et l'IP whitelist (0.0.0.0/0)
- Bot ne répond pas ? → Vérifiez les logs

---

💡 **Astuce** : Gardez ce guide ouvert pendant l'installation !