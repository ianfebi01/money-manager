'use client'
import { useMemo, useState } from 'react'
import { IFilterMonthly, useGetDatas } from '@/lib/hooks/api/dashboard'
import { useFormatDate } from '@/lib/hooks/useFormatDate'
import ChartCard from '@/components/Cards/ChartCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import SkeletonMonthlyChart from './SkeletonMonthlyChart'
import { useLocale, useTranslations } from 'next-intl'
import BarLineChartD3 from '@/components/Chart/BarLineChartD3'
import { getMonthNameFromIndex } from '@/lib/utils'
import { enUS, id } from 'date-fns/locale'

const BarLineChart = () => {
  const t = useTranslations()
  const date = new Date()
  const { year } = useFormatDate()
  const locale = useLocale()

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

  const chartData = useMemo( () => {
    if ( !data?.data ) return { series : [], categories : [] }

    const localeMap = {
      en : enUS,
      id : id,
    }

    type LocaleKey = keyof typeof localeMap
    const localeKey: LocaleKey =
      locale === 'en' || locale === 'id' ? locale : 'en'

    return {
      series     : data.data.series,
      categories : data.data.categories.map( ( item ) =>
        getMonthNameFromIndex( Number( item ), localeMap[localeKey] )
      ),
    }
  }, [data, locale] )

  const isNoData = useMemo( () => {
    if ( !data || !data.data ) {
      return true
    }
    if ( data.data.categories.length === 0 ) {
      return true
    }
    if ( !data.data.series || data.data.series.length === 0 ) {
      return true
    }

    return data.data.series.every( ( serie ) => {
      return (
        !serie.data ||
        serie.data.length === 0 ||
        serie.data.every( ( val ) => !val || val === 0 )
      )
    } )
  }, [data] )

  return (
    <ChartCard
      title={t( 'monthly_transaction' )}
      isError={isError}
      isLoading={isFetching}
      isNoData={isNoData}
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
      <div className="h-[200px] md:h-[300px] flex flex-col p-4 pt-0">
        <BarLineChartD3 datas={chartData} />
      </div>
    </ChartCard>
  )
}

export default BarLineChart
