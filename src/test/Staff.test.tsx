import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import '../i18n'
import i18n from '../i18n'
import { App } from '../app/App'

const seededTrackingCode = 'SC-1001'

function renderStaff() { return render(<MemoryRouter initialEntries={['/staff']}><App /></MemoryRouter>) }
beforeEach(async () => { localStorage.clear(); sessionStorage.clear(); await i18n.changeLanguage('en'); document.documentElement.lang = 'en' })

describe('staff enquiry dashboard', () => {
  it('loads seeded enquiries and filters by status', async () => {
    const user = userEvent.setup()
    renderStaff()
    expect(await screen.findByRole('heading', { name: 'Enquiry management' })).toBeInTheDocument()
    expect(screen.getByText(seededTrackingCode)).toBeInTheDocument()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter status' }), 'RESOLVED')
    await waitFor(() => expect(screen.queryByText(seededTrackingCode)).not.toBeInTheDocument())
  })

  it('filters enquiries by priority and department', async () => {
    const user = userEvent.setup()
    renderStaff()
    await screen.findByText(seededTrackingCode)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter priority' }), 'HIGH')
    await waitFor(() => expect(screen.queryByText(seededTrackingCode)).not.toBeInTheDocument())
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter priority' }), 'NORMAL')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter department' }), 'CARDIOLOGY')
    expect(screen.getByText(seededTrackingCode)).toBeInTheDocument()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter department' }), 'BILLING')
    await waitFor(() => expect(screen.queryByText(seededTrackingCode)).not.toBeInTheDocument())
  })

  it('updates priority from enquiry details and records activity', async () => {
    const user = userEvent.setup()
    renderStaff()
    await user.click(await screen.findByText(seededTrackingCode))
    const priority = screen.getByRole('combobox', { name: 'Priority' })
    expect(priority).toHaveValue('NORMAL')
    await user.selectOptions(priority, 'HIGH')
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Priority' })).toHaveValue('HIGH'))
    expect(screen.getByText('priority:HIGH')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem('sevacare.enquiries') ?? '[]')
    expect(stored.find((item: { trackingCode: string }) => item.trackingCode === seededTrackingCode)).toMatchObject({ priority: 'HIGH' })
  })

  it('updates assignment and status from enquiry details', async () => {
    const user = userEvent.setup()
    renderStaff()
    await user.click(await screen.findByText(seededTrackingCode))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'ASSIGNED')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Assign to' }), 'Appointments')
    await waitFor(() => expect(screen.getByText('Appointments')).toBeInTheDocument())
    const stored = JSON.parse(localStorage.getItem('sevacare.enquiries') ?? '[]')
    expect(stored.find((item: { trackingCode: string }) => item.trackingCode === seededTrackingCode)).toMatchObject({ status: 'ASSIGNED', assignedTo: 'Appointments' })
  })
})
