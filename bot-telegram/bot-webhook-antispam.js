require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const mongoose = require('mongoose');
const { loadConfig, saveConfig, getImagePath } = require('./config');
const { getMainKeyboard, getAdminKeyboard, getSocialManageKeyboard, getSocialLayoutKeyboard, getConfirmKeyboard } = require('./keyboards');
const AntiSpamSystem = require('./antiSpam');

// Configuration Express
const app = express();
const PORT = process.env.PORT || 3000;

// Vérifier les variables d'environnement
if (!process.env.BOT_TOKEN) {
    console.error('❌ BOT_TOKEN n\'est pas défini dans le fichier .env');
    process.exit(1);
}

if (!process.env.ADMIN_ID) {
    console.error('❌ ADMIN_ID n\'est pas défini dans le fichier .env');
    process.exit(1);
}

// URL de votre webhook (à configurer selon votre hébergeur)
const WEBHOOK_URL = process.env.WEBHOOK_URL || `https://your-app.onrender.com`;
const WEBHOOK_PATH = `/bot${process.env.BOT_TOKEN}`;

// Initialiser le bot en mode webhook
const bot = new TelegramBot(process.env.BOT_TOKEN, { 
    webHook: {
        port: PORT,
        autoOpen: false  // On ouvre le serveur manuellement
    }
});

const ADMIN_ID = parseInt(process.env.ADMIN_ID);

// Initialiser le système anti-spam avec configuration optimisée pour webhook
const antiSpam = new AntiSpamSystem({
    maxMessagesPerMinute: 40,      // Un peu plus permissif en webhook (plus efficace)
    maxMessagesPerHour: 200,       
    maxMessagesPerDay: 1000,       
    userRateLimitMinute: 10,       
    userRateLimitHour: 50,         
    minCooldown: 500,              // Cooldown réduit en webhook (plus rapide)
    maxCooldown: 2000,             
    floodThreshold: 3,             
    floodBanDuration: 180000,      
    enableHumanBehavior: true,     
    typingDelay: 30,               // Frappe plus rapide en webhook
    maxTypingDelay: 3000,          
    debug: process.env.DEBUG === 'true'
});

// Ajouter l'admin à la liste blanche
antiSpam.addToWhitelist(ADMIN_ID);

// Middleware Express
app.use(express.json());

// Middleware pour logger les requêtes (optionnel)
if (process.env.DEBUG === 'true') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

// Route pour le webhook Telegram avec protection anti-spam
app.post(WEBHOOK_PATH, async (req, res) => {
    try {
        const update = req.body;
        
        // Vérifier si c'est un message
        if (update.message) {
            const userId = update.message.from.id;
            const messageText = update.message.text || '';
            
            // Vérifier l'anti-spam avant de traiter
            const spamCheck = await antiSpam.canSendMessage(userId, messageText);
            
            if (!spamCheck.allowed) {
                // Envoyer un avertissement si spam détecté
                try {
                    await bot.sendMessage(
                        update.message.chat.id,
                        `⚠️ ${spamCheck.reason}`,
                        { 
                            parse_mode: 'HTML',
                            disable_notification: true 
                        }
                    );
                } catch (error) {
                    console.error('Erreur envoi avertissement anti-spam:', error);
                }
                
                // Répondre OK à Telegram mais ne pas traiter le message
                res.sendStatus(200);
                return;
            }
        }
        
        // Vérifier si c'est un callback_query
        if (update.callback_query) {
            const userId = update.callback_query.from.id;
            const data = update.callback_query.data;
            
            // Vérifier l'anti-spam pour les callbacks
            const spamCheck = await antiSpam.canSendMessage(userId, `callback:${data}`);
            
            if (!spamCheck.allowed) {
                // Répondre avec une alerte
                try {
                    await bot.answerCallbackQuery(update.callback_query.id, {
                        text: '⚠️ Trop de clics rapides. Veuillez patienter.',
                        show_alert: true,
                        cache_time: spamCheck.waitTime
                    });
                } catch (error) {
                    console.error('Erreur callback anti-spam:', error);
                }
                
                // Répondre OK à Telegram mais ne pas traiter le callback
                res.sendStatus(200);
                return;
            }
        }
        
        // Traiter la mise à jour si elle passe l'anti-spam
        bot.processUpdate(update);
        res.sendStatus(200);
        
    } catch (error) {
        console.error('Erreur traitement webhook:', error);
        res.sendStatus(200); // Toujours répondre 200 pour éviter les retry de Telegram
    }
});

// Route de santé pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    const stats = antiSpam.getStats();
    res.send(`
        <h1>🤖 Bot Telegram avec Anti-Spam</h1>
        <p>Status: ✅ En ligne</p>
        <p>Mode: Webhook</p>
        <p>Protection Anti-Spam: ✅ Active</p>
        <h2>📊 Statistiques Anti-Spam</h2>
        <ul>
            <li>Messages (minute): ${stats.globalMessages.minute}/${stats.limits.perMinute}</li>
            <li>Messages (heure): ${stats.globalMessages.hour}/${stats.limits.perHour}</li>
            <li>Messages (jour): ${stats.globalMessages.day}/${stats.limits.perDay}</li>
            <li>Utilisateurs actifs: ${stats.activeUsers}</li>
            <li>Utilisateurs bannis: ${stats.bannedUsers}</li>
        </ul>
        <p>Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}</p>
    `);
});

