// Fonction pour invalider le cache et forcer le rechargement instantané
export const invalidateCache = () => {
  if (typeof window !== 'undefined') {
    // Supprimer tous les caches localStorage
    localStorage.removeItem('contentCache');
    localStorage.removeItem('socialLinksCache');
    localStorage.removeItem('adminSettings');
    
    // Émettre un événement pour notifier les composants
    window.dispatchEvent(new CustomEvent('cacheInvalidated'));
    
    // Forcer le rechargement des pages dynamiques
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }
};

// Fonction pour recharger une page spécifique
export const reloadPage = (page: string) => {
  if (typeof window !== 'undefined') {
    // Invalider le cache de la page spécifique
    const cacheKey = `page_${page}_cache`;
    localStorage.removeItem(cacheKey);
    
    // Émettre un événement spécifique
    window.dispatchEvent(new CustomEvent('pageUpdated', { detail: { page } }));
  }
};

// Fonction pour recharger les réseaux sociaux
export const reloadSocialLinks = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('socialLinksCache');
    window.dispatchEvent(new CustomEvent('socialLinksUpdated'));
  }
};