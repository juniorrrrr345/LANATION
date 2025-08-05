require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const { loadConfig, saveConfig } = require('./config');
const { User, Image } = require('./models');
const { getMainKeyboard, getAdminKeyboard, getSocialManageKeyboard, getSocialLayoutKeyboard, getConfirmKeyboard } = require('./keyboards');

// Vérifier les variables d'environnement
if (!process.env.BOT_TOKEN) {
    console.error('❌ BOT_TOKEN n\'est pas défini dans le fichier .env');
    process.exit(1);
}

if (!process.env.ADMIN_ID) {
    console.error('❌ ADMIN_ID n\'est pas défini dans le fichier .env');
    process.exit(1);
}

// Initialiser le bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const ADMIN_ID = parseInt(process.env.ADMIN_ID);

// État des utilisateurs
const userStates = {};
const activeMessages = {};

// Configuration globale
let config = {};

// Temps de démarrage
const botStartTime = new Date();

// Connexion MongoDB et initialisation
async function initializeBot() {
    try {
        console.log('🚀 Initialisation du bot...');
        
        // Charger la configuration
        config = await loadConfig();
        console.log('✅ Configuration chargée');
        
        // S'assurer que l'admin principal est dans la DB
        await User.findOneAndUpdate(
            { userId: ADMIN_ID },
            { userId: ADMIN_ID, isAdmin: true },
            { upsert: true }
        );
        
        console.log('✅ Bot prêt!');
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        process.exit(1);
    }
}

// Démarrer l'initialisation
initializeBot();

// Fonction pour sauvegarder/mettre à jour un utilisateur
async function saveUser(userId, userInfo = {}) {
    try {
        await User.findOneAndUpdate(
            { userId },
            {
                userId,
                username: userInfo.username,
                firstName: userInfo.first_name,
                lastName: userInfo.last_name,
                lastSeen: new Date(),
                $inc: { messageCount: 1 }
            },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error('Erreur sauvegarde utilisateur:', error);
    }
}

// Vérifier si un utilisateur est admin
async function isAdmin(userId) {
    try {
        const user = await User.findOne({ userId, isAdmin: true });
        return !!user;
    } catch (error) {
        return userId === ADMIN_ID;
    }
}

// Fonction pour envoyer ou éditer un message
async function sendOrEditMessage(chatId, text, keyboard, parseMode = 'HTML') {
    try {
        if (activeMessages[chatId]) {
            try {
                await bot.editMessageText(text, {
                    chat_id: chatId,
                    message_id: activeMessages[chatId],
                    reply_markup: keyboard,
                    parse_mode: parseMode
                });
                return;
            } catch (error) {
                // Si l'édition échoue, envoyer un nouveau message
            }
        }
        
        const sentMsg = await bot.sendMessage(chatId, text, {
            reply_markup: keyboard,
            parse_mode: parseMode
        });
        activeMessages[chatId] = sentMsg.message_id;
    } catch (error) {
        console.error('Erreur envoi message:', error);
    }
}

// Commande /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Sauvegarder l'utilisateur
    await saveUser(userId, msg.from);
    
    // Supprimer le message de commande
    try {
        await bot.deleteMessage(chatId, msg.message_id);
    } catch (error) {}
    
    // Message personnalisé
    const firstName = msg.from.first_name || 'là';
    const welcomeText = config.welcomeMessage
        ? config.welcomeMessage.replace('{firstname}', firstName)
        : `Bienvenue ${firstName}! 👋`;
    
    // Envoyer le message d'accueil
    if (config.welcomeImage) {
        try {
            const sentMsg = await bot.sendPhoto(chatId, config.welcomeImage, {
                caption: welcomeText,
                reply_markup: getMainKeyboard(config),
                parse_mode: 'HTML'
            });
            activeMessages[chatId] = sentMsg.message_id;
        } catch (error) {
            // Si l'image échoue, envoyer juste le texte
            await sendOrEditMessage(chatId, welcomeText, getMainKeyboard(config));
        }
    } else {
        await sendOrEditMessage(chatId, welcomeText, getMainKeyboard(config));
    }
});

