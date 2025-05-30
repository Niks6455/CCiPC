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
import documentsLkEN from '@assets/locales/en/documentsLk.json';
import createReportEN from '@assets/locales/en/createReport.json';
import addCoauthorEN from '@assets/locales/en/addCoauthor.json';
import profileEditingEN from '@assets/locales/en/profileEditing.json';
import changePasswordEN from '@assets/locales/en/changePassword.json';
import homePageEN from '@assets/locales/en/homePage.json';
import globalEN from '@assets/locales/en/global.json';
import confirmLoginEN from '@assets/locales/en/confirmLogin.json';
import recoveryPasswordEN from '@assets/locales/en/recoveryPassword.json';
import noteFoundEN from '@assets/locales/en/noteFound.json';

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
import documentsLkRU from '@assets/locales/ru/documentsLk.json';
import createReportRU from '@assets/locales/ru/createReport.json';
import addCoauthorRU from '@assets/locales/ru/addCoauthor.json';
import profileEditingRU from '@assets/locales/ru/profileEditing.json';
import changePasswordRU from '@assets/locales/ru/changePassword.json';
import homePageRU from '@assets/locales/ru/homePage.json';
import globalRU from '@assets/locales/ru/global.json';
import confirmLoginRU from '@assets/locales/ru/confirmLogin.json';
import recoveryPasswordRU from '@assets/locales/ru/recoveryPassword.json';
import noteFoundRU from '@assets/locales/ru/noteFound.json';

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
      documentsLk: documentsLkEN,
      createReport: createReportEN,
      addCoauthor: addCoauthorEN,
      profileEditing: profileEditingEN,
      changePassword: changePasswordEN,
      homePage: homePageEN,
      global: globalEN,
      confirmLogin: confirmLoginEN,
      recoveryPassword: recoveryPasswordEN,
      noteFound: noteFoundEN,
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
      documentsLk: documentsLkRU,
      createReport: createReportRU,
      addCoauthor: addCoauthorRU,
      profileEditing: profileEditingRU,
      changePassword: changePasswordRU,
      homePage: homePageRU,
      global: globalRU,
      confirmLogin: confirmLoginRU,
      recoveryPassword: recoveryPasswordRU,
      noteFound: noteFoundRU,
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
    'documentsLk',
    'createReport',
    'addCoauthor',
    'profileEditing',
    'changePassword',
    'homePage',
    'global',
    'confirmLogin',
    'recoveryPassword',
    'noteFound',
  ],
  defaultNS: 'author',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
