import { en } from './en'

export const hi = {
  translation: {
    ...en.translation,
    common: { back: 'वापस', continue: 'आगे बढ़ें' },
    welcome: { title: 'हम कैसे मदद कर सकते हैं?', subtitle: 'अपनी भाषा चुनें', chooseLanguage: 'भाषा चुनें' },
    home: { title: 'हम कैसे मदद कर सकते हैं?', subtitle: 'एक विकल्प चुनें।', track: 'ट्रैक करें' },
    enquiry: {
      prompt: 'हमें बताएं कि आपको क्या चाहिए।',
      placeholder: 'यहाँ टाइप करें',
      required: 'कृपया बताएं कि आपको क्या चाहिए।',
      title: { APPOINTMENT: 'अपॉइंटमेंट', DEPARTMENT: 'विभाग', BILLING: 'बिलिंग', OTHER: 'अन्य' },
    },
    voice: {
      button: 'बोलकर बताएं',
      unavailable: 'इस डिवाइस पर वॉइस इनपुट उपलब्ध नहीं है।',
      failed: 'हम आपकी बात सुन नहीं पाए।',
      fallback: 'कृपया अपना अनुरोध टाइप करें।',
    },
    review: {
      title: 'हम समझ गए', thinking: 'आपके अनुरोध को समझ रहे हैं…', understood: 'आपका अनुरोध',
      category: 'श्रेणी', department: 'विभाग', confirm: 'पुष्टि करें', submitting: 'भेजा जा रहा है…',
      change: 'बदलें', submitError: 'हम आपकी पूछताछ भेज नहीं सके। कृपया फिर कोशिश करें।',
    },
    success: { title: 'पूछताछ प्राप्त हुई', message: 'यह ट्रैकिंग कोड संभालकर रखें।', track: 'पूछताछ ट्रैक करें', another: 'नई पूछताछ शुरू करें' },
    track: {
      title: 'पूछताछ ट्रैक करें', code: 'ट्रैकिंग कोड', find: 'खोजें',
      notFound: 'हमें वह पूछताछ नहीं मिली।', error: 'पूछताछ लोड नहीं हो सकी। कृपया फिर कोशिश करें।',
      category: 'श्रेणी', request: 'आपका अनुरोध', current: 'वर्तमान स्थिति',
    },
    category: { APPOINTMENT: 'अपॉइंटमेंट', DEPARTMENT: 'विभाग', BILLING: 'बिलिंग', OTHER: 'अन्य' },
    department: { CARDIOLOGY: 'कार्डियोलॉजी', GENERAL_MEDICINE: 'सामान्य चिकित्सा', BILLING: 'बिलिंग', FRONT_DESK: 'फ्रंट डेस्क' },
    status: { NEW: 'प्राप्त हुआ', ASSIGNED: 'सौंपा गया', IN_PROGRESS: 'प्रगति में', WAITING: 'प्रतीक्षा में', RESOLVED: 'समाधान हो गया' },
  },
}
