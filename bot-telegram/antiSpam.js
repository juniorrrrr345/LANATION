/**
 * Module Anti-Spam pour Bot Telegram
 * Prévient le bannissement en implémentant des mesures de sécurité
 */

class AntiSpamSystem {
    constructor(options = {}) {
        // Configuration par défaut
        this.config = {
            // Limites de messages
            maxMessagesPerMinute: options.maxMessagesPerMinute || 20,
            maxMessagesPerHour: options.maxMessagesPerHour || 100,
            maxMessagesPerDay: options.maxMessagesPerDay || 500,
            
            // Cooldown entre messages (en ms)
            minCooldown: options.minCooldown || 1000,  // 1 seconde minimum
            maxCooldown: options.maxCooldown || 3000,  // 3 secondes maximum
            
            // Détection de flood
            floodThreshold: options.floodThreshold || 5,  // Messages identiques consécutifs
            floodBanDuration: options.floodBanDuration || 300000,  // 5 minutes de ban temporaire
            
            // Comportement humain
            enableHumanBehavior: options.enableHumanBehavior !== false,
            typingDelay: options.typingDelay || 50,  // ms par caractère
            maxTypingDelay: options.maxTypingDelay || 5000,  // 5 secondes max
            
            // Limites par utilisateur
            userRateLimitMinute: options.userRateLimitMinute || 10,
            userRateLimitHour: options.userRateLimitHour || 50,
            
            // Mode debug
            debug: options.debug || false
        };
        
        // Stockage des données
        this.messageHistory = new Map();  // Historique des messages par utilisateur
        this.userActivity = new Map();    // Activité des utilisateurs
        this.bannedUsers = new Map();     // Utilisateurs temporairement bannis
        this.whitelist = new Set();       // Liste blanche
        this.blacklist = new Set();       // Liste noire permanente
        this.globalMessageCount = {
            minute: 0,
            hour: 0,
            day: 0,
            lastReset: {
                minute: Date.now(),
                hour: Date.now(),
                day: Date.now()
            }
        };
        
        // Démarrer les timers de réinitialisation
        this.startResetTimers();
    }
    
    /**
     * Démarre les timers de réinitialisation des compteurs
     */
    startResetTimers() {
        // Réinitialiser les compteurs par minute
        setInterval(() => {
            this.globalMessageCount.minute = 0;
            this.globalMessageCount.lastReset.minute = Date.now();
            this.cleanupOldData();
        }, 60000);  // Chaque minute
        
        // Réinitialiser les compteurs par heure
        setInterval(() => {
            this.globalMessageCount.hour = 0;
            this.globalMessageCount.lastReset.hour = Date.now();
        }, 3600000);  // Chaque heure
        
        // Réinitialiser les compteurs par jour
        setInterval(() => {
            this.globalMessageCount.day = 0;
            this.globalMessageCount.lastReset.day = Date.now();
        }, 86400000);  // Chaque jour
    }
    
    /**
     * Nettoie les anciennes données pour économiser la mémoire
     */
    cleanupOldData() {
        const now = Date.now();
        const oneHourAgo = now - 3600000;
        
        // Nettoyer l'historique des messages
        for (const [userId, history] of this.messageHistory.entries()) {
            const recentMessages = history.filter(msg => msg.timestamp > oneHourAgo);
            if (recentMessages.length === 0) {
                this.messageHistory.delete(userId);
            } else {
                this.messageHistory.set(userId, recentMessages);
            }
        }
        
        // Nettoyer les bans expirés
        for (const [userId, banTime] of this.bannedUsers.entries()) {
            if (banTime < now) {
                this.bannedUsers.delete(userId);
                if (this.config.debug) {
                    console.log(`🔓 Utilisateur ${userId} débanni automatiquement`);
                }
            }
        }
    }
    
    /**
     * Vérifie si un utilisateur peut envoyer un message
     * @param {number} userId - ID de l'utilisateur
     * @param {string} message - Contenu du message
     * @returns {object} - {allowed: boolean, reason: string, waitTime: number}
     */
    async canSendMessage(userId, message = '') {
        // Vérifier la liste noire
        if (this.blacklist.has(userId)) {
            return {
                allowed: false,
                reason: 'Vous êtes sur la liste noire.',
                waitTime: -1
            };
        }
        
        // Vérifier la liste blanche (bypass toutes les restrictions)
        if (this.whitelist.has(userId)) {
            return { allowed: true, reason: 'whitelisted', waitTime: 0 };
        }
        
        // Vérifier si l'utilisateur est temporairement banni
        const banExpiry = this.bannedUsers.get(userId);
        if (banExpiry && banExpiry > Date.now()) {
            const remainingTime = Math.ceil((banExpiry - Date.now()) / 1000);
            return {
                allowed: false,
                reason: `Vous êtes temporairement restreint. Réessayez dans ${remainingTime} secondes.`,
                waitTime: remainingTime
            };
        }
        
        // Vérifier les limites globales
        const globalCheck = this.checkGlobalLimits();
        if (!globalCheck.allowed) {
            return globalCheck;
        }
        
        // Vérifier les limites par utilisateur
        const userCheck = this.checkUserLimits(userId);
        if (!userCheck.allowed) {
            return userCheck;
        }
        
        // Vérifier le flood (messages identiques)
        const floodCheck = this.checkFlood(userId, message);
        if (!floodCheck.allowed) {
            // Bannir temporairement pour flood
            this.bannedUsers.set(userId, Date.now() + this.config.floodBanDuration);
            return floodCheck;
        }
        
        // Vérifier le cooldown
        const cooldownCheck = this.checkCooldown(userId);
        if (!cooldownCheck.allowed) {
            return cooldownCheck;
        }
        
        // Enregistrer le message
        this.recordMessage(userId, message);
        
        return { allowed: true, reason: 'ok', waitTime: 0 };
    }
    
