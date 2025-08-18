'use client'
import React, { useState } from 'react'
import ColumnChart from '@/components/Chart/Column'
import { IFilterMonthly, useGetDatas } from '@/lib/hooks/api/dashboard'
import { useFormatDate } from '@/lib/hooks/useFormatDate'
import ChartCard from '@/components/Cards/ChartCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import SkeletonMonthlyChart from './SkeletonMonthlyChart'
import { useTranslations } from 'next-intl'

const MonthlyChart = () => {
  const t = useTranslations()
  const date = new Date()
  const { year } = useFormatDate()

  const [filter, setFilter] = useState<IFilterMonthly>( {
    year : year( date ),
  } )

  const { data, isFetching, isError } = useGetDatas( filter )

  const changeYear = ( type: 'prev' | 'next' ) => {
    if ( type === 'prev' ) {
      setFilter( ( prev ) => ( { ...prev, year : String( Number( prev.year ) - 1 ) } ) )
    } else if ( type === 'next' ) {
      setFilter( ( prev ) => ( { ...prev, year : String( Number( prev.year ) + 1 ) } ) )
    }
  }

  return (
    <ChartCard
      title={t( 'monthly_transaction' )}
      isError={isError}
      isLoading={isFetching}
      isNoData={( !!data && data?.data?.categories.length === 0 ) || !data}
      filterComponent={
        <div className="flex gap-2 items-center">
          <button
            className="border rounded-md w-6 h-6 border-white-overlay-2 hover:border-white-overlay transition-default"
            onClick={() => changeYear( 'prev' )}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className="p font-normal m-0">{filter.year}</span>
          <button
            className="border rounded-md w-6 h-6 border-white-overlay-2 hover:border-white-overlay transition-default"
            onClick={() => changeYear( 'next' )}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      }
      loaderComponent={<SkeletonMonthlyChart />}
    >
      <div className='h-[300px]'>
        <ColumnChart
          categories={data?.data?.categories || []}
          series={data?.data?.series || []}
        />
      </div>
    </ChartCard>
  )
}

export default MonthlyChart
