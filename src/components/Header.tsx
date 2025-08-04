'use client';
import { useState, useEffect } from 'react';
import contentCache from '@/lib/contentCache';

interface Settings {
  shopTitle: string;
  shopSubtitle: string;
  bannerText: string;
  titleEffect: string;
  scrollingText: string;
}

export default function Header() {
  // Forcer les données du cache instantané - JAMAIS d'ancien contenu
  // Header instantané depuis localStorage
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('adminSettings');
        if (cached) {
          const data = JSON.parse(cached);
          return {
            shopTitle: data.shopTitle || '',
            shopSubtitle: data.shopSubtitle || '',
            scrollingText: data.scrollingText || '',
            bannerText: data.bannerText || '',
            titleStyle: data.titleStyle || 'glow'
          };
        }
      } catch (e) {}
    }
    return {
      shopTitle: '',
      shopSubtitle: '',
      scrollingText: '',
      bannerText: '',
      titleStyle: 'glow'
    };
  });

  useEffect(() => {
    // Mise à jour en arrière-plan (pas prioritaire)
    setTimeout(() => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          setSettings({
            shopTitle: data.shopTitle || '',
            shopSubtitle: data.shopSubtitle || '',
            scrollingText: data.scrollingText || '',
            bannerText: data.bannerText || '',
            titleStyle: data.titleStyle || 'glow'
          });
          // Sauvegarder pour la prochaine fois
          localStorage.setItem('adminSettings', JSON.stringify(data));
        })
        .catch(() => {});
    }, 50);
  }, []);

  const getTitleClass = () => {
    const baseClass = "text-responsive-lg sm:text-responsive-xl md:text-responsive-2xl font-black tracking-wider transition-all duration-300 text-center line-height-tight";
    
    switch (settings.titleStyle) {
      case 'gradient':
        return `${baseClass} bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent`;
      case 'neon':
        return `${baseClass} text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]`;
      case 'rainbow':
        return `${baseClass} bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse`;
      case 'glow':
        return `${baseClass} text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]`;
      case 'shadow':
        return `${baseClass} text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]`;
      case 'bounce':
        return `${baseClass} text-white animate-bounce`;
      case 'graffiti':
        return `graffiti-text text-responsive-lg sm:text-responsive-xl md:text-responsive-2xl font-normal`;
      default:
        return `${baseClass} text-white`;
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-black/40 backdrop-blur-md safe-area-padding">
      {/* Texte défilant - depuis l'admin */}
      {settings.scrollingText && settings.scrollingText.trim() && (
        <div className="bg-black/30 backdrop-blur-sm text-white py-0.5 overflow-hidden relative border-b border-white/10">
          <div className="animate-marquee whitespace-nowrap inline-block">
            <span className="text-xs font-bold tracking-wide px-4 text-white drop-shadow-md">
              {settings.scrollingText}
            </span>
          </div>
        </div>
      )}
      
      {/* Bandeau blanc promotionnel - responsive */}
      {settings.bannerText && settings.bannerText.trim() && (
        <div className="bg-white/90 backdrop-blur-sm text-black py-1 sm:py-2 px-3 sm:px-4 text-center">
          <p className="text-black text-responsive-xs font-bold tracking-wide break-words">
            {settings.bannerText}
          </p>
        </div>
      )}
      
                {/* Logo boutique - responsive optimisé */}
      <div className="bg-black/30 backdrop-blur-md py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 text-center border-b border-white/10">
        <h1 className={getTitleClass()}>
          {settings.shopTitle}
        </h1>
        {settings.shopSubtitle && (
          <p className="text-white/80 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] font-medium mt-0.5 sm:mt-1 break-words drop-shadow-sm">
            {settings.shopSubtitle}
          </p>
        )}
      </div>
    </header>
  );
}