'use client';
import { socials } from '@/lib/constans/socials-media'
import { cn, openNewTab } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import { useAnimation, motion, easeInOut } from 'framer-motion'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import AccordionMenu from './AccordionMenu'
import { NavCategoriesNavCategories } from '@/types/generated/components'
import ClientPortal from './ClientPortal'
import Hamburger from '../Icons/Hamburger'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import LocaleSwitcherAccordion from './LocaleSwitcherAccordion';

interface Props {
  isOpen: boolean
  items: NavCategoriesNavCategories['attributes'][]
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const MobileNavbar = ( { isOpen, items, setIsOpen }: Props ) => {
  const animationControl = useAnimation()
  const [showItem, setShowItem] = useState<boolean>( false )

  const startAnimation = useCallback( () => {
    if ( showItem ) {
      animationControl.start( 'visible' )
    } else if ( !showItem ) {
      animationControl.start( 'hidden' )
    }
  }, [showItem, animationControl] )

  useEffect( () => {
    startAnimation()
  }, [startAnimation] )

  return (
    <ClientPortal selector="myportal"
      show={true}
    >
      <Transition
        className="h-full w-full fixed top-0 z-50"
        appear={true}
        show={isOpen}
        afterEnter={() => setShowItem( true )}
        beforeLeave={() => setShowItem( false )}
      >
        <Transition.Child
          className={cn(
            'h-[100dvh]',
            'md:hidden',
            'transition-all duration-300 ease-out delay-500 opacity-0 flex flex-col'
          )}
          // enter="transition-all duration-300 ease-out delay-500"
          // enterFrom="opacity-0"
          enterTo="bg-dark opacity-100 relative z-50"
          // leave="duration-300 ease-in delay-[600ms]"
          // leaveFrom="no-doc-scroll bg-black opacity-100"
          // leaveTo="opacity-0"
        >
          <Link
            href={'/'}
            className="h-16 flex items-center pl-6"
            onClick={() => setIsOpen( false )}
          >
            <Image src="/Logo.svg"
              alt="Logo image"
              width={40}
              height={40}
              priority
            />
          </Link>
          <div className="absolute top-4 right-4 z-50 md:hidden">
            <Hamburger open={isOpen}
              setOpen={setIsOpen}
            />
          </div>
          <div className="flex flex-col grow p-6 justify-center items-center font-bold text-xl text-white">
            <AccordionMenu
              menus={items}
              mobileMenuOpen={isOpen}
              animationControl={animationControl}
              setMobileMenuOpen={setIsOpen}
            />
            {socials.map( ( item, index ) => (
              <button
                onClick={() => openNewTab( item.href )}
                className={cn(
                  'flex items-center rounded-lg transition duration-150 ease-in-out overflow-hidden',
                  'focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50'
                )}
                key={index}
              >
                <motion.div
                  variants={{
                    hidden : {
                      opacity : 0,
                      y       : isOpen ? 75 : -75,
                    },
                    visible : {
                      opacity : 1,
                      y       : 0,
                    },
                  }}
                  initial="hidden"
                  animate={animationControl}
                  transition={{
                    duration : isOpen ? 0.3 : 0.3,
                    delay    : isOpen ? 0 + index / 20 : 0 + index / 20,
                    ease     : easeInOut,
                  }}
                >
                  <p className="h3 m-0">{item.name}</p>
                </motion.div>
              </button>
            ) )}
            <motion.div
              variants={{
                hidden : {
                  opacity : 0,
                  y       : isOpen ? 75 : -75,
                },
                visible : {
                  opacity : 1,
                  y       : 0,
                },
              }}
              initial="hidden"
              animate={animationControl}
              transition={{
                duration : isOpen ? 0.3 : 0.3,
                delay    : isOpen ? 0 : 0,
                ease     : easeInOut,
              }}
              className='mt-4'
            >
              <LocaleSwitcherAccordion />
            </motion.div>
          </div>
        </Transition.Child>
      </Transition>
    </ClientPortal>
  )
}

export default MobileNavbar
