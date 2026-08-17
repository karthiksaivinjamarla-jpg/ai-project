export enum EnquiryCategory {
  Appointment = 'APPOINTMENT',
  Department = 'DEPARTMENT',
  Billing = 'BILLING',
  Other = 'OTHER',
}

export enum EnquiryStatus {
  New = 'NEW',
  Assigned = 'ASSIGNED',
  InProgress = 'IN_PROGRESS',
  Waiting = 'WAITING',
  Resolved = 'RESOLVED',
}

export enum EnquirySource {
  Typed = 'TYPED',
  Voice = 'VOICE',
  Staff = 'STAFF',
}

export interface Patient {
  id: string
  name: string
  phone: string
  preferredLanguage: string
}

export interface Enquiry {
  id: string
  trackingCode: string
  patientId: string
  category: EnquiryCategory
  description: string
  detectedLanguage: string
  department?: string
  status: EnquiryStatus
  priority: 'LOW' | 'NORMAL' | 'HIGH'
  source: EnquirySource
  createdAt: string
  assignedTo?: string
  resolution?: string
  aiSuggestion?: { category: EnquiryCategory; department: string; summary: string; confidence: number }
  aiSuggestionConfirmed?: boolean
  updates?: Array<{ status: EnquiryStatus; message: string; createdAt: string }>
}
