'use client'

import { useSummarize } from '@/lib/hooks/api/useSummarize'
import { cn } from '@/lib/utils'
import { faWandMagicSparkles, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import Spinner from '@/components/Icons/Spinner'
import Markdown from '@/components/Parsers/Markdown'

interface AISummaryProps {
  month: string
  year: string
  className?: string
}

const AISummary = ( { month, year, className }: AISummaryProps ) => {
  const t = useTranslations()
  const { summary, isLoading, error, generateSummary, reset } = useSummarize( {
    month,
    year,
  } )
  const contentRef = useRef<HTMLDivElement>( null )

  // Reset when month/year changes
  useEffect( () => {
    reset()
  }, [month, year, reset] )

  // Auto-scroll to bottom when summary updates
  useEffect( () => {
    if ( contentRef.current && summary ) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [summary] )

  return (
    <div
      className={cn(
        'bg-dark-secondary border border-white-overlay-2 rounded-xl p-4 sm:p-6',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faWandMagicSparkles}
            className="text-orange w-4 h-4"
          />
          <h3 className="text-lg font-semibold text-white">
            {t( 'ai_summary.title' )}
          </h3>
        </div>

        {summary && !isLoading && (
          <button
            onClick={generateSummary}
            className="text-sm text-white-overlay hover:text-white transition-default flex items-center gap-1"
          >
            <FontAwesomeIcon
              icon={faRotateRight}
              className="w-3 h-3"
            />
            {t( 'ai_summary.regenerate' )}
          </button>
        )}
      </div>

      {!summary && !isLoading && !error && (
        <div className="text-center py-8">
          <p className="text-white-overlay mb-4 text-sm">
            {t( 'ai_summary.description' )}
          </p>
          <button
            onClick={generateSummary}
            className="bg-gradient-to-r from-orange to-orange-600 hover:from-orange-600 hover:to-orange text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-orange/25"
          >
            <FontAwesomeIcon
              icon={faWandMagicSparkles}
              className="w-4 h-4"
            />
            {t( 'ai_summary.generate' )}
          </button>
        </div>
      )}

      {isLoading && !summary && (
        <div className="flex items-center justify-center py-8">
          <Spinner classes="!h-8 !w-8" />
          <span className="ml-3 text-white-overlay">
            {t( 'ai_summary.generating' )}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button
            onClick={generateSummary}
            className="text-sm text-white-overlay hover:text-white transition-default underline"
          >
            {t( 'ai_summary.try_again' )}
          </button>
        </div>
      )}

      {summary && (
        <div
          ref={contentRef}
          className={cn(
            'max-h-[400px] overflow-y-auto pr-2',
            isLoading && 'animate-pulse'
          )}
        >
          <Markdown content={summary} />
          {isLoading && (
            <span className="inline-block w-2 h-4 bg-orange animate-pulse ml-1" />
          )}
        </div>
      )}
    </div>
  )
}

export default AISummary
