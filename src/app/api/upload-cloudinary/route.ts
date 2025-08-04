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

    // Upload vers Cloudinary avec preset unsigned
    const uploadResult = await new Promise((resolve, reject) => {
      // Créer un FormData pour l'upload
      const uploadFormData = new FormData();
      
      // Ajouter le fichier
      const blob = new Blob([buffer], { type: file.type });
      uploadFormData.append('file', blob, file.name);
      
      // Ajouter les paramètres du preset - TRÈS IMPORTANT
      uploadFormData.append('upload_preset', 'lntdl_media');
      
      console.log('📤 Upload vers Cloudinary avec preset:', 'lntdl_media');

      // Upload direct vers Cloudinary
      fetch(`https://api.cloudinary.com/v1_1/dwez3etsh/${isVideo ? 'video' : 'image'}/upload`, {
        method: 'POST',
        body: uploadFormData
      })
      .then(response => {
        console.log('📥 Réponse Cloudinary:', response.status, response.statusText);
        if (!response.ok) {
          return response.text().then(errorText => {
            console.error('❌ Erreur HTTP:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          });
        }
        return response.json();
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