// Commande /admin
bot.onText(/\/admin/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Supprimer le message de commande
    try {
        await bot.deleteMessage(chatId, msg.message_id);
    } catch (error) {}
    
    // Vérifier si l'utilisateur est admin
    if (!await isAdmin(userId)) {
        await bot.sendMessage(chatId, '❌ Accès refusé. Cette commande est réservée aux administrateurs.');
        return;
    }
    
    // Statistiques
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const uptime = Math.floor((Date.now() - botStartTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    const adminText = `🔧 <b>Panel d'administration</b>\n\n` +
        `📊 <b>Statistiques:</b>\n` +
        `• Utilisateurs: ${totalUsers}\n` +
        `• Administrateurs: ${totalAdmins}\n` +
        `• En ligne depuis: ${hours}h ${minutes}min\n\n` +
        `Que souhaitez-vous faire?`;
    
    await sendOrEditMessage(chatId, adminText, getAdminKeyboard());
});

// Callback pour les boutons
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;
    
    // Répondre au callback pour enlever le "chargement"
    await bot.answerCallbackQuery(callbackQuery.id);
    
    // Gestion des différents callbacks
    switch(data) {
        case 'info':
            await handleInfo(chatId);
            break;
            
        case 'social':
            await handleSocial(chatId);
            break;
            
        case 'back_to_menu':
            await handleBackToMenu(chatId, userId);
            break;
            
        case 'admin_message':
            if (await isAdmin(userId)) {
                userStates[userId] = 'waiting_welcome_message';
                await sendOrEditMessage(chatId, 
                    '📝 Envoyez le nouveau message d\'accueil.\n\n' +
                    'Vous pouvez utiliser {firstname} pour personnaliser le message.\n\n' +
                    'Envoyez /cancel pour annuler.',
                    { inline_keyboard: [] }
                );
            }
            break;
            
        case 'admin_photo':
            if (await isAdmin(userId)) {
                userStates[userId] = 'waiting_welcome_photo';
                await sendOrEditMessage(chatId,
                    '🖼️ Envoyez la nouvelle photo d\'accueil.\n\n' +
                    'La photo sera affichée avec le message d\'accueil.\n\n' +
                    'Envoyez /cancel pour annuler.',
                    { inline_keyboard: [] }
                );
            }
            break;
            
        case 'admin_miniapp':
            if (await isAdmin(userId)) {
                await handleMiniAppConfig(chatId, userId);
            }
            break;
            
        case 'admin_social':
            if (await isAdmin(userId)) {
                await handleSocialConfig(chatId);
            }
            break;
            
        case 'admin_info':
            if (await isAdmin(userId)) {
                userStates[userId] = 'waiting_info_text';
                await sendOrEditMessage(chatId,
                    'ℹ️ Envoyez le nouveau texte pour la section informations.\n\n' +
                    'Envoyez /cancel pour annuler.',
                    { inline_keyboard: [] }
                );
            }
            break;
            
        case 'admin_broadcast':
            if (await isAdmin(userId)) {
                await handleBroadcast(chatId, userId);
            }
            break;
            
        case 'admin_admins':
            if (await isAdmin(userId)) {
                await handleAdminManagement(chatId, userId);
            }
            break;
            
        case 'admin_stats':
            if (await isAdmin(userId)) {
                await handleStats(chatId);
            }
            break;
            
        case 'admin_back':
            if (await isAdmin(userId)) {
                bot.emit('text', { 
                    chat: { id: chatId }, 
                    from: { id: userId },
                    text: '/admin'
                });
            }
            break;
            
        // Gestion des réseaux sociaux
        case 'social_add':
            if (await isAdmin(userId)) {
                userStates[userId] = 'adding_social_name';
                await sendOrEditMessage(chatId,
                    '➕ <b>Ajouter un réseau social</b>\n\n' +
                    '1️⃣ Envoyez le nom du réseau (ex: Instagram)',
                    { inline_keyboard: [[{ text: '❌ Annuler', callback_data: 'admin_social' }]] }
                );
            }
            break;
            
        case 'social_remove':
            if (await isAdmin(userId)) {
                await handleSocialRemove(chatId);
            }
            break;
            
        case 'social_layout':
            if (await isAdmin(userId)) {
                await handleSocialLayout(chatId);
            }
            break;
            
        // Gestion des admins
        case 'admin_add':
            if (userId === ADMIN_ID) {
                userStates[userId] = 'adding_admin';
                await sendOrEditMessage(chatId,
                    '➕ <b>Ajouter un administrateur</b>\n\n' +
                    'Envoyez l\'ID Telegram du nouvel admin.\n' +
                    'Pour obtenir un ID, la personne doit utiliser @userinfobot',
                    { inline_keyboard: [[{ text: '❌ Annuler', callback_data: 'admin_admins' }]] }
                );
            }
            break;
            
        case 'admin_remove':
            if (userId === ADMIN_ID) {
                await handleAdminRemove(chatId);
            }
            break;
            
        case 'broadcast_all':
            if (await isAdmin(userId)) {
                userStates[userId] = 'broadcast_message';
                await sendOrEditMessage(chatId,
                    '📢 <b>Message à tous les utilisateurs</b>\n\n' +
                    'Envoyez le message à diffuser.\n' +
                    'Il sera envoyé à tous les utilisateurs du bot.',
                    { inline_keyboard: [[{ text: '❌ Annuler', callback_data: 'admin_back' }]] }
                );
            }
            break;
    }
    
    // Callbacks pour supprimer un réseau social
    if (data.startsWith('remove_social_')) {
        const index = parseInt(data.replace('remove_social_', ''));
        if (config.socialNetworks && config.socialNetworks[index]) {
            config.socialNetworks.splice(index, 1);
            await saveConfig(config);
            await sendOrEditMessage(chatId, '✅ Réseau social supprimé!', { inline_keyboard: [] });
            setTimeout(() => handleSocialConfig(chatId), 1500);
        }
    }
    
    // Callbacks pour supprimer un admin
    if (data.startsWith('remove_admin_')) {
        const adminId = parseInt(data.replace('remove_admin_', ''));
        if (userId === ADMIN_ID && adminId !== ADMIN_ID) {
            await User.findOneAndUpdate({ userId: adminId }, { isAdmin: false });
            await sendOrEditMessage(chatId, '✅ Administrateur supprimé!', { inline_keyboard: [] });
            setTimeout(() => handleAdminManagement(chatId, userId), 1500);
        }
    }
    
    // Callbacks pour le layout des réseaux sociaux
    if (data.startsWith('layout_')) {
        const buttonsPerRow = parseInt(data.replace('layout_', ''));
        config.socialButtonsPerRow = buttonsPerRow;
        await saveConfig(config);
        await sendOrEditMessage(chatId, `✅ Disposition mise à jour: ${buttonsPerRow} boutons par ligne`, { inline_keyboard: [] });
        setTimeout(() => handleSocialConfig(chatId), 1500);
    }
});

