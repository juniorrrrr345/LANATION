import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

// Configuration Next.js 14 pour les limites de requête
export const maxDuration = 30; // 30 secondes timeout
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Début upload (Vercel compatible)...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('📁 Fichier reçu:', {
      name: file?.name,
      type: file?.type,
      size: file?.size
    });
    
    if (!file) {
      console.log('❌ Aucun fichier fourni');
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Déterminer le type réel du fichier basé sur l'extension si le type MIME est vide ou incorrect
    let fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // Gestion spéciale pour les fichiers iPhone et détection robuste
    if (!fileType || fileType === 'application/octet-stream' || fileType === '' || fileType === 'video/x-m4v') {
      console.log('⚠️ Type MIME manquant ou non standard:', fileType, '- détection par extension...');
      
      const ext = fileName.split('.').pop()?.toLowerCase() || '';
      
      const mimeMap: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'heic': 'image/heic',
        'heif': 'image/heif',
        'mp4': 'video/mp4',
        'mov': 'video/quicktime',
        'm4v': 'video/mp4', // Format vidéo iPhone
        '3gp': 'video/3gpp',
        '3g2': 'video/3gpp2',
        'webm': 'video/webm',
        'avi': 'video/x-msvideo'
      };
      
      fileType = mimeMap[ext] || fileType || 'application/octet-stream';
      
      console.log('📋 Extension:', ext, '→ Type final:', fileType);
    }
    
    // Normaliser les types MIME non standard
    if (fileType === 'video/x-m4v' || fileType === 'video/x-quicktime') {
      fileType = 'video/mp4';
      console.log('🔄 Type normalisé en video/mp4');
    }

    // Vérifier le type de fichier - Support formats mobiles
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp',
      'image/heic',      // Format iPhone
      'image/heif',      // Format iPhone
      'video/mp4', 
      'video/webm',
      'video/quicktime', // .mov (iPhone/Mac)
      'video/x-msvideo', // .avi
      'video/mpeg',      // .mpeg
      'video/3gpp',      // .3gp (Android)
      'video/3gpp2'      // .3g2 (Android)
    ];
    
    // Vérifier aussi par extension si le type MIME n'est pas dans la liste
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.mp4', '.mov', '.avi', '.3gp', '.3g2', '.webm', '.mpeg'];
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileType) && !allowedExtensions.includes(fileExtension)) {
      console.log('❌ Type non supporté:', fileType, 'Extension:', fileExtension);
      return NextResponse.json({ 
        error: `Type de fichier non supporté: ${fileType || fileExtension}. Utilisez: JPG, PNG, WebP, HEIC, MP4, WebM, MOV, AVI` 
      }, { status: 400 });
    }

    // Pour les fichiers HEIC/HEIF, on les traite comme des images mais on avertit l'utilisateur
    if (fileType === 'image/heic' || fileType === 'image/heif' || fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
      console.log('⚠️ Format HEIC/HEIF détecté - conversion recommandée');
      // On continue le traitement mais on pourrait retourner un avertissement
    }

    // Limites plus strictes pour éviter les erreurs MongoDB
    const isVideo = fileType.startsWith('video/') || ['.mp4', '.mov', '.avi', '.3gp', '.webm'].some(ext => fileName.endsWith(ext));
    // MongoDB a une limite de 16MB par document
    // Une vidéo en base64 fait ~33% plus gros que le fichier original
    // Augmentation de la limite pour vidéos de bonne qualité
    // MongoDB limite à 16MB par document, mais en base64 ça prend ~33% de plus
    // Donc on peut aller jusqu'à ~12MB de fichier original = 16MB en base64
    const maxSize = isVideo ? 25 * 1024 * 1024 : 5 * 1024 * 1024; // 25MB pour vidéos, 5MB pour images
    const maxSizeText = isVideo ? '25MB' : '5MB';
    
    if (file.size > maxSize) {
      console.log('❌ Fichier trop gros:', file.size, 'max:', maxSize);
      return NextResponse.json({ 
        error: `Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB. Maximum ${maxSizeText} pour ${isVideo ? 'les vidéos' : 'les images'}. Utilisez l'upload Cloudinary pour des fichiers plus gros.` 
      }, { status: 400 });
    }

    console.log('🔄 Conversion en base64...');
    
    // Convertir en base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Vérifier si c'est une vidéo HEVC (H.265) en inspectant les premiers bytes
    const isHEVC = buffer.length > 8 && 
                   (buffer.indexOf(Buffer.from('hvc1')) !== -1 || 
                    buffer.indexOf(Buffer.from('hev1')) !== -1 ||
                    buffer.indexOf(Buffer.from('HEVC')) !== -1);
    
    if (isHEVC) {
      console.log('⚠️ Vidéo HEVC/H.265 détectée - format iPhone moderne');
      return NextResponse.json({ 
        error: 'Les vidéos HEVC/H.265 (format iPhone récent) ne sont pas supportées en upload direct. Utilisez Cloudinary qui convertira automatiquement la vidéo.',
        useCloudinary: true
      }, { status: 400 });
    }
    
    const base64 = buffer.toString('base64');
    
    // Pour les fichiers HEIC/HEIF, on utilise le type MIME image/jpeg pour la compatibilité
    // Vérifier que le type MIME est valide
    let dataUrlType = (fileType === 'image/heic' || fileType === 'image/heif') ? 'image/jpeg' : fileType;
    
    // S'assurer que le type MIME est valide et non vide
    if (!dataUrlType || dataUrlType === 'application/octet-stream' || dataUrlType === '') {
      dataUrlType = isVideo ? 'video/mp4' : 'image/jpeg';
      console.log('⚠️ Type MIME invalide, utilisation du type par défaut:', dataUrlType);
    }
    
    // Validation du base64
    if (!base64 || base64.length === 0) {
      console.error('❌ Erreur: base64 vide');
      return NextResponse.json({ 
        error: 'Erreur lors de la conversion du fichier. Essayez avec un format différent ou utilisez Cloudinary.' 
      }, { status: 400 });
    }
    
    // Vérifier que le base64 est valide (ne contient que des caractères autorisés)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(base64)) {
      console.error('❌ Base64 invalide - caractères non autorisés détectés');
      return NextResponse.json({ 
        error: 'Fichier corrompu ou format non supporté. Utilisez Cloudinary pour ce fichier.' 
      }, { status: 400 });
    }
    
    // Construction du data URL avec validation
    let dataUrl;
    try {
      dataUrl = `data:${dataUrlType};base64,${base64}`;
      // Vérifier que le data URL est valide
      if (!dataUrl.startsWith('data:') || !dataUrl.includes(';base64,')) {
        throw new Error('Data URL invalide');
      }
    } catch (error) {
      console.error('❌ Erreur création data URL:', error);
      return NextResponse.json({ 
        error: 'Format de fichier non supporté. Utilisez Cloudinary pour ce type de fichier.' 
      }, { status: 400 });
    }
    
    console.log('📏 Détails du fichier:', {
      fileName: file.name,
      fileType: fileType,
      originalType: file.type,
      originalSize: file.size,
      originalSizeMB: Math.round(file.size / 1024 / 1024 * 100) / 100,
      base64Size: base64.length,
      dataUrlSize: dataUrl.length,
      ratio: Math.round(dataUrl.length / file.size * 100) / 100,
      base64Preview: base64.substring(0, 100) + '...',
      dataUrlPreview: dataUrl.substring(0, 50) + '...'
    });
    
    // Vérifier que la taille finale ne dépasse pas la limite MongoDB (16MB par document)
    // On met 15.5MB pour avoir une petite marge
    const maxBase64Size = 15.5 * 1024 * 1024;
    if (dataUrl.length > maxBase64Size) {
      console.log('❌ Data URL trop volumineux:', dataUrl.length);
      return NextResponse.json({ 
        error: `Fichier trop volumineux après conversion (${Math.round(dataUrl.length / 1024 / 1024)}MB). Essayez un fichier plus petit ou utilisez l'upload Cloudinary.` 
      }, { status: 400 });
    }
    
    console.log('💾 Sauvegarde en base de données...');
    
    // Sauvegarder en base de données
    try {
      const { db } = await connectToDatabase();
      const mediaCollection = db.collection('media');
      
      const mediaDoc = {
        filename: file.name,
        originalName: file.name,
        type: isVideo ? 'video' : 'image',
        mimeType: fileType, // Garder le type MIME original
        size: file.size,
        dataUrl: dataUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await mediaCollection.insertOne(mediaDoc);
      console.log('✅ Média sauvegardé en DB:', result.insertedId);
      
      // Retourner le data URL directement
      const response = {
        url: dataUrl, // On retourne directement le data URL
        filename: file.name,
        type: isVideo ? 'video' : 'image',
        size: file.size,
        id: result.insertedId
      };
      
      console.log('✅ Upload réussi (base64)');
      return NextResponse.json(response);
      
    } catch (dbError) {
      console.error('❌ Erreur base de données:', dbError);
      
      // Analyser le type d'erreur
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      
      if (errorMessage.includes('pattern') || errorMessage.includes('validation')) {
        console.error('❌ Erreur de validation MongoDB - format base64 invalide');
        return NextResponse.json({ 
          error: 'Format de fichier invalide. Essayez un fichier plus petit ou un format différent (JPG, PNG, MP4).' 
        }, { status: 400 });
      }
      
      if (errorMessage.includes('size') || errorMessage.includes('too large')) {
        console.error('❌ Document MongoDB trop volumineux');
        return NextResponse.json({ 
          error: 'Fichier trop volumineux pour la base de données. Utilisez l\'upload Cloudinary pour des fichiers plus gros.' 
        }, { status: 400 });
      }
      
      // Même si la DB échoue pour une autre raison, on retourne le base64
      const response = {
        url: dataUrl,
        filename: file.name,
        type: isVideo ? 'video' : 'image',
        size: file.size
      };
      
      console.log('⚠️ Upload réussi (base64 seulement)');
      return NextResponse.json(response);
    }

  } catch (error) {
    console.error('❌ Erreur générale upload:', error);
    return NextResponse.json({ 
      error: `Erreur upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
    }, { status: 500 });
  }
}