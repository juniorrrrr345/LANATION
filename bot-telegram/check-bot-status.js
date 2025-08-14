#!/usr/bin/env node

/**
 * Script de diagnostic et configuration du Bot Telegram
 * Vérifie l'état du bot et configure le webhook si nécessaire
 */

require('dotenv').config();
const https = require('https');

// Couleurs pour le terminal
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Configuration
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const ADMIN_ID = process.env.ADMIN_ID;

// Vérification des variables d'environnement
function checkEnvVariables() {
    console.log(`\n${colors.cyan}📋 Vérification des variables d'environnement...${colors.reset}\n`);
    
    let hasErrors = false;
    
    if (!BOT_TOKEN) {
        console.log(`${colors.red}❌ BOT_TOKEN non défini${colors.reset}`);
        console.log(`   Obtenez-le depuis @BotFather sur Telegram`);
        hasErrors = true;
    } else {
        console.log(`${colors.green}✅ BOT_TOKEN défini${colors.reset}`);
        console.log(`   Token: ${BOT_TOKEN.substring(0, 10)}...${BOT_TOKEN.substring(BOT_TOKEN.length - 5)}`);
    }
    
    if (!ADMIN_ID) {
        console.log(`${colors.yellow}⚠️  ADMIN_ID non défini${colors.reset}`);
        console.log(`   Obtenez-le depuis @userinfobot sur Telegram`);
    } else {
        console.log(`${colors.green}✅ ADMIN_ID défini${colors.reset}: ${ADMIN_ID}`);
    }
    
    if (!WEBHOOK_URL) {
        console.log(`${colors.yellow}⚠️  WEBHOOK_URL non défini${colors.reset}`);
        console.log(`   Le bot fonctionnera en mode polling (non recommandé)`);
    } else {
        console.log(`${colors.green}✅ WEBHOOK_URL défini${colors.reset}: ${WEBHOOK_URL}`);
    }
    
    return !hasErrors;
}

