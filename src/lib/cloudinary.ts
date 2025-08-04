import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dagnmkw0e',
  api_key: process.env.CLOUDINARY_API_KEY || '656387237536358',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'APJe9o-RlgaWWHq9zLQ0JztpACI',
  secure: true,
};

console.log('🔧 Configuration Cloudinary chargée:', {
  cloud_name: config.cloud_name,
  api_key: config.api_key ? `${config.api_key.substring(0, 6)}...` : 'MANQUANT',
  api_secret: config.api_secret ? 'OK' : 'MANQUANT'
});

cloudinary.config(config);

export default cloudinary;