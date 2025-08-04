import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    console.log('🔍 API Categories - GET Request');
    
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection('categories');
    
    const categories = await categoriesCollection.find({ isActive: { $ne: false } }).sort({ order: 1, name: 1 }).toArray();
    console.log(`📂 Catégories trouvées: ${categories.length}`);
    
    // Headers pour éviter le cache et assurer la synchronisation instantanée
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('❌ Erreur API Categories GET:', error);
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔍 API Categories - POST Request');
    
    const { db } = await connectToDatabase();
    const categoriesCollection = db.collection('categories');
    
    const data = await request.json();
    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.isActive = data.isActive !== false; // Par défaut true
    
    const result = await categoriesCollection.insertOne(data);
    const newCategory = await categoriesCollection.findOne({ _id: result.insertedId });
    
    console.log('✅ Catégorie créée:', newCategory);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur API Categories POST:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la création de la catégorie',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}