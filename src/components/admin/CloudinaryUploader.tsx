'use client';
import { useState } from 'react';

interface CloudinaryUploaderProps {
  onMediaSelected: (url: string, type: 'image' | 'video') => void;
  acceptedTypes?: string;
  className?: string;
}

export default function CloudinaryUploader({ 
  onMediaSelected, 
  acceptedTypes = "image/*,video/*,.mov,.avi,.3gp",
  className = ""
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB vidéo, 10MB image
    
    if (file.size > maxSize) {
      setError(`Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB. Maximum ${isVideo ? '100MB' : '10MB'}`);
      return;
    }

    setUploading(true);
    setError('');
    setProgress('Préparation upload...');

    try {
      console.log('🚀 Début upload Cloudinary:', {
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1024 / 1024 * 100) / 100 + 'MB'
      });
      
      setProgress('Upload vers Cloudinary...');
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-cloudinary', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Upload Cloudinary réussi:', result);
      
      setProgress('Upload terminé !');
      setTimeout(() => setProgress(''), 2000);
      
      onMediaSelected(result.url, result.type);
      
      // Reset l'input
      event.target.value = '';
      
    } catch (error) {
      console.error('❌ Erreur upload Cloudinary:', error);
      setError(error instanceof Error ? error.message : 'Erreur upload inconnue');
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
                ☁️ Upload Cloudinary
              </>
            )}
          </label>
          
          <span className="text-sm text-gray-400">
            Images (10MB) & Vidéos (100MB) - Hébergement cloud
          </span>
        </div>

        {progress && (
          <div className="text-sm text-blue-400 bg-blue-900/20 px-3 py-2 rounded border border-blue-500">
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