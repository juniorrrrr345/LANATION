'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

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

export default function SocialPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSocialData = async () => {
    try {
      const [socialRes, settingsRes] = await Promise.all([
        fetch('/api/social-links', { cache: 'no-store' }),
        fetch('/api/settings', { cache: 'no-store' })
      ]);

      if (socialRes.ok) {
        const links = await socialRes.json();
        setSocialLinks(links.filter((link: SocialLink) => link.isActive));
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Erreur chargement social:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocialData();

    // Écouter les mises à jour des réseaux sociaux
    const handleSocialUpdate = () => {
      console.log('🔄 Rechargement des réseaux sociaux...');
      loadSocialData();
    };

    const handleCacheInvalidated = () => {
      console.log('🔄 Cache invalidé, rechargement...');
      loadSocialData();
    };

    // Écouter les événements
    window.addEventListener('socialLinksUpdated', handleSocialUpdate);
    window.addEventListener('cacheInvalidated', handleCacheInvalidated);

    // Écouter les mises à jour depuis d'autres onglets
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('social_updates');
      channel.onmessage = (event) => {
        if (event.data.type === 'social_links_updated') {
          console.log('🔄 Mise à jour depuis un autre onglet...');
          loadSocialData();
        }
      };
    } catch (e) {
      console.log('BroadcastChannel non supporté');
    }

    // Nettoyer les listeners
    return () => {
      window.removeEventListener('socialLinksUpdated', handleSocialUpdate);
      window.removeEventListener('cacheInvalidated', handleCacheInvalidated);
      channel?.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="main-container">
        <div className="global-overlay"></div>
        <div className="content-layer">
          <Header />
          <div className="pt-12 sm:pt-14">
            <div className="h-4 sm:h-6"></div>
            <div className="text-center py-8">
              <p className="text-white/60">Chargement...</p>
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
    );
  }

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
          <main className="pt-4 pb-24 sm:pb-28 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-4xl mx-auto">
            {/* Titre de la page avec style boutique */}
            <div className="text-center mb-8">
              <h1 className="shop-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3">
                Suivez-nous
              </h1>
              <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
            </div>

            {/* WhatsApp si disponible */}
            {settings?.whatsappLink && (
              <div className="mb-8">
                <Link 
                  href={settings.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl p-6 shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-4xl">💬</span>
                    <div className="text-center">
                      <p className="text-2xl font-bold">WhatsApp</p>
                      <p className="text-sm opacity-90">Contactez-nous directement</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Grille de liens sociaux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {socialLinks.map((link) => (
                <Link
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: link.color + '20',
                    borderColor: link.color,
                    borderWidth: '2px'
                  }}
                >
                  <div className="p-6 backdrop-blur-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {link.icon}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{link.name}</h3>
                        <p className="text-sm text-gray-300 opacity-75">Suivez-nous</p>
                      </div>
                      <svg className="w-6 h-6 text-white opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ backgroundColor: link.color }}
                  />
                </Link>
              ))}
            </div>

            {/* Message si aucun lien */}
            {socialLinks.length === 0 && !settings?.whatsappLink && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Aucun réseau social configuré pour le moment.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* BottomNav */}
      <BottomNav />
    </div>
  );
}