// Gestion des messages texte
bot.on('message', async (msg) => {
    if (msg.text && msg.text.startsWith('/')) return;
    
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userState = userStates[userId];
    
    // Gérer les annulations
    if (msg.text === '/cancel') {
        delete userStates[userId];
        await sendOrEditMessage(chatId, '❌ Action annulée.', { inline_keyboard: [] });
        return;
    }
    
    // Gérer les différents états
    switch(userState) {
        case 'waiting_welcome_message':
            config.welcomeMessage = msg.text;
            await saveConfig(config);
            delete userStates[userId];
            await sendOrEditMessage(chatId, '✅ Message d\'accueil mis à jour!', { inline_keyboard: [] });
            setTimeout(() => {
                bot.emit('text', { chat: { id: chatId }, from: { id: userId }, text: '/admin' });
            }, 1500);
            break;
            
        case 'waiting_info_text':
            config.infoText = msg.text;
            await saveConfig(config);
            delete userStates[userId];
            await sendOrEditMessage(chatId, '✅ Texte des informations mis à jour!', { inline_keyboard: [] });
            setTimeout(() => {
                bot.emit('text', { chat: { id: chatId }, from: { id: userId }, text: '/admin' });
            }, 1500);
            break;
            
        case 'config_miniapp':
            if (msg.text.toLowerCase() === 'remove') {
                config.miniApp = { url: null, text: '🎮 Mini Application' };
                await saveConfig(config);
                delete userStates[userId];
                await sendOrEditMessage(chatId, '✅ Mini application supprimée!', { inline_keyboard: [] });
            } else if (msg.text.startsWith('http')) {
                userStates[userId] = 'config_miniapp_text';
                userStates[userId + '_url'] = msg.text;
                await sendOrEditMessage(chatId,
                    '📱 Maintenant, envoyez le texte du bouton.\n' +
                    'Exemple: 🎮 Jouer maintenant',
                    { inline_keyboard: [] }
                );
            } else {
                await sendOrEditMessage(chatId, '❌ URL invalide. Elle doit commencer par http:// ou https://', { inline_keyboard: [] });
            }
            break;
            
        case 'config_miniapp_text':
            const url = userStates[userId + '_url'];
            config.miniApp = { url, text: msg.text };
            await saveConfig(config);
            delete userStates[userId];
            delete userStates[userId + '_url'];
            await sendOrEditMessage(chatId, '✅ Mini application configurée!', { inline_keyboard: [] });
            setTimeout(() => {
                bot.emit('text', { chat: { id: chatId }, from: { id: userId }, text: '/admin' });
            }, 1500);
            break;
            
        case 'adding_social_name':
            userStates[userId] = 'adding_social_url';
            userStates[userId + '_social_name'] = msg.text;
            await sendOrEditMessage(chatId,
                '2️⃣ Maintenant, envoyez l\'URL complète.\n' +
                'Exemple: https://instagram.com/votrepage',
                { inline_keyboard: [] }
            );
            break;
            
        case 'adding_social_url':
            userStates[userId] = 'adding_social_emoji';
            userStates[userId + '_social_url'] = msg.text;
            await sendOrEditMessage(chatId,
                '3️⃣ Enfin, envoyez un emoji pour ce réseau.\n' +
                'Exemple: 📷 ou 🐦 ou 👍',
                { inline_keyboard: [] }
            );
            break;
            
        case 'adding_social_emoji':
            const name = userStates[userId + '_social_name'];
            const socialUrl = userStates[userId + '_social_url'];
            const emoji = msg.text;
            
            if (!config.socialNetworks) config.socialNetworks = [];
            config.socialNetworks.push({ name, url: socialUrl, emoji });
            await saveConfig(config);
            
            delete userStates[userId];
            delete userStates[userId + '_social_name'];
            delete userStates[userId + '_social_url'];
            
            await sendOrEditMessage(chatId, '✅ Réseau social ajouté!', { inline_keyboard: [] });
            setTimeout(() => handleSocialConfig(chatId), 1500);
            break;
            
        case 'adding_admin':
            const newAdminId = parseInt(msg.text);
            if (!isNaN(newAdminId)) {
                await User.findOneAndUpdate(
                    { userId: newAdminId },
                    { userId: newAdminId, isAdmin: true },
                    { upsert: true }
                );
                delete userStates[userId];
                await sendOrEditMessage(chatId, '✅ Nouvel administrateur ajouté!', { inline_keyboard: [] });
                setTimeout(() => handleAdminManagement(chatId, userId), 1500);
            } else {
                await sendOrEditMessage(chatId, '❌ ID invalide. Envoyez un nombre.', { inline_keyboard: [] });
            }
            break;
            
        case 'broadcast_message':
            await handleBroadcastSend(chatId, userId, msg.text);
            break;
    }
});

