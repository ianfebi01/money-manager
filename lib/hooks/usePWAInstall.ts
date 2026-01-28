'use client'

import { useState, useEffect, useCallback } from 'react'

// Define the BeforeInstallPromptEvent type
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// Storage key for remembering dismissal
const DISMISSAL_KEY = 'pwa-install-dismissed'
const DISMISSAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface UsePWAInstallReturn {
  isInstallable: boolean
  isShowPrompt: boolean
  handleInstall: () => Promise<void>
  handleDismiss: () => void
}

export function usePWAInstall( delay: number = 3000 ): UsePWAInstallReturn {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>( null )
  const [isInstallable, setIsInstallable] = useState( false )
  const [isShowPrompt, setIsShowPrompt] = useState( false )

  // Check if we should show the prompt (respects dismissal cooldown)
  const shouldShowPrompt = useCallback( (): boolean => {
    if ( typeof window === 'undefined' ) return false

    const dismissedAt = localStorage.getItem( DISMISSAL_KEY )
    if ( dismissedAt ) {
      const dismissedTime = parseInt( dismissedAt, 10 )
      const now = Date.now()
      if ( now - dismissedTime < DISMISSAL_DURATION_MS ) {
        return false
      }
      // Cooldown expired, remove the key
      localStorage.removeItem( DISMISSAL_KEY )
    }

    return true
  }, [] )

  useEffect( () => {
    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = ( e: Event ) => {
      e.preventDefault()
      setDeferredPrompt( e as BeforeInstallPromptEvent )
      setIsInstallable( true )

      // Show prompt after delay if not dismissed recently
      if ( shouldShowPrompt() ) {
        setTimeout( () => {
          setIsShowPrompt( true )
        }, delay )
      }
    }

    // Handle app installed event
    const handleAppInstalled = () => {
      setDeferredPrompt( null )
      setIsInstallable( false )
      setIsShowPrompt( false )
    }

    window.addEventListener( 'beforeinstallprompt', handleBeforeInstallPrompt )
    window.addEventListener( 'appinstalled', handleAppInstalled )

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener( 'appinstalled', handleAppInstalled )
    }
  }, [delay, shouldShowPrompt] )

  const handleInstall = useCallback( async () => {
    if ( !deferredPrompt ) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if ( outcome === 'accepted' ) {
      setDeferredPrompt( null )
      setIsInstallable( false )
    }

    setIsShowPrompt( false )
  }, [deferredPrompt] )

  const handleDismiss = useCallback( () => {
    setIsShowPrompt( false )
    // Remember dismissal
    localStorage.setItem( DISMISSAL_KEY, Date.now().toString() )
  }, [] )

  return {
    isInstallable,
    isShowPrompt,
    handleInstall,
    handleDismiss,
  }
}
