import { cn } from '@/lib/utils'
import React, { createElement, FunctionComponent } from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch'
import NoDataFound from './NoDataFound'
import { NoResultsBoundary } from './NoResutsBoundary'

interface Props extends UseInfiniteHitsProps {
  component: FunctionComponent<any>
  wrapperClass?: string
}

export default function CustomInfiniteHits( {
  component,
  wrapperClass = 'list-none ml-0 grid grid-cols-1 md:grid-cols-2 gap-4',
  ...props
}: Props ) {
  const { items, sendEvent, showMore, isLastPage } = useInfiniteHits( props )

  return (
    <>
      <NoResultsBoundary fallback={<NoDataFound />}>
        <div className="flex flex-col gap-8 ">
          <ul className={wrapperClass}>
            {items.map( ( hit, index ) => (
              <li
                key={index}
                onClick={() => sendEvent( 'click', hit, 'Hit Clicked' )}
                onAuxClick={() => sendEvent( 'click', hit, 'Hit Clicked' )}
              >
                {createElement( component, { hit : hit } )}
              </li>
            ) )}
          </ul>
          <button
            onClick={showMore}
            disabled={isLastPage}
            className={cn( 'button button-secondary', {
              'button-disabled' : isLastPage,
            } )}
          >
            Show more results
          </button>
        </div>
      </NoResultsBoundary>
    </>
  )
}
