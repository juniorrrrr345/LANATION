import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Configuration Next.js 14 - Augmenté pour les vidéos plus longues
export const maxDuration = 300; // 5 minutes pour les uploads vidéo
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload Cloudinary démarré...');
    
    // Vérifier la configuration Cloudinary
    console.log('🔧 Configuration Cloudinary:', {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key ? 'OK' : 'MANQUANT',
      api_secret: cloudinary.config().api_secret ? 'OK' : 'MANQUANT'
    });
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('❌ Aucun fichier dans la requête');
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    console.log('📁 Fichier reçu:', {
      name: file.name,
      type: file.type,
      size: Math.round(file.size / 1024 / 1024 * 100) / 100 + 'MB'
    });

    // Validation iPhone-friendly - accepter plus de types
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.mov', '.avi', '.3gp', '.webm', '.mkv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const hasValidExtension = validExtensions.includes(fileExtension) || file.type.startsWith('image/') || file.type.startsWith('video/');
    
    if (!hasValidExtension) {
      console.log('⚠️ Type de fichier non reconnu:', { name: file.name, type: file.type, extension: fileExtension });
      return NextResponse.json({ 
        error: `Type non supporté: ${file.type} (${fileExtension}). Extensions acceptées: ${validExtensions.join(', ')}` 
      }, { status: 400 });
    }
    
    // Déterminer si c'est une vidéo basé sur l'extension ou le type MIME
    const videoExtensions = ['.mp4', '.mov', '.avi', '.3gp', '.webm', '.mkv'];
    const isVideo = videoExtensions.includes(fileExtension) || file.type.startsWith('video/');

    const maxSize = isVideo ? 500 * 1024 * 1024 : 10 * 1024 * 1024; // 500MB vidéo, 10MB image
    
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB. Maximum ${isVideo ? '500MB' : '10MB'}` 
      }, { status: 400 });
    }

    console.log('☁️ Upload vers Cloudinary...');

    // Convertir le fichier en buffer
    let bytes, buffer;
    try {
      bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      console.log('📋 Buffer créé:', buffer.length, 'bytes');
    } catch (error) {
      console.error('❌ Erreur création buffer:', error);
      throw new Error('Impossible de lire le fichier');
    }

    // Upload vers Cloudinary avec gestion d'erreur améliorée
    console.log('⚡ Début upload vers Cloudinary...');
    
    const uploadResult = await new Promise((resolve, reject) => {
      // Configuration selon vos paramètres Cloudinary
      const uploadOptions: any = {
        resource_type: isVideo ? 'video' : 'image',
        upload_preset: 'lntdl_media',
        overwrite: false,
        use_filename: false,
        unique_filename: true,
        use_filename_as_display_name: true,
        use_asset_folder_as_public_id_prefix: false
      };

      // Ajouter optimisations seulement si nécessaire
      if (!isVideo) {
        uploadOptions.quality = 'auto';
        uploadOptions.width = 800;
        uploadOptions.crop = 'limit';
      }

      console.log('☁️ Options upload:', uploadOptions);

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('❌ Erreur Cloudinary détaillée:', {
              message: error.message,
              http_code: error.http_code,
              name: error.name,
              error: error
            });
            reject(error);
          } else {
            console.log('✅ Upload Cloudinary réussi:', {
              public_id: result?.public_id,
              url: result?.secure_url,
              format: result?.format,
              bytes: result?.bytes
            });
            resolve(result);
          }
        }
      );

      if (!uploadStream) {
        console.error('❌ Impossible de créer le stream upload');
        reject(new Error('Upload stream creation failed'));
        return;
      }

      uploadStream.end(buffer);
    });

    const result = uploadResult as any;
    
    const response = {
      url: result.secure_url,
      public_id: result.public_id,
      type: isVideo ? 'video' : 'image',
      filename: file.name,
      size: file.size,
      width: result.width,
      height: result.height,
      duration: result.duration || null, // Pour les vidéos
      format: result.format
    };

    console.log('🎯 Upload terminé:', {
      url: result.secure_url,
      type: response.type,
      size: Math.round(file.size / 1024 / 1024 * 100) / 100 + 'MB'
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Erreur upload Cloudinary:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'upload',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}