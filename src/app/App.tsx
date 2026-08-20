import { Navigate, Route, Routes } from 'react-router-dom'
import { PatientProvider } from './PatientContext'
import { StaffAccessProvider } from './StaffAccessContext'
import { AppErrorBoundary } from '../components/layout/AppErrorBoundary'
import { RequireStaffAccess } from '../components/layout/RequireStaffAccess'
import { WelcomePage, HomePage, EnquiryPage, ReviewPage, SuccessPage, TrackPage } from '../pages/PatientPages'
import { StaffAuthPage } from '../pages/StaffAuthPage'
import { StaffDashboardPage } from '../pages/StaffPages'

export function App() {
  return (
    <AppErrorBoundary>
      <StaffAccessProvider>
        <PatientProvider><Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/enquiry/:category" element={<EnquiryPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/success/:trackingCode" element={<SuccessPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/staff/login" element={<StaffAuthPage />} />
          <Route path="/staff" element={<RequireStaffAccess><StaffDashboardPage /></RequireStaffAccess>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes></PatientProvider>
      </StaffAccessProvider>
    </AppErrorBoundary>
  )
}
