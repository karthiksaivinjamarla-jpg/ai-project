import { Navigate, Route, Routes } from 'react-router-dom'
import { PatientProvider } from './PatientContext'
import { WelcomePage, HomePage, EnquiryPage, ReviewPage, SuccessPage, TrackPage } from '../pages/PatientPages'
import { StaffDashboardPage } from '../pages/StaffPages'

export function App() {
  return (
    <PatientProvider><Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/enquiry/:category" element={<EnquiryPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/success/:trackingCode" element={<SuccessPage />} />
      <Route path="/track" element={<TrackPage />} />
      <Route path="/staff" element={<StaffDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></PatientProvider>
  )
}
