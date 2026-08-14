import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === i18n.resolvedLanguage || lang.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center items-center w-full rounded-md border border-slate-200 shadow-sm px-3 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors"
          id="language-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="mr-2 text-lg leading-none">{currentLanguage.flag}</span>
          {currentLanguage.code.toUpperCase()}
          <svg className="-mr-1 ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-200" 
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="language-menu-button" 
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-slate-100 hover:text-slate-900 transition-colors ${i18n.language === lang.code ? 'bg-slate-50 font-semibold text-blue-600' : 'text-slate-700'}`}
                role="menuitem"
                tabIndex={-1}
              >
                <span className="mr-3 text-lg leading-none">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
