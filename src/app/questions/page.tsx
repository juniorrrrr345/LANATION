'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import QuestionsPage from '@/components/QuestionsPage';

interface QuestionsData {
  title: string;
  content: string;
}

export default function QuestionsPageRoute() {
  const [questionsData, setQuestionsData] = useState<QuestionsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadQuestionsPage = async () => {
    try {
      const response = await fetch('/api/pages/questions', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setQuestionsData(data);
      }
    } catch (error) {
      console.error('Erreur chargement page questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionsPage();

    // Écouter les mises à jour de la page
    const handlePageUpdate = (event: CustomEvent) => {
      if (event.detail?.page === 'questions' || !event.detail?.page) {
        console.log('🔄 Rechargement de la page questions...');
        loadQuestionsPage();
      }
    };

    const handleCacheInvalidated = () => {
      console.log('🔄 Cache invalidé, rechargement...');
      loadQuestionsPage();
    };

    // Écouter les événements
    window.addEventListener('pageUpdated', handlePageUpdate as EventListener);
    window.addEventListener('cacheInvalidated', handleCacheInvalidated);

    // Écouter les mises à jour depuis d'autres onglets
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('page_updates');
      channel.onmessage = (event) => {
        if (event.data.type === 'page_updated' && event.data.page === 'questions') {
          console.log('🔄 Mise à jour depuis un autre onglet...');
          loadQuestionsPage();
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
      <div className="global-overlay"></div>
      <div className="content-layer">
        <Header />
        <div className="pt-12 sm:pt-14 content-with-bottom-nav">
          <div className="h-4 sm:h-6"></div>
          <QuestionsPage 
            title={questionsData?.title || 'Questions Fréquentes'}
            content={questionsData?.content || ''}
          />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}