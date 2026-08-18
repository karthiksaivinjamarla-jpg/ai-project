import { EnquirySource, EnquiryStatus, type Enquiry, type EnquiryCategory } from '../domain/enquiry'
import type { AIService, ClassificationResult } from '../services/ai'
import type { EnquiryRepository } from '../services/data'

export interface PatientDraft { category: EnquiryCategory; description: string; source: EnquirySource }

const allowedTransitions: Record<EnquiryStatus, EnquiryStatus[]> = {
  [EnquiryStatus.New]: [EnquiryStatus.Assigned, EnquiryStatus.InProgress, EnquiryStatus.Waiting],
  [EnquiryStatus.Assigned]: [EnquiryStatus.InProgress, EnquiryStatus.Waiting],
  [EnquiryStatus.InProgress]: [EnquiryStatus.Waiting, EnquiryStatus.Resolved],
  [EnquiryStatus.Waiting]: [EnquiryStatus.InProgress, EnquiryStatus.Resolved],
  [EnquiryStatus.Resolved]: [],
}

export class PatientEnquiryService {
  constructor(private readonly repository: EnquiryRepository, private readonly ai: AIService) {}
  async interpret(draft: PatientDraft, language: string): Promise<ClassificationResult> { return this.ai.classifyEnquiry(draft.description, language) }
  async findByTrackingCode(code: string) { return this.repository.findEnquiryByTrackingCode(code) }
  async listEnquiries() { return this.repository.listEnquiries() }
  async updateEnquiry(enquiry: Enquiry, changes: { status?: EnquiryStatus; assignedTo?: string; resolution?: string }): Promise<Enquiry> {
    const now = new Date().toISOString()
    const nextStatus = changes.status ?? enquiry.status
    const statusChanged = nextStatus !== enquiry.status
    if (statusChanged && !allowedTransitions[enquiry.status].includes(nextStatus)) {
      throw new Error(`Invalid enquiry status transition: ${enquiry.status} -> ${nextStatus}`)
    }
    if (nextStatus === EnquiryStatus.Resolved && !(changes.resolution ?? enquiry.resolution)?.trim()) {
      throw new Error('A resolution note is required before resolving an enquiry')
    }
    const updates = [...(enquiry.updates ?? [])]
    if (statusChanged) updates.push({ status: nextStatus, message: `status:${nextStatus}`, createdAt: now })
    if (changes.assignedTo !== undefined && changes.assignedTo !== enquiry.assignedTo) {
      updates.push({ status: nextStatus, message: `assigned:${changes.assignedTo || 'unassigned'}`, createdAt: now })
    }
    if (changes.resolution !== undefined && changes.resolution !== enquiry.resolution && changes.resolution.trim()) {
      updates.push({ status: nextStatus, message: 'resolution:updated', createdAt: now })
    }
    return this.repository.saveEnquiry({
      ...enquiry,
      status: nextStatus,
      assignedTo: changes.assignedTo === undefined ? enquiry.assignedTo : changes.assignedTo || undefined,
      resolution: changes.resolution === undefined ? enquiry.resolution : changes.resolution || undefined,
      updates,
    })
  }
  async submit(draft: PatientDraft, suggestion: ClassificationResult, confirmedCategory: EnquiryCategory, department: string, language: string): Promise<Enquiry> {
    const now = new Date().toISOString()
    const enquiry: Enquiry = { id: crypto.randomUUID(), trackingCode: `SC-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`, patientId: 'patient-demo', category: confirmedCategory, description: draft.description, detectedLanguage: language, department, status: EnquiryStatus.New, priority: 'NORMAL', source: draft.source, createdAt: now, aiSuggestion: { ...suggestion }, aiSuggestionConfirmed: confirmedCategory === suggestion.category && department === suggestion.department, updates: [{ status: EnquiryStatus.New, message: 'received', createdAt: now }] }
    return this.repository.saveEnquiry(enquiry)
  }
}
