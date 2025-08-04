import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 PUT Catégorie - ID reçu:', params.id);
    
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection('categories');
    
    const data = await request.json();
    console.log('📝 Données reçues:', data);
    
    const { ObjectId } = require('mongodb');
    
    // Vérifier si l'ID est valide
    if (!ObjectId.isValid(params.id)) {
      console.log('❌ ID invalide:', params.id);
      return NextResponse.json({ error: 'ID catégorie invalide' }, { status: 400 });
    }
    
    // Nettoyer les données
    const { _id, ...updateData } = data;
    updateData.updatedAt = new Date();
    
    console.log('🔄 Tentative de mise à jour avec:', updateData);
    
    // Utiliser updateOne pour éviter les problèmes de compatibilité
    const updateResult = await categoriesCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    console.log('📊 Résultat updateOne:', updateResult);

    if (updateResult.matchedCount === 0) {
      console.log('❌ Catégorie non trouvée');
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 });
    }

    if (updateResult.modifiedCount === 0) {
      console.log('⚠️ Aucune modification effectuée (données identiques)');
    }

    // Récupérer la catégorie mise à jour
    const updatedCategory = await categoriesCollection.findOne({ _id: new ObjectId(params.id) });
    
    console.log('✅ Catégorie mise à jour avec succès');
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
    return NextResponse.json({ 
      error: 'Erreur lors de la modification',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 DELETE Catégorie - ID reçu:', params.id);
    
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection('categories');
    
    const { ObjectId } = require('mongodb');
    
    // Vérifier si l'ID est valide
    if (!ObjectId.isValid(params.id)) {
      console.log('❌ ID invalide:', params.id);
      return NextResponse.json({ error: 'ID catégorie invalide' }, { status: 400 });
    }
    
    const result = await categoriesCollection.findOneAndDelete({ _id: new ObjectId(params.id) });

    console.log('📊 Résultat findOneAndDelete:', result);

    if (!result.value) {
      console.log('⚠️ Catégorie déjà supprimée ou inexistante');
      // Ce n'est pas une erreur - la catégorie est peut-être déjà supprimée
      return NextResponse.json({ message: 'Catégorie déjà supprimée' });
    }

    console.log('✅ Catégorie supprimée avec succès');
    return NextResponse.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
    return NextResponse.json({ 
      error: 'Erreur lors de la suppression',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}