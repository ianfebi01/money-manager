'use client'
import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClientOptions } from '@/lib/constants'

interface Props {
  children: ReactNode
}

function makeQueryClient() {
  return new QueryClient( 
    queryClientOptions
  )
}
  
let browserQueryClient: QueryClient | undefined = undefined
  
export function getQueryClient() {
  if ( typeof window === 'undefined' ) {
	  // Server: always make a new query client
	  return makeQueryClient()
  } else {
	  // Browser: make a new query client if we don't already have one
	  // This is very important so we don't re-make a new client if React
	  // suspends during the initial render. This may not be needed if we
	  // have a suspense boundary BELOW the creation of the query client
	  if ( !browserQueryClient ) browserQueryClient = makeQueryClient()
	  
    return browserQueryClient
  }
}

const ReactQueryProvider = ( { children }: Props ) => {
  // const [queryClient] = useState( () => new QueryClient( queryClientOptions ) )
  const queryClient = getQueryClient()
	
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default ReactQueryProvider
