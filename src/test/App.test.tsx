import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '../i18n'
import { App } from '../app/App'

describe('application foundation', () => {
  it('renders the localized foundation page', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'How can we help?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'తెలుగు' })).toBeInTheDocument()
  })
})
