import type { Enquiry, Patient } from '../../domain/enquiry'
import type { EnquiryRepository } from './EnquiryRepository'

const key = 'sevacare.enquiries'
export class BrowserEnquiryRepository implements EnquiryRepository {
  constructor(private readonly patients: Patient[], private readonly seed: Enquiry[]) {}
  private read(): Enquiry[] { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as Enquiry[] : this.seed }
  private write(enquiries: Enquiry[]) { localStorage.setItem(key, JSON.stringify(enquiries)) }
  async getPatient(id: string) { return this.patients.find((patient) => patient.id === id) }
  async getEnquiry(id: string) { return this.read().find((enquiry) => enquiry.id === id) }
  async findEnquiryByTrackingCode(trackingCode: string) { return this.read().find((enquiry) => enquiry.trackingCode.toUpperCase() === trackingCode.trim().toUpperCase()) }
  async listEnquiries() { return this.read() }
  async saveEnquiry(enquiry: Enquiry) { const enquiries = this.read(); const index = enquiries.findIndex((item) => item.id === enquiry.id); if (index >= 0) enquiries[index] = enquiry; else enquiries.unshift(enquiry); this.write(enquiries); return enquiry }
}
