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

  useEffect(() => {
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
        <div className="pt-12 sm:pt-14">
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