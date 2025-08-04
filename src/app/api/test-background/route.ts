import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function POST() {
  try {
    console.log('🧪 TEST Background - Force une image de test');
    
    const { db } = await connectToDatabase();
    const settingsCollection = db.collection('settings');
    
    // URL d'image de test
    const testImageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center';
    
    // Forcer la mise à jour avec une image de test
    const result = await settingsCollection.updateOne(
      {}, // Premier document
      { 
        $set: { 
          backgroundImage: testImageUrl,
          backgroundOpacity: 30,
          backgroundBlur: 2,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('✅ Background de test forcé:', result);
    
    // Vérifier que ça a bien été sauvegardé
    const updatedSettings = await settingsCollection.findOne({});
    
    return NextResponse.json({
      success: true,
      message: 'Background de test appliqué',
      backgroundImage: testImageUrl,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('❌ Erreur test background:', error);
    return NextResponse.json({ 
      error: 'Erreur test background',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}