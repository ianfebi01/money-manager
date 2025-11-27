import clsx, { ClassValue } from 'clsx'
import { precisionPrefix, format as d3Format } from 'd3'
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

const precis = precisionPrefix( 1e3, 1.3e6 )

export const formatBigNumber = ( raw: number | string, whole = false ) => {
  const n = Number( raw );

  const hasDecimals = String( raw ).includes( "." ) && !whole;
  const smallFormat = hasDecimals
    ? d3Format( ".2f" )     // round to 2 decimal places
    : d3Format( ".0f" );    // no decimals

  if ( Math.abs( n ) >= 1e1 ) {
    return d3Format( `.${precis}~s` )( n );
  }

  return smallFormat( n );
}