import { EnquiryCategory, type EnquiryCategory as EnquiryCategoryType } from '../../domain/enquiry'
import type { AIService, ClassificationResult, IntentResult, SpeechToTextResult } from './AIService'

const categoryKeywords: Record<EnquiryCategoryType, string[]> = {
  [EnquiryCategory.Appointment]: ['appointment', 'doctor', 'visit', 'వైద్యుడ', 'డాక్టర్', 'डॉक्टर', 'मिलना'],
  [EnquiryCategory.Department]: ['department', 'specialist', 'clinic'],
  [EnquiryCategory.Billing]: ['bill', 'billing', 'payment'],
  [EnquiryCategory.Other]: [],
}

function inferCategory(text: string): EnquiryCategoryType {
  const normalized = text.toLowerCase()
  return (Object.entries(categoryKeywords).find(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))?.[0] as EnquiryCategoryType | undefined) ?? EnquiryCategory.Other
}

export class MockAIService implements AIService {
  async speechToText(_audio: Blob, language: string): Promise<SpeechToTextResult> { return { transcript: '', language } }
  async detectIntent(text: string, _language: string): Promise<IntentResult> { return { category: inferCategory(text), confidence: 0.7 } }
  async classifyEnquiry(text: string, _language: string): Promise<ClassificationResult> { const category = inferCategory(text); const department = /heart|గుండె|दिल/i.test(text) ? 'CARDIOLOGY' : category === EnquiryCategory.Billing ? 'BILLING' : category === EnquiryCategory.Appointment ? 'GENERAL_MEDICINE' : 'FRONT_DESK'; return { category, department, summary: text, confidence: 0.7 } }
  async translate(text: string, _fromLanguage: string, _toLanguage: string): Promise<string> { return text }
  async generateResponse(_context: string, _language: string): Promise<string> { return 'A staff member will review this enquiry.' }
}
