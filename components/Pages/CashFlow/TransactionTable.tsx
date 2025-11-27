import Button from '@/components/Buttons/Button'
import DataTable from '@/components/DataTable'
import DefaultCategories from '@/components/DefaultCategories'
import { IFilter, useGetDatas } from '@/lib/hooks/api/cashFlow'
import { cn } from '@/lib/utils'
import { ITransaction } from '@/types/api/transaction'
import formatCurency from '@/utils/format-curency'
import { faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  filter: IFilter
  handleDelete: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => void
  handleEdit: ( row: ITransaction ) => void
}

const TransactionTable = ( { filter, handleDelete, handleEdit }: Props ) => {
  const t = useTranslations();
  const { data: allData, isFetching } = useGetDatas( 100, 1, filter, true )
  const tableData = allData?.data || []

  const columns: ColumnDef<ITransaction>[] = useMemo(
    () => [
      {
        id             : 'index',
        header         : '#',
        enableHiding   : false,
        enableSorting  : false,
        enableGrouping : false,
        size           : 50,
        cell           : ( { row } ) => (
          <span className="text-white-overlay text-sm">{row.index + 1}</span>
        ),
        aggregatedCell : ( { row } ) =>
          row.subRows?.length ? (
            <span className="px-2 py-1 rounded text-xs bg-white/20 text-white whitespace-nowrap">
              {row.subRows?.length || 0} Transactions
            </span>
          ) : (
            <span className="text-white-overlay text-sm">-</span>
          ),
      },
      {
        accessorKey : 'description',
        header      : t( 'description' ),
        cell        : ( { row } ) => (
          <span className="line-clamp-1">{row.original.description}</span>
        ),
        aggregatedCell : ( { row } ) => (
          <span className="text-white-overlay text-sm">
            {row.subRows?.length || 0} item
            {row.subRows?.length === 1 ? '' : 's'}
          </span>
        ),
        enableGrouping : false,
      },
      {
        accessorKey : 'category_name',
        header      : t( 'category' ),
        cell        : ( { row } ) => (
          <div className="min-w-[120px] text-white-overlay">
            {row.original.category_name ? (
              <DefaultCategories name={row.original.category_name} />
            ) : (
              <span className="text-white-overlay">-</span>
            )}
          </div>
        ),
        aggregatedCell : () => <span className="text-white-overlay">-</span>,
      },
      {
        accessorKey : 'type',
        header      : t( 'type' ),
        cell        : ( { row } ) => (
          <span
            className={cn( 'px-2 py-1 rounded text-xs uppercase', {
              'bg-blue-500/20 text-blue-300' : row.original.type === 'income',
              'bg-orange/20 text-orange'     : row.original.type === 'expense',
              'text-white-overlay border border-white-overlay-2' :
                row.original.type !== 'income' &&
                row.original.type !== 'expense',
            } )}
          >
            {row.original.type}
          </span>
        ),
        aggregatedCell : () => <span className="text-white-overlay">-</span>,
      },
      {
        accessorKey : 'amount',
        header      : t( 'amount' ),
        cell        : ( { row } ) => (
          <p
            className={cn( 'm-0 font-semibold text-right', {
              'text-blue-400' : row.original.type === 'income',
              'text-orange'   : row.original.type === 'expense',
            } )}
          >
            {formatCurency( row.original.amount )}
          </p>
        ),
        aggregationFn  : 'sum',
        aggregatedCell : ( { getValue } ) => (
          <p className="m-0 font-semibold text-right text-white">
            {formatCurency( Number( getValue() ) || 0 )}
          </p>
        ),
      },
      {
        accessorKey : 'date',
        header      : t( 'date' ),
        cell        : ( { getValue } ) => {
          const dateValue = getValue<string | undefined>()
          const formatted = dateValue
            ? new Date( dateValue ).toLocaleDateString( undefined, {
              weekday : 'short',
              day     : 'numeric',
            } )
            : '-'

          return (
            <span className="text-white/80 text-sm whitespace-nowrap">
              {formatted}
            </span>
          )
        },
        aggregationFn  : 'count',
        enableGrouping : true,
      },
      {
        id     : 'actions',
        header : t( 'action' ),
        size   : 60,
        cell   : ( { row } ) => (
          <div className="flex justify-end">
            <Button
              variant="iconOnly"
              ariaLabel="Delete transaction"
              onClick={( e ) => handleDelete( e, row.original.id )}
            >
              <FontAwesomeIcon
                icon={faSquareMinus}
                className="text-white-overlay"
              />
            </Button>
          </div>
        ),
      },
    ],
    [ handleDelete, t ]
  )

  return (
    <DataTable
      data={tableData}
      columns={columns}
      searchKeys={[ 'description', 'category_name', 'type', 'date' ]}
      onRowClick={ ( row ) => handleEdit( row ) }
      isLoading={isFetching}
      emptyMessage={ t( 'recent_transactions' ) }
      initialGrouping={[ 'date' ]}
      initialPageSize={20}
    />
  )
}

export default TransactionTable
