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
        shopTitle: 'LANATIONDULAIT',
        shopSubtitle: 'Votre boutique en ligne de confiance',
        scrollingText: 'LANATIONDULAIT • CONTACT • LIVRAISON RAPIDE',
        loadingText: 'Chargement...',
        bannerText: 'Bienvenue chez LANATIONDULAIT',
        backgroundImage: '',
        backgroundOpacity: 20,
        backgroundBlur: 5,
        telegramLink: 'https://t.me/lanationdulait',
        telegramOrderLink: 'https://t.me/lanationdulait_orders',
        email: 'contact@lanationdulait.com',
        address: 'Votre adresse ici',
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