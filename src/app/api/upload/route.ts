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

    // Vérifier le type de fichier - Support formats mobiles
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp',
      'video/mp4', 
      'video/webm',
      'video/quicktime', // .mov (iPhone/Mac)
      'video/x-msvideo', // .avi
      'video/mpeg',      // .mpeg
      'video/3gpp'       // .3gp (Android)
    ];
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Type non supporté:', file.type);
      return NextResponse.json({ 
        error: `Type de fichier non supporté: ${file.type}. Utilisez: JPG, PNG, WebP, MP4, WebM, MOV, AVI` 
      }, { status: 400 });
    }

    // Limites plus strictes pour éviter les erreurs MongoDB
    const isVideo = file.type.startsWith('video/');
    // MongoDB a une limite de 16MB par document
    // Une vidéo en base64 fait ~33% plus gros que le fichier original
    const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB pour vidéos, 5MB pour images
    const maxSizeText = isVideo ? '10MB' : '5MB';
    
    if (file.size > maxSize) {
      console.log('❌ Fichier trop gros:', file.size, 'max:', maxSize);
      return NextResponse.json({ 
        error: `Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB. Maximum ${maxSizeText} pour ${isVideo ? 'les vidéos' : 'les images'}` 
      }, { status: 400 });
    }

    console.log('🔄 Conversion en base64...');
    
    // Convertir en base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;
    
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
        error: `Fichier trop volumineux après conversion (${Math.round(dataUrl.length / 1024 / 1024)}MB). Essayez un fichier plus petit.` 
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
        type: file.type.startsWith('image/') ? 'image' : 'video',
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
        type: file.type.startsWith('image/') ? 'image' : 'video',
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
          error: 'Fichier trop volumineux pour la base de données. Réduisez la taille du fichier.' 
        }, { status: 400 });
      }
      
      // Même si la DB échoue pour une autre raison, on retourne le base64
      const response = {
        url: dataUrl,
        filename: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
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