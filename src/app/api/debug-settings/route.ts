import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    console.log('🔍 DEBUG Settings - Vérification état complet');
    
    const { db } = await connectToDatabase();
    const settingsCollection = db.collection('settings');
    
    // Récupérer tous les documents de la collection
    const allSettings = await settingsCollection.find({}).toArray();
    
    console.log('📊 Tous les settings en DB:', allSettings);
    
    // Compter le nombre de documents
    const count = await settingsCollection.countDocuments();
    
    // Récupérer le premier document
    const firstSetting = await settingsCollection.findOne({});
    
    const debugInfo = {
      totalDocuments: count,
      allDocuments: allSettings,
      firstDocument: firstSetting,
      databaseConnected: true,
      collectionExists: true,
      timestamp: new Date().toISOString()
    };
    
    console.log('🔍 Debug info:', debugInfo);
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('❌ Erreur DEBUG Settings:', error);
    return NextResponse.json({ 
      error: 'Erreur debug',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      databaseConnected: false,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}