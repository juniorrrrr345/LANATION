import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    console.log('🔍 API Info GET');
    
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const infoPage = await pagesCollection.findOne({ slug: 'info' });
    
    if (!infoPage) {
      // Créer une page info par défaut
      const defaultInfoPage = {
        slug: 'info',
        title: 'À propos',
        content: `
          <h2>À propos de LANATIONDULAIT</h2>
          <p>Cette page sera configurée depuis le panel d'administration.</p>
          <p>Vous pouvez ajouter des informations sur votre boutique ici.</p>
        `,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await pagesCollection.insertOne(defaultInfoPage);
      return NextResponse.json(defaultInfoPage);
    }
    
    return NextResponse.json(infoPage);
  } catch (error) {
    console.error('Erreur GET info page:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API Info POST');
    
    const { title, content } = await request.json();
    
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const infoPage = {
      slug: 'info',
      title: title || 'À propos',
      content: content || '',
      updatedAt: new Date()
    };
    
    // Upsert: mettre à jour si existe, sinon créer
    await pagesCollection.updateOne(
      { slug: 'info' },
      { $set: infoPage },
      { upsert: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Page Info mise à jour',
      page: infoPage 
    });
  } catch (error) {
    console.error('Erreur POST info page:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}