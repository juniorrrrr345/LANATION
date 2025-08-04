import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload Cloudinary LANATION démarré...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const convertToGif = formData.get('convertToGif') === 'true';
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    console.log('📁 Fichier reçu:', {
      name: file.name,
      type: file.type,
      size: Math.round(file.size / 1024 / 1024 * 100) / 100 + 'MB'
    });

    // Déterminer le type réel du fichier basé sur l'extension si le type MIME est vide ou incorrect
    let fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // Gestion spéciale pour les fichiers iPhone
    if (!fileType || fileType === 'application/octet-stream' || fileType === '') {
      console.log('⚠️ Type MIME manquant, détection par extension...');
      
      if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        fileType = 'image/jpeg';
      } else if (fileName.endsWith('.png')) {
        fileType = 'image/png';
      } else if (fileName.endsWith('.webp')) {
        fileType = 'image/webp';
      } else if (fileName.endsWith('.gif')) {
        fileType = 'image/gif';
      } else if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
        fileType = 'image/heic';
      } else if (fileName.endsWith('.mp4')) {
        fileType = 'video/mp4';
      } else if (fileName.endsWith('.mov')) {
        fileType = 'video/quicktime';
      } else if (fileName.endsWith('.3gp') || fileName.endsWith('.3g2')) {
        fileType = 'video/3gpp';
      } else if (fileName.endsWith('.webm')) {
        fileType = 'video/webm';
      } else if (fileName.endsWith('.avi')) {
        fileType = 'video/x-msvideo';
      } else if (fileName.endsWith('.mkv')) {
        fileType = 'video/x-matroska';
      }
      
      console.log('📋 Type détecté:', fileType);
    }

    // Accepter TOUS les fichiers avec extensions valides
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif', '.mp4', '.mov', '.avi', '.3gp', '.3g2', '.webm', '.mkv'];
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json({ 
        error: `Extension non supportée: ${fileExtension}. Extensions acceptées: ${validExtensions.join(', ')}` 
      }, { status: 400 });
    }
    
    // Déterminer si c'est une vidéo
    const videoExtensions = ['.mp4', '.mov', '.avi', '.3gp', '.3g2', '.webm', '.mkv'];
    const isVideo = videoExtensions.includes(fileExtension) || fileType.startsWith('video/');

    const maxSize = isVideo ? 2 * 1024 * 1024 * 1024 : 50 * 1024 * 1024; // 2GB pour vidéos (longues et haute qualité), 50MB pour images
    
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB. Maximum ${isVideo ? '2GB' : '50MB'}` 
      }, { status: 400 });
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pour les fichiers HEIC/HEIF, on doit utiliser un type MIME supporté par Cloudinary
    let uploadType = fileType;
    if (fileType === 'image/heic' || fileType === 'image/heif' || fileExtension === '.heic' || fileExtension === '.heif') {
      // Cloudinary peut gérer HEIC mais on doit utiliser le bon type
      uploadType = 'image/jpeg'; // Cloudinary convertira automatiquement
      console.log('🔄 Format HEIC/HEIF détecté - Cloudinary va convertir en JPEG');
    }

    // Upload vers Cloudinary avec preset unsigned
    const uploadResult = await new Promise(async (resolve, reject) => {
      // Créer un FormData pour l'upload
      const uploadFormData = new FormData();
      
      // Pour les vidéos, utiliser le fichier original pour éviter les problèmes
      if (isVideo) {
        uploadFormData.append('file', file);
      } else {
        // Pour les images, on peut utiliser le blob
        const blob = new Blob([buffer], { type: uploadType });
        uploadFormData.append('file', blob, file.name);
      }
      
      // Ajouter les paramètres du preset - TRÈS IMPORTANT
      uploadFormData.append('upload_preset', 'lntdl_media');
      
      // Pour les fichiers HEIC, demander une conversion automatique
      if (fileExtension === '.heic' || fileExtension === '.heif') {
        uploadFormData.append('format', 'jpg');
      }
      
      // Pour les vidéos HEVC/H.265, forcer la conversion en H.264
      if (isVideo) {
        // Détecter si c'est une vidéo HEVC
        const buffer = Buffer.from(await file.arrayBuffer());
        const isHEVC = buffer.length > 8 && 
                       (buffer.indexOf(Buffer.from('hvc1')) !== -1 || 
                        buffer.indexOf(Buffer.from('hev1')) !== -1 ||
                        buffer.indexOf(Buffer.from('HEVC')) !== -1);
        
        if (convertToGif) {
          console.log('🎬 Conversion vidéo → GIF pour Telegram');
          // Paramètres optimisés pour GIF Telegram
          uploadFormData.append('resource_type', 'video');
          uploadFormData.append('format', 'gif');
          uploadFormData.append('flags', 'animated');
          uploadFormData.append('width', '480'); // Largeur max pour Telegram
          uploadFormData.append('height', '480'); // Hauteur max pour Telegram
          uploadFormData.append('crop', 'fit'); // Ajuster sans déformer
          uploadFormData.append('quality', '80'); // Bonne qualité
          uploadFormData.append('delay', '5'); // Délai entre frames (5 = 20fps)
          uploadFormData.append('video_sampling', '10'); // Échantillonnage vidéo
          uploadFormData.append('duration', '10'); // Max 10 secondes pour Telegram
        } else if (isHEVC || fileExtension === '.mov' || uploadType === 'video/quicktime') {
          console.log('🔄 Vidéo HEVC/MOV détectée - Conversion en H.264');
          // Forcer la conversion en MP4 H.264
          uploadFormData.append('resource_type', 'video');
          uploadFormData.append('format', 'mp4');
          uploadFormData.append('video_codec', 'h264');
        }
      }
      
      console.log('📤 Upload vers Cloudinary avec preset:', 'lntdl_media', 'Type:', uploadType);

      // Upload direct vers Cloudinary
      fetch(`https://api.cloudinary.com/v1_1/dwez3etsh/${isVideo ? 'video' : 'image'}/upload`, {
        method: 'POST',
        body: uploadFormData
      })
      .then(async response => {
        console.log('📥 Réponse Cloudinary:', response.status, response.statusText);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Erreur HTTP:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        // Essayer de parser la réponse JSON
        const responseText = await response.text();
        console.log('📄 Réponse brute:', responseText.substring(0, 200));
        
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ Erreur parsing JSON:', parseError);
          console.error('Réponse complète:', responseText);
          throw new Error('Réponse Cloudinary invalide');
        }
      })
      .then(result => {
        if (result.error) {
          console.error('❌ Erreur Cloudinary:', result.error);
          reject(new Error(result.error.message || 'Erreur upload'));
        } else {
          console.log('✅ Upload réussi:', result.secure_url);
          resolve(result);
        }
      })
      .catch(error => {
        console.error('❌ Erreur fetch:', error);
        reject(error);
      });
    });

    const result = uploadResult as any;
    
    // Déterminer le type final
    let finalType: 'image' | 'video' | 'gif' = isVideo ? 'video' : 'image';
    if (convertToGif && isVideo) {
      finalType = 'gif';
    }
    
    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      type: finalType,
      filename: file.name,
      size: file.size,
      format: result.format // Format final après conversion
    });

  } catch (error) {
    console.error('❌ Erreur upload:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'upload',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}