// Gestion des photos
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userState = userStates[userId];
    
    if (userState === 'waiting_welcome_photo') {
        try {
            // Récupérer la photo la plus grande
            const photo = msg.photo[msg.photo.length - 1];
            const fileId = photo.file_id;
            
            // Sauvegarder l'ID de la photo (Telegram garde les photos)
            config.welcomeImage = fileId;
            await saveConfig(config);
            
            delete userStates[userId];
            await sendOrEditMessage(chatId, '✅ Photo d\'accueil mise à jour!', { inline_keyboard: [] });
            
            setTimeout(() => {
                bot.emit('text', { chat: { id: chatId }, from: { id: userId }, text: '/admin' });
            }, 1500);
        } catch (error) {
            console.error('Erreur sauvegarde photo:', error);
            await sendOrEditMessage(chatId, '❌ Erreur lors de la sauvegarde de la photo.', { inline_keyboard: [] });
        }
    }
});

// Fonctions helper
async function handleInfo(chatId) {
    const infoText = config.infoText || 'ℹ️ Aucune information disponible.';
    
    if (config.welcomeImage) {
        try {
            await bot.sendPhoto(chatId, config.welcomeImage, {
                caption: infoText,
                reply_markup: {
                    inline_keyboard: [[
                        { text: '🔙 Retour', callback_data: 'back_to_menu' }
                    ]]
                },
                parse_mode: 'HTML'
            });
        } catch (error) {
            await sendOrEditMessage(chatId, infoText, {
                inline_keyboard: [[
                    { text: '🔙 Retour', callback_data: 'back_to_menu' }
                ]]
            });
        }
    } else {
        await sendOrEditMessage(chatId, infoText, {
            inline_keyboard: [[
                { text: '🔙 Retour', callback_data: 'back_to_menu' }
            ]]
        });
    }
}