// Route de santé JSON
app.get('/health', (req, res) => {
    const stats = antiSpam.getStats();
    res.json({ 
        status: 'ok',
        mode: 'webhook',
        antiSpam: 'active',
        stats: stats,
        timestamp: new Date().toISOString()
    });
});

// Route pour obtenir les stats anti-spam (pour monitoring)
app.get('/stats', (req, res) => {
    // Vérifier le token d'authentification si défini
    const authToken = process.env.STATS_TOKEN;
    if (authToken && req.headers.authorization !== `Bearer ${authToken}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const stats = antiSpam.getStats();
    res.json(stats);
});

// État des utilisateurs (pour gérer les conversations)
const userStates = {};
const activeMessages = {};
const users = new Set();
const admins = new Set([ADMIN_ID]);

// Temps de démarrage du bot
const botStartTime = new Date();

// Configuration globale (sera chargée depuis MongoDB)
let config = {};

// Schéma MongoDB pour les utilisateurs
const userSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    username: String,
    firstName: String,
    lastName: String,
    isAdmin: { type: Boolean, default: false },
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now }
});

const User = mongoose.model('BotUser', userSchema);

// Charger la configuration au démarrage
async function initializeBot() {
    try {
        config = await loadConfig();
        console.log('✅ Configuration chargée depuis MongoDB');
        
        // Charger les utilisateurs depuis MongoDB
        const dbUsers = await User.find();
        dbUsers.forEach(user => {
            users.add(user.userId);
            if (user.isAdmin) {
                admins.add(user.userId);
                // Ajouter les admins à la liste blanche anti-spam
                antiSpam.addToWhitelist(user.userId);
            }
        });
        console.log(`✅ ${users.size} utilisateurs chargés`);
        console.log(`✅ ${admins.size} administrateurs en liste blanche`);
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
    }
}

// Configurer le webhook
async function setupWebhook() {
    try {
        // Supprimer l'ancien webhook s'il existe
        await bot.deleteWebHook();
        
        // Configurer le nouveau webhook
        const webhookUrl = `${WEBHOOK_URL}${WEBHOOK_PATH}`;
        const result = await bot.setWebHook(webhookUrl, {
            max_connections: 40,  // Limiter les connexions simultanées
            allowed_updates: ['message', 'callback_query', 'inline_query']
        });
        
        if (result) {
            console.log(`✅ Webhook configuré: ${webhookUrl}`);
            
            // Obtenir les infos du webhook
            const webhookInfo = await bot.getWebHookInfo();
            console.log('📡 Info Webhook:', {
                url: webhookInfo.url,
                has_custom_certificate: webhookInfo.has_custom_certificate,
                pending_update_count: webhookInfo.pending_update_count,
                max_connections: webhookInfo.max_connections,
                ip_address: webhookInfo.ip_address
            });
        } else {
            console.error('❌ Échec de la configuration du webhook');
        }
    } catch (error) {
        console.error('❌ Erreur configuration webhook:', error);
    }
}

// Sauvegarder un utilisateur dans MongoDB
async function saveUser(userId, userInfo = {}) {
    try {
        await User.findOneAndUpdate(
            { userId },
            {
                userId,
                username: userInfo.username,
                firstName: userInfo.first_name,
                lastName: userInfo.last_name,
                lastSeen: new Date()
            },
            { upsert: true, new: true }
        );
        users.add(userId);
    } catch (error) {
        console.error('Erreur sauvegarde utilisateur:', error);
    }
}

// [Ici, copiez toutes les fonctions de gestion des messages depuis bot.js]
// Pour garder ce fichier concis, je ne les répète pas toutes ici
// Mais elles doivent être incluses dans la version finale

// Gestion des erreurs
bot.on('error', (error) => {
    console.error('Erreur bot:', error);
});

bot.on('webhook_error', (error) => {
    console.error('Erreur webhook:', error);
});

// Gestion de l'arrêt gracieux
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du bot...');
    
    try {
        // Supprimer le webhook
        await bot.deleteWebHook();
        console.log('✅ Webhook supprimé');
        
        // Fermer la connexion MongoDB
        await mongoose.connection.close();
        console.log('✅ Connexion MongoDB fermée');
        
        // Arrêter le serveur Express
        server.close(() => {
            console.log('✅ Serveur Express fermé');
            process.exit(0);
        });
        
        // Forcer l'arrêt après 5 secondes
        setTimeout(() => {
            console.error('⚠️ Arrêt forcé après timeout');
            process.exit(1);
        }, 5000);
        
    } catch (error) {
        console.error('Erreur lors de l\'arrêt:', error);
        process.exit(1);
    }
});

// Démarrer le serveur
const server = app.listen(PORT, async () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🛡️ Système Anti-Spam activé`);
    console.log(`📡 Mode: Webhook`);
    
    // Initialiser le bot et configurer le webhook
    await initializeBot();
    await setupWebhook();
    
    console.log('✅ Bot prêt à recevoir des messages!');
    console.log(`📊 Dashboard: ${WEBHOOK_URL}/`);
    console.log(`🔍 Health Check: ${WEBHOOK_URL}/health`);
});

// Export pour les tests
module.exports = { app, bot, antiSpam };