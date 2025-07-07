'use client'

import { useGetRecentTransactions } from '@/lib/hooks/api/cashFlow'
import { cn } from '@/lib/utils'
import { ITransaction } from '@/types/api/transaction'
import formatCurency from '@/utils/format-curency'

interface Props {
  enabled: boolean
  onClick: ( item: ITransaction ) => void
}

const RecentTransactions = ( { enabled = false, onClick }: Props ) => {
  const { data, isFetching } = useGetRecentTransactions( 5, enabled )

  /**
   * fake array
   */
  const mockLoop = new Array( 9 ).fill( 0 )

  return (
    <div>
      <p className="mt-0 mb-1 text-left text-white-overlay text-sm">
        Recent transactions:
      </p>
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
      </div>
    </div>
  )
}

export default RecentTransactions
