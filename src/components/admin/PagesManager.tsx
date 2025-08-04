'use client';

import { useState, useEffect } from 'react';
import SimpleTextEditor from './SimpleTextEditor';
import Link from 'next/link';

interface PageContent {
  slug: string;
  title: string;
  content: string;
}

export default function PagesManager() {
  const [activeTab, setActiveTab] = useState<'info' | 'contact' | 'questions'>('info');
  const [pageContent, setPageContent] = useState({
    info: { title: 'Page Info', content: '' },
    contact: { title: 'Page Contact', content: '' },
    questions: { title: 'Questions Fréquentes', content: '' }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Mapping des pages vers leurs URLs
  const pageUrls = {
    info: '/info',
    contact: '/contact',
    questions: '/questions'
  };

  // Charger les pages
  const loadPages = async () => {
    try {
      setIsLoading(true);
      console.log('📄 Chargement des pages...');
      
      const [infoRes, contactRes, questionsRes] = await Promise.all([
        fetch('/api/pages/info', { cache: 'no-store' }).catch(err => {
          console.error('Erreur fetch info:', err);
          return { ok: false, json: () => ({ title: 'À propos', content: '' }) };
        }),
        fetch('/api/pages/contact', { cache: 'no-store' }).catch(err => {
          console.error('Erreur fetch contact:', err);
          return { ok: false, json: () => ({ title: 'Contact', content: '' }) };
        }),
        fetch('/api/pages/questions', { cache: 'no-store' }).catch(err => {
          console.error('Erreur fetch questions:', err);
          return { ok: false, json: () => ({ title: 'Questions Fréquentes', content: '' }) };
        })
      ]);
      
      console.log('Réponses API:', { info: infoRes.ok, contact: contactRes.ok, questions: questionsRes.ok });
      
      const [infoData, contactData, questionsData] = await Promise.all([
        infoRes.json(),
        contactRes.json(),
        questionsRes.json()
      ]);
      
      console.log('Données reçues:', { 
        info: infoData.title, 
        contact: contactData.title,
        questions: questionsData.title
      });
      
      setPageContent({
        info: {
          title: infoData.title || 'À propos',
          content: infoData.content || ''
        },
        contact: {
          title: contactData.title || 'Contact',
          content: contactData.content || ''
        },
        questions: {
          title: questionsData.title || 'Questions Fréquentes',
          content: questionsData.content || ''
        }
      });
    } catch (error) {
      console.error('❌ Erreur chargement pages:', error);
      setSaveStatus('❌ Erreur de chargement');
      
      // Définir des valeurs par défaut en cas d'erreur
      setPageContent({
        info: { title: 'À propos', content: '' },
        contact: { title: 'Contact', content: '' },
        questions: { title: 'Questions Fréquentes', content: '' }
      });
      
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder
  const savePage = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('Sauvegarde en cours...');
      
      const page = pageContent[activeTab];
      
      const response = await fetch(`/api/pages/${activeTab}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          title: page.title,
          content: page.content
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSaveStatus('✅ Sauvegardé avec succès !');
        
        // Invalider le cache pour forcer le rechargement
        if (typeof window !== 'undefined') {
          localStorage.removeItem('contentCache');
          window.dispatchEvent(new CustomEvent('cacheUpdated'));
        }
      } else {
        setSaveStatus('❌ Erreur de sauvegarde');
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      setSaveStatus('❌ Erreur de sauvegarde');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Mettre à jour le contenu
  const updateContent = (field: 'title' | 'content', value: string) => {
    setPageContent(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  // Charger au montage
  useEffect(() => {
    loadPages();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-400 mt-2">Chargement des pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec liens vers les pages publiques */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">📄 Gestion des Pages</h2>
        <div className="flex gap-2">
          <Link
            href={pageUrls[activeTab]}
            target="_blank"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir la page
          </Link>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'info'
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          Info
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'questions'
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          Questions
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'contact'
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-gray-800/50 text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          Contact
        </button>
      </div>

      {/* Contenu de la page */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Titre de la page
          </label>
          <input
            type="text"
            value={pageContent[activeTab].title}
            onChange={(e) => updateContent('title', e.target.value)}
            className="w-full bg-gray-800 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Titre de la page"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contenu de la page (Markdown supporté)
          </label>
          <SimpleTextEditor
            value={pageContent[activeTab].content}
            onChange={(value) => updateContent('content', value)}
            placeholder="Tapez votre contenu ici... Utilisez les boutons ci-dessus pour insérer des éléments."
          />
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-between items-center">
          <button
            onClick={savePage}
            disabled={isSaving}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          
          {saveStatus && (
            <span className={`text-sm ${
              saveStatus.includes('✅') ? 'text-green-400' : 'text-red-400'
            }`}>
              {saveStatus}
            </span>
          )}
        </div>
      </div>

      {/* Liens rapides vers toutes les pages */}
      <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-white/10">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Accès rapide aux pages publiques :</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/info"
            target="_blank"
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            📄 Page Info
          </Link>
          <Link
            href="/questions"
            target="_blank"
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            ❓ Page Questions
          </Link>
          <Link
            href="/contact"
            target="_blank"
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            📞 Page Contact
          </Link>
        </div>
      </div>
    </div>
  );
}