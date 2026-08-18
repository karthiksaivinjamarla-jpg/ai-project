import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ClipboardList, Search } from 'lucide-react'
import { usePatient } from '../app/PatientContext'
import { AppShell } from '../components/layout/AppShell'
import { Button } from '../components/ui/Button'
import { EnquiryStatus, type Enquiry } from '../domain/enquiry'

const statuses = Object.values(EnquiryStatus)
const assignees = ['Front Desk', 'Appointments', 'Billing', 'General Medicine']
const Frame = ({ children }: { children: import('react').ReactNode }) => <AppShell><div className="mx-auto max-w-6xl">{children}</div></AppShell>

export function StaffPage() {
  const { service } = usePatient()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [selected, setSelected] = useState<Enquiry>()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    setEnquiries(await service.listEnquiries())
    setLoading(false)
  }
  useEffect(() => { void refresh() }, [])

  const filtered = useMemo(() => enquiries.filter((item) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || [item.trackingCode, item.description, item.department ?? '', item.assignedTo ?? ''].some((value) => value.toLowerCase().includes(q))
    return matchesQuery && (status === 'ALL' || item.status === status)
  }), [enquiries, query, status])

  const update = async (changes: { status?: EnquiryStatus; assignedTo?: string; resolution?: string }) => {
    if (!selected) return
    const updated = await service.updateEnquiry(selected, changes)
    setSelected(updated)
    await refresh()
  }

  const counts = statuses.reduce<Record<string, number>>((acc, value) => { acc[value] = enquiries.filter((item) => item.status === value).length; return acc }, {})

  return <Frame><main className="space-y-6 py-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-2xl font-bold text-teal-800">SevaCare Staff</p><h1 className="text-3xl font-bold">Enquiry management</h1><p className="mt-1 text-slate-600">Review, assign and update patient enquiries.</p></div>
      <Link to="/home" className="inline-flex min-h-12 items-center gap-2 font-semibold text-teal-800"><ArrowLeft size={20}/>Patient view</Link>
    </header>
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <button onClick={() => setStatus('ALL')} className="rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200"><p className="text-sm text-slate-600">Total</p><p className="text-2xl font-bold">{enquiries.length}</p></button>
      {statuses.slice(0, 4).map((value) => <button key={value} onClick={() => setStatus(value)} className="rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200"><p className="text-sm text-slate-600">{value.replaceAll('_', ' ')}</p><p className="text-2xl font-bold">{counts[value] ?? 0}</p></button>)}
    </section>
    <section className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3.5 text-slate-500" size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search enquiries" placeholder="Search tracking code or request" className="min-h-12 w-full rounded-xl bg-white pl-10 pr-3 ring-1 ring-slate-300"/></label><select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter status" className="min-h-12 rounded-xl bg-white px-3 ring-1 ring-slate-300"><option value="ALL">All statuses</option>{statuses.map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}</select></div>
        {loading ? <p role="status">Loading enquiries…</p> : filtered.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200"><ClipboardList className="mx-auto mb-2 text-slate-400"/><p>No enquiries match this filter.</p></div> : <div className="space-y-2">{filtered.map((item) => <button key={item.id} onClick={() => setSelected(item)} className={`w-full rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 hover:bg-teal-50 ${selected?.id === item.id ? 'ring-2 ring-teal-600' : ''}`}><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-teal-900">{item.trackingCode}</p><p className="mt-1 line-clamp-2">{item.description}</p><p className="mt-2 text-sm text-slate-500">{item.department ?? 'Unassigned department'} · {item.assignedTo ?? 'Unassigned'}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold whitespace-nowrap">{item.status.replaceAll('_', ' ')}</span></div></button>)}</div>}
      </div>
      <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-4 lg:self-start">
        {!selected ? <div className="py-12 text-center text-slate-500"><ClipboardList className="mx-auto mb-3" size={40}/><p>Select an enquiry to manage it.</p></div> : <div className="space-y-5"><div><p className="text-sm font-semibold text-teal-700">{selected.trackingCode}</p><h2 className="mt-1 text-xl font-bold">{selected.description}</h2></div><dl className="space-y-2 text-sm"><div><dt className="font-semibold">Category</dt><dd>{selected.category}</dd></div><div><dt className="font-semibold">Department</dt><dd>{selected.department ?? '—'}</dd></div><div><dt className="font-semibold">Language</dt><dd>{selected.detectedLanguage}</dd></div><div><dt className="font-semibold">Source</dt><dd>{selected.source}</dd></div></dl><label className="block font-semibold">Status<select value={selected.status} onChange={(e) => void update({ status: e.target.value as EnquiryStatus })} className="mt-2 min-h-12 w-full rounded-xl bg-white px-3 ring-1 ring-slate-300">{statuses.map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}</select></label><label className="block font-semibold">Assign to<select value={selected.assignedTo ?? ''} onChange={(e) => void update({ assignedTo: e.target.value })} className="mt-2 min-h-12 w-full rounded-xl bg-white px-3 ring-1 ring-slate-300"><option value="">Unassigned</option>{assignees.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label className="block font-semibold">Resolution / staff note<textarea defaultValue={selected.resolution ?? ''} onBlur={(e) => void update({ resolution: e.target.value })} className="mt-2 min-h-28 w-full rounded-xl bg-white p-3 ring-1 ring-slate-300" placeholder="Add a resolution or note…"/></label>{selected.status === EnquiryStatus.Resolved && <p className="flex items-center gap-2 font-semibold text-teal-800"><CheckCircle2 size={20}/>This enquiry is resolved.</p>}<Button variant="secondary" className="w-full" onClick={() => setSelected(undefined)}>Close details</Button></div>}
      </aside>
    </section>
  </main></Frame>
}
