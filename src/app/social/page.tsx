import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { connectToDatabase } from '@/lib/mongodb-fixed';

interface SocialLink {
  _id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  isActive: boolean;
}

interface Settings {
  shopTitle: string;
  shopSubtitle: string;
  email: string;
  address: string;
  whatsappLink: string;
}

async function getSocialData() {
  try {
    const { db } = await connectToDatabase();
    
    const [socialLinks, settings] = await Promise.all([
      db.collection('socialLinks').find({ isActive: true }).toArray(),
      db.collection('settings').findOne({})
    ]);
    
    return {
      socialLinks: socialLinks as SocialLink[],
      settings: settings as Settings | null
    };
  } catch (error) {
    console.error('Erreur chargement social:', error);
    return {
      socialLinks: [],
      settings: null
    };
  }
}

export default async function SocialPage() {
  // Charger les données côté serveur
  const { socialLinks, settings } = await getSocialData();

  // Structure cohérente avec la boutique principale
  return (
    <div className="main-container">
      {/* Overlay global toujours présent */}
      <div className="global-overlay"></div>
      
      {/* Contenu principal */}
      <div className="content-layer">
        <Header />
        
        <div className="pt-12 sm:pt-14">
          <div className="h-4 sm:h-6"></div>
          
          <main className="pt-4 pb-24 sm:pb-28 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl mx-auto">
            {/* Titre de la page avec style boutique */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="shop-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3">
                Nos Réseaux
              </h1>
              <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-base sm:text-lg max-w-xl mx-auto px-4 font-semibold bg-black/50 backdrop-blur-sm py-2 px-4 rounded-lg">
                Rejoignez <span className="text-yellow-400">{settings?.shopTitle || 'notre boutique'}</span> sur nos réseaux sociaux
              </p>
            </div>

            {socialLinks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-white/20"
                  >
                    {/* Effet de hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${link.color}, transparent)`
                      }}
                    />
                    
                    <div className="relative p-4 sm:p-6 text-center">
                      {/* Icône */}
                      <div className="text-2xl sm:text-3xl mb-2">{link.icon}</div>
                      
                      {/* Nom du réseau */}
                      <h3 className="text-sm sm:text-base font-semibold text-white mb-2 truncate">
                        {link.name}
                      </h3>
                      
                      {/* Petit indicateur de couleur */}
                      <div 
                        className="w-8 h-1 mx-auto rounded-full"
                        style={{ backgroundColor: link.color }}
                      />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400">
                  Aucun réseau social configuré pour le moment.
                </p>
              </div>
            )}

            {/* Section contact plus visible */}
            {settings?.whatsappLink && (
              <div className="mt-12 sm:mt-16 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                  <span className="text-2xl">💬</span> Besoin d&apos;aide ?
                </h2>
                <a
                  href={settings.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="text-xl sm:text-2xl">💬</span>
                  <span>Contactez-nous sur WhatsApp</span>
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* BottomNav toujours visible */}
      <BottomNav />
    </div>
  );
}