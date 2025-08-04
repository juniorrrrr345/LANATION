'use client';
import { useState, useRef } from 'react';

interface SimpleTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SimpleTextEditor({ 
  value, 
  onChange, 
  placeholder = "Tapez votre contenu ici...",
  className = ""
}: SimpleTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fonction pour insérer des éléments de formatage simple
  const insertElement = (element: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let insertText = '';
    
    switch (element) {
      case 'title':
        insertText = selectedText ? `\n\nTITRE: ${selectedText}\n` : '\n\nTITRE: Votre titre ici\n';
        break;
      case 'subtitle':
        insertText = selectedText ? `\n\nSOUS-TITRE: ${selectedText}\n` : '\n\nSOUS-TITRE: Votre sous-titre ici\n';
        break;
      case 'list':
        insertText = '\n\n• Premier élément\n• Deuxième élément\n• Troisième élément\n';
        break;
      case 'number':
        insertText = '\n\n1. Premier élément\n2. Deuxième élément\n3. Troisième élément\n';
        break;
      case 'separator':
        insertText = '\n\n─────────────────\n';
        break;
      case 'highlight':
        insertText = selectedText ? `*** ${selectedText} ***` : '*** Texte important ***';
        break;
      case 'contact':
        insertText = '\n\n📞 Contact: Votre numéro\n📧 Email: votre@email.com\n📍 Adresse: Votre adresse\n';
        break;
      case 'info':
        insertText = '\n\nℹ️ INFORMATION IMPORTANTE\n\n';
        break;
      case 'warning':
        insertText = '\n\n⚠️ ATTENTION\n\n';
        break;
      case 'success':
        insertText = '\n\n✅ SUCCÈS\n\n';
        break;
    }
    
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    const newValue = beforeText + insertText + afterText;
    
    onChange(newValue);
    
    // Placer le curseur après l'insertion
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + insertText.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className={`simple-text-editor ${className}`}>
      {/* Barre d'outils simple */}
      <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-800/50 rounded-lg border border-white/10">
        <button
          onClick={() => insertElement('title')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all duration-200"
          title="Ajouter un titre"
        >
          TITRE
        </button>
        
        <button
          onClick={() => insertElement('subtitle')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Ajouter un sous-titre"
        >
          SOUS-TITRE
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        <button
          onClick={() => insertElement('list')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Liste à puces"
        >
          •
        </button>
        
        <button
          onClick={() => insertElement('number')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Liste numérotée"
        >
          1.
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        <button
          onClick={() => insertElement('highlight')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Texte important"
        >
          ***
        </button>
        
        <button
          onClick={() => insertElement('separator')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Séparateur"
        >
          ─
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        <button
          onClick={() => insertElement('contact')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Template contact"
        >
          📞
        </button>
        
        <button
          onClick={() => insertElement('info')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Information"
        >
          ℹ️
        </button>
        
        <button
          onClick={() => insertElement('warning')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Attention"
        >
          ⚠️
        </button>
        
        <button
          onClick={() => insertElement('success')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Succès"
        >
          ✅
        </button>
      </div>

      {/* Zone de texte */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={15}
        className="w-full bg-gray-800 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white resize-y text-base leading-relaxed"
      />
      
      {/* Aide */}
      <div className="mt-2 text-xs text-gray-400">
        <p>💡 <strong>Conseils :</strong></p>
        <ul className="mt-1 space-y-1 ml-4">
          <li>• Sélectionnez du texte puis cliquez sur *** pour le mettre en évidence</li>
          <li>• Utilisez les boutons pour insérer des éléments prédéfinis</li>
          <li>• Les changements apparaissent immédiatement sur la boutique</li>
          <li>• N'oubliez pas de sauvegarder vos modifications</li>
        </ul>
      </div>
    </div>
  );
}