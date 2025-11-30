'use client';
import TextField from '@/components/Inputs/TextField'
import { IFilter, useGetDatas } from '@/lib/hooks/api/cashFlow'
import useDebounce from '@/lib/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { ITransaction } from '@/types/api/transaction'
import formatCurency from '@/utils/format-curency'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface Props {
  enabled: boolean
  onClick: ( item: ITransaction ) => void
}

const RecentTransactions = ( { enabled = false, onClick }: Props ) => {
  const t = useTranslations()

  const [filter, setFilter] = useState<IFilter>( {
    search : '',
  } )

  const debouncedSearch = useDebounce( filter.search, 500 )
  const { data, isFetching } = useGetDatas( 10, 1, { ...filter, search : debouncedSearch }, enabled )

  /**
   * fake array
   */
  const mockLoop = new Array( 9 ).fill( 0 )

  return (
    <div>
      <p className="mt-0 mb-1 text-left text-white-overlay text-sm">
        {t( 'recent_transactions' )}:
      </p>
      <div className='h-10 mb-2 w-fit'>
        <TextField
          value={filter.search as string}
          onChange={( e ) => setFilter( { ...filter, search : e } )}
          placeholder={t( 'search_transactions' )}
          type='text'
          className='h-4'
          small
        />
      </div>
      <div className="flex overflow-auto gap-2 items-center pb-4">
        {!isFetching &&
          !!data &&
          data?.data?.length > 0 &&
          data.data.map( ( item, index ) => (
            <button
              type="button"
              key={index}
              className={cn(
                'flex flex-col justify-center items-center bg-dark-secondary rounded-md p-2 h-[60px] w-40 shrink-0 overflow-hidden',
                [item.type === 'income' && 'border border-blue-400'],
                [item.type === 'expense' && 'border border-orange']
              )}
              onClick={() => onClick( item )}
            >
              <span className="font-bold text-sm m-0 w-full truncate text-ellipsis whitespace-nowrap overflow-hidden text-center line-clamp-1">
                {formatCurency( item.amount )}
              </span>
              <span className="p m-0 text-white-overlay line-clamp-1">
                {item.description}
              </span>
            </button>
          ) )}

        {isFetching &&
          mockLoop.map( ( _item, index ) => (
            <div
              key={index}
              className="bg-dark-secondary animate-pulse h-[60px] w-40 rounded-md shrink-0"
            ></div>
          ) )}

        {!isFetching && !data?.data?.length && (
          <div className="text-white-overlay">
            {t( 'no_data_found' )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentTransactions
