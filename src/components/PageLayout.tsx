import type { ReactNode } from 'react'

type PageLayoutProps = {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return <main className="page">{children}</main>
}
