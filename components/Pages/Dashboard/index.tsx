'use client';
import { cn } from '@/lib/utils'
import ExpenseDoughnutChart from './ExpenseDoughnutChart'
import BarLineChart from './BarLineChart';

const Dashboard = () => {
  return (
    <div className="mt-8">
      <div className={cn( 'grid grid-cols-1 lg:grid-cols-2 gap-4' )}>
        <BarLineChart />
        <ExpenseDoughnutChart />
      </div>
    </div>
  )
}

export default Dashboard
