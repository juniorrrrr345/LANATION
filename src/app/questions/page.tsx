'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';

interface QuestionsPage {
  title: string;
  content: string;
}

export default function QuestionsPage() {
  const [questionsPage, setQuestionsPage] = useState<QuestionsPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestionsPage = async () => {
      try {
        const response = await fetch('/api/pages/questions', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setQuestionsPage(data);
        }
      } catch (error) {
        console.error('Erreur chargement page questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestionsPage();
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
          <BottomNav activeTab="questions" onTabChange={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="global-overlay"></div>
      <div className="content-layer">
        <Header />
        <div className="pt-12 sm:pt-14">
          <div className="h-4 sm:h-6"></div>
          <main className="pt-4 pb-24 sm:pb-28 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h1 className="text-3xl font-bold text-white mb-6">
                {questionsPage?.title || 'Questions Fréquentes'}
              </h1>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: questionsPage?.content || 
                  '<p class="text-white/60">Aucun contenu disponible pour le moment.</p>' 
                }}
              />
            </div>
          </main>
        </div>
        <BottomNav activeTab="questions" onTabChange={() => {}} />
      </div>
    </div>
  );
}