// Faire une requête à l'API Telegram
function telegramRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Vérifier les informations du bot
async function checkBotInfo() {
    console.log(`\n${colors.cyan}🤖 Vérification des informations du bot...${colors.reset}\n`);
    
    try {
        const result = await telegramRequest('getMe');
        
        if (result.ok) {
            const bot = result.result;
            console.log(`${colors.green}✅ Bot connecté avec succès!${colors.reset}`);
            console.log(`   Nom: @${bot.username}`);
            console.log(`   ID: ${bot.id}`);
            console.log(`   Nom complet: ${bot.first_name}`);
            console.log(`   Peut rejoindre les groupes: ${bot.can_join_groups ? 'Oui' : 'Non'}`);
            console.log(`   Peut lire tous les messages: ${bot.can_read_all_group_messages ? 'Oui' : 'Non'}`);
            console.log(`   Support inline: ${bot.supports_inline_queries ? 'Oui' : 'Non'}`);
            return true;
        } else {
            console.log(`${colors.red}❌ Erreur de connexion au bot${colors.reset}`);
            console.log(`   Code: ${result.error_code}`);
            console.log(`   Description: ${result.description}`);
            
            if (result.error_code === 401) {
                console.log(`\n${colors.yellow}💡 Solution: Vérifiez que votre BOT_TOKEN est correct${colors.reset}`);
                console.log(`   1. Allez sur @BotFather`);
                console.log(`   2. Envoyez /mybots`);
                console.log(`   3. Sélectionnez votre bot`);
                console.log(`   4. Cliquez sur "API Token"`);
                console.log(`   5. Copiez le token et mettez-le dans .env`);
            }
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ Erreur lors de la vérification${colors.reset}`);
        console.log(`   ${error.message}`);
        return false;
    }
}

// Vérifier le webhook actuel
async function checkWebhook() {
    console.log(`\n${colors.cyan}🔗 Vérification du webhook...${colors.reset}\n`);
    
    try {
        const result = await telegramRequest('getWebhookInfo');
        
        if (result.ok) {
            const webhook = result.result;
            
            if (webhook.url) {
                console.log(`${colors.green}✅ Webhook configuré${colors.reset}`);
                console.log(`   URL: ${webhook.url}`);
                console.log(`   IP: ${webhook.ip_address || 'Non résolu'}`);
                console.log(`   Certificat personnalisé: ${webhook.has_custom_certificate ? 'Oui' : 'Non'}`);
                console.log(`   Updates en attente: ${webhook.pending_update_count}`);
                console.log(`   Connexions max: ${webhook.max_connections || 40}`);
                
                if (webhook.last_error_date) {
                    const errorDate = new Date(webhook.last_error_date * 1000);
                    console.log(`${colors.red}   ⚠️  Dernière erreur: ${errorDate.toLocaleString()}${colors.reset}`);
                    console.log(`   Message: ${webhook.last_error_message}`);
                }
                
                if (webhook.last_synchronization_error_date) {
                    const syncErrorDate = new Date(webhook.last_synchronization_error_date * 1000);
                    console.log(`${colors.red}   ⚠️  Erreur de sync: ${syncErrorDate.toLocaleString()}${colors.reset}`);
                }
                
                return webhook.url;
            } else {
                console.log(`${colors.yellow}⚠️  Aucun webhook configuré${colors.reset}`);
                console.log(`   Le bot fonctionne probablement en mode polling`);
                return null;
            }
        } else {
            console.log(`${colors.red}❌ Erreur lors de la vérification du webhook${colors.reset}`);
            return null;
        }
    } catch (error) {
        console.log(`${colors.red}❌ Erreur: ${error.message}${colors.reset}`);
        return null;
    }
}

// Supprimer le webhook
async function deleteWebhook() {
    console.log(`\n${colors.cyan}🗑️  Suppression du webhook...${colors.reset}`);
    
    try {
        const result = await telegramRequest('deleteWebhook');
        
        if (result.ok) {
            console.log(`${colors.green}✅ Webhook supprimé avec succès${colors.reset}`);
            return true;
        } else {
            console.log(`${colors.red}❌ Erreur lors de la suppression${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ Erreur: ${error.message}${colors.reset}`);
        return false;
    }
}

// Configurer un nouveau webhook
async function setWebhook(url) {
    console.log(`\n${colors.cyan}⚙️  Configuration du webhook...${colors.reset}`);
    console.log(`   URL: ${url}`);
    
    try {
        // Construire l'URL complète avec le token
        const webhookPath = `/bot${BOT_TOKEN}`;
        const fullUrl = `${url}${webhookPath}`;
        
        const result = await telegramRequest(`setWebhook?url=${encodeURIComponent(fullUrl)}&max_connections=40&allowed_updates=["message","callback_query","inline_query"]`);
        
        if (result.ok) {
            console.log(`${colors.green}✅ Webhook configuré avec succès!${colors.reset}`);
            console.log(`   URL complète: ${fullUrl}`);
            return true;
        } else {
            console.log(`${colors.red}❌ Erreur lors de la configuration${colors.reset}`);
            console.log(`   ${result.description}`);
            
            if (result.description.includes('HTTPS')) {
                console.log(`\n${colors.yellow}💡 Le webhook nécessite HTTPS${colors.reset}`);
                console.log(`   Solutions:`);
                console.log(`   1. Utilisez un service comme Render, Heroku, Railway`);
                console.log(`   2. Configurez SSL sur votre serveur`);
                console.log(`   3. Utilisez ngrok pour les tests locaux`);
            }
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}❌ Erreur: ${error.message}${colors.reset}`);
        return false;
    }
}

// Menu principal
async function showMenu() {
    console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}     🤖 Bot Telegram - Menu Principal${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}\n`);
    
    console.log(`1. Vérifier l'état complet du bot`);
    console.log(`2. Configurer le webhook`);
    console.log(`3. Supprimer le webhook (passer en polling)`);
    console.log(`4. Tester l'envoi d'un message`);
    console.log(`5. Afficher le guide de déploiement`);
    console.log(`0. Quitter`);
    
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    readline.question(`\n${colors.yellow}Choisissez une option: ${colors.reset}`, async (choice) => {
        console.log();
        
        switch(choice) {
            case '1':
                await runFullDiagnostic();
                break;
                
            case '2':
                if (WEBHOOK_URL) {
                    await deleteWebhook();
                    await setWebhook(WEBHOOK_URL);
                } else {
                    console.log(`${colors.red}❌ WEBHOOK_URL non défini dans .env${colors.reset}`);
                }
                break;
                
            case '3':
                await deleteWebhook();
                console.log(`${colors.yellow}Le bot peut maintenant être lancé en mode polling${colors.reset}`);
                break;
                
            case '4':
                await testSendMessage();
                break;
                
            case '5':
                showDeploymentGuide();
                break;
                
            case '0':
                console.log(`${colors.green}Au revoir!${colors.reset}`);
                process.exit(0);
                break;
                
            default:
                console.log(`${colors.red}Option invalide${colors.reset}`);
        }
        
        readline.close();
        
        // Afficher à nouveau le menu
        if (choice !== '0') {
            setTimeout(showMenu, 2000);
        }
    });
}

// Test d'envoi de message
async function testSendMessage() {
    if (!ADMIN_ID) {
        console.log(`${colors.red}❌ ADMIN_ID non défini. Impossible d'envoyer un message test.${colors.reset}`);
        return;
    }
    
    console.log(`\n${colors.cyan}📤 Test d'envoi de message...${colors.reset}`);
    
    try {
        const message = `🎉 Test réussi!\n\nVotre bot fonctionne correctement.\n\nDate: ${new Date().toLocaleString('fr-FR')}`;
        const result = await telegramRequest(`sendMessage?chat_id=${ADMIN_ID}&text=${encodeURIComponent(message)}&parse_mode=HTML`);
        
        if (result.ok) {
            console.log(`${colors.green}✅ Message envoyé avec succès!${colors.reset}`);
            console.log(`   Vérifiez vos messages Telegram`);
        } else {
            console.log(`${colors.red}❌ Erreur lors de l'envoi${colors.reset}`);
            console.log(`   ${result.description}`);
        }
    } catch (error) {
        console.log(`${colors.red}❌ Erreur: ${error.message}${colors.reset}`);
    }
}

