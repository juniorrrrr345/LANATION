import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    // Contenu par défaut pour la page info
    const defaultContent = `# Bienvenue chez LANATIONDULAIT

## Notre Histoire

LANATIONDULAIT est votre destination privilégiée pour tous vos besoins. Nous nous engageons à vous offrir des produits de qualité exceptionnelle et un service client irréprochable.

## Nos Valeurs

- **Qualité** : Nous sélectionnons rigoureusement nos produits
- **Service** : Votre satisfaction est notre priorité
- **Innovation** : Toujours à la pointe des dernières tendances
- **Confiance** : Une relation transparente avec nos clients

## Pourquoi Nous Choisir ?

### Produits de Qualité
Tous nos produits sont soigneusement sélectionnés pour garantir votre satisfaction.

### Livraison Rapide
Nous nous engageons à livrer vos commandes dans les meilleurs délais.

### Service Client
Notre équipe est à votre écoute pour répondre à toutes vos questions.

## Contact

N'hésitez pas à nous contacter pour toute question ou suggestion. Nous sommes là pour vous servir !

**Merci de votre confiance !**`;
    
    // Mettre à jour ou créer la page info
    const result = await pagesCollection.replaceOne(
      { slug: 'info' },
      {
        slug: 'info',
        title: 'À propos',
        content: defaultContent,
        updatedAt: new Date()
      },
      { upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Page info réinitialisée avec succès',
      result: {
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur reset info:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}