import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    console.log('🔍 API Social Links - GET Request');
    
    const { db } = await connectToDatabase();
    const socialLinksCollection = db.collection('socialLinks');
    
    const socialLinks = await socialLinksCollection.find({}).toArray();
    
    console.log('✅ Social Links trouvés:', socialLinks);
    
    // Données par défaut si aucun lien social en BDD
          if (socialLinks.length === 0) {
        return NextResponse.json([]);
      }
    
    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error('❌ Erreur API Social Links GET:', error);
    
    // Fallback data si erreur DB
    const fallbackSocialLinks = [];
    
    return NextResponse.json(fallbackSocialLinks);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Social Links - POST Request');
    
    const body = await request.json();
    
    // Vérifier si c'est une mise à jour globale ou l'ajout d'un seul
    if (body.socialLinks && Array.isArray(body.socialLinks)) {
      // Mise à jour globale (pour rétrocompatibilité)
      const { socialLinks } = body;
      
      const { db } = await connectToDatabase();
      const socialLinksCollection = db.collection('socialLinks');
      
      // Supprimer tous les liens existants et insérer les nouveaux
      await socialLinksCollection.deleteMany({});
      await socialLinksCollection.insertMany(socialLinks);
      
      console.log('✅ Social Links mis à jour:', socialLinks);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Réseaux sociaux mis à jour',
        socialLinks 
      });
    } else {
      // Ajouter un seul réseau social
      const { name, url, icon, color, isActive } = body;
      
      if (!name || !url || !icon) {
        return NextResponse.json(
          { error: 'Champs requis manquants (name, url, icon)' },
          { status: 400 }
        );
      }
      
      const { db } = await connectToDatabase();
      const socialLinksCollection = db.collection('socialLinks');
      
      const newSocialLink = {
        name,
        url,
        icon,
        color: color || '#0088cc',
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await socialLinksCollection.insertOne(newSocialLink);
      
      console.log('✅ Nouveau Social Link ajouté:', result.insertedId);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Réseau social ajouté',
        socialLink: { ...newSocialLink, _id: result.insertedId }
      });
    }
  } catch (error) {
    console.error('❌ Erreur API Social Links POST:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des réseaux sociaux' },
      { status: 500 }
    );
  }
}