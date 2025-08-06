'use client'
import {
  useState,
  useEffect,
  useMemo,
  createElement,
  FunctionComponent,
  Fragment,
} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format, Locale } from 'date-fns'
import { id, enUS } from 'date-fns/locale'
import { ISelectedRange, Placement, TActivatorProps } from '@/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt,
  faBan,
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { useLocale, useTranslations } from 'next-intl'
import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { cn } from '@/lib/utils'
import '@/assets/scss/components/react-datepicker.scss'

interface Props {
  value: ISelectedRange
  setValue: ( val: ISelectedRange ) => void
  min?: Date
  max?: Date
  activator?: FunctionComponent<TActivatorProps>
  position?: Placement
  isTableFilter?: boolean
  handleCommitted?: ( val: ISelectedRange ) => void
}

const DateRangePicker = ( {
  min,
  max,
  activator,
  position = 'bottom-start',
  value,
  isTableFilter = false,
  setValue,
  handleCommitted,
}: Props ) => {
  const t = useTranslations()
  const locale = useLocale()
  const dateLocale = locale === 'id' ? id : enUS

  const [state, setState] = useState<ISelectedRange>( {
    startDate : null,
    endDate   : null,
  } )

  useEffect( () => {
    setState( value )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  const handleChange = ( [startDate, endDate]: Array<Date | null> ) => {
    setState( { startDate, endDate } )
  }

  const onReset = () => {
    setValue( { startDate : null, endDate : null } )
    setState( { startDate : null, endDate : null } )
  }

  const handleClose = () => {
    setState( value )
  }

  const handleSave = () => {
    setValue( state )
    if ( handleCommitted ) {
      handleCommitted( state )
    }
  }

  const selectedTextValue = useMemo( () => {
    const startDate = value.startDate
      ? format( value.startDate, 'd MMMM yyyy', { locale : dateLocale } )
      : ''
    const endDate = value.endDate
      ? format( value.endDate, 'd MMMM yyyy', { locale : dateLocale } )
      : ''

    return value.startDate && value.endDate
      ? `${startDate} - ${endDate}`
      : t( isTableFilter ? 'all' : 'select_date' )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value] )

  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  )
  const [popperElement, setPopperElement] = useState<HTMLElement | null>( null )

  const { styles, attributes } = usePopper( referenceElement, popperElement, {
    placement : position,
    modifiers : [
      {
        name    : 'offset',
        options : { offset : [0, 4] },
      },
      {
        name    : 'preventOverflow',
        options : {
          boundary :
            typeof window !== 'undefined'
              ? ( document.body as Element )
              : undefined,
        },
      },
    ],
  } )

  const DefaultActivator = () => (
    <button
      className={cn(
        'w-full min-w-[300px]',
        'flex justify-between items-center text-left',
        'p-2 border rounded-lg bg-transparent ring-0 focus:ring-0 shadow-none focus:outline-none transition-colors duration-500 ease-in-out',
        'text-base',
        ['focus:border-white/50 border-white/25'],
        ['pr-4'],
        [
          !value.startDate && !value.endDate && 'text-white-overlay',
          !!value.startDate && !!value.endDate && 'text-white',
        ]
      )}
    >
      <span>{selectedTextValue}</span>
      <FontAwesomeIcon icon={faCalendarAlt}
        className="text-gray-500 ml-2"
      />
    </button>
  )

  return (
    <Popover className="relative">
      {( { close } ) => (
        <>
          <Popover.Button as="div"
            ref={setReferenceElement}
          >
            {activator ? (
              createElement( activator, {
                rawValue : value,
              } )
            ) : (
              <DefaultActivator />
            )}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition-opacity ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel
              static
              className="absolute origin-top-right z-50 pt-3 w-screen max-w-xs px-4 sm:px-0"
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              <DatePicker
                inline
                minDate={min}
                maxDate={max}
                selected={state.startDate}
                onChange={handleChange}
                startDate={state.startDate ?? undefined}
                endDate={state.endDate ?? undefined}
                selectsRange
                renderDayContents={RenderDayContent}
                renderCustomHeader={RenderCustomHeader( dateLocale )}
              >
                <div className="px-3 pb-3 flex flex-col gap-3">
                  <div className="flex flex-row items-center gap-2 overflow-hidden">
                    <input
                      className="border rounded px-2 py-1 text-sm bg-dark-secondary w-full focus:border-white/50 border-white/25 text-white/80"
                      disabled
                      placeholder="-"
                      value={
                        state.startDate
                          ? format( state.startDate, 'dd MMM yyyy', {
                            locale : dateLocale,
                          } )
                          : ''
                      }
                    />
                    -
                    <input
                      className="border rounded px-2 py-1 text-sm bg-dark-secondary w-full focus:border-white/50 border-white/25 text-white/80"
                      disabled
                      placeholder="-"
                      value={
                        state.endDate
                          ? format( state.endDate, 'dd MMM yyyy', {
                            locale : dateLocale,
                          } )
                          : ''
                      }
                    />
                  </div>
                  <hr />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        onReset()
                        close()
                      }}
                      className="button button-primary text-xs lg:text-sm"
                    >
                      {t( 'reset' )}
                    </button>
                    <button
                      onClick={() => {
                        handleClose()
                        close()
                      }}
                      className="button button-primary text-xs lg:text-sm"
                    >
                      <FontAwesomeIcon icon={faBan} /> {t( 'close' )}
                    </button>
                    <button
                      onClick={() => {
                        handleSave()
                        close()
                      }}
                      className="button button-secondary text-xs lg:text-sm"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} /> {t( 'set_date' )}
                    </button>
                  </div>
                </div>
              </DatePicker>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default DateRangePicker

const RenderDayContent = ( day: number ) => <span>{day}</span>

type TCustomHeaderProps = {
  date: Date
  decreaseYear: () => void
  increaseYear: () => void
  prevYearButtonDisabled: boolean
  nextYearButtonDisabled: boolean
  changeYear: ( date: number ) => void
  changeMonth: ( date: number ) => void
  decreaseMonth: () => void
  increaseMonth: () => void
  prevMonthButtonDisabled: boolean
  nextMonthButtonDisabled: boolean
}

const RenderCustomHeader = ( dateLocale: Locale ) => {
  const CustomHeader = ( {
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: TCustomHeaderProps ) => (
    <div className="flex items-center justify-between px-3 py-2">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="text-white hover:drop-shadow-lg"
      >
        <FontAwesomeIcon icon={faChevronLeft}
          size="sm"
        />
      </button>
      <span className="text-sm font-medium">
        {format( date, 'MMM, yyyy', { locale : dateLocale } )}
      </span>
      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="text-white hover:drop-shadow-lg"
      >
        <FontAwesomeIcon icon={faChevronRight}
          size="sm"
        />
      </button>
    </div>
  )

  CustomHeader.displayName = 'CustomDatePickerHeader'
  
  return CustomHeader
}
