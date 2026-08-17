import type { EnquiryCategory } from '../../domain/enquiry'

export interface SpeechToTextResult { transcript: string; language: string }
export interface IntentResult { category: EnquiryCategory; confidence: number }
export interface ClassificationResult { category: EnquiryCategory; department: string; confidence: number }

export interface AIService {
  speechToText(audio: Blob, language: string): Promise<SpeechToTextResult>
  detectIntent(text: string, language: string): Promise<IntentResult>
  classifyEnquiry(text: string, language: string): Promise<ClassificationResult>
  translate(text: string, fromLanguage: string, toLanguage: string): Promise<string>
  generateResponse(context: string, language: string): Promise<string>
}
