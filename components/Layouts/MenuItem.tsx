'use client'
import { cn } from '@/lib/utils'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover, Transition } from '@headlessui/react'
import { useState } from 'react'
import {
  NavCategoriesNavCategories,
  NavItemsNavItems,
} from '@/types/generated/components'
import { Link } from '@/i18n/navigation'
import constructNavUrl from '@/utils/construct-nav-url'
import { ApiPagePage } from '@/types/generated/contentTypes'

interface Props {
  data: NavCategoriesNavCategories['attributes']
}
export default function MenuItem( { data }: Props ) {
  const [show, setShow] = useState<boolean>( false )

  return (
    <div className="relative">
      <Popover
        className="relative"
        onMouseEnter={() => setShow( true )}
        onMouseLeave={() => setShow( false )}
        onTouchStart={() => setShow( !show )}
      >
        {() =>
          data.navItems?.length ? (
            <>
              <Popover.Button
                className={cn(
                  'py-2 px-4 text-xs xl:text-base flex items-center gap-2 transition-default w-fit rounded-lg border border-transparent',
                  ' hover:border-white/25',
                  'ring-0 focus:ring-0 outline-none',
                  show ? 'text-white border-white/25' : 'text-white/50',
                  !data?.categoryName && !data.navItem && 'cursor-default'
                )}
              >
                {!!data?.categoryName && data.navItem ? (
                  <Link
                    href={constructNavUrl( data.navItem )}
                    className="no-underline"
                  >
                    {data.categoryName}
                  </Link>
                ) : !!data?.categoryName ? (
                  data?.categoryName
                ) : null}

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
                    <div className="relative grid bg-dark-secondary p-4">
                      {data.navItems.map(
                        ( item: NavItemsNavItems['attributes'], i: number ) => (
                          <div
                            key={i}
                            className={cn(
                              i !== data.navItems?.length - 1 &&
                                'border-b border-dark mb-2 pb-2'
                            )}
                          >
                            <Link
                              href={constructNavUrl( item )}
                              className="no-underline w-full"
                              target={item.newTab ? '_blank' : undefined}
                              rel={
                                item.newTab ? 'noopener noreferrer' : undefined
                              }
                            >
                              <button
                                className={cn(
                                  'flex items-center rounded-lg p-2 min-h-20   w-full',
                                  ' text-sm xl:text-base font-medium text-left ',
                                  'transition duration-150 ease-in-out',
                                  'hover:bg-dark focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50 hover:shadow-xl'
                                )}
                              >
                                {item?.name || ( item.page?.data as ApiPagePage )?.attributes?.title}
                              </button>
                            </Link>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          ) : (
            <Link
              href={constructNavUrl( data?.navItem )}
              className={cn(
                'py-2 px-4 text-xs xl:text-base no-underline flex items-center gap-2 transition-default w-fit rounded-lg border border-transparent',
                ' hover:border-white/25',
                'ring-0 focus:ring-0 outline-none',
                show ? 'text-white border-white/25' : 'text-white/50',
                !data?.categoryName && !data.navItem && 'cursor-default'
              )}
              target={data.navItem?.newTab ? '_blank' : undefined}
              rel={data.navItem?.newTab ? 'noopener noreferrer' : undefined}
            >
              {data.categoryName}
            </Link>
          )
        }
      </Popover>
    </div>
  )
}
