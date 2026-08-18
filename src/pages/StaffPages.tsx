import { ArrowLeft, CheckCircle2, Filter, Search, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePatient } from '../app/PatientContext'
import { AppShell } from '../components/layout/AppShell'
import { Button } from '../components/ui/Button'
import { EnquiryCategory, EnquiryStatus, type Enquiry } from '../domain/enquiry'

const statuses = Object.values(EnquiryStatus)
const categories = Object.values(EnquiryCategory)
const assignees = ['Front Desk', 'Dr. Priya', 'Billing Team', 'Support Team']

const Frame = ({ children }: { children: import('react').ReactNode }) => <AppShell><div className="mx-auto max-w-6xl">{children}</div></AppShell>

function statusLabel(status: EnquiryStatus) {
  return status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusClass(status: EnquiryStatus) {
  if (status === EnquiryStatus.Resolved) return 'bg-emerald-50 text-emerald-800 ring-emerald-200'
  if (status === EnquiryStatus.InProgress) return 'bg-blue-50 text-blue-800 ring-blue-200'
  if (status === EnquiryStatus.Waiting) return 'bg-amber-50 text-amber-800 ring-amber-200'
  if (status === EnquiryStatus.Assigned) return 'bg-violet-50 text-violet-800 ring-violet-200'
  return 'bg-slate-100 text-slate-800 ring-slate-200'
}

export function StaffDashboardPage() {
  const { service } = usePatient()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [category, setCategory] = useState('ALL')
  const [selected, setSelected] = useState<Enquiry>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try { setEnquiries(await service.listEnquiries()); setError('') } catch { setError('Unable to load enquiries.') } finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return enquiries.filter((item) => {
      const matchesQuery = !needle || [item.trackingCode, item.description, item.department, item.assignedTo].filter(Boolean).some((value) => value!.toLowerCase().includes(needle))
      return matchesQuery && (status === 'ALL' || item.status === status) && (category === 'ALL' || item.category === category)
    })
  }, [enquiries, query, status, category])

  const counts = useMemo(() => ({ total: enquiries.length, new: enquiries.filter((item) => item.status === EnquiryStatus.New).length, active: enquiries.filter((item) => [EnquiryStatus.Assigned, EnquiryStatus.InProgress, EnquiryStatus.Waiting].includes(item.status)).length, resolved: enquiries.filter((item) => item.status === EnquiryStatus.Resolved).length }), [enquiries])

  return <Frame><main className="space-y-6 py-4">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><Link to="/home" className="inline-flex min-h-10 items-center gap-2 font-semibold text-teal-800"><ArrowLeft size={18}/>Patient view</Link><h1 className="mt-3 text-3xl font-bold">Staff Enquiry Desk</h1><p className="mt-1 text-slate-600">Review, assign and resolve patient enquiries.</p></div><div className="rounded-xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-900">Demo staff workspace</div></header>
    <section aria-label="Enquiry summary" className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Summary label="Total" value={counts.total}/><Summary label="New" value={counts.new}/><Summary label="Active" value={counts.active}/><Summary label="Resolved" value={counts.resolved}/></section>
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><div className="flex flex-col gap-3 lg:flex-row"><label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-3.5 text-slate-400" size={20}/><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search enquiries" placeholder="Search tracking code or request" className="min-h-12 w-full rounded-xl bg-white pl-10 pr-3 ring-1 ring-slate-300 focus:outline-teal-700"/></label><label className="flex items-center gap-2"><Filter size={18}/><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-12 rounded-xl bg-white px-3 ring-1 ring-slate-300"><option value="ALL">All statuses</option>{statuses.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select></label><select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-xl bg-white px-3 ring-1 ring-slate-300"><option value="ALL">All categories</option>{categories.map((value) => <option key={value} value={value}>{value}</option>)}</select></div></section>
    {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}
    {loading ? <p role="status">Loading enquiries…</p> : <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-3">{filtered.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-slate-600 ring-1 ring-slate-200">No enquiries match the current filters.</div> : filtered.map((item) => <button key={item.id} onClick={() => setSelected(item)} className={`w-full rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 ${selected?.id === item.id ? 'ring-2 ring-teal-600' : ''}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-teal-900">{item.trackingCode}</p><p className="mt-1 line-clamp-2 text-slate-700">{item.description}</p></div><span className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${statusClass(item.status)}`}>{statusLabel(item.status)}</span></div><div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600"><span>{item.category}</span><span>•</span><span>{item.department ?? 'Unassigned department'}</span><span>•</span><span>{new Date(item.createdAt).toLocaleString()}</span></div></button>)}</div><StaffDetail enquiry={selected} onSaved={(updated) => { setEnquiries((current) => current.map((item) => item.id === updated.id ? updated : item)); setSelected(updated) }} service={service}/></section>}
  </main></Frame>
}

function Summary({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200"><p className="text-sm text-slate-600">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p></div> }

function StaffDetail({ enquiry, onSaved, service }: { enquiry?: Enquiry; onSaved: (enquiry: Enquiry) => void; service: ReturnType<typeof usePatient>['service'] }) {
  const [status, setStatus] = useState<EnquiryStatus>(enquiry?.status ?? EnquiryStatus.New)
  const [assignee, setAssignee] = useState(enquiry?.assignedTo ?? '')
  const [resolution, setResolution] = useState(enquiry?.resolution ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { setStatus(enquiry?.status ?? EnquiryStatus.New); setAssignee(enquiry?.assignedTo ?? ''); setResolution(enquiry?.resolution ?? ''); setMessage('') }, [enquiry?.id])
  if (!enquiry) return <aside className="flex min-h-72 items-center justify-center rounded-2xl bg-white p-8 text-center text-slate-500 ring-1 ring-slate-200"><div><UserRound className="mx-auto mb-3" size={40}/><p className="font-semibold">Select an enquiry to manage it.</p></div></aside>

  const save = async () => { setSaving(true); setMessage(''); try { const updated = await service.updateEnquiry(enquiry, { status, assignedTo: assignee, resolution }); onSaved(updated); setMessage('Enquiry updated successfully.') } catch { setMessage('Could not save this enquiry.') } finally { setSaving(false) } }
  return <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-4 lg:self-start"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-500">Tracking code</p><p className="text-xl font-bold text-teal-900">{enquiry.trackingCode}</p></div><CheckCircle2 className="text-teal-700" aria-hidden="true"/></div><div className="mt-5 space-y-4"><div><p className="text-sm font-semibold text-slate-500">Patient request</p><p className="mt-1 text-lg">{enquiry.description}</p></div><div className="grid grid-cols-2 gap-3 text-sm"><Info label="Category" value={enquiry.category}/><Info label="Department" value={enquiry.department ?? '—'}/><Info label="Language" value={enquiry.detectedLanguage.toUpperCase()}/><Info label="Priority" value={enquiry.priority}/></div><label className="block font-semibold">Status<select value={status} onChange={(event) => setStatus(event.target.value as EnquiryStatus)} className="mt-2 min-h-12 w-full rounded-xl bg-white px-3 ring-1 ring-slate-300">{statuses.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select></label><label className="block font-semibold">Assign to<select value={assignee} onChange={(event) => setAssignee(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl bg-white px-3 ring-1 ring-slate-300"><option value="">Unassigned</option>{assignees.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label className="block font-semibold">Resolution / staff note<textarea value={resolution} onChange={(event) => setResolution(event.target.value)} placeholder="Add a resolution or internal note" className="mt-2 min-h-28 w-full rounded-xl bg-white p-3 ring-1 ring-slate-300 focus:outline-teal-700"/></label>{message && <p role="status" className="font-semibold text-teal-800">{message}</p>}<Button className="w-full" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</Button></div></aside>
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">{label}</p><p className="mt-1 font-semibold">{value}</p></div> }
