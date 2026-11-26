import React, { createContext, useContext, useState, useEffect } from 'react';
import en from './en.json';
import hi from './hi.json';

const translations = { en, hi };

const I18nContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key
});

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('pt_language');
      if (saved && (saved === 'en' || saved === 'hi')) return saved;
      return 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pt_language', language);
      document.documentElement.lang = language;
    } catch (e) {}
  }, [language]);

  const t = (path, replacements = {}) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Fallback to English
        let fallback = translations['en'];
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        result = fallback;
        break;
      }
    }

    if (typeof result === 'string') {
      let str = result;
      for (const [k, v] of Object.entries(replacements)) {
        str = str.replace(new RegExp(`{${k}}`, 'g'), v);
      }
      return str;
    }

    return result || path;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
