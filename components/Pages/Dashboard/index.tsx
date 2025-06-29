'use client';
import { cn } from '@/lib/utils'
import MonthlyChart from './MonthlyChart'
import ExpenseDoughnutChart from './ExpenseDoughnutChart'

const Dashboard = () => {
  return (
    <div className="mt-8">
      <div className={cn( 'grid grid-cols-1 lg:grid-cols-2 gap-4' )}>
        <MonthlyChart />
        <ExpenseDoughnutChart />
      </div>
    </div>
  )
}

export default Dashboard