    /**
     * Vérifie les limites globales du bot
     */
    checkGlobalLimits() {
        // Vérifier limite par minute
        if (this.globalMessageCount.minute >= this.config.maxMessagesPerMinute) {
            return {
                allowed: false,
                reason: 'Le bot est temporairement surchargé. Réessayez dans quelques instants.',
                waitTime: 60
            };
        }
        
        // Vérifier limite par heure
        if (this.globalMessageCount.hour >= this.config.maxMessagesPerHour) {
            return {
                allowed: false,
                reason: 'Limite horaire atteinte. Réessayez plus tard.',
                waitTime: 3600
            };
        }
        
        // Vérifier limite par jour
        if (this.globalMessageCount.day >= this.config.maxMessagesPerDay) {
            return {
                allowed: false,
                reason: 'Limite quotidienne atteinte. Réessayez demain.',
                waitTime: 86400
            };
        }
        
        return { allowed: true };
    }
    
    /**
     * Vérifie les limites par utilisateur
     */
    checkUserLimits(userId) {
        const userActivity = this.getUserActivity(userId);
        const now = Date.now();
        
        // Messages dans la dernière minute
        const recentMinute = userActivity.messages.filter(
            msg => msg.timestamp > now - 60000
        ).length;
        
        if (recentMinute >= this.config.userRateLimitMinute) {
            return {
                allowed: false,
                reason: 'Trop de messages. Veuillez patienter avant d\'envoyer un nouveau message.',
                waitTime: 60
            };
        }
        
        // Messages dans la dernière heure
        const recentHour = userActivity.messages.filter(
            msg => msg.timestamp > now - 3600000
        ).length;
        
        if (recentHour >= this.config.userRateLimitHour) {
            return {
                allowed: false,
                reason: 'Limite horaire atteinte. Réessayez plus tard.',
                waitTime: 3600
            };
        }
        
        return { allowed: true };
    }
    
    /**
     * Vérifie le flood (messages identiques répétés)
     */
    checkFlood(userId, message) {
        if (!message) return { allowed: true };
        
        const history = this.messageHistory.get(userId) || [];
        const recentMessages = history.slice(-this.config.floodThreshold);
        
        // Compter les messages identiques consécutifs
        let identicalCount = 0;
        for (let i = recentMessages.length - 1; i >= 0; i--) {
            if (recentMessages[i].content === message) {
                identicalCount++;
            } else {
                break;
            }
        }
        
        if (identicalCount >= this.config.floodThreshold - 1) {
            return {
                allowed: false,
                reason: 'Détection de spam. Évitez d\'envoyer des messages identiques.',
                waitTime: this.config.floodBanDuration / 1000
            };
        }
        
        return { allowed: true };
    }
    
    /**
     * Vérifie le cooldown entre messages
     */
    checkCooldown(userId) {
        const userActivity = this.getUserActivity(userId);
        const lastMessage = userActivity.lastMessageTime;
        
        if (!lastMessage) return { allowed: true };
        
        const elapsed = Date.now() - lastMessage;
        const requiredCooldown = this.getRandomCooldown();
        
        if (elapsed < requiredCooldown) {
            const waitTime = Math.ceil((requiredCooldown - elapsed) / 1000);
            return {
                allowed: false,
                reason: `Veuillez patienter ${waitTime} seconde(s) avant d'envoyer un nouveau message.`,
                waitTime: waitTime
            };
        }
        
        return { allowed: true };
    }
    
    /**
     * Génère un cooldown aléatoire pour simuler un comportement humain
     */
    getRandomCooldown() {
        if (!this.config.enableHumanBehavior) {
            return this.config.minCooldown;
        }
        
        // Cooldown aléatoire entre min et max
        return Math.floor(
            Math.random() * (this.config.maxCooldown - this.config.minCooldown) + 
            this.config.minCooldown
        );
    }
    
    /**
     * Calcule le délai de frappe pour simuler un humain
     * @param {string} message - Le message à "taper"
     * @returns {number} - Délai en millisecondes
     */
    getTypingDelay(message) {
        if (!this.config.enableHumanBehavior || !message) {
            return 0;
        }
        
        // Calculer le délai basé sur la longueur du message
        const baseDelay = message.length * this.config.typingDelay;
        
        // Ajouter une variation aléatoire (±20%)
        const variation = baseDelay * 0.2;
        const randomDelay = baseDelay + (Math.random() * variation * 2 - variation);
        
        // Limiter au maximum configuré
        return Math.min(randomDelay, this.config.maxTypingDelay);
    }
    
