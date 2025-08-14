require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const mongoose = require('mongoose');
const { loadConfig, saveConfig, getImagePath } = require('./config');
const { getMainKeyboard, getAdminKeyboard, getSocialManageKeyboard, getSocialLayoutKeyboard, getConfirmKeyboard } = require('./keyboards');

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

// ====================================
// Créer le bot en mode webhook pour Render
// ====================================
const bot = new TelegramBot(TOKEN, { 
    webHook: true  // Mode webhook activé (PAS polling!)
});

console.log('🚀 Démarrage du bot en mode WEBHOOK pour Render...');
console.log(`📡 URL attendue: ${RENDER_URL}`);

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

// Route pour recevoir les webhooks de Telegram
app.post(`/bot${TOKEN}`, (req, res) => {
    try {
        // Traiter directement l'update sans anti-spam
        bot.processUpdate(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error('❌ Erreur traitement webhook:', error.message);
        res.sendStatus(200); // Toujours répondre 200 pour éviter les retry
    }
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
                max_connections: 40,  // Limite raisonnable
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
        
        // Supprimer le message de commande pour garder le chat propre
        try {
            await bot.deleteMessage(chatId, msg.message_id);
        } catch (error) {}
        
        // Message de bienvenue
        const welcomeMsg = config.welcomeMessage || `
🎉 Bienvenue sur le Bot!

Utilisez les boutons ci-dessous pour naviguer.
        `;
        
        // Envoyer le message avec le clavier
        const sentMessage = await bot.sendMessage(chatId, welcomeMsg, {
            parse_mode: 'HTML',
            reply_markup: getMainKeyboard()
        });
        
        // Stocker l'ID du message actif
        activeMessages[chatId] = sentMessage.message_id;
    });
    
    // Handler /status - Vérification du webhook (admin only)
    bot.onText(/\/status/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        if (!admins.has(userId)) {
            await bot.sendMessage(chatId, '❌ Commande réservée aux administrateurs');
            return;
        }
        
        const webhookInfo = await bot.getWebHookInfo();
        const uptime = Date.now() - botStartTime;
        const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
        const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        
        const statusMsg = `
📊 <b>Status du Bot</b>

🤖 <b>Bot:</b> @${bot.username}
⏱️ <b>Uptime:</b> ${uptimeHours}h ${uptimeMinutes}m
👥 <b>Utilisateurs:</b> ${users.size}
👮 <b>Admins:</b> ${admins.size}

🔗 <b>Webhook:</b>
├ Status: ${webhookInfo.url ? '✅ Configuré' : '❌ Non configuré'}
├ Updates en attente: ${webhookInfo.pending_update_count}
└ Dernière erreur: ${webhookInfo.last_error_message || 'Aucune'}

🌐 <b>Plateforme:</b> Render
📡 <b>Mode:</b> Webhook (sans anti-spam)
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
/addadmin <id> - Ajouter un admin
/removeadmin <id> - Retirer un admin
/broadcast <message> - Envoyer à tous
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
        
        // Supprimer le message de commande
        try {
            await bot.deleteMessage(chatId, msg.message_id);
        } catch (error) {}
        
        // Supprimer l'ancien message actif s'il existe
        if (activeMessages[chatId]) {
            try {
                await bot.deleteMessage(chatId, activeMessages[chatId]);
            } catch (error) {}
        }
        
        // Envoyer le menu admin
        const sentMessage = await bot.sendMessage(chatId, '🔧 Menu Administrateur', {
            reply_markup: getAdminKeyboard()
        });
        
        activeMessages[chatId] = sentMessage.message_id;
    });
    
    // Handler pour ajouter un admin
    bot.onText(/\/addadmin(?:\s+(\d+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const targetUserId = match[1] ? parseInt(match[1]) : null;
        
        if (!admins.has(userId)) {
            await bot.sendMessage(chatId, '❌ Commande admin uniquement');
            return;
        }
        
        if (!targetUserId) {
            await bot.sendMessage(chatId, '❌ Usage: /addadmin <user_id>');
            return;
        }
        
        admins.add(targetUserId);
        
        // Sauvegarder en base si possible
        if (mongoose.connection.readyState === 1) {
            await User.findOneAndUpdate(
                { userId: targetUserId },
                { isAdmin: true },
                { upsert: true }
            );
        }
        
        await bot.sendMessage(chatId, `✅ Utilisateur ${targetUserId} est maintenant admin`);
    });
    
    // Handler pour retirer un admin
    bot.onText(/\/removeadmin(?:\s+(\d+))?/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const targetUserId = match[1] ? parseInt(match[1]) : null;
        
        if (!admins.has(userId)) {
            await bot.sendMessage(chatId, '❌ Commande admin uniquement');
            return;
        }
        
        if (!targetUserId) {
            await bot.sendMessage(chatId, '❌ Usage: /removeadmin <user_id>');
            return;
        }
        
        if (targetUserId === ADMIN_ID) {
            await bot.sendMessage(chatId, '❌ Impossible de retirer l\'admin principal!');
            return;
        }
        
        admins.delete(targetUserId);
        
        // Sauvegarder en base si possible
        if (mongoose.connection.readyState === 1) {
            await User.findOneAndUpdate(
                { userId: targetUserId },
                { isAdmin: false }
            );
        }
        
        await bot.sendMessage(chatId, `✅ Utilisateur ${targetUserId} n'est plus admin`);
    });
    
    // Handler pour broadcast (envoi à tous)
    bot.onText(/\/broadcast(.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const message = match[1].trim();
        
        if (!admins.has(userId)) {
            await bot.sendMessage(chatId, '❌ Commande admin uniquement');
            return;
        }
        
        if (!message) {
            await bot.sendMessage(chatId, '❌ Usage: /broadcast <message>');
            return;
        }
        
        let sent = 0;
        let failed = 0;
        
        for (const uid of users) {
            try {
                await bot.sendMessage(uid, `📢 <b>Message de l'admin:</b>\n\n${message}`, {
                    parse_mode: 'HTML'
                });
                sent++;
                // Petit délai pour éviter d'être trop rapide
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                failed++;
            }
        }
        
        await bot.sendMessage(chatId, `✅ Broadcast terminé\n📤 Envoyés: ${sent}\n❌ Échecs: ${failed}`);
    });
    
    // Handler pour les callbacks (boutons)
    bot.on('callback_query', async (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const messageId = callbackQuery.message.message_id;
        const userId = callbackQuery.from.id;
        const data = callbackQuery.data;
        
        // Répondre au callback pour éviter le spinner
        await bot.answerCallbackQuery(callbackQuery.id);
        
        // Vérifier les permissions admin pour les actions admin
        if (data.startsWith('admin_') && !admins.has(userId)) {
            await bot.answerCallbackQuery(callbackQuery.id, {
                text: '❌ Vous n\'êtes pas autorisé',
                show_alert: true
            });
            return;
        }
        
        // Traiter les différentes actions
        try {
            switch (data) {
                case 'info':
                    await bot.editMessageText(
                        config.infoText || 'Informations du bot',
                        {
                            chat_id: chatId,
                            message_id: messageId,
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [[
                                    { text: '⬅️ Retour', callback_data: 'back_to_main' }
                                ]]
                            }
                        }
                    );
                    break;
                    
                case 'back_to_main':
                    await bot.editMessageText(
                        config.welcomeMessage || 'Menu principal',
                        {
                            chat_id: chatId,
                            message_id: messageId,
                            parse_mode: 'HTML',
                            reply_markup: getMainKeyboard()
                        }
                    );
                    break;
                    
                case 'admin_stats':
                    const totalUsers = users.size;
                    const totalAdmins = admins.size;
                    const uptime = Date.now() - botStartTime;
                    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
                    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
                    
                    const statsMsg = `
📊 <b>Statistiques du Bot</b>

👥 Total utilisateurs: ${totalUsers}
👮 Administrateurs: ${totalAdmins}
⏱️ Uptime: ${uptimeHours}h ${uptimeMinutes}m

🌐 Mode: Webhook (Render)
📅 Démarré: ${botStartTime.toLocaleString('fr-FR')}
                    `;
                    
                    await bot.editMessageText(statsMsg, {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '🔄 Actualiser', callback_data: 'admin_stats' }],
                                [{ text: '⬅️ Retour', callback_data: 'admin_menu' }]
                            ]
                        }
                    });
                    break;
                    
                case 'admin_menu':
                    await bot.editMessageText('🔧 Menu Administrateur', {
                        chat_id: chatId,
                        message_id: messageId,
                        reply_markup: getAdminKeyboard()
                    });
                    break;
                    
                // Ajouter d'autres cas selon vos besoins...
            }
        } catch (error) {
            console.error('Erreur callback:', error);
        }
    });
    
    // Handler pour les messages texte (conversations)
    bot.on('message', async (msg) => {
        // Ignorer les commandes
        if (msg.text && msg.text.startsWith('/')) return;
        
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userState = userStates[userId];
        
        if (!userState) return;
        
        // Supprimer le message de l'utilisateur pour garder le chat propre
        try {
            await bot.deleteMessage(chatId, msg.message_id);
        } catch (error) {}
        
        // Traiter selon l'état de la conversation
        // Ajouter votre logique de conversation ici...
    });
    
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
    console.log(`✅ Mode simple SANS anti-spam (sûr pour Telegram)`);
    
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
module.exports = { app, bot };