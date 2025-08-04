'use client';

import { useState, useEffect } from 'react';
import { invalidateCache, reloadPage } from '@/lib/cacheInvalidator';

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

  // Sauvegarder avec mise à jour instantanée
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
        
        // Invalider le cache et forcer le rechargement instantané
        invalidateCache();
        reloadPage(activeTab);
        
        // Recharger la page si elle est ouverte dans un autre onglet
        if (typeof window !== 'undefined') {
          // Utiliser BroadcastChannel pour synchroniser entre onglets
          const channel = new BroadcastChannel('page_updates');
          channel.postMessage({ type: 'page_updated', page: activeTab });
          channel.close();
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Titre responsive */}
      <h2 className="text-xl sm:text-2xl font-bold text-white">📄 Gestion des Pages</h2>

      {/* Onglets responsive avec scroll horizontal sur mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex space-x-2 min-w-max sm:min-w-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-gray-800/50 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'questions'
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-gray-800/50 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-gray-800/50 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            Contact
          </button>
        </div>
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
            className="w-full bg-gray-800 border border-white/20 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Titre de la page"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contenu (Markdown supporté)
          </label>
          <div className="text-xs text-gray-400 mb-2">
            Utilisez # pour les titres, ** pour le gras, * pour l'italique, - pour les listes
          </div>
          <textarea
            value={pageContent[activeTab].content}
            onChange={(e) => updateContent('content', e.target.value)}
            rows={10}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-white/20 rounded-lg text-white font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white resize-y min-h-[200px] sm:min-h-[300px]"
            placeholder="Contenu de la page..."
          />
        </div>

        {/* Aide Markdown responsive */}
        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-xs text-gray-400">
          <p className="font-semibold mb-2">Syntaxe Markdown :</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-1">
              <p>• # Titre principal</p>
              <p>• ## Sous-titre</p>
              <p>• ### Section</p>
              <p>• **texte en gras**</p>
              <p>• *texte en italique*</p>
            </div>
            <div className="space-y-1">
              <p>• - élément de liste</p>
              <p>• 1. liste numérotée</p>
              <p>• `code inline`</p>
              <p>• Ligne vide = nouveau paragraphe</p>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde responsive avec statut */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center sticky bottom-0 bg-black/80 backdrop-blur-sm p-4 -mx-4 sm:mx-0 sm:p-0 sm:bg-transparent sm:backdrop-blur-none border-t sm:border-0 border-white/10">
          <button
            onClick={savePage}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isSaving ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sauvegarde...
              </span>
            ) : (
              '💾 Sauvegarder'
            )}
          </button>
          
          {saveStatus && (
            <span className={`text-sm font-medium ${
              saveStatus.includes('✅') ? 'text-green-400' : 
              saveStatus.includes('❌') ? 'text-red-400' : 
              'text-yellow-400'
            }`}>
              {saveStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}