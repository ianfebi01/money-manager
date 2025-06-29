'use client'
import { cn } from '@/lib/utils'
import { Disclosure, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { routing } from '@/i18n/routing'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import { Locale, useTranslations } from 'next-intl'

export default function LocaleSwitcherAccordion() {
  const t = useTranslations( 'locale-switcher' )

  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()

  const changeLocale = ( locale: string ) => {
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale : locale }
    )
  }

  return (
    <div className="relative">
      <Disclosure as="div">
        {( { open } ) => (
          <dl
            className={`py-2 rounded-lg overflow-x-clip transition-all duration-300 ease-in-out `}
          >
            <dt>
              <Disclosure.Button className="flex w-full items-start justify-between text-left text-white-overlay">
                <span className='pl-4 text-sm'>{t( 'title' )}</span>
                <span className="ml-4 flex items-center pr-4 text-soft-grey hover:text-blue-dark">
                  <FontAwesomeIcon
                    className={`h-3 w-3 transition-all ease-in-out ${
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
                  <div className="px-4 text-xs lg:text-[1.1rem] w-full">
                    <div className="flex flex-col items-center gap-2 mt-2">
                      {routing.locales.map(
                        (
                          subItem: Locale,
                          indexSubitem: number
                        ) => (
                          <button
                            key={indexSubitem}
                            onClick={() => changeLocale( subItem )}
                            className={cn(
                              'flex items-center rounded-lg min-h-20',
                              ' text-sm text-left uppercase',
                              'transition duration-150 ease-in-out',
                              'focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50 hover:shadow-xl text-white-overlay'
                            )}
                          >
                            {subItem}
                          </button>
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
    </div>

  )
}
