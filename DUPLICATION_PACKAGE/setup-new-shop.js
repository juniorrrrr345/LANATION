#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔄 ASSISTANT DE DUPLICATION - NOUVELLE BOUTIQUE');
console.log('='.repeat(50));
console.log('✨ Ce script va configurer votre nouvelle boutique automatiquement');
console.log('📋 Assurez-vous d\'avoir vos credentials MongoDB et Cloudinary prêts\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function generateSecretKey() {
  return crypto.randomBytes(32).toString('base64');
}

function cleanInput(input) {
  return input.trim().replace(/['"]/g, '');
}

function validateRequired(value, fieldName) {
  if (!value || value.trim() === '') {
    throw new Error(`❌ ${fieldName} est obligatoire`);
  }
  return value.trim();
}

async function main() {
  try {
    console.log('📝 ÉTAPE 1/4 - Informations de la boutique\n');
    
    // Informations boutique
    const shopTitle = validateRequired(
      await question('🏪 Nom de votre boutique : '), 
      'Nom de la boutique'
    );
    
    const shopSubtitle = validateRequired(
      await question('📝 Description/sous-titre : '), 
      'Description'
    );
    
    const telegramChannel = cleanInput(
      await question('📱 Canal Telegram (@votrecanal) : ')
    ).replace('@', '');
    
    const scrollingText = cleanInput(
      await question(`✨ Texte défilant (ENTER pour "${shopTitle.toUpperCase()} 📲 • CONTACT") : `)
    ) || `${shopTitle.toUpperCase()} 📲 • CONTACT`;
    
    console.log('\n🔐 ÉTAPE 2/4 - Configuration Administrateur\n');
    
    const adminUsername = validateRequired(
      await question('👤 Nom d\'utilisateur admin : '), 
      'Nom d\'utilisateur admin'
    );
    
    const adminPassword = validateRequired(
      await question('🔒 Mot de passe admin (sécurisé) : '), 
      'Mot de passe admin'
    );
    
    console.log('\n🗄️ ÉTAPE 3/4 - Base de Données MongoDB\n');
    console.log('💡 Format: mongodb+srv://username:password@cluster.mongodb.net/database');
    
    const mongoUri = validateRequired(
      await question('🔗 MongoDB URI : '), 
      'MongoDB URI'
    );
    
    console.log('\n☁️ ÉTAPE 4/4 - Configuration Cloudinary\n');
    
    const cloudinaryName = validateRequired(
      await question('🌟 Cloud Name : '), 
      'Cloudinary Cloud Name'
    );
    
    const cloudinaryKey = validateRequired(
      await question('🔑 API Key : '), 
      'Cloudinary API Key'
    );
    
    const cloudinarySecret = validateRequired(
      await question('🔐 API Secret : '), 
      'Cloudinary API Secret'
    );
    
    // Génération clé secrète
    const nextAuthSecret = generateSecretKey();
    
    console.log('\n🚀 CONFIGURATION EN COURS...\n');
    
    // 1. Création .env.local
    const envContent = `# Configuration générée automatiquement pour ${shopTitle}
# Générée le : ${new Date().toLocaleString()}

# MongoDB
MONGODB_URI=${mongoUri}

# Cloudinary
CLOUDINARY_CLOUD_NAME=${cloudinaryName}
CLOUDINARY_API_KEY=${cloudinaryKey}
CLOUDINARY_API_SECRET=${cloudinarySecret}

# Admin
ADMIN_USERNAME=${adminUsername}
ADMIN_PASSWORD=${adminPassword}

# NextAuth Secret (généré automatiquement)
NEXTAUTH_SECRET=${nextAuthSecret}

# Environment
NODE_ENV=production
`;

    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Fichier .env.local créé');
    
    // 2. Création du fichier de sauvegarde des credentials
    const backupContent = `# 🔐 SAUVEGARDE DES CREDENTIALS - ${shopTitle}
# Généré le : ${new Date().toLocaleString()}
# ⚠️ GARDEZ CE FICHIER EN SÉCURITÉ ET NE LE PARTAGEZ PAS !

Boutique: ${shopTitle}
Description: ${shopSubtitle}
Admin Username: ${adminUsername}
Admin Password: ${adminPassword}
Telegram: @${telegramChannel}
Cloud Name: ${cloudinaryName}
API Key: ${cloudinaryKey}
Generated Secret: ${nextAuthSecret}

# Instructions de restauration:
# 1. Copiez ces valeurs dans votre .env.local
# 2. Ou relancez: npm run setup-new-shop
`;

    fs.writeFileSync(`CREDENTIALS_${shopTitle.replace(/\s+/g, '_')}.txt`, backupContent);
    console.log('✅ Sauvegarde des credentials créée');
    
    // 3. Configuration du contenu par défaut
    const contentCachePath = 'src/lib/contentCache.ts';
    if (fs.existsSync(contentCachePath)) {
      let contentCache = fs.readFileSync(contentCachePath, 'utf8');
      
      // Remplacements basiques
      contentCache = contentCache.replace(
        /shopTitle: '[^']*'/g, 
        `shopTitle: '${shopTitle}'`
      );
      contentCache = contentCache.replace(
        /shopSubtitle: '[^']*'/g, 
        `shopSubtitle: '${shopSubtitle}'`
      );
      contentCache = contentCache.replace(
        /scrollingText: '[^']*'/g, 
        `scrollingText: '${scrollingText}'`
      );
      
      if (telegramChannel) {
        contentCache = contentCache.replace(
          /telegramLink: '[^']*'/g, 
          `telegramLink: 'https://t.me/${telegramChannel}'`
        );
      }
      
      // Contenu Info personnalisé
      const infoContent = `# À propos de ${shopTitle}

**${shopTitle}** - ${shopSubtitle}

## Nos Services
- 🛍️ Produits de qualité premium
- 🚀 Livraison rapide et sécurisée  
- 💬 Support client réactif
- 🔒 Paiement sécurisé

## Notre Engagement
Nous nous engageons à vous fournir les meilleurs produits avec un service client exceptionnel.

## Contact
Rejoignez-nous sur Telegram : @${telegramChannel}`;

      // Remplacer le contenu info
      contentCache = contentCache.replace(
        /getInfoContent\(\) \{[\s\S]*?return this\.data\.infoPage\?\.content \|\| `[\s\S]*?`;/,
        `getInfoContent() {
    return this.data.infoPage?.content || \`${infoContent}\`;`
      );
      
      // Contenu Contact personnalisé
      const contactContent = `# Contactez ${shopTitle}

## 📱 Nous Contacter
**Telegram:** @${telegramChannel}  
**Disponibilité:** 24h/24, 7j/7

## 🚚 Livraison
**Zone de livraison:** À préciser
**Délais:** Livraison rapide
**Méthodes:** Livraison sécurisée

## ❓ Support
Notre équipe est là pour vous aider !`;

      contentCache = contentCache.replace(
        /getContactContent\(\) \{[\s\S]*?return this\.data\.contactPage\?\.content \|\| `[\s\S]*?`;/,
        `getContactContent() {
    return this.data.contactPage?.content || \`${contactContent}\`;`
      );
      
      fs.writeFileSync(contentCachePath, contentCache);
      console.log('✅ Configuration de base mise à jour');
    }
    
    // 4. Mise à jour page d'accueil
    const pagePath = 'src/app/page.tsx';
    if (fs.existsSync(pagePath)) {
      let pageContent = fs.readFileSync(pagePath, 'utf8');
      pageContent = pageContent.replace(
        /Bienvenu\(e\)s sur Notre Mini App 📲/g,
        `Bienvenu(e)s chez ${shopTitle} 📲`
      );
      pageContent = pageContent.replace(
        /Bienvenu\(e\)s chez [^📲]*📲/g,
        `Bienvenu(e)s chez ${shopTitle} 📲`
      );
      fs.writeFileSync(pagePath, pageContent);
      console.log('✅ Page d\'accueil personnalisée');
    }
    
    // 5. Mise à jour métadonnées
    const layoutPath = 'src/app/layout.tsx';
    if (fs.existsSync(layoutPath)) {
      let layoutContent = fs.readFileSync(layoutPath, 'utf8');
      layoutContent = layoutContent.replace(
        /title: '[^']*'/g, 
        `title: '${shopTitle}'`
      );
      layoutContent = layoutContent.replace(
        /description: '[^']*'/g, 
        `description: '${shopTitle} - ${shopSubtitle}'`
      );
      fs.writeFileSync(layoutPath, layoutContent);
      console.log('✅ Métadonnées SEO mises à jour');
    }
    
    // 6. Mise à jour package.json
    const packagePath = 'package.json';
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      packageJson.name = shopTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      packageJson.description = `${shopTitle} - ${shopSubtitle}`;
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Package.json mis à jour');
    }
    
    // 7. Nettoyage des anciennes données
    console.log('🧹 Nettoyage des anciennes configurations...');
    
    // Supprimer d'éventuels fichiers de cache
    const filesToClean = [
      '.next',
      'node_modules/.cache',
      'tsconfig.tsbuildinfo'
    ];
    
    filesToClean.forEach(file => {
      if (fs.existsSync(file)) {
        if (fs.lstatSync(file).isDirectory()) {
          fs.rmSync(file, { recursive: true, force: true });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`  ✅ ${file} supprimé`);
      }
    });
    
    // 8. Création du guide de déploiement personnalisé
    const deployGuide = `# 🚀 Guide de Déploiement - ${shopTitle}

## ✅ Configuration Terminée

Votre boutique **${shopTitle}** est maintenant configurée !

### 📋 Récapitulatif
- **Nom:** ${shopTitle}
- **Description:** ${shopSubtitle}
- **Admin:** ${adminUsername}
- **Telegram:** @${telegramChannel}

### 🔧 Prochaines Étapes

1. **Test en Local**
   \`\`\`bash
   npm run dev
   \`\`\`
   Ouvrez http://localhost:3000

2. **Déploiement Vercel**
   - Allez sur https://vercel.com
   - Importez votre repository GitHub
   - Ajoutez vos variables d'environnement (voir .env.local)
   - Déployez !

3. **Configuration Admin**
   - Allez sur votre-boutique.vercel.app/admin
   - Connectez-vous avec: ${adminUsername}
   - Ajoutez vos produits, catégories, etc.

### 🔐 Sécurité
- Vos credentials sont sauvegardés dans CREDENTIALS_${shopTitle.replace(/\s+/g, '_')}.txt
- Gardez ce fichier en sécurité !
- Ne le commitez jamais sur GitHub

### 🎉 Félicitations !
Votre boutique est prête à être déployée !
`;

    fs.writeFileSync('DEPLOIEMENT_GUIDE.md', deployGuide);
    console.log('✅ Guide de déploiement créé');
    
    console.log('\n🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !\n');
    console.log('=' .repeat(50));
    console.log(`✨ Boutique: ${shopTitle}`);
    console.log(`📝 Description: ${shopSubtitle}`);
    console.log(`👤 Admin: ${adminUsername}`);
    console.log(`📱 Telegram: @${telegramChannel}`);
    console.log('=' .repeat(50));
    
    console.log('\n📋 PROCHAINES ÉTAPES:');
    console.log('1. ✅ Configuration terminée');
    console.log('2. 🧪 Testez en local: npm run dev');
    console.log('3. 🚀 Déployez sur Vercel');
    console.log('4. ⚙️ Configurez depuis /admin');
    console.log('5. 🛍️ Ajoutez vos produits');
    
    console.log('\n📁 FICHIERS CRÉÉS:');
    console.log('- .env.local (variables d\'environnement)');
    console.log(`- CREDENTIALS_${shopTitle.replace(/\s+/g, '_')}.txt (sauvegarde)`);
    console.log('- DEPLOIEMENT_GUIDE.md (guide suivant)');
    
    console.log('\n🚀 Votre boutique est prête à conquérir le monde !');
    
  } catch (error) {
    console.error('\n❌ ERREUR lors de la configuration:');
    console.error(error.message);
    console.log('\n🔧 Vérifiez vos informations et relancez: npm run setup-new-shop');
  } finally {
    rl.close();
  }
}

// Vérifications préliminaires
if (!fs.existsSync('package.json')) {
  console.error('❌ Erreur: package.json non trouvé');
  console.log('💡 Assurez-vous d\'être dans le dossier racine de votre projet');
  process.exit(1);
}

if (!fs.existsSync('src')) {
  console.error('❌ Erreur: Dossier src/ non trouvé');
  console.log('💡 Ce script doit être lancé depuis la racine du projet Next.js');
  process.exit(1);
}

main();