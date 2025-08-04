import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function POST() {
  try {
    console.log('🧹 Nettoyage de l\'ancien contenu...');
    
    const { db } = await connectToDatabase();
    
    // Nettoyer les settings - configuration par défaut vide
    const settingsCollection = db.collection('settings');
    await settingsCollection.replaceOne(
      {},
      {
        shopTitle: '',
        shopSubtitle: '',
        titleStyle: 'glow',
        bannerText: '',
        scrollingText: '',
        loadingText: '',
        backgroundImage: '',
        backgroundOpacity: 20,
        backgroundBlur: 5,
        telegramLink: '',
        canalLink: '',

        email: '',
        address: 'France',
        updatedAt: new Date()
      },
      { upsert: true }
    );

    // Supprimer toutes les pages - contenu uniquement depuis l'admin
    const pagesCollection = db.collection('pages');
    
    // Supprimer toutes les pages existantes pour forcer l'admin
    await pagesCollection.deleteMany({});

    console.log('✅ Toutes les pages supprimées - contenu uniquement depuis l\'admin');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Ancien contenu supprimé ! Boutique prête pour configuration admin.',
      data: {
        settings: 'Configuration par défaut',
        pages: 'Pages supprimées - admin requis'
      }
    });
  } catch (error) {
    console.error('❌ Erreur nettoyage:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erreur lors du nettoyage',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function GET() {
  return POST(); // Permettre aussi GET pour faciliter l'utilisation
}
