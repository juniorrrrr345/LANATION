'use client';
import { useState } from 'react';

interface CloudinaryUploaderProps {
  onMediaSelected: (url: string, type: 'image' | 'video') => void;
  acceptedTypes?: string;
  className?: string;
}

export default function CloudinaryUploader({ 
  onMediaSelected, 
  acceptedTypes = "image/*,video/*,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif,.mp4,.mov,.avi,.3gp,.3g2,.webm,.mkv",
  className = ""
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    console.log('📱 Fichier sélectionné:', {
      name: file.name,
      type: file.type || 'Type non détecté',
      size: Math.round(file.size / 1024 / 1024 * 100) / 100 + 'MB',
      extension: fileExtension
    });

    // Sur iPhone, les types peuvent être différents ou manquants
    const isVideo = file.type.startsWith('video/') || 
                   ['.mp4', '.mov', '.avi', '.3gp', '.3g2', '.webm', '.mkv'].includes(fileExtension);
    
    // Vérifier si c'est un fichier HEIC/HEIF
    const isHeic = fileExtension === '.heic' || fileExtension === '.heif';
    
    const maxSize = isVideo ? 2 * 1024 * 1024 * 1024 : 50 * 1024 * 1024; // 2GB vidéo (haute qualité et longue durée), 50MB image
    
    if (file.size > maxSize) {
              setError(`Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB. Maximum ${isVideo ? '2GB' : '50MB'}`);
      return;
    }

    setUploading(true);
    setError('');
    setProgress('Préparation upload...');

    try {
      // Avertissement spécial pour HEIC
      if (isHeic) {
        setProgress('Conversion HEIC vers JPEG...');
        console.log('🔄 Format HEIC détecté - Cloudinary va convertir automatiquement');
      }
      
      console.log('🚀 Début upload Cloudinary');
      
      setProgress(isVideo ? 'Upload vidéo en cours...' : 'Upload image en cours...');
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-cloudinary', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Réponse serveur:', response.status);

      if (!response.ok) {
        let errorMessage = `Erreur HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('❌ Erreur serveur:', errorData);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          console.error('❌ Impossible de parser l\'erreur');
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
        console.log('✅ Upload Cloudinary réussi:', result);
      } catch (parseError) {
        console.error('❌ Erreur parsing réponse:', parseError);
        throw new Error('Réponse serveur invalide. Réessayez ou contactez le support.');
      }
      
      setProgress('Upload terminé !');
      setTimeout(() => setProgress(''), 2000);
      
      // Si c'était un HEIC, informer que la conversion a réussi
      if (isHeic && result.format === 'jpg') {
        console.log('✅ HEIC converti en JPEG avec succès');
      }
      
      onMediaSelected(result.url, result.type);
      
      // Reset l'input
      event.target.value = '';
      
    } catch (error) {
      console.error('❌ Erreur upload Cloudinary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur upload inconnue';
      
      // Messages d'erreur plus clairs
      if (errorMessage.includes('Extension non supportée')) {
        setError('Format non supporté. Formats acceptés: JPG, PNG, WebP, GIF, HEIC (iPhone), MP4, MOV, AVI, WebM');
      } else if (errorMessage.includes('trop volumineux')) {
        setError(errorMessage);
      } else if (errorMessage.includes('preset')) {
        setError('Erreur de configuration Cloudinary. Contactez l\'administrateur.');
      } else if (errorMessage.includes('Invalid image file') || errorMessage.includes('Invalid video file')) {
        setError('❌ Fichier vidéo non supporté par Cloudinary. Convertissez d\'abord la vidéo avec une app iPhone (ex: Video Converter) en MP4 H.264.');
      } else {
        setError(`Erreur: ${errorMessage}. Pour les vidéos HEVC, convertissez-les d'abord en MP4.`);
      }
      
      setProgress('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`cloudinary-uploader ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className={`
            inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg 
            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
            text-white cursor-pointer transition-all duration-300 shadow-lg
            ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
          `}>
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif,.mp4,.mov,.avi,.3gp,.3g2,.webm,.mkv"
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
                ☁️ Upload Cloudinary
              </>
            )}
          </label>
          
          <span className="text-sm text-gray-400">
            Images (50MB) & Vidéos (2GB) - HEIC iPhone supporté, Haute qualité et longue durée
          </span>
        </div>

        {progress && (
          <div className="text-sm text-blue-400 bg-blue-900/20 px-3 py-2 rounded border border-blue-500 animate-pulse">
            {progress}
          </div>
        )}
        
        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded border border-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}