import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEn from './en/translation.json'
import translationFr from './fr/translation.json'

export const resources = {
  en: {
    translation: translationEn,
  },
  fr: {
    translation: translationFr,
  },
}

i18next.use(initReactI18next).init({
  lng: 'en', // if you're using a language detector, do not define the lng option
  debug: true,
  resources,
})
