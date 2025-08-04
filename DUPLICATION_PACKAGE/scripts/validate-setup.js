#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATION DE VOTRE INSTALLATION\n');

let hasErrors = false;
let warnings = [];

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} : ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description} : ${filePath} - MANQUANT`);
    hasErrors = true;
    return false;
  }
}

function checkEnvVariable(envContent, varName, description) {
  if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=[`)) {
    console.log(`✅ ${description} : ${varName}`);
    return true;
  } else {
    console.log(`❌ ${description} : ${varName} - MANQUANT OU INVALIDE`);
    hasErrors = true;
    return false;
  }
}

function addWarning(message) {
  warnings.push(message);
  console.log(`⚠️  ${message}`);
}

// 1. Vérification des fichiers essentiels
console.log('📁 VÉRIFICATION DES FICHIERS :\n');

checkFile('package.json', 'Package.json');
checkFile('next.config.js', 'Configuration Next.js');
checkFile('tailwind.config.ts', 'Configuration Tailwind');
checkFile('src/app/layout.tsx', 'Layout principal');
checkFile('src/app/page.tsx', 'Page d\'accueil');
checkFile('src/lib/contentCache.ts', 'Cache de contenu');

// 2. Vérification du fichier .env.local
console.log('\n🔐 VÉRIFICATION DES VARIABLES D\'ENVIRONNEMENT :\n');

if (checkFile('.env.local', 'Variables d\'environnement')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  checkEnvVariable(envContent, 'MONGODB_URI', 'MongoDB URI');
  checkEnvVariable(envContent, 'CLOUDINARY_CLOUD_NAME', 'Cloudinary Cloud Name');
  checkEnvVariable(envContent, 'CLOUDINARY_API_KEY', 'Cloudinary API Key');
  checkEnvVariable(envContent, 'CLOUDINARY_API_SECRET', 'Cloudinary API Secret');
  checkEnvVariable(envContent, 'ADMIN_USERNAME', 'Admin Username');
  checkEnvVariable(envContent, 'ADMIN_PASSWORD', 'Admin Password');
  checkEnvVariable(envContent, 'NEXTAUTH_SECRET', 'NextAuth Secret');
  
  // Vérifications avancées
  if (envContent.includes('MONGODB_URI=mongodb+srv://')) {
    console.log('✅ Format MongoDB URI : Valide');
  } else {
    addWarning('Format MongoDB URI suspect - vérifiez votre connection string');
  }
  
  if (envContent.includes('ADMIN_PASSWORD=') && envContent.match(/ADMIN_PASSWORD=.{8,}/)) {
    console.log('✅ Mot de passe admin : Longueur suffisante');
  } else {
    addWarning('Mot de passe admin trop court (minimum 8 caractères recommandé)');
  }
}

// 3. Vérification de la structure des dossiers
console.log('\n📂 VÉRIFICATION DE LA STRUCTURE :\n');

const requiredDirs = [
  'src/app',
  'src/components',
  'src/lib',
  'src/models',
  'public'
];

requiredDirs.forEach(dir => {
  checkFile(dir, `Dossier ${dir}`);
});

// 4. Vérification des dépendances
console.log('\n📦 VÉRIFICATION DES DÉPENDANCES :\n');

if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = [
    'next', 'react', 'react-dom', 'mongodb', 'mongoose', 
    'cloudinary', 'multer', 'sharp'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ Dépendance : ${dep} v${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ Dépendance manquante : ${dep}`);
      hasErrors = true;
    }
  });
  
  // Vérification node_modules
  if (fs.existsSync('node_modules')) {
    console.log('✅ Modules installés : node_modules présent');
  } else {
    addWarning('Modules non installés - lancez "npm install"');
  }
}

// 5. Vérification de la personnalisation
console.log('\n🎨 VÉRIFICATION DE LA PERSONNALISATION :\n');

if (fs.existsSync('src/lib/contentCache.ts')) {
  const contentCache = fs.readFileSync('src/lib/contentCache.ts', 'utf8');
  
  if (contentCache.includes('shopTitle: \'LTDM\'')) {
    addWarning('Titre de boutique non personnalisé (encore LTDM)');
  } else {
    console.log('✅ Titre de boutique : Personnalisé');
  }
  
  if (contentCache.includes('telegramLink: \'\'')) {
    addWarning('Lien Telegram vide');
  } else {
    console.log('✅ Lien Telegram : Configuré');
  }
}

// 6. Vérification Git
console.log('\n🐙 VÉRIFICATION GIT :\n');

if (fs.existsSync('.git')) {
  console.log('✅ Repository Git : Initialisé');
  
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (gitignore.includes('.env.local')) {
      console.log('✅ Sécurité : .env.local dans .gitignore');
    } else {
      console.log('❌ SÉCURITÉ : .env.local PAS dans .gitignore !');
      hasErrors = true;
    }
  }
} else {
  addWarning('Repository Git non initialisé');
}

// 7. Tests de connectivité (basiques)
console.log('\n🌐 SUGGESTIONS DE TESTS :\n');

console.log('📝 Tests recommandés à faire manuellement :');
console.log('   1. npm run dev (test local)');
console.log('   2. Connexion au panel admin');
console.log('   3. Upload d\'une image de test');
console.log('   4. Création d\'un produit de test');
console.log('   5. Test de commande via Telegram');

// 8. Résumé final
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSUMÉ DE LA VALIDATION');
console.log('='.repeat(50));

if (hasErrors) {
  console.log('❌ ERREURS DÉTECTÉES :');
  console.log('   Corrigez les erreurs avant de continuer');
  console.log('   Relancez la validation après corrections');
} else {
  console.log('✅ AUCUNE ERREUR CRITIQUE');
  console.log('   Votre installation semble correcte !');
}

if (warnings.length > 0) {
  console.log(`\n⚠️  ${warnings.length} AVERTISSEMENT(S) :`)
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
  console.log('   Ces avertissements ne bloquent pas le fonctionnement');
}

console.log('\n🚀 PROCHAINES ÉTAPES :');
if (hasErrors) {
  console.log('   1. Corrigez les erreurs listées');
  console.log('   2. Relancez : npm run validate-setup');
} else {
  console.log('   1. Testez en local : npm run dev');
  console.log('   2. Déployez sur Vercel');
  console.log('   3. Configurez votre boutique !');
}

console.log('\n📚 AIDE :');
console.log('   - Documentation complète dans DUPLICATION_PACKAGE/guides/');
console.log('   - Script de configuration : npm run setup-new-shop');
console.log('   - Nettoyage : npm run cleanup');

process.exit(hasErrors ? 1 : 0);