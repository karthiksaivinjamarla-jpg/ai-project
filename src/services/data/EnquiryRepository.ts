import type { Enquiry, Patient } from '../../domain/enquiry'

export interface EnquiryRepository {
  getPatient(id: string): Promise<Patient | undefined>
  getEnquiry(id: string): Promise<Enquiry | undefined>
  findEnquiryByTrackingCode(trackingCode: string): Promise<Enquiry | undefined>
  listEnquiries(): Promise<Enquiry[]>
  saveEnquiry(enquiry: Enquiry): Promise<Enquiry>
}
