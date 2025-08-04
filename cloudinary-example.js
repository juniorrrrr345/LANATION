require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configuration de Cloudinary à partir des variables d'environnement
cloudinary.config({
  cloud_name: 'dwez3etsh',
  api_key: '567536976535776',
  api_secret: 'RRiC4Hdh50szrTQMDHSRi3kxZZE'
});

// Exemple d'upload d'image
async function uploadImage(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'my-app',
      use_filename: true
    });
    console.log('Image uploadée avec succès:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    throw error;
  }
}

// Exemple d'utilisation
// uploadImage('./path/to/your/image.jpg');

module.exports = { uploadImage };