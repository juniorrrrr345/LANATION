import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    console.log('🔍 API Contact GET');
    
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const contactPage = await pagesCollection.findOne({ slug: 'contact' });
    
    if (!contactPage) {
      // Créer une page contact par défaut
      const defaultContactPage = {
        slug: 'contact',
        title: 'Contact',
        content: `
          <h2>Contactez-nous</h2>
          <p>Cette page sera configurée depuis le panel d'administration.</p>
          <p>Vous pouvez ajouter vos informations de contact ici.</p>
        `,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await pagesCollection.insertOne(defaultContactPage);
      return NextResponse.json(defaultContactPage);
    }
    
    return NextResponse.json(contactPage);
  } catch (error) {
    console.error('Erreur GET contact page:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 API Contact POST');
    
    const { title, content } = await request.json();
    
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const contactPage = {
      slug: 'contact',
      title: title || 'Contact',
      content: content || '',
      updatedAt: new Date()
    };
    
    // Upsert: mettre à jour si existe, sinon créer
    await pagesCollection.updateOne(
      { slug: 'contact' },
      { $set: contactPage },
      { upsert: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Page Contact mise à jour',
      page: contactPage 
    });
  } catch (error) {
    console.error('Erreur POST contact page:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}