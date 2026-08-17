import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'
import type { PatientDraft } from '../application/PatientEnquiryService'
import { PatientEnquiryService } from '../application/PatientEnquiryService'
import { demoEnquiries, demoPatients } from '../data/demoData'
import { MockAIService } from '../services/ai'
import { BrowserEnquiryRepository } from '../services/data'

const service = new PatientEnquiryService(new BrowserEnquiryRepository(demoPatients, demoEnquiries), new MockAIService())
const Context = createContext<{ draft?: PatientDraft; setDraft: (draft?: PatientDraft) => void; service: PatientEnquiryService }>({ draft: undefined, setDraft: () => undefined, service })
export function PatientProvider({ children }: PropsWithChildren) { const [draft, setDraft] = useState<PatientDraft>(); const value = useMemo(() => ({ draft, setDraft, service }), [draft]); return <Context.Provider value={value}>{children}</Context.Provider> }
export const usePatient = () => useContext(Context)