// Guide de déploiement
function showDeploymentGuide() {
    console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}     📚 Guide de Déploiement Rapide${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}\n`);
    
    console.log(`${colors.yellow}1. Configuration locale (test):${colors.reset}`);
    console.log(`   npm install`);
    console.log(`   cp .env.example .env`);
    console.log(`   # Éditer .env avec vos valeurs`);
    console.log(`   npm run polling  # Mode polling pour tests\n`);
    
    console.log(`${colors.yellow}2. Déploiement sur Render (recommandé):${colors.reset}`);
    console.log(`   - Créez un compte sur render.com`);
    console.log(`   - Nouveau Web Service depuis GitHub`);
    console.log(`   - Start Command: npm start`);
    console.log(`   - Ajoutez les variables d'environnement`);
    console.log(`   - WEBHOOK_URL = https://your-app.onrender.com\n`);
    
    console.log(`${colors.yellow}3. Déploiement sur Heroku:${colors.reset}`);
    console.log(`   heroku create your-bot-name`);
    console.log(`   heroku config:set BOT_TOKEN=...`);
    console.log(`   heroku config:set WEBHOOK_URL=https://your-bot-name.herokuapp.com`);
    console.log(`   git push heroku main\n`);
    
    console.log(`${colors.green}💡 Conseil: Utilisez toujours le mode webhook en production!${colors.reset}`);
}

// Diagnostic complet
async function runFullDiagnostic() {
    console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}     🔍 Diagnostic Complet du Bot${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    
    // 1. Vérifier les variables d'environnement
    const envOk = checkEnvVariables();
    
    if (!envOk) {
        console.log(`\n${colors.red}⚠️  Corrigez d'abord les variables d'environnement dans .env${colors.reset}`);
        return;
    }
    
    // 2. Vérifier les infos du bot
    const botOk = await checkBotInfo();
    
    if (!botOk) {
        return;
    }
    
    // 3. Vérifier le webhook
    const webhookUrl = await checkWebhook();
    
    // 4. Recommandations
    console.log(`\n${colors.cyan}📝 Recommandations:${colors.reset}\n`);
    
    if (!webhookUrl && WEBHOOK_URL) {
        console.log(`${colors.yellow}→ Configurez le webhook pour de meilleures performances${colors.reset}`);
        console.log(`  Utilisez l'option 2 du menu pour le configurer`);
    } else if (!webhookUrl) {
        console.log(`${colors.yellow}→ Mode polling actif (non recommandé en production)${colors.reset}`);
        console.log(`  Définissez WEBHOOK_URL dans .env pour utiliser les webhooks`);
    } else if (webhookUrl !== `${WEBHOOK_URL}/bot${BOT_TOKEN}`) {
        console.log(`${colors.yellow}→ L'URL du webhook ne correspond pas à WEBHOOK_URL${colors.reset}`);
        console.log(`  Webhook actuel: ${webhookUrl}`);
        console.log(`  Webhook attendu: ${WEBHOOK_URL}/bot...`);
    } else {
        console.log(`${colors.green}✅ Configuration optimale!${colors.reset}`);
    }
    
    console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
}

// Fonction principale
async function main() {
    console.clear();
    console.log(`${colors.cyan}╔═══════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║   🤖 Bot Telegram - Outil de Diagnostic   ║${colors.reset}`);
    console.log(`${colors.cyan}║        Avec Système Anti-Spam         ║${colors.reset}`);
    console.log(`${colors.cyan}╚═══════════════════════════════════════╝${colors.reset}`);
    
    // Si pas de token, afficher les instructions
    if (!BOT_TOKEN) {
        console.log(`\n${colors.red}❌ Configuration manquante!${colors.reset}\n`);
        console.log(`${colors.yellow}Instructions:${colors.reset}`);
        console.log(`1. Copiez .env.example vers .env`);
        console.log(`   ${colors.blue}cp .env.example .env${colors.reset}\n`);
        console.log(`2. Éditez .env et ajoutez votre BOT_TOKEN`);
        console.log(`   ${colors.blue}nano .env${colors.reset}\n`);
        console.log(`3. Relancez ce script`);
        console.log(`   ${colors.blue}node check-bot-status.js${colors.reset}\n`);
        process.exit(1);
    }
    
    // Lancer le menu ou le diagnostic selon les arguments
    const args = process.argv.slice(2);
    
    if (args.includes('--check')) {
        await runFullDiagnostic();
        process.exit(0);
    } else if (args.includes('--set-webhook')) {
        if (WEBHOOK_URL) {
            await deleteWebhook();
            await setWebhook(WEBHOOK_URL);
        } else {
            console.log(`${colors.red}❌ WEBHOOK_URL non défini${colors.reset}`);
        }
        process.exit(0);
    } else if (args.includes('--delete-webhook')) {
        await deleteWebhook();
        process.exit(0);
    } else {
        await showMenu();
    }
}

// Lancer le script
main().catch(error => {
    console.error(`${colors.red}Erreur fatale: ${error.message}${colors.reset}`);
    process.exit(1);
});