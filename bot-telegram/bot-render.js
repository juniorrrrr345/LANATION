require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const mongoose = require('mongoose');
const { loadConfig, saveConfig, getImagePath } = require('./config');
const { getMainKeyboard, getAdminKeyboard, getSocialManageKeyboard, getSocialLayoutKeyboard, getConfirmKeyboard } = require('./keyboards');
const AntiSpamSystem = require('./antiSpam');

// ====================================
// Configuration pour Render
// ====================================
const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 10000;
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || process.env.WEBHOOK_URL;
const ADMIN_ID = parseInt(process.env.ADMIN_ID);
const MONGODB_URI = process.env.MONGODB_URI;

// Vérification des variables essentielles
if (!TOKEN) {
    console.error('❌ BOT_TOKEN non défini dans les variables d\'environnement');
    process.exit(1);
}

if (!ADMIN_ID) {
    console.error('❌ ADMIN_ID non défini dans les variables d\'environnement');
    process.exit(1);
}

// ====================================
// Créer l'app Express AVANT le bot
// ====================================
const app = express();
app.use(express.json());

// Middleware pour logger les requêtes en mode debug
if (process.env.DEBUG === 'true') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

// ====================================
// Créer le bot en mode webhook pour Render
// ====================================
const bot = new TelegramBot(TOKEN, { 
    webHook: true  // Mode webhook activé (PAS polling!)
});

console.log('🚀 Démarrage du bot en mode WEBHOOK pour Render...');
console.log(`📡 URL attendue: ${RENDER_URL}`);

// ====================================
// Initialiser le système Anti-Spam
// ====================================
const antiSpam = new AntiSpamSystem({
    maxMessagesPerMinute: 40,      // Limite globale par minute
    maxMessagesPerHour: 200,       // Limite globale par heure
    maxMessagesPerDay: 1000,       // Limite globale par jour
    userRateLimitMinute: 10,       // Limite par utilisateur par minute
    userRateLimitHour: 50,          // Limite par utilisateur par heure
    minCooldown: 500,               // Cooldown minimum (ms)
    maxCooldown: 2000,              // Cooldown maximum (ms)
    floodThreshold: 3,              // Seuil de détection de flood
    floodBanDuration: 180000,       // Durée du ban temporaire (3 min)
    enableHumanBehavior: true,      // Simuler comportement humain
    typingDelay: 30,                // Délai de frappe (ms/caractère)
    maxTypingDelay: 3000,           // Délai de frappe max
    debug: process.env.DEBUG === 'true'
});

// Ajouter l'admin à la liste blanche anti-spam
antiSpam.addToWhitelist(ADMIN_ID);
console.log(`✅ Admin ${ADMIN_ID} ajouté à la liste blanche anti-spam`);

// ====================================
// Variables globales
// ====================================
const userStates = {};
const activeMessages = {};
const users = new Set();
const admins = new Set([ADMIN_ID]);
const botStartTime = new Date();
let config = {};

// ====================================
// Schéma MongoDB
// ====================================
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

// ====================================
// Routes Express
// ====================================

// Route de santé OBLIGATOIRE pour Render
app.get('/', (req, res) => {
    const stats = antiSpam.getStats();
    const uptime = Date.now() - botStartTime;
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    
    res.json({ 
        status: '✅ Bot actif',
        mode: 'webhook',
        platform: 'Render',
        bot: {
            username: bot.username || 'En cours de chargement...',
            uptime: `${uptimeHours}h ${uptimeMinutes}m`,
            users: users.size,
            admins: admins.size
        },
        antiSpam: {
            status: 'Active',
            messagesMinute: `${stats.globalMessages.minute}/${stats.limits.perMinute}`,
            messagesHour: `${stats.globalMessages.hour}/${stats.limits.perHour}`,
            activeUsers: stats.activeUsers,
            bannedUsers: stats.bannedUsers
        },
        timestamp: new Date().toISOString()
    });
});

