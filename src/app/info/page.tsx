'use client';

import { useState, useEffect } from 'react';
import InfoPage from '@/components/InfoPage';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function InfoPageRoute() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadInfoContent = async () => {
    try {
      const response = await fetch('/api/pages/info', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || '');
      }
    } catch (error) {
      console.error('Erreur chargement info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfoContent();

    // Écouter les mises à jour de la page
    const handlePageUpdate = (event: CustomEvent) => {
      if (event.detail?.page === 'info' || !event.detail?.page) {
        console.log('🔄 Rechargement de la page info...');
        loadInfoContent();
      }
    };

    const handleCacheInvalidated = () => {
      console.log('🔄 Cache invalidé, rechargement...');
      loadInfoContent();
    };

    // Écouter les événements
    window.addEventListener('pageUpdated', handlePageUpdate as EventListener);
    window.addEventListener('cacheInvalidated', handleCacheInvalidated);

    // Écouter les mises à jour depuis d'autres onglets
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('page_updates');
      channel.onmessage = (event) => {
        if (event.data.type === 'page_updated' && event.data.page === 'info') {
          console.log('🔄 Mise à jour depuis un autre onglet...');
          loadInfoContent();
        }
      };
    } catch (e) {
      console.log('BroadcastChannel non supporté');
    }

    // Nettoyer les listeners
    return () => {
      window.removeEventListener('pageUpdated', handlePageUpdate as EventListener);
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

  return (
    <div className="main-container">
      {/* Overlay global toujours présent */}
      <div className="global-overlay"></div>
      
      {/* Contenu principal */}
      <div className="content-layer">
        <Header />
        <div className="pt-12 sm:pt-14 content-with-bottom-nav">
          <div className="h-4 sm:h-6"></div>
          <InfoPage content={content} />
        </div>
      </div>
      
      {/* BottomNav */}
      <BottomNav />
    </div>
  );
}