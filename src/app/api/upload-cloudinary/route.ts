import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Upload Cloudinary LANATION démarré...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    console.log('📁 Fichier reçu:', {
      name: file.name,
      type: file.type,
      size: Math.round(file.size / 1024 / 1024 * 100) / 100 + 'MB'
    });

    // Accepter TOUS les fichiers avec extensions valides
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.mov', '.avi', '.3gp', '.webm', '.mkv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json({ 
        error: `Extension non supportée: ${fileExtension}. Extensions acceptées: ${validExtensions.join(', ')}` 
      }, { status: 400 });
    }
    
    // Déterminer si c'est une vidéo
    const videoExtensions = ['.mp4', '.mov', '.avi', '.3gp', '.webm', '.mkv'];
    const isVideo = videoExtensions.includes(fileExtension);

    const maxSize = isVideo ? 500 * 1024 * 1024 : 10 * 1024 * 1024;
    
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB. Maximum ${isVideo ? '500MB' : '10MB'}` 
      }, { status: 400 });
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload vers Cloudinary avec upload unsigned
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadOptions = {
        upload_preset: 'lntdl_media',
        overwrite: false,
        unique_filename: true
      };

      // Utiliser fetch pour upload direct vers Cloudinary
      const formData = new FormData();
      formData.append('file', new Blob([buffer], { type: file.type }));
      formData.append('upload_preset', 'lntdl_media');
      formData.append('overwrite', 'false');
      formData.append('unique_filename', 'true');

      fetch(`https://api.cloudinary.com/v1_1/dwez3etsh/${isVideo ? 'video' : 'image'}/upload`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
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
    
    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      type: isVideo ? 'video' : 'image',
      filename: file.name,
      size: file.size
    });

  } catch (error) {
    console.error('❌ Erreur upload:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'upload',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}