import { EnquirySource, EnquiryStatus, type Enquiry, type EnquiryCategory } from '../domain/enquiry'
import type { AIService, ClassificationResult } from '../services/ai'
import type { EnquiryRepository } from '../services/data'

export interface PatientDraft { category: EnquiryCategory; description: string; source: EnquirySource }

export class PatientEnquiryService {
  constructor(private readonly repository: EnquiryRepository, private readonly ai: AIService) {}
  async interpret(draft: PatientDraft, language: string): Promise<ClassificationResult> { return this.ai.classifyEnquiry(draft.description, language) }
  async findByTrackingCode(code: string) { return this.repository.findEnquiryByTrackingCode(code) }
  async submit(draft: PatientDraft, suggestion: ClassificationResult, confirmedCategory: EnquiryCategory, department: string, language: string): Promise<Enquiry> {
    const now = new Date().toISOString()
    const enquiry: Enquiry = { id: crypto.randomUUID(), trackingCode: `SC-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`, patientId: 'patient-demo', category: confirmedCategory, description: draft.description, detectedLanguage: language, department, status: EnquiryStatus.New, priority: 'NORMAL', source: draft.source, createdAt: now, aiSuggestion: { ...suggestion }, aiSuggestionConfirmed: confirmedCategory === suggestion.category && department === suggestion.department, updates: [{ status: EnquiryStatus.New, message: 'received', createdAt: now }] }
    return this.repository.saveEnquiry(enquiry)
  }
}
