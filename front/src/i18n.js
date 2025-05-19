// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import authorEN from '@assets/locales/en/author.json';
import footerEN from '@assets/locales/en/footer.json';
import loginEN from '@assets/locales/en/login.json';
import reginsterEN from '@assets/locales/en/register.json';
import participantsEN from '@assets/locales/en/participants.json';
import committeeEN from '@assets/locales/en/committee.json';
import navbarEN from '@assets/locales/en/navbar.json';
import profileEN from '@assets/locales/en/profile.json';
import leftMenuEN from '@assets/locales/en/leftMenu.json';
import viewReportsEN from '@assets/locales/en/viewReports.json';

import authorRU from '@assets/locales/ru/author.json';
import footerRU from '@assets/locales/ru/footer.json';
import loginRU from '@assets/locales/ru/login.json';
import reginsterRU from '@assets/locales/ru/register.json';
import participantsRU from '@assets/locales/ru/participants.json';
import committeeRU from '@assets/locales/ru/committee.json';
import navbarRU from '@assets/locales/ru/navbar.json';
import profileRU from '@assets/locales/ru/profile.json';
import leftMenuRU from '@assets/locales/ru/leftMenu.json';
import viewReportsRU from '@assets/locales/ru/viewReports.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      author: authorEN,
      footer: footerEN,
      login: loginEN,
      register: reginsterEN,
      participants: participantsEN,
      committee: committeeEN,
      navbar: navbarEN,
      profile: profileEN,
      leftMenu: leftMenuEN,
      viewReports: viewReportsEN,
    },
    ru: {
      author: authorRU,
      footer: footerRU,
      login: loginRU,
      register: reginsterRU,
      participants: participantsRU,
      committee: committeeRU,
      navbar: navbarRU,
      profile: profileRU,
      leftMenu: leftMenuRU,
      viewReports: viewReportsRU,
    },
  },
  lng: 'ru',
  fallbackLng: 'en',
  ns: [
    'author',
    'footer',
    'login',
    'register',
    'participants',
    'committee',
    'navbar',
    'profile',
    'leftMenu',
    'viewReports',
  ],
  defaultNS: 'author',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
