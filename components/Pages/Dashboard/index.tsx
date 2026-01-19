'use client';
import { cn } from '@/lib/utils'
import ExpenseDoughnutChart from './ExpenseDoughnutChart'
import BarLineChart from './BarLineChart';
import AISummary from '@/components/AISummary';
import { useFormatDate } from '@/lib/hooks/useFormatDate';

const Dashboard = () => {
  const { month, year } = useFormatDate()
  const date = new Date()

  return (
    <div className="mt-8">
      <div className="mb-6">
        <AISummary
          month={month( date )}
          year={year( date )}
        />
      </div>
      <div className={cn( 'grid grid-cols-1 lg:grid-cols-2 gap-4' )}>
        <BarLineChart />
        <ExpenseDoughnutChart />
      </div>
    </div>
  )
}

export default Dashboard
