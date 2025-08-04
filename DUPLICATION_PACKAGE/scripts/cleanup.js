#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🧹 SCRIPT DE NETTOYAGE - BOUTIQUE\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  try {
    console.log('⚠️  ATTENTION : Ce script va supprimer les configurations actuelles');
    console.log('📋 Il va nettoyer :');
    console.log('   - Cache de build (.next)');
    console.log('   - Cache des modules (node_modules/.cache)');
    console.log('   - Fichiers temporaires');
    console.log('   - Optionnel : fichiers de configuration');
    console.log('');
    
    const confirm = await question('Continuer le nettoyage ? (y/N) : ');
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Nettoyage annulé');
      rl.close();
      return;
    }
    
    console.log('\n🧹 NETTOYAGE EN COURS...\n');
    
    // 1. Nettoyage des caches de build
    const buildCacheFiles = [
      '.next',
      'tsconfig.tsbuildinfo',
      'node_modules/.cache'
    ];
    
    buildCacheFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          if (fs.lstatSync(file).isDirectory()) {
            fs.rmSync(file, { recursive: true, force: true });
          } else {
            fs.unlinkSync(file);
          }
          console.log(`✅ Supprimé : ${file}`);
        } catch (error) {
          console.log(`⚠️  Erreur suppression ${file} : ${error.message}`);
        }
      } else {
        console.log(`ℹ️  Déjà absent : ${file}`);
      }
    });
    
    // 2. Nettoyage optionnel des fichiers de configuration
    console.log('\n🔧 NETTOYAGE AVANCÉ (OPTIONNEL)\n');
    
    const advancedClean = await question('Supprimer aussi les fichiers de config ? (y/N) : ');
    
    if (advancedClean.toLowerCase() === 'y' || advancedClean.toLowerCase() === 'yes') {
      const configFiles = [
        '.env.local',
        'CREDENTIALS_*.txt',
        'DEPLOIEMENT_GUIDE.md',
        'shop-config.js'
      ];
      
      configFiles.forEach(filePattern => {
        if (filePattern.includes('*')) {
          // Gérer les wildcards
          const files = fs.readdirSync('.').filter(file => 
            file.startsWith(filePattern.split('*')[0]) && 
            file.endsWith(filePattern.split('*')[1])
          );
          files.forEach(file => {
            try {
              fs.unlinkSync(file);
              console.log(`✅ Supprimé : ${file}`);
            } catch (error) {
              console.log(`⚠️  Erreur suppression ${file} : ${error.message}`);
            }
          });
        } else {
          if (fs.existsSync(filePattern)) {
            try {
              fs.unlinkSync(filePattern);
              console.log(`✅ Supprimé : ${filePattern}`);
            } catch (error) {
              console.log(`⚠️  Erreur suppression ${filePattern} : ${error.message}`);
            }
          } else {
            console.log(`ℹ️  Déjà absent : ${filePattern}`);
          }
        }
      });
      
      console.log('\n⚠️  CONFIGURATION SUPPRIMÉE :');
      console.log('   Vous devrez reconfigurer votre boutique avec :');
      console.log('   npm run setup-new-shop');
    }
    
    // 3. Nettoyage des logs et fichiers temporaires
    console.log('\n🗂️  NETTOYAGE DES TEMPORAIRES...\n');
    
    const tempFiles = [
      '*.log',
      '*.tmp',
      '.DS_Store',
      'Thumbs.db'
    ];
    
    tempFiles.forEach(pattern => {
      if (pattern.includes('*')) {
        const extension = pattern.split('*')[1];
        const files = fs.readdirSync('.').filter(file => file.endsWith(extension));
        files.forEach(file => {
          try {
            fs.unlinkSync(file);
            console.log(`✅ Supprimé : ${file}`);
          } catch (error) {
            console.log(`⚠️  Erreur : ${error.message}`);
          }
        });
      } else {
        if (fs.existsSync(pattern)) {
          try {
            fs.unlinkSync(pattern);
            console.log(`✅ Supprimé : ${pattern}`);
          } catch (error) {
            console.log(`⚠️  Erreur : ${error.message}`);
          }
        }
      }
    });
    
    // 4. Réinstallation propre (optionnel)
    console.log('\n📦 RÉINSTALLATION PROPRE (OPTIONNEL)\n');
    
    const reinstall = await question('Réinstaller les dépendances proprement ? (y/N) : ');
    
    if (reinstall.toLowerCase() === 'y' || reinstall.toLowerCase() === 'yes') {
      console.log('🗑️  Suppression de node_modules...');
      if (fs.existsSync('node_modules')) {
        fs.rmSync('node_modules', { recursive: true, force: true });
        console.log('✅ node_modules supprimé');
      }
      
      if (fs.existsSync('package-lock.json')) {
        fs.unlinkSync('package-lock.json');
        console.log('✅ package-lock.json supprimé');
      }
      
      console.log('\n📥 Réinstallation des dépendances...');
      console.log('⏳ Veuillez patienter...');
      
      const { spawn } = require('child_process');
      const npmInstall = spawn('npm', ['install'], { stdio: 'inherit' });
      
      npmInstall.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Dépendances réinstallées avec succès');
        } else {
          console.log('❌ Erreur lors de la réinstallation');
        }
        finishCleanup();
      });
      
      return; // Sort pour attendre la fin de npm install
    }
    
    finishCleanup();
    
  } catch (error) {
    console.error('\n❌ ERREUR lors du nettoyage :');
    console.error(error.message);
  } finally {
    if (!reinstall || reinstall.toLowerCase() !== 'y') {
      rl.close();
    }
  }
}

function finishCleanup() {
  console.log('\n🎉 NETTOYAGE TERMINÉ !\n');
  console.log('✅ Votre projet a été nettoyé');
  console.log('📋 Prochaines étapes recommandées :');
  console.log('   1. npm run validate-setup (vérifier l\'état)');
  console.log('   2. npm run setup-new-shop (si config supprimée)');
  console.log('   3. npm run dev (tester en local)');
  console.log('');
  console.log('🚀 Votre boutique est prête pour un nouveau départ !');
  
  rl.close();
}

// Vérification que nous sommes dans un projet Next.js
if (!fs.existsSync('package.json')) {
  console.error('❌ Erreur : package.json non trouvé');
  console.log('💡 Assurez-vous d\'être dans le dossier racine de votre projet');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!packageJson.dependencies || !packageJson.dependencies.next) {
  console.error('❌ Erreur : Ce ne semble pas être un projet Next.js');
  console.log('💡 Vérifiez que vous êtes dans le bon dossier');
  process.exit(1);
}

main();