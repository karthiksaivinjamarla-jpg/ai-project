import type { Enquiry, Patient } from '../../domain/enquiry'
import type { EnquiryRepository } from './EnquiryRepository'

const key = 'sevacare.enquiries'

function isEnquiry(value: unknown): value is Enquiry {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<Enquiry>
  return typeof item.id === 'string'
    && typeof item.trackingCode === 'string'
    && typeof item.patientId === 'string'
    && typeof item.category === 'string'
    && typeof item.description === 'string'
    && typeof item.detectedLanguage === 'string'
    && typeof item.status === 'string'
    && typeof item.priority === 'string'
    && typeof item.source === 'string'
    && typeof item.createdAt === 'string'
}

export class BrowserEnquiryRepository implements EnquiryRepository {
  constructor(private readonly patients: Patient[], private readonly seed: Enquiry[]) {}

  private seedStorage(): Enquiry[] {
    const seeded = [...this.seed]
    this.write(seeded)
    return seeded
  }

  private read(): Enquiry[] {
    let raw: string | null
    try {
      raw = localStorage.getItem(key)
    } catch {
      return [...this.seed]
    }

    if (!raw) return this.seedStorage()

    try {
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return this.seedStorage()

      const valid = parsed.filter(isEnquiry)
      if (valid.length !== parsed.length) return this.seedStorage()
      return valid
    } catch {
      return this.seedStorage()
    }
  }

  private write(enquiries: Enquiry[]) {
    try {
      localStorage.setItem(key, JSON.stringify(enquiries))
    } catch {
      // Keep the in-memory workflow usable if browser storage is unavailable
      // (for example private browsing or storage quota exhaustion).
    }
  }

  async getPatient(id: string) { return this.patients.find((patient) => patient.id === id) }
  async getEnquiry(id: string) { return this.read().find((enquiry) => enquiry.id === id) }
  async findEnquiryByTrackingCode(trackingCode: string) { return this.read().find((enquiry) => enquiry.trackingCode.toUpperCase() === trackingCode.trim().toUpperCase()) }
  async listEnquiries() { return this.read() }
  async saveEnquiry(enquiry: Enquiry) {
    const enquiries = this.read()
    const index = enquiries.findIndex((item) => item.id === enquiry.id)
    if (index >= 0) enquiries[index] = enquiry
    else enquiries.unshift(enquiry)
    this.write(enquiries)
    return enquiry
  }
}
