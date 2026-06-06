import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json';
import enTranslation from './locales/en/translation.json';

// Language direction configuration
const languageDirections = {
  en: 'ltr',
  hi: 'ltr',
  mr: 'ltr',
  ar: 'rtl' // Arabic as an example of RTL language
};

// the translations
const resources = {
  en: {
    translation: enTranslation
  },
  hi: {
    translation: hiTranslation
  },
  mr: {
    translation: mrTranslation
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'mr'],
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Function to set document direction based on language
export const setDocumentDirection = (language) => {
  document.documentElement.dir = languageDirections[language] || 'ltr';
  document.documentElement.lang = language;
};

export default i18n;