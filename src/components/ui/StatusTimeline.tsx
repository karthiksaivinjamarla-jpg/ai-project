import { Check, Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EnquiryStatus } from '../../domain/enquiry'
const statuses = [EnquiryStatus.New, EnquiryStatus.Assigned, EnquiryStatus.InProgress, EnquiryStatus.Waiting, EnquiryStatus.Resolved]

export function StatusTimeline({ current, updates = [] }: { current: EnquiryStatus; updates?: Array<{ status: EnquiryStatus; message: string; createdAt: string }> }) {
  const { t } = useTranslation()
  const active = statuses.indexOf(current)
  const latestByStatus = new Map(updates.map((update) => [update.status, update]))
  return <ol className="space-y-3">{statuses.map((status, index) => {
    const update = latestByStatus.get(status)
    return <li key={status} className="flex items-start gap-3"><span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${index <= active ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'}`} aria-hidden="true">{index < active ? <Check size={16} /> : <Circle size={12} />}</span><div><span className={index === active ? 'font-bold text-slate-950' : 'text-slate-700'}>{t(`status.${status}`)}</span>{index === active && <span className="ml-2 text-sm text-teal-800">{t('track.current')}</span>}{update && <p className="text-xs text-slate-500">{new Date(update.createdAt).toLocaleString()}</p>}</div></li>
  })}</ol>
}
