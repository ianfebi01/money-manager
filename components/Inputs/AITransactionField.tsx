'use client'

import { cn } from '@/lib/utils'
import Button from '../Buttons/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUp,
  faFileImage,
  faMicrophone,
  faStop,
} from '@fortawesome/free-solid-svg-icons'
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  TextareaHTMLAttributes,
  forwardRef,
  useImperativeHandle,
} from 'react'
import Spinner from '../Icons/Spinner'

// Type declaration for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ( event: SpeechRecognitionEvent ) => void
  onerror: ( event: SpeechRecognitionErrorEvent ) => void
  onend: () => void
  onstart: () => void
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface AITransactionFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'value'
> {
  value?: string
  onChange?: ( value: string ) => void
  onSubmit?: () => void
  onImageSelect?: ( file: File ) => void
  loading?: boolean
  maxRows?: number
}

const AITransactionField = forwardRef<
  HTMLTextAreaElement,
  AITransactionFieldProps
>(
  (
    {
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
    },
    forwardedRef,
  ) => {
    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState( '' )
    // Track if textarea has multiple lines
    const [isMultiline, setIsMultiline] = useState( false )

    // Use controlled value if provided, otherwise use internal state
    const value =
      controlledValue !== undefined ? controlledValue : internalValue
    const setValue = useCallback(
      ( newValue: string ) => {
        if ( controlledOnChange ) {
          controlledOnChange( newValue )
        } else {
          setInternalValue( newValue )
        }
      },
      [controlledOnChange],
    )

    const textareaRef = useRef<HTMLTextAreaElement>( null )
    const fileInputRef = useRef<HTMLInputElement>( null )
    const recognitionRef = useRef<SpeechRecognition | null>( null )

    // Speech recognition state
    const [isListening, setIsListening] = useState( false )
    const [isSpeechSupported, setIsSpeechSupported] = useState( false )

    // Check if speech recognition is supported
    useEffect( () => {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSpeechSupported( !!SpeechRecognitionAPI )
    }, [] )

    // Start speech recognition
    const startListening = useCallback( () => {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition
      if ( !SpeechRecognitionAPI ) return

      const recognition = new SpeechRecognitionAPI()
      recognitionRef.current = recognition

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'id-ID' // Indonesian language

      recognition.onstart = () => {
        setIsListening( true )
      }

      recognition.onresult = ( event: SpeechRecognitionEvent ) => {
        let finalTranscript = ''

        for ( let i = event.resultIndex; i < event.results.length; i++ ) {
          const transcript = event.results[i][0].transcript
          if ( event.results[i].isFinal ) {
            finalTranscript += transcript
          }
        }

        // Append final transcript to existing value
        if ( finalTranscript ) {
          const currentValue =
            controlledValue !== undefined ? controlledValue : internalValue
          const trimmedCurrent = currentValue.trim()
          const newValue = trimmedCurrent
            ? `${trimmedCurrent} ${finalTranscript}`
            : finalTranscript
          setValue( newValue )
        }
      }

      recognition.onerror = () => {
        setIsListening( false )
      }

      recognition.onend = () => {
        setIsListening( false )
        recognitionRef.current = null
      }

      recognition.start()
    }, [controlledValue, internalValue, setValue] )

    // Stop speech recognition
    const stopListening = useCallback( () => {
      if ( recognitionRef.current ) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      setIsListening( false )
    }, [] )

    // Toggle speech recognition
    const toggleListening = useCallback( () => {
      if ( isListening ) {
        stopListening()
      } else {
        startListening()
      }
    }, [isListening, startListening, stopListening] )

    // Cleanup on unmount
    useEffect( () => {
      return () => {
        if ( recognitionRef.current ) {
          recognitionRef.current.abort()
        }
      }
    }, [] )

    // Merge forwarded ref with internal ref
    useImperativeHandle(
      forwardedRef,
      () => textareaRef.current as HTMLTextAreaElement,
    )

    // Auto-resize function
    const adjustHeight = () => {
      const textarea = textareaRef.current
      if ( !textarea ) return

      // Temporarily set to single-line mode width to check if it would wrap
      const wasMultiline = isMultiline

      // Force single-line padding to measure accurately
      textarea.style.paddingRight = '96px'
      textarea.style.height = 'auto'

      const lineHeight = 24
      const singleLineThreshold = 40 // 24px line + 16px padding
      const maxHeight = lineHeight * maxRows

      // Detect if should be multiline based on scrollHeight with single-line padding
      const shouldBeMultiline =
        textarea.scrollHeight > singleLineThreshold || value.includes( '\n' )

      // Apply correct padding based on multiline state
      if ( shouldBeMultiline ) {
        textarea.style.paddingRight = '8px' // px-2 in multiline mode
      }
      // If still single line, keep the 96px padding

      // Recalculate height with correct padding
      textarea.style.height = 'auto'
      const newHeight = Math.min( textarea.scrollHeight, maxHeight )
      textarea.style.height = `${newHeight}px`

      // Update state only if changed
      if ( shouldBeMultiline !== wasMultiline ) {
        setIsMultiline( shouldBeMultiline )
      }

      // Add overflow if content exceeds max height
      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
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

    // Action button: shows microphone when empty, stop when listening, send when has text
    const hasText = value.trim().length > 0

    const ActionButton = (
      <Button
        variant="icon"
        type="button"
        onClick={hasText ? onSubmit : toggleListening}
        disabled={loading || disabled || ( !hasText && !isSpeechSupported )}
        className={cn(
          'bg-dark-secondary aspect-square h-[36px] w-[36px] flex-shrink-0 transition-all duration-200',
          // Show full opacity when has text or when listening
          ( hasText || isListening ) && !loading ? 'opacity-100' : 'opacity-70',
          // Add pulsing animation when listening
          isListening && 'animate-pulse bg-red-500/20',
        )}
      >
        {loading ? (
          <Spinner />
        ) : (
          <FontAwesomeIcon
            icon={isListening ? faStop : hasText ? faArrowUp : faMicrophone}
            className={cn(
              'transition-all duration-200',
              loading && 'animate-pulse',
              isListening && 'text-red-400',
            )}
          />
        )}
      </Button>
    )

    return (
      <div
        className={cn(
          'border border-white/25 p-2.5 transition-all duration-300 ease-in-out',
          'focus-within:border-white/50',
          'rounded-lg',
          // Add extra bottom padding when multiline to keep buttons inside border
          isMultiline && 'pb-12',
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

        {/* Use relative container for smooth button position transitions */}
        <div className="relative">
          {/* Textarea */}
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
              'pt-2 pb-1 text-base leading-6',
              'text-white bg-transparent transition-colors duration-300 ease-in-out placeholder:text-white-overlay',
              'ring-0 focus:ring-0 shadow-none focus:outline-none border-none',
              'scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent',
              // Only add right padding when single line (buttons overlay on right)
              isMultiline ? 'px-2 pb-1' : 'pl-2 pr-24',
              className,
            )}
            style={{
              minHeight : '24px',
              maxHeight : `${24 * maxRows}px`,
            }}
          />
          {/* Button container with absolute positioning for smooth transitions */}
          <div
            className={cn(
              'absolute flex items-center gap-2',
              'transition-all duration-300 ease-in-out',
              isMultiline
                ? 'top-full right-0 mt-0' // Below textarea when multiline
                : 'top-1/2 right-0 -translate-y-1/2', // Center right when single line
            )}
          >
            {ImageButton}
            {ActionButton}
          </div>
        </div>
      </div>
    )
  },
)

AITransactionField.displayName = 'AITransactionField'

export default AITransactionField
