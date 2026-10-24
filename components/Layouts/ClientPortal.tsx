'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type ClientPortalInterface = {
  children: React.ReactNode
  show?: boolean
  onClose?: () => void
  selector: string
}

const ClientPortal = ( { children, selector, show = true }: ClientPortalInterface ) => {
  const [mounted, setMounted] = useState( false )

  useEffect( () => {
    setMounted( true )
  }, [] )

  if ( !show || !mounted ) return null

  const target = document.getElementById( selector )

  return target ? createPortal( children, target ) : null
}

export default ClientPortal