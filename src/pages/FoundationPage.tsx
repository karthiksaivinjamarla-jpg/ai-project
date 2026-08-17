import { HeartPulse, Languages, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AppShell } from '../components/layout/AppShell'
import { IconActionCard } from '../components/ui/IconActionCard'
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher'

interface FoundationPageProps {
  audience: 'patient' | 'staff'
}

export function FoundationPage({ audience }: FoundationPageProps) {
  const { t } = useTranslation()
  const heading = audience === 'patient' ? t('foundation.patientTitle') : t('foundation.staffTitle')

  return (
    <AppShell>
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-teal-900">
          <span className="grid size-12 place-items-center rounded-2xl bg-teal-700 text-white" aria-hidden="true">
            <HeartPulse size={26} />
          </span>
          <div>
            <p className="text-xl font-bold tracking-tight">SevaCare</p>
            <p className="text-sm text-slate-600">{t('brand.tagline')}</p>
          </div>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="mt-12 space-y-8">
        <section aria-labelledby="foundation-heading" className="space-y-3">
          <p className="text-sm font-semibold tracking-wide text-teal-800">{t('foundation.phaseLabel')}</p>
          <h1 id="foundation-heading" className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {heading}
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-700">{t('foundation.description')}</p>
        </section>

        <section aria-label={t('foundation.readyLabel')} className="grid gap-4 sm:grid-cols-2">
          <IconActionCard icon={<Languages />} title={t('foundation.localized')} description={t('foundation.localizedDescription')} />
          <IconActionCard icon={<ShieldCheck />} title={t('foundation.accessible')} description={t('foundation.accessibleDescription')} />
        </section>
      </main>
    </AppShell>
  )
}