async function handleSocial(chatId) {
    if (!config.socialNetworks || config.socialNetworks.length === 0) {
        await sendOrEditMessage(chatId, 
            '🌐 Aucun réseau social configuré.',
            {
                inline_keyboard: [[
                    { text: '🔙 Retour', callback_data: 'back_to_menu' }
                ]]
            }
        );
        return;
    }
    
    const keyboard = [];
    const buttonsPerRow = config.socialButtonsPerRow || 3;
    
    for (let i = 0; i < config.socialNetworks.length; i += buttonsPerRow) {
        const row = [];
        for (let j = 0; j < buttonsPerRow && i + j < config.socialNetworks.length; j++) {
            const network = config.socialNetworks[i + j];
            row.push({
                text: `${network.emoji} ${network.name}`,
                url: network.url
            });
        }
        keyboard.push(row);
    }
    
    keyboard.push([{ text: '🔙 Retour', callback_data: 'back_to_menu' }]);
    
    await sendOrEditMessage(chatId,
        '🌐 <b>Nos réseaux sociaux</b>\n\nCliquez sur un bouton pour nous rejoindre!',
        { inline_keyboard: keyboard }
    );
}

async function handleBackToMenu(chatId, userId) {
    const user = await User.findOne({ userId });
    const firstName = user?.firstName || 'là';
    const welcomeText = config.welcomeMessage
        ? config.welcomeMessage.replace('{firstname}', firstName)
        : `Bienvenue ${firstName}! 👋`;
    
    await sendOrEditMessage(chatId, welcomeText, getMainKeyboard(config));
}

async function handleMiniAppConfig(chatId, userId) {
    userStates[userId] = 'config_miniapp';
    await sendOrEditMessage(chatId,
        '📱 <b>Configuration Mini App</b>\n\n' +
        `URL actuelle: ${config.miniApp?.url || 'Non définie'}\n` +
        `Texte du bouton: ${config.miniApp?.text || '🎮 Mini Application'}\n\n` +
        'Envoyez l\'URL de votre mini application ou "remove" pour la supprimer.\n' +
        'Format: https://votre-app.com\n\n' +
        'Envoyez /cancel pour annuler.',
        { inline_keyboard: [[{ text: '🔙 Retour', callback_data: 'admin_back' }]] }
    );
}

async function handleSocialConfig(chatId) {
    const text = '🌐 <b>Gestion des réseaux sociaux</b>\n\n' +
        'Réseaux actuels:\n' +
        (config.socialNetworks?.map((n, i) => `${i + 1}. ${n.emoji} ${n.name}`).join('\n') || 'Aucun') +
        '\n\nQue voulez-vous faire?';
    
    await sendOrEditMessage(chatId, text, getSocialManageKeyboard());
}

async function handleSocialRemove(chatId) {
    if (!config.socialNetworks || config.socialNetworks.length === 0) {
        await sendOrEditMessage(chatId, '❌ Aucun réseau social à supprimer.', { inline_keyboard: [] });
        setTimeout(() => handleSocialConfig(chatId), 1500);
        return;
    }
    
    const keyboard = config.socialNetworks.map((network, index) => [{
        text: `❌ ${network.emoji} ${network.name}`,
        callback_data: `remove_social_${index}`
    }]);
    
    keyboard.push([{ text: '🔙 Retour', callback_data: 'admin_social' }]);
    
    await sendOrEditMessage(chatId,
        '❌ <b>Supprimer un réseau social</b>\n\nCliquez sur le réseau à supprimer:',
        { inline_keyboard: keyboard }
    );
}

async function handleSocialLayout(chatId) {
    await sendOrEditMessage(chatId,
        '📐 <b>Disposition des boutons</b>\n\n' +
        `Actuellement: ${config.socialButtonsPerRow || 3} boutons par ligne\n\n` +
        'Choisissez le nombre de boutons par ligne:',
        getSocialLayoutKeyboard()
    );
}

