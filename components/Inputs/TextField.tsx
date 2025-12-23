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

  const formatRupiah = ( number: string ) => {
    if ( !number ) return '0'
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

  const internalRef = useRef<HTMLInputElement>( null )

  // Merge forwarded ref with internal ref
  useImperativeHandle( forwardedRef, () => internalRef.current as HTMLInputElement )

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
            type="text"
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
  )
} )

TextField.displayName = 'TextField'

export default TextField
