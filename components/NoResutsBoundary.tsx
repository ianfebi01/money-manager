import { ReactNode } from 'react'
import { useInstantSearch } from 'react-instantsearch'

interface NoResultsBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

export function NoResultsBoundary( {
  children,
  fallback,
}: NoResultsBoundaryProps ) {
  const { results } = useInstantSearch()

  // The `__isArtificial` flag ensures not to display the No Results message
  // when no hits have been returned artificially.
  if ( !results.__isArtificial && results.nbHits === 0 ) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  return <>{children}</>
}
