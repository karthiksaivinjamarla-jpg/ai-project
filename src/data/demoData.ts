import { EnquiryCategory, EnquirySource, EnquiryStatus, type Enquiry, type Patient } from '../domain/enquiry'

export const demoPatients: Patient[] = [
  { id: 'patient-1', name: 'Ananya', phone: '9000000001', preferredLanguage: 'te' },
  { id: 'patient-2', name: 'Ravi', phone: '9000000002', preferredLanguage: 'hi' },
]

export const demoEnquiries: Enquiry[] = [
  { id: 'enquiry-1', trackingCode: 'SC-1001', patientId: 'patient-1', category: EnquiryCategory.Appointment, description: 'Need an appointment.', detectedLanguage: 'te', department: 'General Medicine', status: EnquiryStatus.New, priority: 'NORMAL', source: EnquirySource.Voice, createdAt: '2026-08-17T09:00:00.000Z' },
]
