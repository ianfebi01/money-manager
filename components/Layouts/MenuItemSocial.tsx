'use client';
import { cn, openNewTab } from '@/lib/utils'
import { Popover, Transition } from '@headlessui/react'
import { useMemo, useState } from 'react'
import CopyToClipboard from '../Inputs/CopyToClipboard'
import { ArraysSocials } from '@/types/generated/components'
import InstagramIcon from '../Icons/InstagramIcon'
import LinkedinIcon from '../Icons/LinkedinIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

interface Props {
  title: string
  socials: ArraysSocials['attributes'][]
}
export default function MenuItemSocial( { title, socials }: Props ) {
  const t = useTranslations( 'socials-desc' )
  const [show, setShow] = useState<boolean>( false )

  const email = useMemo( ()=>socials?.find( ( item ) => item.platform === 'Email' ), [socials] )

  return (
    <div className="relative">
      <Popover
        className="relative"
        onMouseEnter={() => setShow( true )}
        onMouseLeave={() => setShow( false )}
        onTouchStart={() => setShow( !show )}
      >
        {() => (
          <>
            <Popover.Button
              className={cn(
                'py-2 px-4 text-xs xl:text-base flex items-center gap-2 transition-default w-fit rounded-lg border border-transparent',
                ' hover:border-white/25',
                'ring-0 focus:ring-0 outline-none',
                show ? 'text-white border-white/25' : 'text-white/50'
              )}
            >
              <span>{title}</span>
              <div
                className={cn(
                  'transition-default group-hover:text-orange-300/80',
                  show ? 'text-white transform -rotate-180' : 'text-white/50'
                )}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            </Popover.Button>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
              show={show}
            >
              <Popover.Panel
                static
                className="absolute right-0 z-10 pt-3 w-screen max-w-xs px-4 sm:px-0"
              >
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative grid gap-8 bg-dark-secondary p-7">
                    {socials?.map( ( item, i ) => {
                      switch ( item.platform ) {
                      case 'Instagram':
                        return (
                          <button
                            key={i}
                            onClick={() => openNewTab( item.url )}
                            className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-dark focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                              <InstagramIcon aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-white text-left m-0">
                                {item.platform}
                              </p>
                              <p className="text-sm text-white/50 text-left m-0">
                                {t( 'instagram' )}
                              </p>
                            </div>
                          </button>
                        )
                      case 'LinkedIn':
                        return (
                          <button
                            key={i}
                            onClick={() => openNewTab( item.url )}
                            className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-dark focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                              <LinkedinIcon aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-white text-left m-0">
                                {item.platform}
                              </p>
                              <p className="text-sm text-white/50 text-left m-0">
                                {t( 'linkedin' )}
                              </p>
                            </div>
                          </button>
                        )
                      }
                    } )}
                  </div>
                  { email? (
                    <div className="bg-dark p-4">
                      <div className="flow-root w-full rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-dark-secondary focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50">
                        <span className="flex items-center">
                          <span className="text-sm font-medium text-white">
                            Email
                          </span>
                        </span>
                        <div className="block text-sm text-left text-white/50">
                          <CopyToClipboard
                            copyText={email.url}
                            className="text-md mt-2 mb-0"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
