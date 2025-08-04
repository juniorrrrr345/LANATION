require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dwez3etsh',
  api_key: process.env.CLOUDINARY_API_KEY || '567536976535776',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'RRiC4Hdh50szrTQMDHSRi3kxZZE'
});

// Configuration MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Intd7117:Junior50300.@lanation.cgsbvus.mongodb.net/?retryWrites=true&w=majority&appName=lanation';
const client = new MongoClient(mongoUri);

// Configuration Multer pour upload de fichiers
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

app.use(express.json());
app.use(express.static('public'));

// Route principale
app.get('/', (req, res) => {
  res.json({
    message: 'API MongoDB + Cloudinary',
    endpoints: {
      '/api/users': 'GET - Liste des utilisateurs',
      '/api/users': 'POST - Créer un utilisateur',
      '/api/upload': 'POST - Upload d\'image vers Cloudinary'
    }
  });
});

// Connexion à MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB Atlas');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
  }
}

// Routes API
app.get('/api/users', async (req, res) => {
  try {
    const db = client.db('lanation');
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const db = client.db('lanation');
    const result = await db.collection('users').insertOne({
      name,
      email,
      avatar,
      createdAt: new Date()
    });
    res.json({ success: true, userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload vers Cloudinary
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'lanation',
      use_filename: true,
      unique_filename: true
    });

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  connectDB();
});

module.exports = app;