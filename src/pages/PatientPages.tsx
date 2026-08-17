import { CalendarDays, Building2, CircleDollarSign, CircleHelp, CheckCircle2, Search, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { usePatient } from '../app/PatientContext'
import { AppShell } from '../components/layout/AppShell'
import { Button } from '../components/ui/Button'
import { StatusTimeline } from '../components/ui/StatusTimeline'
import { VoiceInput } from '../components/ui/VoiceInput'
import { EnquiryCategory, EnquirySource, type Enquiry } from '../domain/enquiry'
import { supportedLanguages } from '../i18n/languages'

const categories = [{ value: EnquiryCategory.Appointment, icon: CalendarDays }, { value: EnquiryCategory.Department, icon: Building2 }, { value: EnquiryCategory.Billing, icon: CircleDollarSign }, { value: EnquiryCategory.Other, icon: CircleHelp }]
const Frame = ({ children }: { children: import('react').ReactNode }) => <AppShell><div className="mx-auto max-w-xl">{children}</div></AppShell>

export function WelcomePage() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const choose = (code: string) => { void i18n.changeLanguage(code); sessionStorage.setItem('sevacare.language', code); document.documentElement.lang = code; navigate('/home') }
  return <Frame><main className="space-y-8 pt-8"><div className="space-y-3"><p className="text-2xl font-bold text-teal-800">SevaCare</p><h1 className="text-4xl font-bold tracking-tight">{t('welcome.title')}</h1><p className="text-lg text-slate-700">{t('welcome.subtitle')}</p></div><section aria-label={t('welcome.chooseLanguage')} className="grid gap-3">{supportedLanguages.map((language) => <button key={language.code} onClick={() => choose(language.code)} className="min-h-18 rounded-2xl bg-white px-6 py-5 text-left text-xl font-bold shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 focus-visible:outline-teal-700">{language.nativeName}</button>)}</section></main></Frame>
}

export function HomePage() {
  const { t } = useTranslation()
  return <Frame><header className="flex items-center justify-between"><p className="text-2xl font-bold text-teal-800">SevaCare</p><Link to="/track" className="min-h-12 rounded-xl px-3 py-3 font-semibold text-teal-800 focus-visible:outline-teal-700"><Search className="mr-1 inline" size={18}/>{t('home.track')}</Link></header><main className="mt-10"><h1 className="text-4xl font-bold">{t('home.title')}</h1><p className="mt-3 text-lg text-slate-700">{t('home.subtitle')}</p><section className="mt-8 grid grid-cols-2 gap-4">{categories.map(({ value, icon: Icon }) => <Link key={value} to={`/enquiry/${value}`} className="flex min-h-40 flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 focus-visible:outline-teal-700"><Icon size={36} className="text-teal-700" aria-hidden="true"/><span className="text-lg font-bold">{t(`category.${value}`)}</span></Link>)}</section></main></Frame>
}

export function EnquiryPage() {
  const { category } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setDraft } = usePatient()
  const selected = (Object.values(EnquiryCategory).includes(category as EnquiryCategory) ? category : EnquiryCategory.Other) as EnquiryCategory
  const [description, setDescription] = useState('')
  const [source, setSource] = useState(EnquirySource.Typed)
  const [error, setError] = useState('')
  const next = () => { if (!description.trim()) return setError(t('enquiry.required')); setDraft({ category: selected, description, source }); navigate('/review') }
  return <Frame><main className="space-y-6"><Link to="/home" className="inline-flex min-h-12 items-center gap-2 font-semibold text-teal-800"><ArrowLeft size={20}/>{t('common.back')}</Link><h1 className="text-3xl font-bold">{t(`enquiry.title.${selected}`)}</h1><p className="text-lg text-slate-700">{t('enquiry.prompt')}</p><textarea value={description} onChange={(event) => { setDescription(event.target.value); setSource(EnquirySource.Typed); setError('') }} className="min-h-40 w-full rounded-2xl bg-white p-4 text-lg ring-1 ring-slate-300 focus:outline-teal-700" aria-label={t('enquiry.prompt')} placeholder={t('enquiry.placeholder')} />{error && <p role="alert" className="font-semibold text-red-700">{error}</p>}<VoiceInput onResult={(text) => { setDescription(text); setSource(EnquirySource.Voice); setError('') }} /><Button className="w-full" onClick={next}>{t('common.continue')}</Button></main></Frame>
}

