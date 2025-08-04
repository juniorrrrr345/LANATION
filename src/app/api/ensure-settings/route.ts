import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    console.log('🔍 Vérification des settings...');
    
    const { db } = await connectToDatabase();
    const settingsCollection = db.collection('settings');
    
    // Récupérer les settings actuels
    const settings = await settingsCollection.findOne({});
    
    if (!settings) {
      console.log('⚠️ Aucun settings trouvé - création vide');
      // Créer des settings vides pour que l'admin puisse tout configurer
      const emptySettings = {
        shopTitle: '',
        shopSubtitle: '',
        scrollingText: '',
        loadingText: '',
        bannerText: '',
        backgroundImage: '',
        backgroundOpacity: 20,
        backgroundBlur: 5,
        telegramLink: '',
        telegramOrderLink: '',
        email: '',
        address: '',
        titleStyle: 'glow',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await settingsCollection.insertOne(emptySettings);
      return NextResponse.json({ 
        message: 'Settings vides créés - configurez depuis l\'admin',
        settings: emptySettings 
      });
    }
    
    // Ne jamais retourner de valeurs par défaut PLUG
    console.log('✅ Settings actuels:', {
      shopTitle: settings.shopTitle || 'VIDE',
      hasBackground: !!settings.backgroundImage
    });
    
    return NextResponse.json({ 
      message: 'Settings existants',
      settings 
    });
    
  } catch (error) {
    console.error('❌ Erreur ensure-settings:', error);
    return NextResponse.json({ 
      error: 'Erreur vérification settings',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}