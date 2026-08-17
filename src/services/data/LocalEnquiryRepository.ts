import type { Enquiry, Patient } from '../../domain/enquiry'
import type { EnquiryRepository } from './EnquiryRepository'

export class LocalEnquiryRepository implements EnquiryRepository {
  constructor(private readonly patients: Patient[], private enquiries: Enquiry[]) {}
  async getPatient(id: string) { return this.patients.find((patient) => patient.id === id) }
  async getEnquiry(id: string) { return this.enquiries.find((enquiry) => enquiry.id === id) }
  async findEnquiryByTrackingCode(trackingCode: string) { return this.enquiries.find((enquiry) => enquiry.trackingCode === trackingCode) }
  async listEnquiries() { return [...this.enquiries] }
  async saveEnquiry(enquiry: Enquiry) { const index = this.enquiries.findIndex((item) => item.id === enquiry.id); if (index >= 0) this.enquiries[index] = enquiry; else this.enquiries = [...this.enquiries, enquiry]; return enquiry }
}
