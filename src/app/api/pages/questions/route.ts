import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const questionsPage = await pagesCollection.findOne({ type: 'questions' });
    
    if (!questionsPage) {
      // Créer une page questions par défaut
      const defaultQuestionsPage = {
        type: 'questions',
        title: 'Questions Fréquentes',
        content: `
          <h2>Questions Fréquentes</h2>
          <p>Cette page sera configurée depuis le panel d'administration.</p>
          <p>Vous pouvez ajouter vos questions et réponses ici.</p>
        `,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await pagesCollection.insertOne(defaultQuestionsPage);
      return NextResponse.json(defaultQuestionsPage);
    }
    
    return NextResponse.json(questionsPage);
  } catch (error) {
    console.error('Erreur GET questions page:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();
    
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const questionsPage = {
      type: 'questions',
      title: title || 'Questions Fréquentes',
      content: content || '',
      updatedAt: new Date()
    };
    
    // Upsert: mettre à jour si existe, sinon créer
    await pagesCollection.updateOne(
      { type: 'questions' },
      { $set: questionsPage },
      { upsert: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Page Questions mise à jour',
      page: questionsPage 
    });
  } catch (error) {
    console.error('Erreur POST questions page:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}