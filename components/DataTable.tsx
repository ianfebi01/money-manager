'use client';
import {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ColumnDef,
  GroupingState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faMinus, faPlus, faSliders } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl'
import { Menu, Transition } from '@headlessui/react'
import TextField from './Inputs/TextField';

type DataTableProps<TData> = {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  searchKeys?: ( keyof TData | string )[]
  searchPlaceholder?: string
  pageSizeOptions?: number[]
  initialPageSize?: number
  emptyMessage?: string
  isLoading?: boolean
  loadingRows?: number
  onRowClick?: ( row: TData ) => void
  enableSelection?: boolean
  renderToolbar?: ReactNode
  className?: string
  enableColumnVisibility?: boolean
  initialGrouping?: string[]
}

const DEFAULT_PAGE_SIZES = [5, 10, 20, 50]

const getValueFromPath = ( item: unknown, path: string ) => {
  return path.split( '.' ).reduce<unknown>( ( acc, segment ) => {
    if ( acc === null || acc === undefined ) return undefined
    if ( typeof acc !== 'object' ) return undefined

    return ( acc as Record<string, unknown> )[segment]
  }, item )
}

const DataTable = <TData, >( {
  columns,
  data,
  searchKeys,
  searchPlaceholder,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  initialPageSize = 10,
  emptyMessage,
  isLoading = false,
  loadingRows = 6,
  onRowClick,
  enableSelection = false,
  renderToolbar,
  className,
  enableColumnVisibility = true,
  initialGrouping = [],
}: DataTableProps<TData> ) => {
  const t = useTranslations()
  const [sorting, setSorting] = useState<SortingState>( [] )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>( {} )
  const [searchQuery, setSearchQuery] = useState( '' )
  const [grouping, setGrouping] = useState<GroupingState>( initialGrouping )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>( {} )
  const [showColumnMenu, setShowColumnMenu] = useState( false )
  const [expanded, setExpanded] = useState( {} )
  const columnMenuRef = useRef<HTMLDivElement | null>( null )

  const searchableKeys = useMemo( () => {
    if ( searchKeys && searchKeys.length > 0 ) {
      return searchKeys.map( ( key ) => String( key ) )
    }

    return columns
      .map( ( column ) => {
        if ( typeof column.id === 'string' ) return column.id
        // if ( typeof column?.accessorKey === 'string' ) return column?.accessorKey

        return undefined
      } )
      .filter( ( key ): key is string => Boolean( key ) )
  }, [columns, searchKeys] )

  const filteredData = useMemo( () => {
    const query = searchQuery.trim().toLowerCase()
    if ( !query ) return data

    if ( !searchableKeys.length ) {
      return data.filter( ( item ) =>
        JSON.stringify( item ).toLowerCase().includes( query )
      )
    }

    return data.filter( ( item ) =>
      searchableKeys.some( ( key ) => {
        const value = getValueFromPath( item, key )
        if ( value === null || value === undefined ) return false

        return String( value ).toLowerCase().includes( query )
      } )
    )
  }, [data, searchQuery, searchableKeys] )

  const selectionColumn: ColumnDef<TData, unknown> | null = useMemo( () => {
    if ( !enableSelection ) return null

    return {
      id            : '__select__',
      size          : 42,
      enableSorting : false,
      enableHiding  : false,
      header        : ( { table } ) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white-overlay-2 bg-transparent accent-blue-400"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-checked={
              table.getIsSomePageRowsSelected() ? 'mixed' : undefined
            }
          />
        </div>
      ),
      cell : ( { row } ) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white-overlay-2 bg-transparent accent-blue-400"
            checked={row.getIsSelected()}
            onClick={( event ) => event.stopPropagation()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
    }
  }, [enableSelection] )

  const columnsWithSelection = useMemo( () => {
    if ( !selectionColumn ) return columns

    return [selectionColumn, ...columns]
  }, [columns, selectionColumn] )

  const table = useReactTable( {
    data    : filteredData,
    columns : columnsWithSelection,
    state   : {
      sorting,
      rowSelection,
      columnVisibility,
      grouping,
      expanded,
    },
    onSortingChange          : setSorting,
    onRowSelectionChange     : setRowSelection,
    onColumnVisibilityChange : setColumnVisibility,
    onGroupingChange         : setGrouping,
    onExpandedChange         : setExpanded,
    enableRowSelection       : enableSelection,
    getCoreRowModel          : getCoreRowModel(),
    getSortedRowModel        : getSortedRowModel(),
    getGroupedRowModel       : getGroupedRowModel(),
    getExpandedRowModel      : getExpandedRowModel(),
    getPaginationRowModel    : getPaginationRowModel(),
    initialState             : {
      pagination : {
        pageSize : initialPageSize,
      },
    },
  } )

  useEffect( () => {
    table.setPageIndex( 0 )
  }, [searchQuery, filteredData.length, table] )

  useEffect( () => {
    const handleClickOutside = ( event: MouseEvent ) => {
      if (
        columnMenuRef.current &&
        !columnMenuRef.current.contains( event.target as Node )
      ) {
        setShowColumnMenu( false )
      }
    }

    if ( showColumnMenu ) {
      document.addEventListener( 'mousedown', handleClickOutside )
    }

    return () => {
      document.removeEventListener( 'mousedown', handleClickOutside )
    }
  }, [showColumnMenu] )

  useEffect( () => {
    if ( grouping.length > 0 && filteredData.length > 0 ) {
      setTimeout( () => {
        const collectGroupedRowIds = ( rows: any[] ): string[] => {
          let ids: string[] = []
          for ( const row of rows ) {
            if ( row.getIsGrouped() ) {
              ids.push( row.id )
              if ( row.subRows && row.subRows.length > 0 ) {
                ids = ids.concat( collectGroupedRowIds( row.subRows ) )
              }
            }
          }

          return ids
        }
        const allGroupIds = collectGroupedRowIds(
          table.getPrePaginationRowModel().rows
        )
        const expandedState = Object.fromEntries(
          allGroupIds.map( ( id ) => [id, true] )
        )
        setExpanded( expandedState )
      }, 0 )
    }
  }, [grouping, filteredData, table] )

  const pageSize = table.getState().pagination.pageSize
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const pageStart = filteredData.length
    ? table.getState().pagination.pageIndex * pageSize + 1
    : 0
  const pageEnd = Math.min( filteredData.length, currentPage * pageSize )
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const columnCount = table.getVisibleFlatColumns().length || 1

  return (
    <div className={cn( className )}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 py-3">
        <div className="relative w-full max-w-sm">
          <TextField
            value={searchQuery}
            placeholder={searchPlaceholder || t( 'search' )}
            onChange={( value ) => setSearchQuery( value )}
            type="text"
          />
        </div>

        {renderToolbar}

        {enableSelection && (
          <span className="text-sm text-white-overlay">
            {selectedCount} {t( 'selected' )}
          </span>
        )}

        <div className="grow" />

        {enableColumnVisibility && (
          <Menu as="div"
            className="relative text-left"
          >
            {( ) => (
              <>
                <Menu.Button
                  className={cn(
                    'min-w-[120px]',
                    'flex justify-between items-center text-left',
                    'p-2 border rounded-lg bg-transparent ring-0 focus:ring-0 shadow-none focus:outline-none transition-colors duration-500 ease-in-out',
                    'text-base',
                    ['focus:border-white/50 border-white/25'],
                    ['pr-4']
                  )}
                >
                  <span className="p m-0 line-clamp-1 text-base">
                    {t( 'columns' )}
                  </span>
                  <div
                    className={`transition-all duration-300 ease-out`}
                  >
                    <FontAwesomeIcon
                      icon={faSliders}
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
                  <Menu.Items className="absolute right-0 mt-2 origin-top-left bg-dark border border-white-overlay-2 w-[150px] shadow-2xl focus:outline-none z-[11] rounded-lg overflow-hidden p-1">
                    <div className="max-h-[250px] overflow-y-auto">
                      {table
                        .getAllLeafColumns()
                        .filter( ( column ) => column.getCanHide() )?.length
                        ? table
                          .getAllLeafColumns()
                          .filter( ( column ) => column.getCanHide() )
                          .map( ( column, index ) => (
                            <Menu.Item key={index}>
                              {( ) => (
                                <button
                                  type="button"
                                  onClick={( e ) => {
                                    e.preventDefault()
                                    column.toggleVisibility()
                                  }}
                                  className={`flex items-center justify-between w-full gap-2 px-2 py-1.5 text-left no-underline transition-all duration-300 ease-in-out cursor-pointer hover:bg-dark-secondary rounded-lg`}
                                >
                                  <span className="p m-0 line-clamp-2 text-sm">
                                    {column.columnDef.header &&
                                      typeof column.columnDef.header ===
                                        'string'
                                      ? column.columnDef.header
                                      : column.id}
                                  </span>
                                  {column.getIsVisible() && (
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className="text-white-overlay w-4 h-4 shrink-0"
                                    />
                                  )}
                                </button>
                              )}
                            </Menu.Item>
                          ) )
                        : !table
                          .getAllLeafColumns()
                          .some( ( column ) => column.getCanHide() ) && (
                          <span className="text-xs text-white-overlay">
                            {t( 'no_hideable_columns' )}
                          </span>
                        )}
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        )}
      </div>
      {/* End Toolbar */}

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-dark-secondary border-none">
            {table.getHeaderGroups().map( ( headerGroup ) => (
              <tr key={headerGroup.id}
                className="border-none"
              >
                {headerGroup.headers.map( ( header ) => (
                  <th
                    key={header.id}
                    style={{
                      width :
                        header.getSize() !== 0 ? header.getSize() : undefined,
                    }}
                    className={cn(
                      'py-2 first:rounded-l-lg last:rounded-r-lg',
                      header.column.getCanSort() && 'cursor-pointer select-none'
                    )}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2 font-normal">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="text-[10px] leading-none text-white-overlay">
                          {header.column.getIsSorted() === 'asc' && '▲'}
                          {header.column.getIsSorted() === 'desc' && '▼'}
                          {!header.column.getIsSorted() && '⇅'}
                        </span>
                      )}
                    </div>
                  </th>
                ) )}
              </tr>
            ) )}
          </thead>
          <tbody>
            {isLoading &&
              Array.from( { length : loadingRows } ).map( ( _, rowIndex ) => (
                <tr
                  key={`loading-${rowIndex}`}
                  className="border-dark-secondary border-t first:border-none"
                >
                  {Array.from( { length : columnCount } ).map( ( _, cellIndex ) => (
                    <td key={cellIndex}
                      className="px-4 py-4"
                    >
                      <div className="h-4 w-full animate-pulse rounded bg-dark-secondary" />
                    </td>
                  ) )}
                </tr>
              ) )}

            {!isLoading &&
              table.getRowModel().rows.map( ( row ) => (
                <tr
                  key={row.id}
                  className={cn(
                    ' border-dark-secondary transition-colors duration-200 border-t first:border-none',
                    onRowClick &&
                      row.subRows?.length === 0 &&
                      'cursor-pointer hover:bg-dark',
                    row.index % 2 === 1 && 'bg-dark/40'
                  )}
                  onClick={
                    onRowClick && row.subRows?.length === 0
                      ? () => onRowClick( row.original )
                      : undefined
                  }
                >
                  {row.getVisibleCells().map( ( cell ) => {
                    if ( cell.getIsGrouped() ) {
                      return (
                        <td
                          key={cell.id}
                          className="px-4 py-3 align-middle text-white/80 flex items-center"
                          style={{ paddingLeft : `${row.depth * 12}px` }}
                        >
                          <button
                            type="button"
                            className="mr-2 text-white/80 button button-secondary w-6 h-6 flex items-center justify-center rounded-md p-0"
                            onClick={row.getToggleExpandedHandler()}
                          >
                            {row.getIsExpanded() ? (
                              <FontAwesomeIcon icon={faMinus}
                                size="xs"
                              />
                            ) : (
                              <FontAwesomeIcon icon={faPlus}
                                size="xs"
                              />
                            )}
                          </button>
                          {cell.column.columnDef.cell &&
                            cell.column.columnDef.header &&
                            flexRender(
                              cell.column.columnDef.cell ??
                                cell.column.columnDef.header,
                              cell.getContext()
                            )}
                          <span className="ml-2 text-xs text-white-overlay">
                            ({row.subRows?.length ?? 0})
                          </span>
                        </td>
                      )
                    }

                    if ( cell.getIsAggregated() ) {
                      return (
                        <td key={cell.id}
                          className="px-4 py-3 align-middle"
                        >
                          {flexRender(
                            cell.column.columnDef.aggregatedCell ??
                              cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    }

                    if ( cell.getIsPlaceholder() ) {
                      return (
                        <td key={cell.id}
                          className="px-4 py-3 align-middle"
                        />
                      )
                    }

                    return (
                      <td key={cell.id}
                        className="px-4 py-3 align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  } )}
                </tr>
              ) )}
          </tbody>
        </table>

        {!isLoading && table.getRowModel().rows.length === 0 && (
          <div className="border-t border-white-overlay-2 px-4 py-6 text-center text-white-overlay">
            {emptyMessage || t( 'no-data-found' )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-white-overlay-2 py-3 text-sm text-white-overlay">
        <div className="flex items-center gap-2">
          <span>{t( 'rows_per_page' )}</span>
          <select
            value={pageSize}
            onChange={( event ) => table.setPageSize( Number( event.target.value ) )}
            className="rounded-md border border-white-overlay-2 bg-dark px-2 py-1 text-white focus:border-white focus:outline-none"
          >
            {pageSizeOptions.map( ( size ) => (
              <option key={size}
                value={size}
                className="bg-dark"
              >
                {size}
              </option>
            ) )}
          </select>
        </div>

        <span className="text-sm">
          {pageStart}-{pageEnd} {t( 'of' )} {filteredData.length}
        </span>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              'button button-outline px-3 py-1 text-sm',
              !table.getCanPreviousPage()
                ? 'cursor-not-allowed opacity-50'
                : 'hover:border-white hover:bg-dark'
            )}
          >
            {t( 'prev' )}
          </button>
          <span className="min-w-[90px] text-center">
            {t( 'page' )} {currentPage} {t( 'of' )} {Math.max( totalPages, 1 )}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={cn(
              'button button-outline px-3 py-1 text-sm',
              !table.getCanNextPage()
                ? 'cursor-not-allowed opacity-50'
                : 'hover:border-white hover:bg-dark'
            )}
          >
            {t( 'next' )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
