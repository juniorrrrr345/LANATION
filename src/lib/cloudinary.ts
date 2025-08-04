import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dwez3etsh',
  api_key: process.env.CLOUDINARY_API_KEY || '567536976535776',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'RRiC4Hdh5OszrTQMDHSRi3kxZZE',
  secure: true,
};

console.log('🔧 Configuration Cloudinary chargée:', {
  cloud_name: config.cloud_name,
  api_key: config.api_key ? `${config.api_key.substring(0, 6)}...` : 'MANQUANT',
  api_secret: config.api_secret ? 'OK' : 'MANQUANT'
});

cloudinary.config(config);

export default cloudinary;