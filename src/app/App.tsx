import { Navigate, Route, Routes } from 'react-router-dom'
import { FoundationPage } from '../pages/FoundationPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<FoundationPage audience="patient" />} />
      <Route path="/staff" element={<FoundationPage audience="staff" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
