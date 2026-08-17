import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import '../i18n'
import i18n from '../i18n'
import { App } from '../app/App'

function renderApp() { return render(<MemoryRouter><App /></MemoryRouter>) }
async function begin(language: 'English' | 'తెలుగు' | 'हिन्दी') { const user = userEvent.setup(); renderApp(); await user.click(screen.getByRole('button', { name: language })); return user }
beforeEach(async () => { localStorage.clear(); sessionStorage.clear(); await i18n.changeLanguage('en'); document.documentElement.lang = 'en' })

describe('patient enquiry experience', () => {
  it('completes the Telugu golden flow and shows tracking status', async () => {
    const user = await begin('తెలుగు')
    expect(document.documentElement.lang).toBe('te')
    await user.click(await screen.findByRole('link', { name: 'అపాయింట్‌మెంట్' }))
    await user.type(screen.getByRole('textbox', { name: 'మీకు ఏమి కావాలో చెప్పండి.' }), 'నాకు గుండె వైద్యుడిని కలవాలి')
    await user.click(screen.getByRole('button', { name: 'కొనసాగించండి' }))
    await screen.findByText('కార్డియాలజీ')
    const selects = await screen.findAllByRole('combobox')
    expect(selects[1]).toHaveValue('CARDIOLOGY')
    await user.click(screen.getByRole('button', { name: 'నిర్ధారించండి' }))
    const code = (await screen.findByText(/SC-/)).textContent!
    await user.click(screen.getByRole('button', { name: 'విచారణను ట్రాక్ చేయండి' }))
    expect(await screen.findByText(code)).toBeInTheDocument()
    expect(screen.getByText('స్వీకరించబడింది')).toBeInTheDocument()
    expect(localStorage.getItem('sevacare.enquiries')).toContain(code)
  })
  it('completes the Hindi flow without English fallback text', async () => {
    const user = await begin('हिन्दी')
    expect(document.documentElement.lang).toBe('hi')
    await user.click(await screen.findByRole('link', { name: 'अपॉइंटमेंट' }))
    await user.type(screen.getByRole('textbox', { name: 'हमें बताएं कि आपको क्या चाहिए।' }), 'मुझे हृदय रोग के डॉक्टर से मिलना है')
    await user.click(screen.getByRole('button', { name: 'आगे बढ़ें' }))
    await screen.findByText('कार्डियोलॉजी')
    const selects = await screen.findAllByRole('combobox')
    expect(selects[1]).toHaveValue('CARDIOLOGY')
    expect(screen.getByRole('button', { name: 'पुष्टि करें' })).toBeInTheDocument()
  })
  it('allows an AI suggestion to be changed before submission', async () => {
    const user = await begin('English')
    await user.click(await screen.findByRole('link', { name: 'Appointment' }))
    await user.type(screen.getByRole('textbox'), 'I need a heart doctor')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    const selects = await screen.findAllByRole('combobox')
    await user.selectOptions(selects[0], 'BILLING')
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    const code = (await screen.findByText(/SC-/)).textContent!
    await user.click(screen.getByRole('button', { name: 'Track enquiry' }))
    expect(await screen.findByText('Billing')).toBeInTheDocument()
    expect(localStorage.getItem('sevacare.enquiries')).toContain('"aiSuggestionConfirmed":false')
    expect(code).toMatch(/^SC-/)
  })
  it('keeps typed input available when voice is unavailable and validates empty input', async () => {
    const user = await begin('English')
    await user.click(await screen.findByRole('link', { name: 'Other' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Please tell us what you need.')
    await user.click(screen.getByRole('button', { name: 'Speak instead' }))
    expect(screen.getByRole('status')).toHaveTextContent('Voice input is unavailable')
    await user.type(screen.getByRole('textbox'), 'Please call me')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'We understood' })).toBeInTheDocument())
  })
})
