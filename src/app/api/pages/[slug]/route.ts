import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('🔍 API Pages GET - Slug:', params.slug);
    
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const page = await pagesCollection.findOne({ slug: params.slug });
    console.log('📄 Page trouvée:', page ? 'OUI' : 'NON');
    
    // Si la page n'existe pas, créer une page vide
    if (!page) {
      const defaultPage = {
        slug: params.slug,
        title: params.slug === 'info' ? 'À propos' : 'Contact',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await pagesCollection.insertOne(defaultPage);
      console.log('✅ Page vide créée:', params.slug);
      
      return NextResponse.json({
        content: defaultPage.content,
        title: defaultPage.title
      });
    }
    
    return NextResponse.json({
      content: page.content || '',
      title: page.title || params.slug
    });
  } catch (error) {
    console.error('❌ Erreur API Pages GET:', error);
    return NextResponse.json({ 
      content: '', 
      title: params.slug,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('📝 API Pages POST - Slug:', params.slug);
    
    const { content, title } = await request.json();
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const result = await pagesCollection.replaceOne(
      { slug: params.slug },
      { 
        slug: params.slug, 
        title: title || params.slug, 
        content: content || '', 
        updatedAt: new Date() 
      },
      { upsert: true }
    );
    
    console.log('✅ Page sauvegardée:', {
      slug: params.slug,
      modified: result.modifiedCount,
      upserted: result.upsertedCount
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur API Pages POST:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  return POST(req, context);
}