// Route health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Route pour recevoir les webhooks de Telegram avec Anti-Spam
app.post(`/bot${TOKEN}`, async (req, res) => {
    try {
        const update = req.body;
        
        // Vérification Anti-Spam pour les messages
        if (update.message) {
            const userId = update.message.from.id;
            const messageText = update.message.text || '';
            
            const spamCheck = await antiSpam.canSendMessage(userId, messageText);
            
            if (!spamCheck.allowed) {
                // Envoyer un avertissement anti-spam
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
                    console.error('Erreur envoi avertissement anti-spam:', error.message);
                }
                
                // Répondre OK à Telegram mais ne pas traiter le message
                res.sendStatus(200);
                return;
            }
        }
        
        // Vérification Anti-Spam pour les callbacks
        if (update.callback_query) {
            const userId = update.callback_query.from.id;
            const data = update.callback_query.data;
            
            const spamCheck = await antiSpam.canSendMessage(userId, `callback:${data}`);
            
            if (!spamCheck.allowed) {
                try {
                    await bot.answerCallbackQuery(update.callback_query.id, {
                        text: '⚠️ Trop de clics rapides. Veuillez patienter.',
                        show_alert: true,
                        cache_time: spamCheck.waitTime
                    });
                } catch (error) {
                    console.error('Erreur callback anti-spam:', error.message);
                }
                
                res.sendStatus(200);
                return;
            }
        }
        
        // Traiter l'update si elle passe l'anti-spam
        bot.processUpdate(update);
        res.sendStatus(200);
        
    } catch (error) {
        console.error('❌ Erreur traitement webhook:', error.message);
        res.sendStatus(200); // Toujours répondre 200 pour éviter les retry
    }
});

