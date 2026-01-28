'use client'

import { useState, useEffect, Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { cn } from '@/lib/utils'
import capitalizeFirst from '@/utils/capitalize-first'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useDebounce from '@/lib/hooks/useDebounce'

interface AutocompleteTextFieldProps {
  value: string
  onChange: ( value: string ) => void
  placeholder?: string
  name?: string
  disabled?: boolean
  small?: boolean
  capitalizeFirstChar?: boolean
  enabled?: boolean
}

async function fetchDescriptions( query: string ): Promise<string[]> {
  if ( !query ) return []
  const { data } = await axios.get( '/api/transactions/descriptions', {
    params : { query, limit : 5 },
  } )

  return data.data || []
}

export default function AutocompleteTextField( {
  value,
  onChange,
  placeholder = '',
  name,
  disabled = false,
  small = false,
  capitalizeFirstChar = false,
  enabled = true,
}: AutocompleteTextFieldProps ) {
  const [query, setQuery] = useState( value )

  // Sync query with external value changes
  useEffect( () => {
    setQuery( value )
  }, [value] )

  // Use existing debounce hook
  const debouncedQuery = useDebounce( query, 300 )

  const { data: suggestions = [] } = useQuery( {
    queryKey : ['descriptions', debouncedQuery],
    queryFn  : () => fetchDescriptions( debouncedQuery ),
    enabled  : enabled && debouncedQuery.length > 0,
  } )

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    let newValue = e.target.value
    if ( capitalizeFirstChar ) {
      newValue = capitalizeFirst( newValue )
    }
    setQuery( newValue )
    onChange( newValue )
  }

  const handleSelect = ( selectedValue: string ) => {
    let finalValue = selectedValue
    if ( capitalizeFirstChar ) {
      finalValue = capitalizeFirst( selectedValue )
    }
    setQuery( finalValue )
    onChange( finalValue )
  }

  // Filter suggestions that include the query but exclude exact match
  const filteredSuggestions = suggestions.filter(
    ( s ) => s.toLowerCase() !== query.toLowerCase()
  )

  return (
    <Combobox
      value={value}
      onChange={handleSelect}
      disabled={disabled}
    >
      <div className="relative">
        <Combobox.Input
          id={name}
          name={name}
          placeholder={placeholder}
          displayValue={() => query}
          onChange={handleInputChange}
          className={cn(
            'w-full',
            [small ? 'py-1 px-2 text-xs rounded-md' : 'py-2 px-2 text-base rounded-lg'],
            'text-white border bg-transparent ring-0 focus:ring-0 shadow-none focus:outline-none transition-colors duration-500 ease-in-out placeholder:text-white-overlay',
            'focus:border-white/50 border-white/25',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options
            className={cn(
              'absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg',
              'bg-dark border border-white/25',
              'py-1 text-base shadow-lg focus:outline-none mx-0 text-left'
            )}
          >
            {filteredSuggestions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-white-overlay">
                No suggestions
              </div>
            ) : (
              filteredSuggestions.map( ( suggestion, index ) => (
                <Combobox.Option
                  key={index}
                  value={suggestion}
                  className={( { active } ) =>
                    cn(
                      'relative cursor-pointer select-none py-2 px-4',
                      active ? 'bg-dark-secondary text-white' : 'text-white-overlay'
                    )
                  }
                >
                  {( { selected } ) => (
                    <span className={cn( selected ? 'font-semibold' : 'font-normal' )}>
                      {suggestion}
                    </span>
                  )}
                </Combobox.Option>
              ) )
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}
