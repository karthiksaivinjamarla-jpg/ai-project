import { Check, Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EnquiryStatus } from '../../domain/enquiry'
const statuses = [EnquiryStatus.New, EnquiryStatus.Assigned, EnquiryStatus.InProgress, EnquiryStatus.Waiting, EnquiryStatus.Resolved]
export function StatusTimeline({ current }: { current: EnquiryStatus }) { const { t } = useTranslation(); const active = statuses.indexOf(current); return <ol className="space-y-3">{statuses.map((status, index) => <li key={status} className="flex items-center gap-3"><span className={`grid size-7 place-items-center rounded-full ${index <= active ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'}`} aria-hidden="true">{index < active ? <Check size={16} /> : <Circle size={12} />}</span><span className={index === active ? 'font-bold text-slate-950' : 'text-slate-700'}>{t(`status.${status}`)}</span>{index === active && <span className="text-sm text-teal-800">{t('track.current')}</span>}</li>)}</ol> }
