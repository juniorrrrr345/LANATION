import InfoPage from '@/components/InfoPage';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { connectToDatabase } from '@/lib/mongodb-fixed';

// Force le rendu dynamique pour éviter le cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getInfoContent() {
  try {
    const { db } = await connectToDatabase();
    const page = await db.collection('pages').findOne({ slug: 'info' });
    console.log('📄 Contenu info chargé:', page?.content?.substring(0, 50) + '...');
    return page?.content || '';
  } catch (error) {
    console.error('Erreur chargement info:', error);
    return '';
  }
}

export default async function InfoPageRoute() {
  // Charger le contenu côté serveur
  const content = await getInfoContent();

  return (
    <div className="main-container">
      {/* Overlay global toujours présent */}
      <div className="global-overlay"></div>
      
      {/* Contenu principal */}
      <div className="content-layer">
        <Header />
        <div className="pt-12 sm:pt-14">
          <div className="h-4 sm:h-6"></div>
          <InfoPage content={content} />
        </div>
      </div>
      
      {/* BottomNav */}
      <BottomNav />
    </div>
  );
}