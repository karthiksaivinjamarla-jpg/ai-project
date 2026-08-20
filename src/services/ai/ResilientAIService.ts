import type { EnquiryCategory } from '../../domain/enquiry'
import type { AIService, ClassificationResult, IntentResult, SpeechToTextResult } from './AIService'
import { MockAIService } from './MockAIService'

type Operation = 'speechToText' | 'detectIntent' | 'classifyEnquiry' | 'translate' | 'generateResponse'

interface ProviderResponse {
  category?: EnquiryCategory
  department?: string
  summary?: string
  confidence?: number
  transcript?: string
  language?: string
  response?: string
  text?: string
}

const DEFAULT_TIMEOUT_MS = 6000

function clampConfidence(value: unknown, fallback = 0.5) {
  const numeric = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numeric) ? Math.min(1, Math.max(0, numeric)) : fallback
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read audio input'))
    reader.readAsDataURL(blob)
  })
}

export class ResilientAIService implements AIService {
  private readonly fallback: AIService
  private readonly timeoutMs: number

  constructor(
    private readonly endpoint = import.meta.env.VITE_AI_ENDPOINT?.trim() ?? '',
    fallback: AIService = new MockAIService(),
    timeoutMs = DEFAULT_TIMEOUT_MS,
  ) {
    this.fallback = fallback
    this.timeoutMs = timeoutMs
  }

  private async request(operation: Operation, payload: Record<string, unknown>): Promise<ProviderResponse> {
    if (!this.endpoint) throw new Error('AI provider endpoint is not configured')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), this.timeoutMs)
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, ...payload }),
        signal: controller.signal,
      })
      if (!response.ok) throw new Error(`AI provider returned ${response.status}`)
      const result: unknown = await response.json()
      if (!result || typeof result !== 'object') throw new Error('AI provider returned an invalid response')
      return result as ProviderResponse
    } finally {
      window.clearTimeout(timeout)
    }
  }

  async speechToText(audio: Blob, language: string): Promise<SpeechToTextResult> {
    try {
      const result = await this.request('speechToText', { audioBase64: await blobToBase64(audio), language })
      return { transcript: result.transcript ?? '', language: result.language ?? language }
    } catch {
      return this.fallback.speechToText(audio, language)
    }
  }

  async detectIntent(text: string, language: string): Promise<IntentResult> {
    try {
      const result = await this.request('detectIntent', { text, language })
      if (!result.category) throw new Error('AI provider omitted category')
      return { category: result.category, confidence: clampConfidence(result.confidence) }
    } catch {
      return this.fallback.detectIntent(text, language)
    }
  }

  async classifyEnquiry(text: string, language: string): Promise<ClassificationResult> {
    try {
      const result = await this.request('classifyEnquiry', { text, language })
      if (!result.category || !result.department) throw new Error('AI provider omitted classification fields')
      return {
        category: result.category,
        department: result.department,
        summary: result.summary ?? text,
        confidence: clampConfidence(result.confidence),
      }
    } catch {
      return this.fallback.classifyEnquiry(text, language)
    }
  }

  async translate(text: string, fromLanguage: string, toLanguage: string): Promise<string> {
    try {
      const result = await this.request('translate', { text, fromLanguage, toLanguage })
      return result.text ?? result.response ?? text
    } catch {
      return this.fallback.translate(text, fromLanguage, toLanguage)
    }
  }

  async generateResponse(context: string, language: string): Promise<string> {
    try {
      const result = await this.request('generateResponse', { context, language })
      return result.response ?? result.text ?? 'A staff member will review this enquiry.'
    } catch {
      return this.fallback.generateResponse(context, language)
    }
  }
}
