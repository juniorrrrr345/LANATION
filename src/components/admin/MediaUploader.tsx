'use client';
import { useState } from 'react';

interface MediaUploaderProps {
  onMediaSelected: (url: string, type: 'image' | 'video') => void;
  acceptedTypes?: string;
  maxSize?: number;
  className?: string;
}

export default function MediaUploader({ 
  onMediaSelected, 
  acceptedTypes = "image/*,video/*,.jpg,.jpeg,.png,.webp,.heic,.heif,.mp4,.mov,.avi,.3gp,.3g2,.webm",
  maxSize = 10, // Limite par défaut réduite
  className = ""
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Déterminer le type de fichier par l'extension si le type MIME est manquant
    const fileName = file.name.toLowerCase();
    const isVideo = file.type.startsWith('video/') || 
                   ['.mp4', '.mov', '.avi', '.3gp', '.3g2', '.webm'].some(ext => fileName.endsWith(ext));
    
    // Vérifier si c'est un fichier HEIC/HEIF
    const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif');
    
    // Vérifier la taille selon le type de fichier
    const actualMaxSize = isVideo ? 15 : 5; // 15MB pour vidéos (max MongoDB), 5MB pour images
    const maxBytes = actualMaxSize * 1024 * 1024;
    
    if (file.size > maxBytes) {
      setError(`Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB. Maximum ${actualMaxSize}MB pour ${isVideo ? 'les vidéos' : 'les images'}. Utilisez l'upload Cloudinary pour des fichiers plus gros.`);
      return;
    }
    
    // Vérification supplémentaire pour éviter les erreurs MongoDB
    if (isVideo && file.size > 10 * 1024 * 1024) {
      console.log('⚠️ Vidéo proche de la limite MongoDB, risque d\'erreur possible');
    }
    
    // Avertissement pour les fichiers HEIC
    if (isHeic) {
      console.log('⚠️ Format HEIC détecté - sera traité comme JPEG');
    }

    setUploading(true);
    setError('');

    try {
      console.log('🚀 Début upload client:', {
        name: file.name,
        type: file.type || 'Type non détecté',
        size: Math.round(file.size / 1024 / 1024 * 100) / 100 + 'MB',
        extension: fileName.substring(fileName.lastIndexOf('.'))
      });
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Réponse serveur:', response.status);

      if (!response.ok) {
        let errorMessage = `Erreur HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('❌ Erreur serveur:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('❌ Erreur parsing réponse:', parseError);
          if (response.status === 413) {
            errorMessage = 'Fichier trop volumineux';
          } else if (response.status === 400) {
            errorMessage = 'Format de fichier non supporté. Essayez Cloudinary pour ce type de vidéo.';
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Upload réussi:', result);
      onMediaSelected(result.url, result.type);
      
      // Reset l'input
      event.target.value = '';
      
    } catch (error) {
      console.error('❌ Erreur upload client:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur upload inconnue';
      
      // Messages d'erreur plus clairs pour l'utilisateur
      if (errorMessage.includes('trop volumineux')) {
        setError(errorMessage);
      } else if (errorMessage.includes('Type de fichier non supporté')) {
        setError('Format de fichier non supporté. Utilisez JPG, PNG, WebP, HEIC (iPhone), MP4, MOV ou WebM.');
      } else if (errorMessage.includes('string did not match') || errorMessage.includes('expected pattern') || errorMessage.includes('Invalid')) {
        setError('⚠️ Format vidéo non compatible (vidéo iPhone?). Utilisez Cloudinary (bouton bleu) pour ce fichier.');
      } else if (errorMessage.includes('HEVC') || errorMessage.includes('H.265')) {
        setError('📱 Vidéo iPhone moderne détectée (HEVC/H.265). Ce format nécessite Cloudinary pour la conversion automatique. Utilisez le bouton bleu ci-dessous.');
      } else {
        setError(`Erreur: ${errorMessage}. Essayez l'upload Cloudinary pour plus de fiabilité.`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`media-uploader ${className}`}>
      <div className="flex items-center gap-2">
        <label className={`
          inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg 
          bg-gray-700 hover:bg-gray-600 text-white cursor-pointer transition-colors
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          <input
            type="file"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Upload...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Choisir un fichier
            </>
          )}
        </label>
        
        <span className="text-sm text-gray-400">
                      {acceptedTypes.includes('video') && acceptedTypes.includes('image') 
              ? 'Images (5MB) & Vidéos (15MB) - Formats iPhone supportés'
            : acceptedTypes.includes('video')
                          ? 'Vidéos (max 15MB) - MP4, MOV, WebM, AVI, 3GP'
              : 'Images (max 5MB) - JPG, PNG, WebP, HEIC'
          }
        </span>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded border border-red-500">
          {error}
          {(error.includes('HEVC') || error.includes('H.265') || error.includes('Cloudinary')) && (
            <p className="text-yellow-400 text-xs mt-2">
              💡 Astuce iPhone: Réglages → Appareil photo → Formats → Choisir "Le plus compatible" pour éviter ce problème.
            </p>
          )}
        </div>
      )}
    </div>
  );
}