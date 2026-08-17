import type { PropsWithChildren } from 'react'

export function AppShell({ children }: PropsWithChildren) {
  return <div className="min-h-dvh bg-stone-50 px-5 py-6 text-slate-900 sm:px-8 sm:py-10"><div className="mx-auto max-w-5xl">{children}</div></div>
}
