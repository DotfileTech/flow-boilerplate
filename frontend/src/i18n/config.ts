import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import addEn from '../config/trads/en.json';
import addFr from '../config/trads/fr.json';
import addDe from '../config/trads/de.json';
import addEs from '../config/trads/es.json';
import addIt from '../config/trads/it.json';
import addNl from '../config/trads/nl.json';
import baseEn from './trads/en.json';
import baseFr from './trads/fr.json';
import baseDe from './trads/de.json';
import baseEs from './trads/es.json';
import baseIt from './trads/it.json';
import baseNl from './trads/nl.json';

export const resources = {
  en: { translation: { ...baseEn, ...addEn } },
  fr: { translation: { ...baseFr, ...addFr } },
  de: { translation: { ...baseDe, ...addDe } },
  es: { translation: { ...baseEs, ...addEs } },
  it: { translation: { ...baseIt, ...addIt } },
  nl: { translation: { ...baseNl, ...addNl } },
};

const languageDetector = new LanguageDetector({
  order: [
    'querystring',
    'cookie',
    'localStorage',
    'sessionStorage',
    'navigator',
    'htmlTag',
    'path',
    'subdomain',
  ],

  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

  // optional expire and domain for set cookie
  cookieMinutes: 10,
  cookieDomain: 'myDomain',

  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement,

  // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
  cookieOptions: { path: '/', sameSite: 'strict' },
});

i18next.use(languageDetector).use(initReactI18next).init({
  debug: process.env.REACT_APP_ENV === 'development',
  resources,
});
