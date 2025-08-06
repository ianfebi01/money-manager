'use client'

import {
  InputHTMLAttributes,
  useState,
  FormEvent,
  useRef,
  useEffect,
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
  capitalizeFirstChar?: boolean
}

const TextField = ( {
  value,
  onChange,
  loading,
  placeholder,
  disabled,
  type,
  name,
  error,
  touched,
  capitalizeFirstChar,
  ...props
}: TextFieldProps ) => {
  const [showPassword, setShowPassword] = useState<boolean>( false )

  const formatRupiah = ( number: string ) => {
    const parsed = parseInt( number.replace( /\D/g, '' ), 10 )
    if ( isNaN( parsed ) ) return ''

    return parsed.toLocaleString( 'id-ID' )
  }

  const handleChange = ( e: FormEvent<HTMLInputElement> ) => {
    const input = ( e.target as HTMLInputElement ).value
    if ( type === 'currency-id' ) {
      const numericValue = input.replace( /\D/g, '' )
      onChange( numericValue )
    } else if ( type === 'text' && capitalizeFirstChar ) {
      onChange( capitalizeFirst( input ) )
    } else {
      onChange( input )
    }
  }

  const ref = useRef<HTMLInputElement>( null )

  // AutoFocus
  useEffect( () => {
    if ( props.autoFocus && ref.current ) {
      ref.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  return loading ? (
    <div className="h-8 p-2 w-full border border-white/25 rounded-lg">
      <div className="h-full max-w-sm bg-dark-secondary animate-pulse" />
    </div>
  ) : (
    <div className="relative">
      {type === 'currency-id' && (
        <>
          <span className="absolute left-2 inset-y-0 my-auto pointer-events-none h-fit text-base">
            Rp.
          </span>
          <input
            ref={ref}
            id={name}
            placeholder={placeholder}
            type="text"
            name={name}
            value={formatRupiah( value )}
            onChange={handleChange}
            disabled={disabled}
            {...props}
            className={cn(
              'w-full',
              'py-2 px-8',
              'text-white border rounded-lg bg-transparent ring-0 focus:ring-0 shadow-none focus:outline-none transition-colors duration-500 ease-in-out placeholder:text-white-overlay',
              'text-base',
              [
                'focus:border-white/50 border-white/25',
                touched && error && 'focus:border-red-500 border-red-500',
              ]
            )}
          />
        </>
      )}

      {['text', 'password', 'number', 'email'].includes( String( type ) ) && (
        <input
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
            'text-white p-2 border rounded-lg bg-transparent ring-0 focus:ring-0 shadow-none focus:outline-none transition-colors duration-500 ease-in-out placeholder:text-white-overlay',
            'text-base',
            [
              'focus:border-white/50 border-white/25',
              touched && error && 'focus:border-red-500 border-red-500',
            ],
            [type === 'password' && 'pr-4']
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
  )
}

export default TextField
