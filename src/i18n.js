import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationUK from './locales/uk.json';
import translationEN from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uk: { translation: translationUK },
      en: { translation: translationEN }
    },
    lng: 'uk', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;