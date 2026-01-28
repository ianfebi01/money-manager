'use client'

import { cn } from '@/lib/utils'
import Button from '../Buttons/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faFileImage } from '@fortawesome/free-solid-svg-icons'
import { useState, useRef, useEffect, TextareaHTMLAttributes, forwardRef, useImperativeHandle } from 'react'

interface AITransactionFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value?: string
  onChange?: ( value: string ) => void
  onSubmit?: () => void
  onImageSelect?: ( file: File ) => void
  loading?: boolean
  maxRows?: number
}

const AITransactionField = forwardRef<HTMLTextAreaElement, AITransactionFieldProps>( ( {
  value: controlledValue,
  onChange: controlledOnChange,
  onSubmit,
  onImageSelect,
  loading = false,
  maxRows = 5,
  placeholder = 'Tulis transaksi biar AI yang membantu',
  disabled,
  className,
  ...props
}, forwardedRef ) => {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState( '' )
  // Track if textarea has multiple lines
  const [isMultiline, setIsMultiline] = useState( false )

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = ( newValue: string ) => {
    if ( controlledOnChange ) {
      controlledOnChange( newValue )
    } else {
      setInternalValue( newValue )
    }
  }

  const textareaRef = useRef<HTMLTextAreaElement>( null )
  const fileInputRef = useRef<HTMLInputElement>( null )

  // Merge forwarded ref with internal ref
  useImperativeHandle( forwardedRef, () => textareaRef.current as HTMLTextAreaElement )

  // Auto-resize function
  const adjustHeight = () => {
    const textarea = textareaRef.current
    if ( !textarea ) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'

    // Calculate line height (assuming 1.5 line-height with 16px font)
    const lineHeight = 24
    const singleLineHeight = lineHeight + 16 // padding included
    const maxHeight = lineHeight * maxRows

    // Check if content exceeds single line
    setIsMultiline( textarea.scrollHeight > singleLineHeight )

    // Set the height to scrollHeight, but cap at maxHeight
    const newHeight = Math.min( textarea.scrollHeight, maxHeight )
    textarea.style.height = `${newHeight}px`

    // Add overflow if content exceeds max height
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }

  // Adjust height on value change
  useEffect( () => {
    adjustHeight()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value] )

  // Handle input change
  const handleChange = ( e: React.ChangeEvent<HTMLTextAreaElement> ) => {
    setValue( e.target.value )
  }

  // Handle key down for submit on Enter (without Shift)
  const handleKeyDown = ( e: React.KeyboardEvent<HTMLTextAreaElement> ) => {
    if ( e.key === 'Enter' && !e.shiftKey ) {
      e.preventDefault()
      if ( onSubmit && value.trim() && !loading ) {
        onSubmit()
      }
    }
  }

  // Handle image upload click
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  // Handle file selection
  const handleFileChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const file = e.target.files?.[0]
    if ( file && onImageSelect ) {
      onImageSelect( file )
    }
    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  // Image upload button component to avoid duplication
  const ImageButton = (
    <Button
      variant="icon"
      type="button"
      onClick={handleImageClick}
      disabled={loading || disabled}
      className="bg-dark-secondary aspect-square h-[36px] w-[36px] flex-shrink-0 transition-all duration-200"
    >
      <FontAwesomeIcon icon={faFileImage} />
    </Button>
  )

  // Send button component to avoid duplication
  const SendButton = (
    <Button 
      variant="icon"
      type="button"
      onClick={onSubmit}
      disabled={!value.trim() || loading || disabled}
      className={cn(
        'bg-dark-secondary aspect-square h-[36px] w-[36px] flex-shrink-0 transition-all duration-200',
        value.trim() && !loading ? 'opacity-100' : 'opacity-50'
      )}
    >
      <FontAwesomeIcon icon={faArrowUp}
        className={cn( loading && 'animate-pulse' )}
      />
    </Button>
  )

  return (
    <div className={cn(
      'border border-white/25 p-2.5 transition-all duration-300 ease-in-out',
      'focus-within:border-white/50',
      'rounded-lg'
    )}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Use CSS Grid for smooth layout transitions */}
      <div className={cn(
        'grid gap-2 transition-all duration-300 ease-in-out',
        isMultiline 
          ? 'grid-cols-1' 
          : 'grid-cols-[auto_1fr_auto] items-end'
      )}
      >
        {/* Image button - only in single line mode at start */}
        {!isMultiline && ImageButton}

        {/* Textarea - always rendered, order changes via grid */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || loading}
          rows={1}
          {...props}
          className={cn(
            'w-full resize-none',
            'py-2 px-2 text-base leading-6',
            'text-white bg-transparent transition-colors duration-300 ease-in-out placeholder:text-white-overlay',
            'ring-0 focus:ring-0 shadow-none focus:outline-none border-none',
            'scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent',
            className
          )}
          style={{
            minHeight : '24px',
            maxHeight : `${24 * maxRows}px`,
          }}
        />

        {/* Send button - only in single line mode at end */}
        {!isMultiline && SendButton}

        {/* Bottom row with buttons - only in multiline mode */}
        {isMultiline && (
          <div className="flex justify-between items-center animate-in fade-in duration-200">
            {ImageButton}
            {SendButton}
          </div>
        )}
      </div>
    </div>
  )
} )

AITransactionField.displayName = 'AITransactionField'

export default AITransactionField
