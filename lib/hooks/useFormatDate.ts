'use client'
import { differenceInYears, format, Locale } from 'date-fns'
import { enUS, id } from 'date-fns/locale'
import { useLocale } from 'next-intl'

const localeMap: Record<string, Locale> = {
  en : enUS,
  id : id,
}

export const useFormatDate = () => {

  const currentLocale = useLocale()
  const locale = localeMap[currentLocale] || enUS

  const normal = ( date: Date | string ) =>
    format( new Date( date ), 'dd:MM:yyyy', { locale } )

  const month = ( date: Date | string ) =>
    format( new Date( date ), 'MM', { locale } )

  const year = ( date: Date | string ) =>
    format( new Date( date ), 'yyyy', { locale } )

  const slash = ( date: Date | string ) =>
    format( new Date( date ), 'dd/MM/yyyy', { locale } )

  const time = ( date: Date | string ) =>
    format( new Date( date ), 'HH:mm:ss', { locale } )

  const spaceMonthText = ( date: Date | string ) =>
    format( new Date( date ), 'dd MMM yyyy', { locale } )

  const spaceMonthYear = ( date: Date | string ) =>
    format( new Date( date ), 'MMM yyyy', { locale } )

  const birthDayAndYear = ( date: Date | string ) =>
    `${format( new Date( date ), 'dd MMM yyyy', { locale } )} (${calculateAge( new Date( date ) )} tahun)`

  const startDateNoTime = ( date: Date | string ) =>
    format( new Date( date ), 'yyyy-MM-dd HH:mm:ss', { locale } )

  const endDateNoTime = ( date: Date | string ) =>
    format( new Date( date ), 'yyyy-MM-dd', { locale } ) + ' 23:59:59'

  return {
    slash,
    normal,
    time,
    spaceMonthText,
    birthDayAndYear,
    startDateNoTime,
    endDateNoTime,
    year,
    month,
    spaceMonthYear
  }
}

function calculateAge( dob: Date ) {
  const age = differenceInYears( new Date(), dob )
  
  return age
}
