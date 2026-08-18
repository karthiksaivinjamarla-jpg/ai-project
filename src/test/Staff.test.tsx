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

  it('updates assignment and status from enquiry details', async () => {
    const user = userEvent.setup()
    renderStaff()
    await user.click(await screen.findByText(seededTrackingCode))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'ASSIGNED')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Assign to' }), 'Appointments')
    await waitFor(() => expect(screen.getByText('Appointments')).toBeInTheDocument())
    const stored = JSON.parse(localStorage.getItem('sevacare.enquiries') ?? '[]')
    expect(stored.find((item: { trackingCode: string }) => item.trackingCode === seededTrackingCode)).toMatchObject({ status: 'ASSIGNED', assignedTo: 'Appointments' })
    const enquiry = stored.find((item: { trackingCode: string }) => item.trackingCode === seededTrackingCode)
    expect(enquiry.updates.some((item: { message: string }) => item.message === 'status:ASSIGNED')).toBe(true)
    expect(enquiry.updates.some((item: { message: string }) => item.message === 'assigned:Appointments')).toBe(true)
  })

  it('blocks resolving without a resolution note and allows resolution after adding one', async () => {
    const user = userEvent.setup()
    renderStaff()
    await user.click(await screen.findByText(seededTrackingCode))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'RESOLVED')
    expect(await screen.findByRole('alert')).toHaveTextContent('resolution note is required')
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('NEW')

    const note = screen.getByPlaceholderText('Add a resolution or note…')
    await user.type(note, 'Patient was given the cardiology appointment details.')
    await user.tab()
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('NEW'))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'ASSIGNED')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'IN_PROGRESS')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'RESOLVED')
    await waitFor(() => expect(screen.getByText('This enquiry is resolved.')).toBeInTheDocument())

    const stored = JSON.parse(localStorage.getItem('sevacare.enquiries') ?? '[]')
    const enquiry = stored.find((item: { trackingCode: string }) => item.trackingCode === seededTrackingCode)
    expect(enquiry).toMatchObject({ status: 'RESOLVED', resolution: 'Patient was given the cardiology appointment details.' })
    expect(enquiry.updates.some((item: { message: string }) => item.message === 'resolution:updated')).toBe(true)
  })

  it('rejects an invalid status jump without changing the stored enquiry', async () => {
    const user = userEvent.setup()
    renderStaff()
    await user.click(await screen.findByText(seededTrackingCode))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'RESOLVED')
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid enquiry status transition')
    const stored = JSON.parse(localStorage.getItem('sevacare.enquiries') ?? '[]')
    expect(stored.find((item: { trackingCode: string }) => item.trackingCode === seededTrackingCode).status).toBe('NEW')
  })
})
