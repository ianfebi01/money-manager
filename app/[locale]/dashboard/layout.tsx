import MoneyManagerNavbar from '@/components/Layouts/MoneyManagerNavbar'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function MoneyManagerDashboardLayout( { children }: Props ) {
  return (
    <main className="h-fit bg-dark ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-4">
        <MoneyManagerNavbar />
        {children}
      </div>
    </main>
  )
}
