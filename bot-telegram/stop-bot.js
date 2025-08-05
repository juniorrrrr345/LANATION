require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Script pour arrêter proprement le bot
async function stopBot() {
    console.log('🛑 Arrêt du bot en cours...');
    
    if (!process.env.BOT_TOKEN) {
        console.error('❌ BOT_TOKEN non défini');
        process.exit(1);
    }
    
    try {
        // Créer une instance temporaire pour arrêter le polling
        const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
        
        // Essayer de supprimer le webhook (au cas où)
        await bot.deleteWebHook();
        console.log('✅ Webhook supprimé (si existant)');
        
        // Attendre un peu pour s'assurer que tout est arrêté
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('✅ Bot arrêté avec succès');
        console.log('💡 Vous pouvez maintenant redémarrer le bot');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'arrêt:', error.message);
    }
    
    process.exit(0);
}

stopBot();