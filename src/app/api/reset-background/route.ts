import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function POST() {
  try {
    console.log('🔄 RESET Background - Remise à zéro');
    
    const { db } = await connectToDatabase();
    const settingsCollection = db.collection('settings');
    
    // Remettre le background à vide
    const result = await settingsCollection.updateOne(
      {}, // Premier document
      { 
        $set: { 
          backgroundImage: '',
          backgroundOpacity: 20,
          backgroundBlur: 5,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('✅ Background remis à zéro:', result);
    
    // Vérifier que ça a bien été remis à zéro
    const updatedSettings = await settingsCollection.findOne({});
    
    return NextResponse.json({
      success: true,
      message: 'Background remis à zéro',
      backgroundImage: '',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('❌ Erreur reset background:', error);
    return NextResponse.json({ 
      error: 'Erreur reset background',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}