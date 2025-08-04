'use client';

import { useState } from 'react';

interface VideoConverterProps {
  onClose: () => void;
}

export default function VideoConverter({ onClose }: VideoConverterProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">📹 Convertir vos vidéos iPhone</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Option 1: Cloudinary */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">
              ✅ Option 1: Upload Cloudinary (Recommandé)
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Cloudinary convertit automatiquement vos vidéos HEVC en H.264 compatible.
            </p>
            <ul className="text-sm text-gray-400 space-y-1 ml-4">
              <li>• Conversion automatique</li>
              <li>• Garde la qualité originale</li>
              <li>• Fonctionne avec toutes les vidéos iPhone</li>
              <li>• Limite: 2GB</li>
            </ul>
            <button
              onClick={onClose}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Utiliser Cloudinary
            </button>
          </div>

          {/* Option 2: Réglages iPhone */}
          <div className="bg-gray-800 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              📱 Option 2: Changer les réglages iPhone
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Pour les futures vidéos, changez le format d'enregistrement :
            </p>
            <ol className="text-sm text-gray-400 space-y-2 ml-4">
              <li>1. Ouvrir <strong className="text-white">Réglages</strong></li>
              <li>2. Aller dans <strong className="text-white">Appareil photo</strong></li>
              <li>3. Toucher <strong className="text-white">Formats</strong></li>
              <li>4. Sélectionner <strong className="text-white">"Le plus compatible"</strong></li>
            </ol>
            <p className="text-xs text-yellow-400 mt-3">
              ⚠️ Vos futures vidéos seront en H.264 (compatible partout)
            </p>
          </div>

          {/* Option 3: Apps de conversion */}
          <div className="bg-gray-800 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              📲 Option 3: Apps de conversion iPhone
            </h3>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              {showInstructions ? 'Masquer' : 'Voir'} les instructions
            </button>
            
            {showInstructions && (
              <div className="mt-3 space-y-3">
                <div>
                  <h4 className="text-white font-medium mb-1">Apps gratuites recommandées :</h4>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4">
                    <li>• <strong className="text-white">Video Converter</strong> (gratuit)</li>
                    <li>• <strong className="text-white">Media Converter</strong> (gratuit)</li>
                    <li>• <strong className="text-white">HandBrake</strong> (gratuit, plus avancé)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-1">Comment faire :</h4>
                  <ol className="text-sm text-gray-400 space-y-1 ml-4">
                    <li>1. Télécharger une app de conversion</li>
                    <li>2. Importer votre vidéo HEVC</li>
                    <li>3. Choisir le format <strong className="text-white">H.264</strong> ou <strong className="text-white">MP4</strong></li>
                    <li>4. Convertir et sauvegarder</li>
                    <li>5. Uploader la vidéo convertie</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Option 4: En ligne */}
          <div className="bg-gray-800 border border-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              🌐 Option 4: Convertisseurs en ligne
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Sites web gratuits pour convertir HEVC → H.264 :
            </p>
            <ul className="text-sm text-gray-400 space-y-1 ml-4">
              <li>• <strong className="text-white">CloudConvert.com</strong></li>
              <li>• <strong className="text-white">Convertio.co</strong></li>
              <li>• <strong className="text-white">FreeConvert.com</strong></li>
            </ul>
            <p className="text-xs text-yellow-400 mt-3">
              ⚠️ Attention à la confidentialité de vos vidéos
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            💡 Conseil : Utilisez Cloudinary pour une conversion automatique et sécurisée
          </p>
        </div>
      </div>
    </div>
  );
}