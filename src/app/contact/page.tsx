import ContactPage from '@/components/ContactPage';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { connectToDatabase } from '@/lib/mongodb-fixed';

// Force le rendu dynamique pour éviter le cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getContactData() {
  try {
    const { db } = await connectToDatabase();
    
    const [page, settings, socialLinks] = await Promise.all([
      db.collection('pages').findOne({ slug: 'contact' }),
      db.collection('settings').findOne({}),
      db.collection('socialLinks').find({ isActive: true }).toArray()
    ]);
    
    console.log('📄 Contenu contact chargé:', page?.content?.substring(0, 50) + '...');
    
    return {
      content: page?.content || '',
      whatsappLink: settings?.whatsappLink || '',
      socialLinks: socialLinks || []
    };
  } catch (error) {
    console.error('Erreur chargement contact:', error);
    return {
      content: '',
      whatsappLink: '',
      socialLinks: []
    };
  }
}

export default async function ContactPageRoute() {
  // Charger les données côté serveur
  const { content, whatsappLink, socialLinks } = await getContactData();

  return (
    <div className="main-container">
      {/* Overlay global toujours présent */}
      <div className="global-overlay"></div>
      
      {/* Contenu principal */}
      <div className="content-layer">
        <Header />
        <div className="pt-12 sm:pt-14">
          <div className="h-4 sm:h-6"></div>
          <ContactPage 
            content={content}
            whatsappLink={whatsappLink}
            socialLinks={socialLinks}
          />
        </div>
      </div>
      
      {/* BottomNav */}
      <BottomNav />
    </div>
  );
}