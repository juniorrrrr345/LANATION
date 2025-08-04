import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 API Social Links - PUT Request for ID:', params.id);
    
    const body = await request.json();
    const { name, url, icon, color, isActive } = body;
    
    if (!name || !url || !icon) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    const socialLinksCollection = db.collection('socialLinks');
    
    const result = await socialLinksCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          name, 
          url, 
          icon, 
          color: color || '#0088cc', 
          isActive: isActive !== undefined ? isActive : true 
        } 
      }
    );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Réseau social non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Social Link mis à jour:', params.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Réseau social mis à jour' 
    });
  } catch (error) {
    console.error('❌ Erreur API Social Links PUT:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du réseau social' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 API Social Links - DELETE Request for ID:', params.id);
    
    const { db } = await connectToDatabase();
    const socialLinksCollection = db.collection('socialLinks');
    
    const result = await socialLinksCollection.deleteOne(
      { _id: new ObjectId(params.id) }
    );
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Réseau social non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('✅ Social Link supprimé:', params.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Réseau social supprimé' 
    });
  } catch (error) {
    console.error('❌ Erreur API Social Links DELETE:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du réseau social' },
      { status: 500 }
    );
  }
}