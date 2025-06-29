import React from 'react'
import { Disclosure } from '@headlessui/react'
import { Transition } from '@headlessui/react'
import { Link } from '@/i18n/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import {
  NavCategoriesNavCategories,
  NavItemsNavItems,
} from '@/types/generated/components'
import constructNavUrl from '@/utils/construct-nav-url'
import { cn } from '@/lib/utils'
import { motion, easeInOut } from 'framer-motion'
import { ApiPagePage } from '@/types/generated/contentTypes'

interface AccordionMenuProps {
  menus: NavCategoriesNavCategories['attributes'][]
  mobileMenuOpen?: boolean
  setMobileMenuOpen?: ( open: boolean ) => void
  animationControl: any
}

const AccordionMenu: React.FC<AccordionMenuProps> = ( {
  menus,
  mobileMenuOpen,
  animationControl,
  setMobileMenuOpen,
} ) => {
  if ( !menus?.length ) return null

  return (
    <div className="mt-6 flex grow w-full">
      <div className="py-6 flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4 w-full h-full text-white">
          {menus.map( ( item, key ) => (
            <div key={key}>
              <motion.div
                variants={{
                  hidden : {
                    opacity : 0,
                    y       : mobileMenuOpen ? 75 : -75,
                  },
                  visible : {
                    opacity : 1,
                    y       : 0,
                  },
                }}
                initial="hidden"
                animate={animationControl}
                transition={{
                  duration : mobileMenuOpen ? 0.6 : 0.6,
                  delay    : mobileMenuOpen ? 0 + key / 12 : 0 + key / 12,
                  ease     : easeInOut,
                }}
              >
                {!!item.categoryName && item.navItems.length > 0 ? (
                  <Disclosure as="div">
                    {( { open } ) => (
                      <dl
                        className={`py-2 hover:bg-dark-secondary rounded-lg overflow-x-clip transition-all duration-300 ease-in-out ${
                          open ? 'bg-dark-secondary' : ''
                        }`}
                      >
                        <dt>
                          <Disclosure.Button className="flex w-full items-start justify-between text-left text-white">
                            <Link
                              href={constructNavUrl( item.navItem ) || ''}
                              className={cn(
                                'h3 pl-4 underline-offset-4',
                                !constructNavUrl( item.navItem )
                                  ? 'no-underline pointer-events-none'
                                  : 'no-underline hover:underline pointer-events-auto'
                              )}
                              aria-disabled={!constructNavUrl( item.navItem )}
                              tabIndex={
                                !constructNavUrl( item.navItem ) ? -1 : undefined
                              }
                              onClick={() =>
                                setMobileMenuOpen && setMobileMenuOpen( false )
                              }
                            >
                              {item.categoryName}
                            </Link>
                            <span className="ml-6 flex h-7 items-center pr-4 text-soft-grey hover:text-blue-dark">
                              <FontAwesomeIcon
                                className={`size-4 transition-all ease-in-out ${
                                  open ? '-rotate-45' : ''
                                }`}
                                aria-hidden="true"
                                icon={faPlusCircle}
                              />
                            </span>
                          </Disclosure.Button>
                        </dt>
                        <dd>
                          <Transition
                            enterFrom="transform max-h-0 opacity-0"
                            enterTo="transform max-h-[500px] opacity-100 duration-700 ease-in-out"
                            leaveFrom="transform max-h-[500px] opacity-100"
                            leaveTo="transform max-h-0 opacity-0 duration-700 ease-in-out"
                          >
                            <Disclosure.Panel
                              as="div"
                              className="flex overflow-y-hidden"
                            >
                              <div className="px-4 my-4 text-xs lg:text-[1.1rem] ml-4">
                                <div className="flex flex-col gap-4">
                                  {item.navItems.map(
                                    (
                                      subItem: NavItemsNavItems['attributes'],
                                      indexSubitem: number
                                    ) => (
                                      <Link
                                        key={indexSubitem}
                                        href={constructNavUrl( subItem )}
                                        className="block p m-0 underline-offset-4 decoration-2 no-underline hover:underline"
                                        target={
                                          subItem?.newTab ? '_blank' : undefined
                                        }
                                        rel={
                                          subItem?.newTab
                                            ? 'noopener noreferrer'
                                            : undefined
                                        }
                                        onClick={() =>
                                          setMobileMenuOpen &&
                                          setMobileMenuOpen( false )
                                        }
                                      >
                                        {subItem?.name ||
                                          ( subItem.page?.data as ApiPagePage )
                                            ?.attributes?.title}
                                      </Link>
                                    )
                                  )}
                                </div>
                              </div>
                            </Disclosure.Panel>
                          </Transition>
                        </dd>
                      </dl>
                    )}
                  </Disclosure>
                ) : !!item.categoryName && item.navItem ? (
                  <Link
                    href={constructNavUrl( item.navItem ) || ''}
                    className={cn(
                      'h3 px-4 underline-offset-4 w-full block',
                      'py-2 hover:bg-dark-secondary rounded-lg overflow-x-clip transition-all duration-300 ease-in-out',
                      !constructNavUrl( item.navItem )
                        ? 'no-underline pointer-events-none'
                        : 'no-underline hover:underline pointer-events-auto'
                    )}
                    aria-disabled={!constructNavUrl( item.navItem )}
                    tabIndex={!constructNavUrl( item.navItem ) ? -1 : undefined}
                    onClick={() =>
                      setMobileMenuOpen && setMobileMenuOpen( false )
                    }
                  >
                    {item.categoryName}
                  </Link>
                ) : null}
              </motion.div>
            </div>
          ) )}
        </div>
      </div>
    </div>
  )
}

export default AccordionMenu
