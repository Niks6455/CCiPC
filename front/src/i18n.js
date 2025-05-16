// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import authorEN from '@assets/locales/en/author.json';
import footerEN from '@assets/locales/en/footer.json';
import loginEN from '@assets/locales/en/login.json';
import reginsterEN from '@assets/locales/en/register.json';
import participantsEN from '@assets/locales/en/participants.json';

import authorRU from '@assets/locales/ru/author.json';
import footerRU from '@assets/locales/ru/footer.json';
import loginRU from '@assets/locales/ru/login.json';
import reginsterRU from '@assets/locales/ru/register.json';
import participantsRU from '@assets/locales/ru/participants.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      author: authorEN,
      footer: footerEN,
      login: loginEN,
      register: reginsterEN,
      participants: participantsEN,
    },
    ru: {
      author: authorRU,
      footer: footerRU,
      login: loginRU,
      register: reginsterRU,
      participants: participantsRU,
    },
  },
  lng: 'ru',
  fallbackLng: 'en',
  ns: ['author', 'footer', 'login', 'register', 'participants'],
  defaultNS: 'author',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
