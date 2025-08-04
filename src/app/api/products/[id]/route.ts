import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

// Configuration Next.js 14 pour les limites de requête
export const maxDuration = 30; // 30 secondes timeout
export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 API Products PUT - Request pour ID:', params.id);
    
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');
    
    const data = await request.json();
    console.log('📝 Données reçues pour mise à jour:', data);
    
    // Supprimer les champs immutables avant mise à jour
    const { _id, createdAt, __v, ...updateData } = data;
    updateData.updatedAt = new Date();
    
    console.log('🔄 Données nettoyées pour update:', updateData);
    
    // Validation des données avant update
    try {
      if (updateData.image && typeof updateData.image !== 'string') {
        console.log('⚠️ Type image invalide:', typeof updateData.image);
        updateData.image = String(updateData.image);
      }
      if (updateData.video && typeof updateData.video !== 'string') {
        console.log('⚠️ Type video invalide:', typeof updateData.video);
        updateData.video = String(updateData.video);
      }
      if (updateData.prices && typeof updateData.prices !== 'object') {
        console.log('⚠️ Type prices invalide:', typeof updateData.prices);
        return NextResponse.json({ error: 'Format prices invalide' }, { status: 400 });
      }
      console.log('✅ Validation données OK');
    } catch (validationError) {
      console.error('❌ Erreur validation données:', validationError);
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    
    const { ObjectId } = require('mongodb');
    
    // Vérifier la validité de l'ID
    console.log('🔍 ID reçu:', params.id);
    if (!ObjectId.isValid(params.id)) {
      console.log('❌ ID invalide:', params.id);
      return NextResponse.json({ error: 'ID produit invalide' }, { status: 400 });
    }
    
    const objectId = new ObjectId(params.id);
    console.log('🔍 ObjectId créé:', objectId);
    
    // D'abord vérifier si le produit existe
    const existingProduct = await productsCollection.findOne({ _id: objectId });
    console.log('🔍 Produit existant trouvé:', existingProduct ? 'OUI' : 'NON');
    
    if (!existingProduct) {
      console.log('❌ Produit inexistant avec ID:', params.id);
      // Lister quelques produits pour debug
      const allProducts = await productsCollection.find({}).limit(3).toArray();
      console.log('📋 Exemples produits en base:', allProducts.map(p => ({ id: p._id, name: p.name })));
      return NextResponse.json({ error: 'Produit non trouvé en base' }, { status: 404 });
    }
    
    console.log('✅ Produit existe, tentative mise à jour...');
    
    let result;
    try {
      result = await productsCollection.findOneAndUpdate(
        { _id: objectId },
        { $set: updateData },
        { returnDocument: 'after' } // Nouvelle syntaxe MongoDB
      );
      console.log('🔄 Résultat brut findOneAndUpdate:', {
        hasResult: !!result,
        hasValue: !!(result && result.value),
        resultKeys: result ? Object.keys(result) : 'NO_RESULT'
      });
    } catch (updateError) {
      console.error('❌ Erreur MongoDB lors de l\'update:', {
        error: updateError,
        message: updateError instanceof Error ? updateError.message : 'Erreur inconnue',
        updateData: updateData
      });
      return NextResponse.json({ 
        error: 'Erreur base de données lors de la mise à jour',
        details: updateError instanceof Error ? updateError.message : 'Erreur inconnue'
      }, { status: 500 });
    }

    // Vérifier si l'update a marché
    let updatedProduct;
    if (!result || !result.value) {
      console.log('❌ findOneAndUpdate a échoué, tentative avec updateOne + findOne');
      
      // Méthode alternative si findOneAndUpdate échoue
      try {
        const updateResult = await productsCollection.updateOne(
          { _id: objectId },
          { $set: updateData }
        );
        
        console.log('🔄 Résultat updateOne:', {
          matchedCount: updateResult.matchedCount,
          modifiedCount: updateResult.modifiedCount,
          acknowledged: updateResult.acknowledged
        });
        
        if (updateResult.matchedCount === 0) {
          return NextResponse.json({ error: 'Produit non trouvé pour update' }, { status: 404 });
        }
        
        if (updateResult.modifiedCount === 0) {
          console.log('⚠️ Aucune modification effectuée (données identiques?)');
        }
        
        // Récupérer le produit mis à jour
        updatedProduct = await productsCollection.findOne({ _id: objectId });
        
      } catch (altUpdateError) {
        console.error('❌ Erreur avec updateOne:', altUpdateError);
        return NextResponse.json({ error: 'Impossible de mettre à jour le produit' }, { status: 500 });
      }
    } else {
      updatedProduct = result.value;
    }

    console.log('✅ Produit mis à jour:', updatedProduct);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la modification',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 API Products DELETE - Request pour ID:', params.id);
    
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');
    
    const { ObjectId } = require('mongodb');
    
    // Vérifier la validité de l'ID avant de continuer
    if (!ObjectId.isValid(params.id)) {
      console.log('❌ ID invalide pour suppression:', params.id);
      return NextResponse.json({ error: 'ID produit invalide' }, { status: 400 });
    }
    
    const objectId = new ObjectId(params.id);
    console.log('🔍 ObjectId créé pour suppression:', objectId);
    
    // D'abord vérifier si le produit existe
    const existingProduct = await productsCollection.findOne({ _id: objectId });
    console.log('🔍 Produit existant trouvé:', existingProduct ? 'OUI' : 'NON');
    
    if (!existingProduct) {
      console.log('⚠️ Produit déjà supprimé ou inexistant avec ID:', params.id);
      // Ce n'est pas une erreur si le produit n'existe pas - il est peut-être déjà supprimé
      return NextResponse.json({ 
        message: 'Produit déjà supprimé', 
        productId: params.id 
      });
    }
    
    console.log('✅ Produit existe, tentative suppression...');
    const result = await productsCollection.findOneAndDelete({ _id: objectId });

    if (!result.value) {
      console.log('⚠️ Produit supprimé entre temps pour ID:', params.id);
      // Pas une erreur - le produit a été supprimé entre temps
      return NextResponse.json({ 
        message: 'Produit supprimé', 
        productId: params.id 
      });
    }

    console.log('✅ Produit supprimé avec succès:', result.value.name);
    return NextResponse.json({ message: 'Produit supprimé avec succès', productName: result.value.name });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la suppression',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 API Products GET - Request pour ID:', params.id);
    
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');
    
    const { ObjectId } = require('mongodb');
    const product = await productsCollection.findOne({ _id: new ObjectId(params.id) });

    if (!product) {
      console.log('❌ Produit non trouvé:', params.id);
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    console.log('✅ Produit trouvé:', product);
    return NextResponse.json(product);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}