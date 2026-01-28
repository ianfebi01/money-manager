'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePWAInstall } from '@/lib/hooks/usePWAInstall'
import Button from '@/components/Buttons/Button'
import ClientPortal from '@/components/Layouts/ClientPortal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faDownload } from '@fortawesome/free-solid-svg-icons'

// Detect iOS Safari
function isIOSSafari(): boolean {
  if ( typeof window === 'undefined' ) return false
  const ua = window.navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test( ua )
  const isWebkit = /WebKit/.test( ua )
  const isChrome = /CriOS/.test( ua )
  const isFirefox = /FxiOS/.test( ua )

  return isIOS && isWebkit && !isChrome && !isFirefox
}

// Check if already installed as standalone
function isStandalone(): boolean {
  if ( typeof window === 'undefined' ) return false

  return (
    window.matchMedia( '(display-mode: standalone)' ).matches ||
    ( 'standalone' in window.navigator &&
      ( window.navigator as { standalone?: boolean } ).standalone === true )
  )
}

// Storage key for iOS dismissal
const IOS_DISMISSAL_KEY = 'pwa-ios-install-dismissed'
const DISMISSAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export default function PWAInstallPrompt() {
  const t = useTranslations( 'pwa_install' )
  const { isShowPrompt, handleInstall, handleDismiss } = usePWAInstall()
  const [showIOSPrompt, setShowIOSPrompt] = useState( false )

  useEffect( () => {
    // Check for iOS Safari and show prompt if applicable
    if ( isIOSSafari() && !isStandalone() ) {
      const dismissedAt = localStorage.getItem( IOS_DISMISSAL_KEY )
      if ( dismissedAt ) {
        const dismissedTime = parseInt( dismissedAt, 10 )
        if ( Date.now() - dismissedTime < DISMISSAL_DURATION_MS ) {
          return
        }
        localStorage.removeItem( IOS_DISMISSAL_KEY )
      }

      // Show after 3 seconds
      const timer = setTimeout( () => {
        setShowIOSPrompt( true )
      }, 3000 )

      return () => clearTimeout( timer )
    }
  }, [] )

  const handleIOSDismiss = () => {
    setShowIOSPrompt( false )
    localStorage.setItem( IOS_DISMISSAL_KEY, Date.now().toString() )
  }

  const isVisible = isShowPrompt || showIOSPrompt
  const isIOS = showIOSPrompt && !isShowPrompt

  return (
    <ClientPortal selector="myportal"
      show
    >
      <Transition appear
        show={isVisible}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-50"
          onClose={isIOS ? handleIOSDismiss : handleDismiss}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          {/* Bottom Sheet */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center sm:items-center sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="w-full sm:max-w-md transform bg-dark rounded-t-2xl sm:rounded-2xl shadow-xl transition-all">
                  <div className="p-6">
                    {/* App Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <Image
                        src="/logo-no-bg.svg"
                        alt="Logo image"
                        width={50}
                        height={50}
                        priority
                        className='mt-2'
                      />
                      <div>
                        <Dialog.Title className="text-lg font-semibold text-white">
                          {t( 'title' )}
                        </Dialog.Title>
                        <p className="text-sm text-gray-400 mt-1">
                          {t( 'description' )}
                        </p>
                      </div>
                    </div>

                    {/* iOS Instructions */}
                    {isIOS && (
                      <div className="bg-dark rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-300 mb-3">
                          {t( 'ios_instructions' )}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">1.</span>
                            <span>{t( 'ios_step1' )}</span>
                            <svg
                              className="w-5 h-5 text-blue-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2L12 14M12 2L8 6M12 2L16 6M4 14V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-2">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">2.</span>
                            <span>{t( 'ios_step2' )}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 justify-end">
                      <Button
                        type="button"
                        variant='link'
                        onClick={isIOS ? handleIOSDismiss : handleDismiss}
                      >
                        <FontAwesomeIcon icon={faClock}/>
                        {t( 'dismiss' )}
                      </Button>
                      {!isIOS && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleInstall}
                        >
                          <FontAwesomeIcon icon={faDownload}/>
                          {t( 'install' )}
                        </Button>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </ClientPortal>
  )
}
