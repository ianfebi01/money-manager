import Button from '@/components/Buttons/Button'
import DataTable from '@/components/DataTable'
import DefaultCategories from '@/components/DefaultCategories'
import { IFilter, useExportExcel, useGetDatas } from '@/lib/hooks/api/cashFlow'
import useDebounce from '@/lib/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { ITransaction } from '@/types/api/transaction'
import formatCurency from '@/utils/format-curency'
import { faFileExcel, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ColumnDef } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { format, Locale } from 'date-fns'
import { enUS, id as idLocale } from 'date-fns/locale'

interface Props {
  filter: IFilter
  handleDelete: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => void
  handleEdit: ( row: ITransaction ) => void
}

const TransactionTable = ( { filter, handleDelete, handleEdit }: Props ) => {
  const t = useTranslations()
  const currentLocale = useLocale()
  const [isExporting, setIsExporting] = useState( false )
  const { exportExcel } = useExportExcel()

  // Server-side pagination state
  const [page, setPage] = useState( 1 )
  const [pageSize, setPageSize] = useState( 20 )
  const [sortBy, setSortBy] = useState<string>( 'date' )
  const [search, setSearch] = useState( '' )
  const debouncedSearch = useDebounce( search, 300 )

  const handleExport = useCallback( async () => {
    setIsExporting( true )
    try {
      await exportExcel( filter )
    } finally {
      setIsExporting( false )
    }
  }, [exportExcel, filter] )
  
  // Get the date-fns locale based on next-intl locale
  const dateFnsLocale: Locale = useMemo( () => {
    const localeMap: Record<string, Locale> = {
      en : enUS,
      id : idLocale,
    }

    return localeMap[currentLocale] || enUS
  }, [currentLocale] )

  // Handle grouping change - update sortBy and reset page
  const handleGroupingChange = useCallback( ( groupBy: string | null ) => {
    setSortBy( groupBy || 'date' )
    setPage( 1 )
  }, [] )

  // Handle search change
  const handleSearchChange = useCallback( ( value: string ) => {
    setSearch( value )
  }, [] )

  // Combine filter with sortBy and search for API call
  const apiFilter = useMemo( () => ( {
    ...filter,
    sortBy,
    search : debouncedSearch || undefined,
  } ), [filter, sortBy, debouncedSearch] )

  const { data: response, isFetching } = useGetDatas( pageSize, page, apiFilter, true )
  const tableData = response?.data || []
  const pagination = response?.meta?.pagination

  // Format date with locale
  const formatDateWithLocale = useCallback( ( dateValue: string | undefined ) => {
    if ( !dateValue ) return '-'
    const [year, month, day] = dateValue.split( '-' ).map( Number )
    const date = new Date( year, month - 1, day )

    return format( date, 'EEE, d', { locale : dateFnsLocale } )
  }, [dateFnsLocale] )

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
        id          : 'description',
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
        id          : 'category_name',
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
        id          : 'type',
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
        id          : 'amount',
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
        accessorKey : 'local_date',
        id          : 'date',
        header      : t( 'date' ),
        cell        : ( { getValue } ) => {
          const dateValue = getValue<string | undefined>()
          if ( !dateValue ) return <span className="text-white/80 text-sm">-</span>
          
          return (
            <span className="text-white/80 text-sm whitespace-nowrap">
              {formatDateWithLocale( dateValue )}
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
    [ handleDelete, t, formatDateWithLocale ]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={isExporting || isFetching}
          ariaLabel={t( 'export_excel' )}
        >
          <FontAwesomeIcon
            icon={faFileExcel}
            className="mr-2"
          />
          {isExporting ? t( 'exporting' ) : t( 'export_excel' )}
        </Button>
      </div>
      <DataTable
        data={tableData}
        columns={columns}
        searchKeys={[ 'description', 'category_name', 'type', 'date' ]}
        onRowClick={ ( row ) => handleEdit( row ) }
        isLoading={isFetching}
        emptyMessage={ t( 'recent_transactions' ) }
        initialGrouping={[ 'date' ]}
        initialPageSize={pageSize}
        // Server-side pagination props
        manualPagination={true}
        pageCount={pagination?.totalPages || 1}
        totalRows={pagination?.total || 0}
        currentPage={page}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onGroupingChange={handleGroupingChange}
        onSearchChange={handleSearchChange}
      />
    </div>
  )
}

export default TransactionTable
