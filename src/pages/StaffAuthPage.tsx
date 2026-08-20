import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useStaffAccess } from '../app/StaffAccessContext'
import { AppShell } from '../components/layout/AppShell'
import { Button } from '../components/ui/Button'

export function StaffAuthPage() {
  const navigate = useNavigate()
  const { role, signInDemoStaff } = useStaffAccess()

  const continueToDashboard = () => {
    signInDemoStaff()
    navigate('/staff', { replace: true })
  }

  return <AppShell><main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-10">
    <section className="w-full rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9">
      <button onClick={() => navigate('/home')} className="mb-8 inline-flex min-h-11 items-center gap-2 font-semibold text-teal-800"><ArrowLeft size={20}/>Patient view</button>
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-800"><ShieldCheck size={30}/></div>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Staff access</p>
      <h1 className="mt-2 text-3xl font-bold">Enquiry management</h1>
      <p className="mt-3 text-slate-600">The staff dashboard is separated from the patient experience. Your staff session is kept only for this browser session.</p>
      {role === 'STAFF' && <p role="status" className="mt-4 rounded-xl bg-teal-50 p-3 text-sm font-semibold text-teal-800">Staff session is active.</p>}
      <Button className="mt-6 w-full" onClick={continueToDashboard}>Continue as demo staff</Button>
      <p className="mt-4 text-xs text-slate-500">Demo access is a development boundary, not production authentication. Replace this session adapter with the real identity provider before deployment.</p>
    </section>
  </main></AppShell>
}
