export interface SupportedLanguage { code: 'en' | 'te' | 'hi'; nativeName: string }

export const supportedLanguages: SupportedLanguage[] = [
  { code: 'en', nativeName: 'English' },
  { code: 'te', nativeName: 'తెలుగు' },
  { code: 'hi', nativeName: 'हिन्दी' },
]
