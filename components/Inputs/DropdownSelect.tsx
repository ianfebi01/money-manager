import { Fragment, useMemo } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { IOptions } from '@/types/form'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface Props {
  label?: string
  options: IOptions[]
  value: IOptions['value']
  onChange: ( value: IOptions['value'] ) => void
}

export default function DropdownSelect( {
  label = '',
  options = [],
  value,
  onChange,
}: Props ) {
  const t = useTranslations()
  const selectedLabel = useMemo( () => {
    return options.find( ( opt ) => opt.value === value )?.label || ''
  }, [value, options] )

  const handleSelect = ( value: IOptions['value'] ) => {
    onChange( value )
  }

  return (
    <Menu as="div"
      className="relative inline-block text-left w-full"
    >
      {( { open } ) => (
        <>
          <Menu.Button
            className={cn(
              'w-full min-w-[300px]',
              'flex justify-between items-center text-left',
              'p-2 border rounded-lg bg-transparent ring-0 focus:ring-0 shadow-none focus:outline-none transition-colors duration-500 ease-in-out',
              'text-base',
              ['focus:border-white/50 border-white/25'],
              ['pr-4']
            )}
          >
            <span className="p m-0 line-clamp-1 text-base">{selectedLabel || label}</span>
            <div
              className={`transition-all duration-300 ease-out ${
                open ? '-rotate-180' : ''
              }`}
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                className="text-white-overlay"
              />
            </div>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute left-0 mt-2 origin-top-left bg-dark shadow-2xl focus:outline-none w-full z-[11] rounded overflow-hidden">
              <div className="divide-y divide-white-overlay-2 max-h-[250px] overflow-y-auto">
                {options.length ? (
                  options.map( ( item, index ) => (
                    <Menu.Item key={index}>
                      {( { active } ) => (
                        <button
                          type="button"
                          onClick={() => handleSelect( item.value )}
                          className={`flex items-center justify-between w-full gap-2 px-4 py-3 text-left no-underline transition-all duration-300 ease-in-out cursor-pointer ${
                            active ? 'bg-dark-secondary' : ''
                          }`}
                        >
                          <span className="p m-0 line-clamp-2 text-base">
                            {item.label}
                          </span>
                          {value === item.value && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-white-overlay w-4 h-4 shrink-0"
                            />
                          )}
                        </button>
                      )}
                    </Menu.Item>
                  ) )
                ) : (
                  <div className="flex items-center justify-between w-full gap-2 py-3 mx-4 text-left">
                    <p className="m-0">{t( 'no_option' )}</p>
                  </div>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
