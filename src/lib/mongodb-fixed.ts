import mongoose from 'mongoose';

// URI MongoDB Atlas - Utilise la variable d'environnement
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lmvrtt2:ALcWY4mLHwvtz1X2@lmvrtt.km9x4q9.mongodb.net/lmvrtt_shop?retryWrites=true&w=majority&appName=LMVRTT';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
      console.log('🔗 Tentative de connexion MongoDB...');
  console.log('📡 URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

  if (cached.conn) {
    console.log('✅ Utilisation connexion existante');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // Augmenté à 30s
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4, // Forcer IPv4
    };

    console.log('🔄 Création nouvelle connexion...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connexion MongoDB réussie');
      return mongoose;
    }).catch((error) => {
      console.error('❌ Erreur connexion MongoDB:', error);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Échec connexion MongoDB:', e);
    throw e;
  }
}

export default connectDB;

// Export also a function that returns the db directly
export async function connectToDatabase() {
  const mongooseInstance = await connectDB();
  return { 
    db: mongooseInstance.connection.db,
    client: mongooseInstance.connection.getClient()
  };
}