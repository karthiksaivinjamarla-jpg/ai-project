import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import '../i18n'
import i18n from '../i18n'
import { App } from '../app/App'

function renderStaff() { return render(<MemoryRouter initialEntries={['/staff']}><App /></MemoryRouter>) }

beforeEach(async () => { localStorage.clear(); sessionStorage.clear(); await i18n.changeLanguage('en'); document.documentElement.lang = 'en' })

describe('staff enquiry dashboard', () => {
  it('loads seeded enquiries and filters by status', async () => {
    renderStaff()
    expect(await screen.findByRole('heading', { name: 'Enquiry management' })).toBeInTheDocument()
    expect(screen.getByText('SC-DEMO-0001')).toBeInTheDocument()
    await userEvent.setup().selectOptions(screen.getByRole('combobox', { name: 'Filter status' }), 'RESOLVED')
    await waitFor(() => expect(screen.queryByText('SC-DEMO-0001')).not.toBeInTheDocument())
  })

  it('updates assignment and status from enquiry details', async () => {
    const user = userEvent.setup()
    renderStaff()
    await user.click(await screen.findByText('SC-DEMO-0001'))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'ASSIGNED')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Assign to' }), 'Appointments')
    await waitFor(() => expect(screen.getByText('Appointments')).toBeInTheDocument())
    const stored = JSON.parse(localStorage.getItem('sevacare.enquiries') ?? '[]')
    expect(stored.find((item: { trackingCode: string }) => item.trackingCode === 'SC-DEMO-0001')).toMatchObject({ status: 'ASSIGNED', assignedTo: 'Appointments' })
  })
})
