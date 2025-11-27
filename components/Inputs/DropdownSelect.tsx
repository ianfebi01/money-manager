import { Fragment, useMemo } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft, faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { IOptions } from '@/types/form'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface Props {
  label?: string
  options: IOptions[]
  value: IOptions['value']
  onChange: ( value: IOptions['value'] ) => void
  resettable?: boolean
  resetLabel?: string
  resetValue?: IOptions['value']
  icon?: React.ReactNode // custom icon prop
}

export default function DropdownSelect( {
  label = '',
  options = [],
  value,
  onChange,
  resettable = false,
  resetLabel = 'Reset',
  resetValue = '',
  icon, // custom icon
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
              'min-w-[120px] w-full',
              'flex justify-between items-center text-left gap-4',
              'p-2 border rounded-lg bg-transparent ring-0 focus:ring-0 shadow-none focus:outline-none transition-colors duration-500 ease-in-out',
              'text-base',
              ['focus:border-white/50 border-white/25'],
              ['pr-4']
            )}
          >
            <span className="p m-0 line-clamp-1 text-base">{selectedLabel || label}</span>
            <div
              className={`transition-all duration-300 ease-out ${open && !icon ? '-rotate-180' : ''}`}
            >
              {icon ? (
                icon
              ) : (
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-white-overlay"
                />
              )}
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
            <Menu.Items className="absolute right-0 mt-2 origin-top-left bg-dark border border-white-overlay-2 min-w-[150px] w-full shadow-2xl focus:outline-none z-[11] rounded-lg overflow-hidden p-1">
              <div className="max-h-[250px] overflow-y-auto">
                {resettable && (
                  <div className='mb-1 pb-1 border-b border-white-overlay-2'>
                  
                    <Menu.Item>
                      <button
                        type="button"
                        onClick={() => handleSelect( resetValue )}
                        className="flex items-center justify-start w-full gap-2 px-2 py-1.5 text-left no-underline transition-all duration-300 ease-in-out cursor-pointer hover:bg-dark-secondary rounded-lg text-xs"
                      >
                        <FontAwesomeIcon icon={faArrowRotateLeft}
                          className='text-orange'
                        />
                        <span>{resetLabel}</span>
                      </button>
                    </Menu.Item>
                  </div>
                )}
                {options.length ? (
                  options.map( ( item, index ) => (
                    <Menu.Item key={index}>
                      {( { active } ) => (
                        <button
                          type="button"
                          onClick={() => handleSelect( item.value )}
                          className={`flex items-center justify-between w-full gap-2 px-2 py-1.5 text-left no-underline transition-all duration-300 ease-in-out cursor-pointer hover:bg-dark-secondary rounded-lg ${active ? 'bg-dark-secondary' : ''}`}
                        >
                          <span className="p m-0 line-clamp-2 text-sm">
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
                  <span className="text-xs text-white-overlay">
                    {t( 'no_option' )}
                  </span>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
