import { EnquiryCategory, EnquirySource, EnquiryStatus, type Enquiry, type Patient } from '../domain/enquiry'

export const demoPatients: Patient[] = [
  { id: 'patient-1', name: 'Ananya', phone: '9000000001', preferredLanguage: 'te' },
  { id: 'patient-2', name: 'Ravi', phone: '9000000002', preferredLanguage: 'hi' },
]

export const demoEnquiries: Enquiry[] = [
  { id: 'enquiry-1', trackingCode: 'SC-1001', patientId: 'patient-1', category: EnquiryCategory.Appointment, description: 'నాకు గుండె వైద్యుడిని కలవాలి', detectedLanguage: 'te', department: 'CARDIOLOGY', status: EnquiryStatus.New, priority: 'NORMAL', source: EnquirySource.Voice, createdAt: '2026-08-17T09:00:00.000Z', updates: [{ status: EnquiryStatus.New, message: 'received', createdAt: '2026-08-17T09:00:00.000Z' }] },
  { id: 'enquiry-2', trackingCode: 'SC-1002', patientId: 'patient-2', category: EnquiryCategory.Billing, description: 'मुझे बिल के बारे में पूछना है', detectedLanguage: 'hi', department: 'BILLING', status: EnquiryStatus.Waiting, priority: 'NORMAL', source: EnquirySource.Typed, createdAt: '2026-08-16T09:00:00.000Z', updates: [{ status: EnquiryStatus.Waiting, message: 'waiting', createdAt: '2026-08-16T10:00:00.000Z' }] },
]
