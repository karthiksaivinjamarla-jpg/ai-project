import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../../i18n/languages'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage ?? 'en'

  return <label className="flex min-h-12 items-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-200"><Languages size={20} aria-hidden="true" /><span className="sr-only">{t('language.label')}</span><select value={currentLanguage} onChange={(event) => void i18n.changeLanguage(event.target.value)} className="min-h-10 bg-transparent outline-none" aria-label={t('language.label')}>{supportedLanguages.map((language) => <option key={language.code} value={language.code}>{language.nativeName}</option>)}</select></label>
}
