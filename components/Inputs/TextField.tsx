'use client'

import {
  InputHTMLAttributes,
  useState,
  FormEvent,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { cn } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { TFieldType } from '@/types/form'
import capitalizeFirst from '@/utils/capitalize-first'

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string
  onChange: ( value: string ) => void
  loading?: boolean
  type?: TFieldType
  error?: string
  touched?: boolean
  autoFocus?: boolean
  small?: boolean
  capitalizeFirstChar?: boolean
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>( ( {
  value,
  onChange,
  loading,
  placeholder,
  disabled,
  type = 'text',
  name,
  error,
  touched,
  capitalizeFirstChar,
  small = false,
  ...props
}, forwardedRef ) => {
  const [showPassword, setShowPassword] = useState<boolean>( false )
  const [cursorPosition, setCursorPosition] = useState<number | null>( null )

  const formatRupiah = ( number: string ) => {
    if ( !number ) return '0'
    const parsed = parseInt( number.replace( /\D/g, '' ), 10 )
    if ( isNaN( parsed ) ) return ''

    return parsed.toLocaleString( 'id-ID' )
  }

  const handleChange = ( e: FormEvent<HTMLInputElement> ) => {
    const input = ( e.target as HTMLInputElement ).value
    const inputEl = e.target as HTMLInputElement

    if ( type === 'currency-id' ) {
      const numericValue = input.replace( /\D/g, '' )

      // Calculate cursor position based on numeric characters
      const cursorPos = inputEl.selectionStart || 0
      // Count how many numeric chars are before cursor in the raw input
      const beforeCursor = input.slice( 0, cursorPos )
      const numericBeforeCursor = beforeCursor.replace( /\D/g, '' ).length

      // After formatting, find where the cursor should be
      const formatted = formatRupiah( numericValue )
      let newCursorPos = 0
      let numericCount = 0
      for ( let i = 0; i < formatted.length; i++ ) {
        if ( /\d/.test( formatted[i] ) ) {
          numericCount++
        }
        if ( numericCount === numericBeforeCursor ) {
          newCursorPos = i + 1
          break
        }
      }

      // If we didn't find enough digits, put cursor at end
      if ( numericCount < numericBeforeCursor ) {
        newCursorPos = formatted.length
      }

      setCursorPosition( newCursorPos )
      onChange( numericValue )
    } else if ( type === 'text' && capitalizeFirstChar ) {
      onChange( capitalizeFirst( input ) )
    } else {
      onChange( input )
    }
  }

  const internalRef = useRef<HTMLInputElement>( null )

  // Merge forwarded ref with internal ref
  useImperativeHandle( forwardedRef, () => internalRef.current as HTMLInputElement )

  // Restore cursor position after re-render for currency-id
  useEffect( () => {
    if ( type === 'currency-id' && cursorPosition !== null && internalRef.current ) {
      internalRef.current.setSelectionRange( cursorPosition, cursorPosition )
      setCursorPosition( null )
    }
  }, [cursorPosition, type] )

  // AutoFocus
  useEffect( () => {
    if ( props.autoFocus && internalRef.current ) {
      internalRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  return loading ? (
    <div className="h-8 p-2 w-full border border-white/25 rounded-lg">
      <div className="h-full max-w-sm bg-dark-secondary animate-pulse" />
    </div>
  ) : (
    <>

      <div className="relative">
        {type === 'currency-id' && (
          <>
            <span className="absolute left-2 inset-y-0 my-auto pointer-events-none h-fit text-base">
            Rp.
            </span>
            <input
              ref={internalRef}
              id={name}
              placeholder={placeholder}
              type="tel"
              name={name}
              value={formatRupiah( value )}
              onChange={handleChange}
              disabled={disabled}
              {...props}
              className={cn(
                'w-full',
                [ small ? 'py-1 px-4 text-xs rounded-md' : 'py-2 px-8 text-base rounded-lg'],
                'text-white border bg-transparent ring-0 focus:ring-0 shadow-none focus:outline-none transition-colors duration-500 ease-in-out placeholder:text-white-overlay',
                [
                  'focus:border-white/50 border-white/25',
                  touched && error && 'focus:border-red-500 border-red-500',
                ],
                props.className
              )}
            />
          </>
        )}

        {['text', 'password', 'number', 'email'].includes( String( type ) ) && (
          <input
            ref={internalRef}
            id={name}
            name={name}
            placeholder={placeholder}
            type={
              type === 'password' ? ( showPassword ? 'text' : 'password' ) : type
            }
            value={value}
            onChange={handleChange}
            disabled={disabled}
            {...props}
            className={cn(
              'w-full',
              [ small ? 'py-1 px-2 text-xs rounded-md' : 'py-2 px-2 text-base rounded-lg'],
              'text-white border bg-transparent ring-0 focus:ring-0 shadow-none focus:outline-none transition-colors duration-500 ease-in-out placeholder:text-white-overlay',
              [
                'focus:border-white/50 border-white/25',
                touched && error && 'focus:border-red-500 border-red-500',
              ],
              [type === 'password' && 'pr-4'],
              props.className
            )}
          />
        )}

        {type === 'password' && (
          <button
            className="absolute right-2 inset-y-0 my-auto"
            type="button"
            onClick={() => setShowPassword( !showPassword )}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        )}
      </div>

      { type === 'currency-id' && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
          {[
            { label : '-1rb', value : -1000 },
            { label : '-5rb', value : -5000 },
            { label : '-10rb', value : -10000 },
            { label : '+1rb', value : 1000 },
            { label : '+5rb', value : 5000 },
            { label : '+10rb', value : 10000 },
          ].map( ( chip ) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => {
                const currentValue = parseInt( value || '0', 10 )
                const newValue = Math.max( 0, currentValue + chip.value )
                onChange( String( newValue ) )
              }}
              disabled={disabled}
              className={cn(
                'px-3 py-1 text-xs rounded-md border transition-colors',
                'border-white/25 hover:border-white/50 hover:bg-white/10',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                chip.value < 0 ? 'text-orange' : 'text-blue-400'
              )}
            >
              {chip.label}
            </button>
          ) )}
        </div>
      ) }
    </>
  )
} )

TextField.displayName = 'TextField'

export default TextField