// Route pour les statistiques anti-spam
app.get('/stats', (req, res) => {
    const authToken = process.env.STATS_TOKEN;
    if (authToken && req.headers.authorization !== `Bearer ${authToken}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const stats = antiSpam.getStats();
    res.json(stats);
});

// ====================================
// Fonctions d'initialisation
// ====================================

async function connectMongoDB() {
    if (!MONGODB_URI) {
        console.log('⚠️ MONGODB_URI non défini - Fonctionnement sans base de données');
        return false;
    }
    
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connecté');
        return true;
    } catch (error) {
        console.error('❌ Erreur connexion MongoDB:', error.message);
        return false;
    }
}

async function initializeBot() {
    try {
        console.log('🔧 Initialisation du bot...');
        
        // Connexion MongoDB
        const mongoConnected = await connectMongoDB();
        
        // Charger la configuration
        if (mongoConnected) {
            try {
                config = await loadConfig();
                console.log('✅ Configuration chargée depuis MongoDB');
                
                // Charger les utilisateurs
                const dbUsers = await User.find();
                dbUsers.forEach(user => {
                    users.add(user.userId);
                    if (user.isAdmin) {
                        admins.add(user.userId);
                        antiSpam.addToWhitelist(user.userId);
                    }
                });
                console.log(`✅ ${users.size} utilisateurs chargés`);
            } catch (error) {
                console.log('⚠️ Configuration par défaut utilisée');
                config = {
                    welcomeMessage: 'Bienvenue sur le bot!',
                    infoText: 'Bot en cours de configuration...'
                };
            }
        }
        
        // Configurer le webhook si on est sur Render
        if (RENDER_URL) {
            const webhookUrl = `${RENDER_URL}/bot${TOKEN}`;
            
            console.log('🔗 Configuration du webhook...');
            
            // Supprimer l'ancien webhook
            await bot.deleteWebHook();
            console.log('✅ Ancien webhook supprimé');
            
            // Attendre un peu pour éviter les conflits
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Définir le nouveau webhook
            const result = await bot.setWebHook(webhookUrl, {
                max_connections: 100,
                allowed_updates: ['message', 'callback_query', 'inline_query']
            });
            
            if (result) {
                console.log('✅ Webhook configuré:', webhookUrl);
                
                // Vérifier la configuration
                const webhookInfo = await bot.getWebHookInfo();
                console.log('📡 Info Webhook:', {
                    url: webhookInfo.url ? '✅ Configuré' : '❌ Non configuré',
                    pending: webhookInfo.pending_update_count,
                    lastError: webhookInfo.last_error_message || 'Aucune'
                });
            } else {
                console.error('❌ Échec configuration webhook');
            }
        } else {
            console.log('⚠️ RENDER_EXTERNAL_URL non défini - Mode webhook local');
        }
        
        // Info du bot
        const me = await bot.getMe();
        bot.username = me.username;
        console.log(`✅ Bot connecté: @${me.username} (${me.id})`);
        
        // Configurer les handlers
        setupHandlers();
        
        console.log('🎉 Bot prêt et opérationnel!');
        
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        // Ne pas crash le serveur, continuer à fonctionner
    }
}

// ====================================
// Handlers du bot
// ====================================

function setupHandlers() {
    console.log('⚙️ Configuration des handlers...');
    
    // Handler /start
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        // Sauvegarder l'utilisateur
        await saveUser(userId, msg.from);
        
        // Message de bienvenue avec anti-spam
        const welcomeMsg = `
🎉 <b>Bienvenue sur le Bot!</b>

✅ Mode: Webhook (Render)
🛡️ Protection Anti-Spam: Active
👤 Votre ID: <code>${userId}</code>

${config.welcomeMessage || 'Bot opérationnel!'}

Utilisez /help pour voir les commandes disponibles.
        `;
        
        await bot.sendMessage(chatId, welcomeMsg, {
            parse_mode: 'HTML',
            reply_markup: getMainKeyboard()
        });
    });
    
    // Handler /status - Vérification du webhook
    bot.onText(/\/status/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        if (!admins.has(userId)) {
            await bot.sendMessage(chatId, '❌ Commande réservée aux administrateurs');
            return;
        }
        
        const webhookInfo = await bot.getWebHookInfo();
        const stats = antiSpam.getStats();
        const uptime = Date.now() - botStartTime;
        const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
        const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        
        const statusMsg = `
📊 <b>Status du Bot</b>

🤖 <b>Bot:</b> @${bot.username}
⏱️ <b>Uptime:</b> ${uptimeHours}h ${uptimeMinutes}m
👥 <b>Utilisateurs:</b> ${users.size}

🔗 <b>Webhook:</b>
├ Status: ${webhookInfo.url ? '✅ Configuré' : '❌ Non configuré'}
├ Updates en attente: ${webhookInfo.pending_update_count}
└ Dernière erreur: ${webhookInfo.last_error_message || 'Aucune'}

🛡️ <b>Anti-Spam:</b>
├ Messages/min: ${stats.globalMessages.minute}/${stats.limits.perMinute}
├ Messages/h: ${stats.globalMessages.hour}/${stats.limits.perHour}
├ Utilisateurs actifs: ${stats.activeUsers}
└ Utilisateurs bannis: ${stats.bannedUsers}

🌐 <b>Plateforme:</b> Render
📡 <b>Mode:</b> Webhook
        `;
        
        await bot.sendMessage(chatId, statusMsg, { parse_mode: 'HTML' });
    });
    
    // Handler /help
    bot.onText(/\/help/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        let helpMsg = `
📚 <b>Commandes disponibles:</b>

/start - Démarrer le bot
/help - Afficher cette aide
/id - Voir votre ID Telegram
        `;
        
        if (admins.has(userId)) {
            helpMsg += `

🔧 <b>Commandes Admin:</b>
/status - État du système
/admin - Menu administration
/whitelist <id> - Ajouter à la liste blanche
/blacklist <id> - Bannir un utilisateur
/unban <id> - Débannir un utilisateur
            `;
        }
        
        await bot.sendMessage(chatId, helpMsg, { parse_mode: 'HTML' });
    });
    
    // Handler /id
    bot.onText(/\/id/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const username = msg.from.username ? `@${msg.from.username}` : 'Non défini';
        
        const idMsg = `
🆔 <b>Vos informations:</b>

👤 <b>Nom:</b> ${msg.from.first_name} ${msg.from.last_name || ''}
📛 <b>Username:</b> ${username}
🔢 <b>ID:</b> <code>${userId}</code>

<i>Cliquez sur l'ID pour le copier</i>
        `;
        
        await bot.sendMessage(chatId, idMsg, { parse_mode: 'HTML' });
    });
    
    // Handler /admin
    bot.onText(/\/admin/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        if (!admins.has(userId)) {
            await bot.sendMessage(chatId, '❌ Accès refusé');
            return;
        }
        
        await bot.sendMessage(chatId, '🔧 Menu Administrateur', {
            reply_markup: getAdminKeyboard()
        });
    });
    
    // Commandes Anti-Spam pour les admins
    bot.onText(/\/whitelist(?:\s+(\d+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const targetUserId = match[1] ? parseInt(match[1]) : null;
        
        if (!admins.has(userId)) {
            await bot.sendMessage(chatId, '❌ Commande admin uniquement');
            return;
        }
        
        if (!targetUserId) {
            await bot.sendMessage(chatId, '❌ Usage: /whitelist <user_id>');
            return;
        }
        
        antiSpam.addToWhitelist(targetUserId);
        await bot.sendMessage(chatId, `✅ Utilisateur ${targetUserId} ajouté à la liste blanche`);
    });
    
    bot.onText(/\/blacklist(?:\s+(\d+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const targetUserId = match[1] ? parseInt(match[1]) : null;
        
        if (!admins.has(userId)) {
            await bot.sendMessage(chatId, '❌ Commande admin uniquement');
            return;
        }
        
        if (!targetUserId) {
            await bot.sendMessage(chatId, '❌ Usage: /blacklist <user_id>');
            return;
        }
        
        if (targetUserId === ADMIN_ID) {
            await bot.sendMessage(chatId, '❌ Impossible de bannir l\'admin principal!');
            return;
        }
        
        antiSpam.addToBlacklist(targetUserId);
        await bot.sendMessage(chatId, `🚫 Utilisateur ${targetUserId} banni`);
    });
    
    bot.onText(/\/unban(?:\s+(\d+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const targetUserId = match[1] ? parseInt(match[1]) : null;
        
        if (!admins.has(userId)) {
            await bot.sendMessage(chatId, '❌ Commande admin uniquement');
            return;
        }
        
        if (!targetUserId) {
            await bot.sendMessage(chatId, '❌ Usage: /unban <user_id>');
            return;
        }
        
        antiSpam.removeFromBlacklist(targetUserId);
        antiSpam.resetUser(targetUserId);
        await bot.sendMessage(chatId, `✅ Utilisateur ${targetUserId} débanni`);
    });
    
    // Ajouter ici vos autres handlers selon votre bot...
    
    console.log('✅ Handlers configurés');
}

// Fonction pour sauvegarder un utilisateur
async function saveUser(userId, userInfo = {}) {
    try {
        if (mongoose.connection.readyState === 1) {
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
        }
        users.add(userId);
    } catch (error) {
        console.error('Erreur sauvegarde utilisateur:', error.message);
    }
}

// ====================================
// Gestion des erreurs
// ====================================

bot.on('error', (error) => {
    console.error('❌ Erreur bot:', error.message);
});

bot.on('webhook_error', (error) => {
    console.error('❌ Erreur webhook:', error.message);
});

// ====================================
// Démarrer le serveur Express (IMPORTANT!)
// ====================================

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Serveur Express démarré sur le port ${PORT}`);
    console.log(`📡 En attente du webhook sur /bot${TOKEN ? 'TOKEN' : 'undefined'}`);
    
    // Initialiser le bot après le démarrage du serveur
    initializeBot();
});

// ====================================
// Gestion de l'arrêt propre
// ====================================

process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du bot...');
    
    try {
        // Supprimer le webhook
        await bot.deleteWebHook();
        console.log('✅ Webhook supprimé');
        
        // Fermer MongoDB
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('✅ MongoDB déconnecté');
        }
        
        // Fermer le serveur
        server.close(() => {
            console.log('✅ Serveur fermé');
            process.exit(0);
        });
        
        // Forcer l'arrêt après 5 secondes
        setTimeout(() => {
            console.error('⚠️ Arrêt forcé');
            process.exit(1);
        }, 5000);
        
    } catch (error) {
        console.error('Erreur lors de l\'arrêt:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM reçu, arrêt gracieux...');
    process.emit('SIGINT');
});

// Export pour les tests
module.exports = { app, bot, antiSpam };