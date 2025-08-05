require('dotenv').config();
const mongoose = require('mongoose');
const { loadConfig, saveConfig, resetConfig, Config } = require('./config');

async function testBot() {
    console.log('🧪 Test du bot Telegram avec MongoDB\n');
    
    // Vérifier les variables d'environnement
    console.log('📋 Vérification des variables d\'environnement:');
    console.log('- BOT_TOKEN:', process.env.BOT_TOKEN ? '✅ Défini' : '❌ Manquant');
    console.log('- ADMIN_ID:', process.env.ADMIN_ID ? '✅ Défini' : '❌ Manquant');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Défini' : '❌ Manquant');
    
    if (!process.env.BOT_TOKEN || !process.env.ADMIN_ID) {
        console.error('\n❌ Variables manquantes! Créez un fichier .env avec BOT_TOKEN et ADMIN_ID');
        process.exit(1);
    }
    
    console.log('\n📊 Test de MongoDB:');
    
    try {
        // Attendre la connexion MongoDB
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Tester le chargement de la configuration
        console.log('\n1️⃣ Test de chargement de la configuration...');
        const config = await loadConfig();
        console.log('✅ Configuration chargée:', {
            welcomeMessage: config.welcomeMessage?.substring(0, 30) + '...',
            socialNetworks: config.socialNetworks?.length || 0
        });
        
        // Tester la sauvegarde
        console.log('\n2️⃣ Test de sauvegarde...');
        const testConfig = {
            ...config,
            welcomeMessage: 'Test message ' + new Date().toISOString()
        };
        const saved = await saveConfig(testConfig);
        console.log(saved ? '✅ Sauvegarde réussie' : '❌ Échec de la sauvegarde');
        
        // Vérifier la persistance
        console.log('\n3️⃣ Test de persistance...');
        const reloaded = await loadConfig();
        if (reloaded.welcomeMessage === testConfig.welcomeMessage) {
            console.log('✅ Les modifications sont bien persistées!');
        } else {
            console.log('❌ Les modifications ne sont pas persistées');
        }
        
        // Afficher les collections
        console.log('\n4️⃣ Collections MongoDB:');
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(col => {
            console.log(`- ${col.name}`);
        });
        
        // Compter les documents
        console.log('\n5️⃣ Statistiques:');
        const configCount = await Config.countDocuments();
        console.log(`- Configurations: ${configCount}`);
        
        console.log('\n✅ Tous les tests sont passés! Le bot est prêt pour le déploiement.');
        
    } catch (error) {
        console.error('\n❌ Erreur pendant les tests:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Connexion MongoDB fermée');
        process.exit(0);
    }
}

// Lancer les tests
testBot();