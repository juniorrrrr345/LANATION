import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    console.log('🔍 API Farms - GET Request');
    
    const { db } = await connectToDatabase();
    const farmsCollection = db.collection('farms');
    
    const farms = await farmsCollection.find({ isActive: { $ne: false } }).sort({ name: 1 }).toArray();
    console.log(`🏭 Farms trouvées: ${farms.length}`);
    
    // Headers pour éviter le cache et assurer la synchronisation instantanée
    return NextResponse.json(farms, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('❌ Erreur API Farms GET:', error);
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔍 API Farms - POST Request');
    
    const { db } = await connectToDatabase();
    const farmsCollection = db.collection('farms');
    
    const data = await request.json();
    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.isActive = data.isActive !== false; // Par défaut true
    
    const result = await farmsCollection.insertOne(data);
    const newFarm = await farmsCollection.findOne({ _id: result.insertedId });
    
    console.log('✅ Farm créée:', newFarm);
    return NextResponse.json(newFarm, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur API Farms POST:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la création de la farm',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}