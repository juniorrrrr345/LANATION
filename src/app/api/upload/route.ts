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
    
    // Gestion spéciale pour les fichiers iPhone
    if (!fileType || fileType === 'application/octet-stream' || fileType === '') {
      console.log('⚠️ Type MIME manquant, détection par extension...');
      
      if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        fileType = 'image/jpeg';
      } else if (fileName.endsWith('.png')) {
        fileType = 'image/png';
      } else if (fileName.endsWith('.webp')) {
        fileType = 'image/webp';
      } else if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
        fileType = 'image/heic';
      } else if (fileName.endsWith('.mp4')) {
        fileType = 'video/mp4';
      } else if (fileName.endsWith('.mov')) {
        fileType = 'video/quicktime';
      } else if (fileName.endsWith('.3gp')) {
        fileType = 'video/3gpp';
      } else if (fileName.endsWith('.webm')) {
        fileType = 'video/webm';
      } else if (fileName.endsWith('.avi')) {
        fileType = 'video/x-msvideo';
      }
      
      console.log('📋 Type détecté:', fileType);
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
    const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB pour vidéos, 5MB pour images
    const maxSizeText = isVideo ? '10MB' : '5MB';
    
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
    const base64 = buffer.toString('base64');
    
    // Pour les fichiers HEIC/HEIF, on utilise le type MIME image/jpeg pour la compatibilité
    const dataUrlType = (fileType === 'image/heic' || fileType === 'image/heif') ? 'image/jpeg' : fileType;
    const dataUrl = `data:${dataUrlType};base64,${base64}`;
    
    console.log('📏 Taille base64:', {
      originalSize: file.size,
      base64Size: base64.length,
      dataUrlSize: dataUrl.length,
      ratio: Math.round(dataUrl.length / file.size * 100) / 100
    });
    
    // Vérifier que la taille finale ne dépasse pas 15MB (limite MongoDB)
    const maxBase64Size = 15 * 1024 * 1024;
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