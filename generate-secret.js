const crypto = require('crypto');

// Générer un JWT secret sécurisé
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('🔐 JWT_SECRET généré:');
console.log(jwtSecret);
console.log('\n📋 Copiez cette valeur dans vos variables d\'environnement Vercel');
console.log('⚠️  Gardez ce secret en sécurité et ne le partagez jamais !');