    /**
     * Enregistre un message envoyé
     */
    recordMessage(userId, message) {
        const now = Date.now();
        
        // Mettre à jour l'historique des messages
        const history = this.messageHistory.get(userId) || [];
        history.push({
            content: message,
            timestamp: now
        });
        
        // Garder seulement les 100 derniers messages
        if (history.length > 100) {
            history.shift();
        }
        
        this.messageHistory.set(userId, history);
        
        // Mettre à jour l'activité de l'utilisateur
        const userActivity = this.getUserActivity(userId);
        userActivity.lastMessageTime = now;
        userActivity.messages.push({ timestamp: now });
        
        // Garder seulement les messages de la dernière heure
        const oneHourAgo = now - 3600000;
        userActivity.messages = userActivity.messages.filter(
            msg => msg.timestamp > oneHourAgo
        );
        
        this.userActivity.set(userId, userActivity);
        
        // Incrémenter les compteurs globaux
        this.globalMessageCount.minute++;
        this.globalMessageCount.hour++;
        this.globalMessageCount.day++;
        
        if (this.config.debug) {
            console.log(`📊 Message enregistré - User: ${userId}, Global: ${this.globalMessageCount.minute}/min`);
        }
    }
    
    /**
     * Obtient l'activité d'un utilisateur
     */
    getUserActivity(userId) {
        if (!this.userActivity.has(userId)) {
            this.userActivity.set(userId, {
                messages: [],
                lastMessageTime: null
            });
        }
        return this.userActivity.get(userId);
    }
    
    /**
     * Ajoute un utilisateur à la liste blanche
     */
    addToWhitelist(userId) {
        this.whitelist.add(userId);
        this.blacklist.delete(userId);  // Retirer de la liste noire si présent
        if (this.config.debug) {
            console.log(`✅ Utilisateur ${userId} ajouté à la liste blanche`);
        }
    }
    
    /**
     * Retire un utilisateur de la liste blanche
     */
    removeFromWhitelist(userId) {
        this.whitelist.delete(userId);
    }
    
    /**
     * Ajoute un utilisateur à la liste noire
     */
    addToBlacklist(userId) {
        this.blacklist.add(userId);
        this.whitelist.delete(userId);  // Retirer de la liste blanche si présent
        if (this.config.debug) {
            console.log(`🚫 Utilisateur ${userId} ajouté à la liste noire`);
        }
    }
    
    /**
     * Retire un utilisateur de la liste noire
     */
    removeFromBlacklist(userId) {
        this.blacklist.delete(userId);
    }
    
    /**
     * Réinitialise les données d'un utilisateur
     */
    resetUser(userId) {
        this.messageHistory.delete(userId);
        this.userActivity.delete(userId);
        this.bannedUsers.delete(userId);
    }
    
    /**
     * Obtient les statistiques du système
     */
    getStats() {
        return {
            globalMessages: {
                minute: this.globalMessageCount.minute,
                hour: this.globalMessageCount.hour,
                day: this.globalMessageCount.day
            },
            activeUsers: this.userActivity.size,
            bannedUsers: this.bannedUsers.size,
            whitelistedUsers: this.whitelist.size,
            blacklistedUsers: this.blacklist.size,
            limits: {
                perMinute: this.config.maxMessagesPerMinute,
                perHour: this.config.maxMessagesPerHour,
                perDay: this.config.maxMessagesPerDay
            }
        };
    }
    
    /**
     * Middleware pour intégration facile avec node-telegram-bot-api
     */
    createMiddleware(bot) {
        return async (msg) => {
            const userId = msg.from.id;
            const messageText = msg.text || '';
            
            // Vérifier si l'utilisateur peut envoyer un message
            const check = await this.canSendMessage(userId, messageText);
            
            if (!check.allowed) {
                // Envoyer un message d'avertissement à l'utilisateur
                try {
                    await bot.sendMessage(
                        msg.chat.id,
                        `⚠️ ${check.reason}`,
                        {
                            reply_to_message_id: msg.message_id,
                            parse_mode: 'HTML'
                        }
                    );
                } catch (error) {
                    console.error('Erreur envoi avertissement anti-spam:', error);
                }
                
                // Retourner false pour indiquer que le message ne doit pas être traité
                return false;
            }
            
            // Si comportement humain activé, simuler la frappe
            if (this.config.enableHumanBehavior) {
                const typingDelay = this.getTypingDelay(messageText);
                if (typingDelay > 0) {
                    await bot.sendChatAction(msg.chat.id, 'typing');
                    await new Promise(resolve => setTimeout(resolve, typingDelay));
                }
            }
            
            // Retourner true pour indiquer que le message peut être traité
            return true;
        };
    }
}

module.exports = AntiSpamSystem;