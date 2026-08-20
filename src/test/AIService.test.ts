import { describe, expect, it, vi } from 'vitest'
import { EnquiryCategory } from '../domain/enquiry'
import { MockAIService, ResilientAIService } from '../services/ai'

describe('resilient AI service', () => {
  it('uses the local mock when no provider endpoint is configured', async () => {
    const service = new ResilientAIService('', new MockAIService())
    await expect(service.classifyEnquiry('I need a heart doctor', 'en')).resolves.toMatchObject({
      category: EnquiryCategory.Appointment,
      department: 'CARDIOLOGY',
      confidence: 0.7,
    })
  })

  it('normalizes a provider classification response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      category: EnquiryCategory.Billing,
      department: 'BILLING',
      summary: 'Payment question',
      confidence: 1.4,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.stubGlobal('fetch', fetchMock)

    const service = new ResilientAIService('https://ai.example.test', new MockAIService())
    await expect(service.classifyEnquiry('I have a payment question', 'en')).resolves.toEqual({
      category: EnquiryCategory.Billing,
      department: 'BILLING',
      summary: 'Payment question',
      confidence: 1,
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: 'POST' })
    vi.unstubAllGlobals()
  })

  it('falls back when the provider fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'))
    vi.stubGlobal('fetch', fetchMock)

    const service = new ResilientAIService('https://ai.example.test', new MockAIService())
    await expect(service.classifyEnquiry('I need a heart doctor', 'en')).resolves.toMatchObject({
      category: EnquiryCategory.Appointment,
      department: 'CARDIOLOGY',
    })
    vi.unstubAllGlobals()
  })
})
