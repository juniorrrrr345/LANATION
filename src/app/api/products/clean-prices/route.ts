import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('🧹 Début du nettoyage des prix...');
    
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');
    
    // Récupérer tous les produits
    const products = await productsCollection.find({}).toArray();
    console.log(`📦 ${products.length} produits trouvés à nettoyer`);
    
    let updatedCount = 0;
    let totalCleanedKeys = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      const cleanedPrices: { [key: string]: number } = {};
      const originalKeysCount = Object.keys(product.prices || {}).length;
      
      if (product.prices) {
        Object.entries(product.prices).forEach(([key, value]) => {
          const numValue = Number(value);
          if (!isNaN(numValue) && numValue > 0 && isFinite(numValue)) {
            cleanedPrices[key] = numValue;
          } else {
            needsUpdate = true; // Il y avait des valeurs invalides
            console.log(`🗑️ Suppression prix invalide: ${key} = ${value} pour produit ${product.name}`);
          }
        });
      }
      
      if (needsUpdate) {
        const cleanedKeysCount = Object.keys(cleanedPrices).length;
        totalCleanedKeys += (originalKeysCount - cleanedKeysCount);
        
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: { prices: cleanedPrices, updatedAt: new Date() } }
        );
        updatedCount++;
        console.log(`✅ Produit ${product.name} nettoyé: ${originalKeysCount} → ${cleanedKeysCount} prix`);
      }
    }
    
    console.log(`🧹 Nettoyage terminé: ${updatedCount} produits mis à jour, ${totalCleanedKeys} prix invalides supprimés`);
    
    return NextResponse.json({ 
      success: true, 
      message: `${updatedCount} produits nettoyés, ${totalCleanedKeys} prix invalides supprimés`,
      updatedCount,
      cleanedPricesCount: totalCleanedKeys
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des prix:', error);
    return NextResponse.json(
      { error: 'Erreur lors du nettoyage des prix', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}