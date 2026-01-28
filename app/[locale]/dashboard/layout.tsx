import { ReactNode } from 'react'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

type Props = {
  children: ReactNode
}

export default function MoneyManagerDashboardLayout( { children }: Props ) {
  return (
    <main className="h-fit bg-dark grow">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-4">
        {children}
      </div>
      <PWAInstallPrompt />
    </main>
  )
}
