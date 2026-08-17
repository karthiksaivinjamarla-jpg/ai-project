import type { ReactNode } from 'react'

interface IconActionCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function IconActionCard({ icon, title, description }: IconActionCardProps) {
  return <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="mb-4 grid size-12 place-items-center rounded-xl bg-teal-50 text-teal-800" aria-hidden="true">{icon}</div><h2 className="text-lg font-bold text-slate-950">{title}</h2><p className="mt-1 text-base leading-6 text-slate-700">{description}</p></article>
}
