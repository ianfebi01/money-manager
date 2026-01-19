import { useCallback, useState } from 'react'
import { useLocale } from 'next-intl'

interface UseSummarizeOptions {
  month: string
  year: string
}

interface UseSummarizeReturn {
  summary: string
  isLoading: boolean
  error: string | null
  generateSummary: () => Promise<void>
  reset: () => void
}

export const useSummarize = ( options: UseSummarizeOptions ): UseSummarizeReturn => {
  const [summary, setSummary] = useState<string>( '' )
  const [isLoading, setIsLoading] = useState<boolean>( false )
  const [error, setError] = useState<string | null>( null )
  const locale = useLocale()

  const generateSummary = useCallback( async () => {
    setIsLoading( true )
    setError( null )
    setSummary( '' )

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    try {
      const response = await fetch( '/api/ai/summarize', {
        method  : 'POST',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify( {
          month    : options.month,
          year     : options.year,
          timezone : timezone,
          locale   : locale,
        } ),
      } )

      if ( !response.ok ) {
        const errorData = await response.json()
        throw new Error( errorData.message || errorData.error || 'Failed to generate summary' )
      }

      // Check if it's a simple JSON response (no transactions case)
      const contentType = response.headers.get( 'content-type' )
      if ( contentType?.includes( 'application/json' ) ) {
        const data = await response.json()
        setSummary( data.summary )
        setIsLoading( false )

        return
      }

      // Handle text stream response (toTextStreamResponse format)
      const reader = response.body?.getReader()
      if ( !reader ) {
        throw new Error( 'No response body' )
      }

      const decoder = new TextDecoder()
      let fullText = ''

      while ( true ) {
        const { done, value } = await reader.read()
        if ( done ) break

        const chunk = decoder.decode( value, { stream : true } )
        fullText += chunk
        setSummary( fullText )
      }

      setIsLoading( false )
    } catch ( err ) {
      setError( err instanceof Error ? err.message : 'An error occurred' )
      setIsLoading( false )
    }
  }, [options.month, options.year, locale] )

  const reset = useCallback( () => {
    setSummary( '' )
    setError( null )
    setIsLoading( false )
  }, [] )

  return {
    summary,
    isLoading,
    error,
    generateSummary,
    reset,
  }
}
