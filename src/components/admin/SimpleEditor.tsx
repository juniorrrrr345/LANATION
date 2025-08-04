'use client';
import { useState, useRef, useEffect } from 'react';

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SimpleEditor({ 
  value, 
  onChange, 
  placeholder = "Tapez votre contenu ici...",
  className = ""
}: SimpleEditorProps) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fonction pour appliquer le formatage
  const applyFormat = (tag: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (selectedText) {
      // Appliquer le formatage au texte sélectionné
      const beforeText = value.substring(0, start);
      const afterText = value.substring(end);
      const formattedText = `<${tag}>${selectedText}</${tag}>`;
      
      const newValue = beforeText + formattedText + afterText;
      onChange(newValue);
      
      // Restaurer la sélection
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(
            start + tag.length + 2,
            start + tag.length + 2 + selectedText.length
          );
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      // Insérer les balises vides
      const beforeText = value.substring(0, start);
      const afterText = value.substring(end);
      const insertText = `<${tag}></${tag}>`;
      
      const newValue = beforeText + insertText + afterText;
      onChange(newValue);
      
      // Placer le curseur entre les balises
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + tag.length + 2;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  // Fonction pour insérer une liste
  const insertList = (type: 'ul' | 'ol') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(start);
    
    const listItem = type === 'ul' ? '<li>• Élément de liste</li>' : '<li>1. Élément de liste</li>';
    const listContent = `<${type}>\n  ${listItem}\n  <li>• Autre élément</li>\n</${type}>`;
    
    const newValue = beforeText + listContent + afterText;
    onChange(newValue);
    
    // Placer le curseur après la liste
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + listContent.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Fonction pour insérer un lien
  const insertLink = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const linkText = selectedText || 'Votre texte ici';
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    const linkContent = `<a href="https://votre-lien.com" target="_blank">${linkText}</a>`;
    
    const newValue = beforeText + linkContent + afterText;
    onChange(newValue);
    
    // Placer le curseur dans le lien
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = start + linkContent.indexOf('>') + 1;
        textareaRef.current.setSelectionRange(newPosition, newPosition + linkText.length);
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className={`simple-editor ${className}`}>
      {/* Barre d'outils */}
      <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-800/50 rounded-lg border border-white/10">
        {/* Formatage de base */}
        <button
          onClick={() => applyFormat('strong')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all duration-200"
          title="Gras"
        >
          B
        </button>
        
        <button
          onClick={() => applyFormat('em')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm italic transition-all duration-200"
          title="Italique"
        >
          I
        </button>
        
        <button
          onClick={() => applyFormat('u')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm underline transition-all duration-200"
          title="Souligné"
        >
          U
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        {/* Titres */}
        <button
          onClick={() => applyFormat('h2')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all duration-200"
          title="Titre 2"
        >
          H2
        </button>
        
        <button
          onClick={() => applyFormat('h3')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all duration-200"
          title="Titre 3"
        >
          H3
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        {/* Listes */}
        <button
          onClick={() => insertList('ul')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Liste à puces"
        >
          •
        </button>
        
        <button
          onClick={() => insertList('ol')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Liste numérotée"
        >
          1.
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        {/* Lien */}
        <button
          onClick={insertLink}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Insérer un lien"
        >
          🔗
        </button>
        
        {/* Paragraphe */}
        <button
          onClick={() => applyFormat('p')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Paragraphe"
        >
          ¶
        </button>
      </div>

      {/* Zone de texte */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="w-full bg-gray-800 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white resize-y text-base leading-relaxed"
      />
      
      {/* Aide */}
      <div className="mt-2 text-xs text-gray-400">
        <p>💡 <strong>Conseils :</strong></p>
        <ul className="mt-1 space-y-1 ml-4">
          <li>• Sélectionnez du texte puis cliquez sur un bouton pour le formater</li>
          <li>• Cliquez sur un bouton sans sélection pour insérer des balises vides</li>
          <li>• Utilisez les listes pour organiser vos informations</li>
          <li>• Les liens s'ouvriront dans un nouvel onglet</li>
        </ul>
      </div>
    </div>
  );
}