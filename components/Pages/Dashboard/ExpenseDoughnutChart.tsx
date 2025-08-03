'use client'
import { useState } from 'react'
import { IFilter, useGetTopExpense } from '@/lib/hooks/api/dashboard'
import { useFormatDate } from '@/lib/hooks/useFormatDate'
import ChartCard from '@/components/Cards/ChartCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import Doughnut from '@/components/Chart/Doughnut'
import SkeletonExpenseDoughnutChart from './SkeletonExpenseDoughnutChart'
import { useTranslations } from 'next-intl'

const ExpenseDoughnutChart = () => {
  const t = useTranslations()
  const date = new Date()
  const { year, month, spaceMonthYear } = useFormatDate()

  const [filter, setFilter] = useState<IFilter>( {
    month : month( date ),
    year  : year( date ),
  } )

  const { data, isFetching, isError } = useGetTopExpense( filter )

  const changeMonth = ( type: 'prev' | 'next' ) => {
    setFilter( ( prev ) => {
      let newMonth = Number( prev.month )
      let newYear = Number( prev.year )

      if ( type === 'prev' ) {
        newMonth--
        if ( newMonth < 1 ) {
          newMonth = 12
          newYear--
        }
      } else {
        newMonth++
        if ( newMonth > 12 ) {
          newMonth = 1
          newYear++
        }
      }

      return {
        month : String( newMonth ).padStart( 2, '0' ), // 🔒 Padded, safe month
        year  : String( newYear ),
      }
    } )
  }

  return (
    <ChartCard
      title={t( 'top_expense' )}
      isError={isError}
      isLoading={isFetching}
      isNoData={( !!data && data?.data?.categories.length === 0 ) || !data}
      filterComponent={
        <div className="flex gap-2 items-center">
          <button
            className="border rounded-md w-6 h-6 border-white-overlay-2 hover:border-white-overlay transition-default"
            onClick={() => changeMonth( 'prev' )}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className="p font-normal m-0 text-center">
            {spaceMonthYear( new Date( `${filter.year}-${filter.month}-01` ) )}
          </span>
          <button
            className="border rounded-md w-6 h-6 border-white-overlay-2 hover:border-white-overlay transition-default"
            onClick={() => changeMonth( 'next' )}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      }
      loaderComponent={<SkeletonExpenseDoughnutChart />}
    >
      <Doughnut
        categories={data?.data?.categories || []}
        series={data?.data?.series || []}
      />
    </ChartCard>
  )
}

export default ExpenseDoughnutChart
