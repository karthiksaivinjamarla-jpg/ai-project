import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'

export type StaffRole = 'STAFF'

const storageKey = 'sevacare.staff.role'

type StaffAccess = {
  role?: StaffRole
  signInDemoStaff: () => void
  signOut: () => void
}

const StaffAccessContext = createContext<StaffAccess>({
  role: undefined,
  signInDemoStaff: () => undefined,
  signOut: () => undefined,
})

function readRole(): StaffRole | undefined {
  try {
    return sessionStorage.getItem(storageKey) === 'STAFF' ? 'STAFF' : undefined
  } catch {
    return undefined
  }
}

export function StaffAccessProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<StaffRole | undefined>(readRole)

  const value = useMemo<StaffAccess>(() => ({
    role,
    signInDemoStaff: () => {
      try { sessionStorage.setItem(storageKey, 'STAFF') } catch { /* session remains in-memory */ }
      setRole('STAFF')
    },
    signOut: () => {
      try { sessionStorage.removeItem(storageKey) } catch { /* ignore unavailable storage */ }
      setRole(undefined)
    },
  }), [role])

  return <StaffAccessContext.Provider value={value}>{children}</StaffAccessContext.Provider>
}

export const useStaffAccess = () => useContext(StaffAccessContext)