export function ReviewPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { draft, service } = usePatient()
  const [suggestion, setSuggestion] = useState<Awaited<ReturnType<typeof service.interpret>>>()
  const [category, setCategory] = useState<EnquiryCategory>(draft?.category ?? EnquiryCategory.Other)
  const [department, setDepartment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    let active = true
    setSuggestion(undefined)
    setSubmitError('')
    if (!draft) return () => { active = false }
    void service.interpret(draft, i18n.language).then((result) => {
      if (active) { setSuggestion(result); setCategory(result.category); setDepartment(result.department) }
    }).catch(() => {
      if (active) setSubmitError(t('review.submitError'))
    })
    return () => { active = false }
  }, [draft, i18n.language, service, t])

  if (!draft) return <Navigate to="/home" replace />

  const submit = async () => {
    if (!suggestion || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const enquiry = await service.submit(draft, suggestion, category, department, i18n.language)
      navigate(`/success/${enquiry.trackingCode}`)
    } catch {
      setIsSubmitting(false)
      setSubmitError(t('review.submitError'))
    }
  }

  return <Frame><main className="space-y-6"><h1 className="text-3xl font-bold">{t('review.title')}</h1>{!suggestion && !submitError ? <p role="status">{t('review.thinking')}</p> : <>{suggestion && <><section className="rounded-2xl bg-teal-50 p-5"><p className="font-semibold text-teal-900">{t('review.understood')}</p><p className="mt-3 text-lg">{draft.description}</p></section><label className="block font-bold">{t('review.category')}<select value={category} onChange={(e) => setCategory(e.target.value as EnquiryCategory)} className="mt-2 min-h-12 w-full rounded-xl bg-white px-3 ring-1 ring-slate-300">{categories.map(({value}) => <option key={value} value={value}>{t(`category.${value}`)}</option>)}</select></label><label className="block font-bold">{t('review.department')}<select value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl bg-white px-3 ring-1 ring-slate-300">{['CARDIOLOGY','GENERAL_MEDICINE','BILLING','FRONT_DESK'].map((value) => <option key={value} value={value}>{t(`department.${value}`)}</option>)}</select></label><div className="flex flex-col gap-3 sm:flex-row"><Button className="min-w-0 flex-1" disabled={isSubmitting} aria-busy={isSubmitting} onClick={submit}>{isSubmitting ? t('review.submitting') : t('review.confirm')}</Button><Button className="min-w-0 flex-1" variant="secondary" disabled={isSubmitting} onClick={() => navigate(-1)}>{t('review.change')}</Button></div></>}{submitError && <p role="alert" className="font-semibold text-red-700">{submitError}</p>}</>}</main></Frame>
}

export function SuccessPage() {
  const { trackingCode } = useParams()
  const { t } = useTranslation()
  const { setDraft } = usePatient()
  return <Frame><main className="space-y-6 py-12 text-center"><CheckCircle2 className="mx-auto text-teal-700" size={72} aria-hidden="true"/><h1 className="text-3xl font-bold">{t('success.title')}</h1><p className="text-lg text-slate-700">{t('success.message')}</p><p className="rounded-2xl bg-teal-50 p-5 text-2xl font-bold tracking-wider text-teal-950">{trackingCode}</p><Link to={`/track?code=${trackingCode}`} className="flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-base font-semibold text-white hover:bg-teal-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{t('success.track')}</Link><Link to="/home" onClick={() => setDraft(undefined)} className="block py-3 font-semibold text-teal-800">{t('success.another')}</Link></main></Frame>
}

export function TrackPage() {
  const { t } = useTranslation()
  const { service } = usePatient()
  const location = useLocation()
  const [code, setCode] = useState(new URLSearchParams(location.search).get('code') ?? '')
  const [enquiry, setEnquiry] = useState<Enquiry>()
  const [missing, setMissing] = useState(false)
  const [error, setError] = useState('')

  const find = async () => {
    if (!code.trim()) { setEnquiry(undefined); setMissing(false); setError(''); return }
    setError('')
    try {
      const result = await service.findByTrackingCode(code.trim())
      setEnquiry(result)
      setMissing(!result)
    } catch {
      setEnquiry(undefined)
      setMissing(false)
      setError(t('track.error'))
    }
  }

  useEffect(() => { if (code) void find() }, [])

  return <Frame><main className="space-y-6"><Link to="/home" className="inline-flex min-h-12 items-center gap-2 font-semibold text-teal-800"><ArrowLeft size={20}/>{t('common.back')}</Link><h1 className="text-3xl font-bold">{t('track.title')}</h1><div className="flex flex-col gap-2 sm:flex-row"><input value={code} onChange={(e) => { setCode(e.target.value); setMissing(false); setError('') }} aria-label={t('track.code')} placeholder={t('track.code')} className="min-h-12 min-w-0 flex-1 rounded-xl bg-white px-3 ring-1 ring-slate-300"/><Button onClick={find}>{t('track.find')}</Button></div>{missing && <p role="alert" className="font-semibold text-red-700">{t('track.notFound')}</p>}{error && <p role="alert" className="font-semibold text-red-700">{error}</p>}{enquiry && <section className="space-y-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="font-bold text-teal-900">{enquiry.trackingCode}</p><p><span className="font-semibold">{t('track.category')}:</span> {t(`category.${enquiry.category}`)}</p><p><span className="font-semibold">{t('track.request')}:</span> {enquiry.description}</p><StatusTimeline current={enquiry.status}/></section>}</main></Frame>
}