async function handleBroadcast(chatId, userId) {
    const totalUsers = await User.countDocuments();
    
    await sendOrEditMessage(chatId,
        '📢 <b>Diffusion de message</b>\n\n' +
        `Ce message sera envoyé à ${totalUsers} utilisateurs.\n\n` +
        'Choisissez une option:',
        {
            inline_keyboard: [
                [{ text: '📤 Envoyer à tous', callback_data: 'broadcast_all' }],
                [{ text: '🔙 Retour', callback_data: 'admin_back' }]
            ]
        }
    );
}

async function handleBroadcastSend(chatId, userId, message) {
    delete userStates[userId];
    
    await sendOrEditMessage(chatId, '📤 Envoi en cours...', { inline_keyboard: [] });
    
    const users = await User.find({});
    let sent = 0;
    let failed = 0;
    
    for (const user of users) {
        try {
            await bot.sendMessage(user.userId, message, { parse_mode: 'HTML' });
            sent++;
        } catch (error) {
            failed++;
        }
    }
    
    await sendOrEditMessage(chatId,
        `✅ <b>Diffusion terminée!</b>\n\n` +
        `• Messages envoyés: ${sent}\n` +
        `• Échecs: ${failed}`,
        { inline_keyboard: [[{ text: '🔙 Retour', callback_data: 'admin_back' }]] }
    );
}

async function handleAdminManagement(chatId, userId) {
    const admins = await User.find({ isAdmin: true });
    
    const adminList = admins.map(admin => 
        `• ${admin.userId === ADMIN_ID ? '👑' : '👤'} ${admin.firstName || admin.username || admin.userId}`
    ).join('\n');
    
    const keyboard = [];
    
    if (userId === ADMIN_ID) {
        keyboard.push([{ text: '➕ Ajouter un admin', callback_data: 'admin_add' }]);
        if (admins.length > 1) {
            keyboard.push([{ text: '❌ Retirer un admin', callback_data: 'admin_remove' }]);
        }
    }
    
    keyboard.push([{ text: '🔙 Retour', callback_data: 'admin_back' }]);
    
    await sendOrEditMessage(chatId,
        `👥 <b>Gestion des administrateurs</b>\n\n` +
        `Administrateurs actuels:\n${adminList}\n\n` +
        `${userId === ADMIN_ID ? 'Vous êtes le super-admin 👑' : ''}`,
        { inline_keyboard: keyboard }
    );
}

async function handleAdminRemove(chatId) {
    const admins = await User.find({ isAdmin: true, userId: { $ne: ADMIN_ID } });
    
    if (admins.length === 0) {
        await sendOrEditMessage(chatId, '❌ Aucun admin à retirer.', { inline_keyboard: [] });
        setTimeout(() => handleAdminManagement(chatId, ADMIN_ID), 1500);
        return;
    }
    
    const keyboard = admins.map(admin => [{
        text: `❌ ${admin.firstName || admin.username || admin.userId}`,
        callback_data: `remove_admin_${admin.userId}`
    }]);
    
    keyboard.push([{ text: '🔙 Retour', callback_data: 'admin_admins' }]);
    
    await sendOrEditMessage(chatId,
        '❌ <b>Retirer un administrateur</b>\n\nCliquez sur l\'admin à retirer:',
        { inline_keyboard: keyboard }
    );
}

async function handleStats(chatId) {
    const totalUsers = await User.countDocuments();
    const activeToday = await User.countDocuments({
        lastSeen: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    
    const uptime = Math.floor((Date.now() - botStartTime) / 1000);
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    await sendOrEditMessage(chatId,
        `📊 <b>Statistiques détaillées</b>\n\n` +
        `👥 <b>Utilisateurs:</b>\n` +
        `• Total: ${totalUsers}\n` +
        `• Actifs aujourd'hui: ${activeToday}\n` +
        `• Administrateurs: ${totalAdmins}\n\n` +
        `⏱️ <b>Uptime:</b>\n` +
        `${days}j ${hours}h ${minutes}min\n\n` +
        `🤖 <b>Version:</b> 1.0.0\n` +
        `💾 <b>Base de données:</b> MongoDB`,
        {
            inline_keyboard: [[
                { text: '🔙 Retour', callback_data: 'admin_back' }
            ]]
        }
    );
}

// Gestion des erreurs
bot.on('polling_error', (error) => {
    console.error('Erreur polling:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt du bot...');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt du bot...');
    await mongoose.connection.close();
    process.exit(0);
});

console.log('🤖 Bot démarré en mode polling!');