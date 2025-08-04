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

  // Fonction pour insérer des éléments de formatage Markdown
  const insertElement = (element: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let insertText = '';
    let newCursorPos = start;
    
    switch (element) {
      case 'h1':
        insertText = selectedText ? `# ${selectedText}\n` : '# Titre principal\n';
        newCursorPos = start + 2;
        break;
      case 'h2':
        insertText = selectedText ? `## ${selectedText}\n` : '## Sous-titre\n';
        newCursorPos = start + 3;
        break;
      case 'h3':
        insertText = selectedText ? `### ${selectedText}\n` : '### Section\n';
        newCursorPos = start + 4;
        break;
      case 'bold':
        insertText = selectedText ? `**${selectedText}**` : '**texte en gras**';
        newCursorPos = start + 2;
        break;
      case 'italic':
        insertText = selectedText ? `*${selectedText}*` : '*texte en italique*';
        newCursorPos = start + 1;
        break;
      case 'list':
        insertText = '\n- Premier élément\n- Deuxième élément\n- Troisième élément\n';
        newCursorPos = start + 3;
        break;
      case 'number':
        insertText = '\n1. Premier élément\n2. Deuxième élément\n3. Troisième élément\n';
        newCursorPos = start + 3;
        break;
      case 'separator':
        insertText = '\n---\n';
        newCursorPos = start + insertText.length;
        break;
      case 'code':
        insertText = selectedText ? `\`${selectedText}\`` : '`code`';
        newCursorPos = start + 1;
        break;
      case 'link':
        insertText = selectedText ? `[${selectedText}](url)` : '[texte du lien](https://example.com)';
        newCursorPos = start + 1;
        break;
      case 'contact':
        insertText = '\n## 📞 Contact\n\n**Téléphone** : +33 1 23 45 67 89\n**Email** : contact@example.com\n**Adresse** : 123 Rue Example, 75001 Paris\n';
        break;
      case 'info':
        insertText = '\n## ℹ️ Information\n\n';
        newCursorPos = start + insertText.length;
        break;
      case 'warning':
        insertText = '\n## ⚠️ Attention\n\n';
        newCursorPos = start + insertText.length;
        break;
      case 'success':
        insertText = '\n## ✅ Succès\n\n';
        newCursorPos = start + insertText.length;
        break;
    }
    
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    const newValue = beforeText + insertText + afterText;
    
    onChange(newValue);
    
    // Placer le curseur à la bonne position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className={`simple-text-editor ${className}`}>
      {/* Barre d'outils Markdown */}
      <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-800/50 rounded-lg border border-white/10">
        <button
          onClick={() => insertElement('h1')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all duration-200"
          title="Titre principal (# )"
        >
          H1
        </button>
        
        <button
          onClick={() => insertElement('h2')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Sous-titre (## )"
        >
          H2
        </button>
        
        <button
          onClick={() => insertElement('h3')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Section (### )"
        >
          H3
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        <button
          onClick={() => insertElement('bold')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all duration-200"
          title="Gras (**texte**)"
        >
          B
        </button>
        
        <button
          onClick={() => insertElement('italic')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm italic transition-all duration-200"
          title="Italique (*texte*)"
        >
          I
        </button>
        
        <button
          onClick={() => insertElement('code')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-mono transition-all duration-200"
          title="Code (`code`)"
        >
          {'</>'}
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        <button
          onClick={() => insertElement('list')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Liste à puces (- )"
        >
          • Liste
        </button>
        
        <button
          onClick={() => insertElement('number')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Liste numérotée (1. )"
        >
          1. Liste
        </button>
        
        <button
          onClick={() => insertElement('link')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Lien [texte](url)"
        >
          🔗
        </button>
        
        <button
          onClick={() => insertElement('separator')}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all duration-200"
          title="Séparateur (---)"
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
        className="w-full bg-gray-800 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white resize-y font-mono text-sm leading-relaxed"
      />
      
      {/* Aide Markdown */}
      <div className="mt-2 text-xs text-gray-400">
        <p>💡 <strong>Syntaxe Markdown :</strong></p>
        <div className="mt-1 grid grid-cols-2 gap-2 ml-4">
          <div>
            <p>• <code className="bg-gray-700 px-1"># Titre</code> → Titre principal</p>
            <p>• <code className="bg-gray-700 px-1">## Sous-titre</code> → Sous-titre</p>
            <p>• <code className="bg-gray-700 px-1">**gras**</code> → <strong>gras</strong></p>
            <p>• <code className="bg-gray-700 px-1">*italique*</code> → <em>italique</em></p>
          </div>
          <div>
            <p>• <code className="bg-gray-700 px-1">- item</code> → Liste à puces</p>
            <p>• <code className="bg-gray-700 px-1">1. item</code> → Liste numérotée</p>
            <p>• <code className="bg-gray-700 px-1">[texte](url)</code> → Lien</p>
            <p>• <code className="bg-gray-700 px-1">`code`</code> → Code inline</p>
          </div>
        </div>
      </div>
    </div>
  );
}