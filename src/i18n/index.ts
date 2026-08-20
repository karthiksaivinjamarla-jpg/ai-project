import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { hi } from './hi'
import { te } from './te'

const savedLanguage = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sevacare.language') : null
const language = savedLanguage === 'en' || savedLanguage === 'te' || savedLanguage === 'hi' ? savedLanguage : 'en'

void i18n.use(initReactI18next).init({ resources: { en, te, hi }, lng: language, fallbackLng: 'en', interpolation: { escapeValue: false } }).then(() => { document.documentElement.lang = language })

export default i18n
