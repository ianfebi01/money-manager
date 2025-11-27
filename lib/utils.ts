import clsx, { ClassValue } from 'clsx'
import { format } from 'date-fns'
import { enUS, id } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'

/** Merge classes with tailwind-merge with clsx full feature */
export function cn( ...inputs: ClassValue[] ) {
  return twMerge( clsx( inputs ) )
}

/**
 *  open new tab
 */

export function openNewTab( url: string ) {
  window.open( url )
}

/**
 * Get month name from month index
 */

type SupportedLocale = typeof enUS | typeof id

export function getMonthNameFromIndex(
  monthIndex: number,
  locale: SupportedLocale = enUS,
  formatStr: string = 'LLL'
) {

  const date = new Date( 2000, monthIndex, 1 )
  
  return format( date, formatStr, { locale } )
}