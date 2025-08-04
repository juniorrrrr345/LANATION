'use client';

import { useState, useEffect } from 'react';
import ContactPage from '@/components/ContactPage';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

interface ContactData {
  content: string;
  whatsappLink: string;
  socialLinks: any[];
}

export default function ContactPageRoute() {
  const [contactData, setContactData] = useState<ContactData>({
    content: '',
    whatsappLink: '',
    socialLinks: []
  });
  const [loading, setLoading] = useState(true);

  const loadContactData = async () => {
    try {
      const [pageRes, settingsRes, socialRes] = await Promise.all([
        fetch('/api/pages/contact', { cache: 'no-store' }),
        fetch('/api/settings', { cache: 'no-store' }),
        fetch('/api/social-links', { cache: 'no-store' })
      ]);

      let content = '';
      let whatsappLink = '';
      let socialLinks: any[] = [];

      if (pageRes.ok) {
        const pageData = await pageRes.json();
        content = pageData.content || '';
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        whatsappLink = settingsData.whatsappLink || '';
      }

      if (socialRes.ok) {
        const links = await socialRes.json();
        socialLinks = links.filter((link: any) => link.isActive) || [];
      }

      setContactData({ content, whatsappLink, socialLinks });
    } catch (error) {
      console.error('Erreur chargement contact:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContactData();

    // Écouter les mises à jour de la page
    const handlePageUpdate = (event: CustomEvent) => {
      if (event.detail?.page === 'contact' || !event.detail?.page) {
        console.log('🔄 Rechargement de la page contact...');
        loadContactData();
      }
    };

    const handleCacheInvalidated = () => {
      console.log('🔄 Cache invalidé, rechargement...');
      loadContactData();
    };

    const handleSocialUpdate = () => {
      console.log('🔄 Rechargement des réseaux sociaux...');
      loadContactData();
    };

    // Écouter les événements
    window.addEventListener('pageUpdated', handlePageUpdate as EventListener);
    window.addEventListener('cacheInvalidated', handleCacheInvalidated);
    window.addEventListener('socialLinksUpdated', handleSocialUpdate);

    // Écouter les mises à jour depuis d'autres onglets
    let pageChannel: BroadcastChannel | null = null;
    let socialChannel: BroadcastChannel | null = null;
    
    try {
      pageChannel = new BroadcastChannel('page_updates');
      pageChannel.onmessage = (event) => {
        if (event.data.type === 'page_updated' && event.data.page === 'contact') {
          console.log('🔄 Mise à jour depuis un autre onglet...');
          loadContactData();
        }
      };

      socialChannel = new BroadcastChannel('social_updates');
      socialChannel.onmessage = (event) => {
        if (event.data.type === 'social_links_updated') {
          console.log('🔄 Mise à jour des réseaux sociaux depuis un autre onglet...');
          loadContactData();
        }
      };
    } catch (e) {
      console.log('BroadcastChannel non supporté');
    }

    // Nettoyer les listeners
    return () => {
      window.removeEventListener('pageUpdated', handlePageUpdate as EventListener);
      window.removeEventListener('cacheInvalidated', handleCacheInvalidated);
      window.removeEventListener('socialLinksUpdated', handleSocialUpdate);
      pageChannel?.close();
      socialChannel?.close();
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

  return (
    <div className="main-container">
      {/* Overlay global toujours présent */}
      <div className="global-overlay"></div>
      
      {/* Contenu principal */}
      <div className="content-layer">
        <Header />
        <div className="pt-12 sm:pt-14 content-with-bottom-nav">
          <div className="h-4 sm:h-6"></div>
          <ContactPage 
            content={contactData.content}
            whatsappLink={contactData.whatsappLink}
            socialLinks={contactData.socialLinks}
          />
        </div>
      </div>
      
      {/* BottomNav */}
      <BottomNav />
    </div>
  );
}