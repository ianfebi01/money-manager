'use client'

import { useSummarize } from '@/lib/hooks/api/useSummarize'
import { cn } from '@/lib/utils'
import {
  faWandMagicSparkles,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import Spinner from '@/components/Icons/Spinner'
import Markdown from '@/components/Parsers/Markdown'
import Button from './Buttons/Button'

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
  const [isExpanded, setIsExpanded] = useState( false )

  // Track expanded state based on whether we have content
  useEffect( () => {
    if ( summary || isLoading || error ) {
      setIsExpanded( true )
    } else {
      setIsExpanded( false )
    }
  }, [summary, isLoading, error] )

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

  const showInitialState = !summary && !isLoading && !error

  return (
    <div
      className={cn(
        'bg-dark-secondary border border-white-overlay-2 rounded-xl p-4',
        'transition-all duration-500 ease-out',
        className
      )}
    >
      {/* Initial state - Generate button */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          showInitialState
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="text-center flex flex-col md:flex-row items-center gap-2">
            <FontAwesomeIcon icon={faWandMagicSparkles}
              size="xl"
            />
            <h3 className="text-white/80 m-0 text-base font-normal">
              {t( 'ai_summary.description' )}
            </h3>
            <Button
              onClick={generateSummary}
              variant="outline"
              className="md:ml-auto"
            >
              <FontAwesomeIcon icon={faWandMagicSparkles}
                className="w-4 h-4"
              />
              {t( 'ai_summary.generate' )}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded state - Header with title */}
      <div
        className={cn(
          'transition-all duration-300 ease-out',
          isExpanded
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 h-0 overflow-hidden'
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

          <div
            className={cn(
              'transition-all duration-300 ease-out',
              summary && !isLoading
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-2 pointer-events-none'
            )}
          >
            <button
              onClick={generateSummary}
              className="text-sm text-white-overlay hover:text-white transition-default flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faRotateRight}
                className="w-3 h-3"
              />
              {t( 'ai_summary.regenerate' )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isLoading && !summary
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="flex items-center justify-center py-8">
            <Spinner classes="!h-8 !w-8" />
            <span className="ml-3 text-white-overlay">
              {t( 'ai_summary.generating' )}
            </span>
          </div>
        </div>
      </div>

      {/* Error state */}
      <div
        className={cn(
          'transition-all duration-300 ease-out',
          error
            ? 'opacity-100 max-h-[200px] translate-y-0'
            : 'opacity-0 max-h-0 -translate-y-2 overflow-hidden'
        )}
      >
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button
            onClick={generateSummary}
            className="text-sm text-white-overlay hover:text-white transition-default underline"
          >
            {t( 'ai_summary.try_again' )}
          </button>
        </div>
      </div>

      {/* Summary content */}
      <div
        className={cn(
          'transition-all duration-500 ease-out',
          summary
            ? 'opacity-100 max-h-[400px] translate-y-0'
            : 'opacity-0 max-h-0 -translate-y-4 overflow-hidden'
        )}
      >
        <div
          ref={contentRef}
          className={cn(
            'max-h-[400px] overflow-y-auto pr-2',
            isLoading && 'opacity-70'
          )}
        >
          <Markdown content={summary} />
          {isLoading && (
            <span className="inline-block w-0.5 h-4 bg-white-overlay animate-pulse ml-1" />
          )}
        </div>
      </div>
    </div>
  )
}

export default AISummary
