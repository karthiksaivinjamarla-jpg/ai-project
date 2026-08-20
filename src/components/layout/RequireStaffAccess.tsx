import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useStaffAccess } from '../../app/StaffAccessContext'

export function RequireStaffAccess({ children }: { children: ReactNode }) {
  const { role } = useStaffAccess()
  return role === 'STAFF' ? <>{children}</> : <Navigate to="/staff/login" replace />
}
