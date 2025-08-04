require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testMongoDBConnection() {
  const uri = process.env.MONGODB_URI;
  console.log('🔗 Test de connexion MongoDB...');
  console.log('📡 URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log('✅ Connexion MongoDB réussie !');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('📂 Collections disponibles:', collections.map(c => c.name));
    
    await client.close();
    console.log('🔒 Connexion fermée');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.error('🔍 Détails:', error);
  }
}

testMongoDBConnection();