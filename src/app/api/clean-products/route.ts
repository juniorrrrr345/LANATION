import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function POST() {
  try {
    console.log('🧹 Nettoyage des anciens produits par défaut...');
    
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');
    
    // Supprimer tous les anciens produits par défaut
    const defaultProductNames = [
      'COOKIES GELATO',
      'PURPLE HAZE', 
      'OG KUSH',
      'BLUE DREAM',
      'AMNESIA HAZE',
      'GELATO 41',
      'AMNESIA LEMON',
      'WEDDING CAKE',
      'GELATO 33'
    ];
    
    const result = await productsCollection.deleteMany({
      name: { $in: defaultProductNames }
    });
    
    console.log(`🗑️ ${result.deletedCount} anciens produits supprimés`);
    
    // Vérifier ce qui reste
    const remainingProducts = await productsCollection.find({}).toArray();
    console.log(`📦 Produits restants: ${remainingProducts.length}`);
    
    return NextResponse.json({
      message: `${result.deletedCount} anciens produits supprimés`,
      remainingProducts: remainingProducts.length,
      success: true
    });
    
  } catch (error) {
    console.error('❌ Erreur nettoyage produits:', error);
    return NextResponse.json({
      error: 'Erreur lors du nettoyage',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}