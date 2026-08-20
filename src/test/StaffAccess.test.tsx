import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import '../i18n'
import { App } from '../app/App'

function renderApp(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

beforeEach(() => {
  sessionStorage.clear()
})

describe('staff access boundary', () => {
  it('redirects unauthenticated staff access to the staff sign-in screen', async () => {
    renderApp('/staff')
    expect(await screen.findByRole('heading', { name: 'Enquiry management' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue as demo staff' })).toBeInTheDocument()
    expect(screen.queryByText('Review, assign and update patient enquiries.')).not.toBeInTheDocument()
  })

  it('creates a session and opens the protected staff dashboard', async () => {
    const user = userEvent.setup()
    renderApp('/staff/login')
    await user.click(screen.getByRole('button', { name: 'Continue as demo staff' }))
    expect(await screen.findByText('Review, assign and update patient enquiries.')).toBeInTheDocument()
    expect(sessionStorage.getItem('sevacare.staff.role')).toBe('STAFF')
  })
})
