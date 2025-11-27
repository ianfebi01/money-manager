'use client'
import AddTransaction from '@/components/Modal/AddTransaction'
import EditTransaction from '@/components/Modal/EditTransaction'
import Modal from '@/components/Modal/Modal'
import { IFilter, useDelete } from '@/lib/hooks/api/cashFlow'
import { useFormatDate } from '@/lib/hooks/useFormatDate'
import { ITransaction } from '@/types/api/transaction'
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import TransactionTable from './TransactionTable'
import TransactionCards from './TransactionCards'
import { Switch } from '@headlessui/react'
import { cn } from '@/lib/utils'
import Spinner from '@/components/Icons/Spinner'

const VIEW_KEY = 'cashflow_view_mode'

const CashFlow = () => {
  const t = useTranslations()
  const { month, year, spaceMonthYear } = useFormatDate()

  const date = new Date()
  const [filter, setFilter] = useState<IFilter>( {
    month : month( date ),
    year  : year( date ),
  } )

  const changeMonth = ( type: 'prev' | 'next' ) => {
    setFilter( ( prev ) => {
      let newMonth = Number( prev.month )
      let newYear = Number( prev.year )

      if ( type === 'prev' ) {
        newMonth--
        if ( newMonth < 1 ) {
          newMonth = 12
          newYear--
        }
      } else {
        newMonth++
        if ( newMonth > 12 ) {
          newMonth = 1
          newYear++
        }
      }

      return {
        month : String( newMonth ).padStart( 2, '0' ), // 🔒 Padded, safe month
        year  : String( newYear ),
      }
    } )
  }

  /**
   *  Handle Delete
   */
  const [deleteWarningAlert, setDeleteWarningAlert] = useState<boolean>( false )
  const [deleteIsLoading, setDeleteIsLoading] = useState( false )
  const [id, setId] = useState<number | null>( null )
  const deleteTransaction = useDelete()

  const handleDelete = useCallback(
    ( e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number ) => {
      e.stopPropagation()
      setId( id )
      setDeleteWarningAlert( true )
    },
    []
  )

  const onDeleteOk = async () => {
    try {
      setDeleteIsLoading( true )
      if ( id ) {
        await deleteTransaction( id )
      }
      setDeleteIsLoading( false )
      setDeleteWarningAlert( false )
    } catch ( error ) {
      setDeleteWarningAlert( false )
      setDeleteIsLoading( false )
      toast.error( 'Failed to delete transaction' )
    }
  }

  /**
   *  Handle Edit
   */

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>( false )
  const [editData, setEditData] = useState<ITransaction | undefined>()

  const handleEdit = ( item: ITransaction ) => {
    setIsEditModalOpen( true )
    setEditData( item )
  }

  // View mode state
  const [viewMode, setViewMode] = useState<'table' | 'cards'>( 'table' )
  const [hydrated, setHydrated] = useState( false )

  // On mount, sync viewMode from localStorage
  useEffect( () => {
    if ( typeof window !== 'undefined' ) {
      const stored = localStorage.getItem( VIEW_KEY ) as 'table' | 'cards' | null
      if ( stored ) setViewMode( stored )
      setHydrated( true )
    }
  }, [] )

  // Sync view mode to localStorage
  useEffect( () => {
    if ( typeof window !== 'undefined' ) {
      localStorage.setItem( VIEW_KEY, viewMode )
    }
  }, [viewMode] )

  // Sync view mode from localStorage on storage event
  useEffect( () => {
    const syncView = ( e: StorageEvent ) => {
      if ( e.key === VIEW_KEY && e.newValue ) {
        setViewMode( e.newValue as 'table' | 'cards' )
      }
    }
    window.addEventListener( 'storage', syncView )

    return () => window.removeEventListener( 'storage', syncView )
  }, [] )

  return (
    <div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2 items-center h-[42px]">
          <button
            className="border rounded-md w-6 h-6 border-white-overlay-2 hover:border-white-overlay transition-default"
            onClick={() => changeMonth( 'prev' )}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2 className="h3 font-normal m-0">
            {spaceMonthYear( new Date( `${filter.year}-${filter.month}-01` ) )}
          </h2>
          <button
            className="border rounded-md w-6 h-6 border-white-overlay-2 hover:border-white-overlay transition-default"
            onClick={() => changeMonth( 'next' )}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className="grow" />
        <AddTransaction />
      </div>
      {/* Loader while waiting for hydration */}
      {!hydrated ? (
        <div className="flex items-center justify-center h-32 mt-6">
          <Spinner classes="!h-10 !w-10" />
        </div>
      ) : (
        <>
          {/* Display Switcher */}
          <div className="flex items-center sm:justify-end gap-2 mt-6">
            <span className="text-xs text-white-overlay mr-2">Table</span>
            <Switch
              checked={viewMode === 'cards'}
              onChange={() =>
                setViewMode( viewMode === 'cards' ? 'table' : 'cards' )
              }
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-default',
                viewMode === 'cards' ? 'bg-orange' : 'bg-dark-secondary'
              )}
            >
              <span className="sr-only">Toggle view mode</span>
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  viewMode === 'cards' ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </Switch>
            <span className="text-xs text-white-overlay ml-2">Cards</span>
          </div>
          <div className="mt-6">
            {viewMode === 'table' ? (
              <TransactionTable
                filter={filter}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ) : (
              <TransactionCards
                filter={filter}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            )}
          </div>
        </>
      )}
      <Modal
        isOpen={deleteWarningAlert}
        setIsOpen={setDeleteWarningAlert}
        onConfirm={() => onDeleteOk()}
        onCancel={() => setDeleteWarningAlert( false )}
        title={t( 'delete_warning.title' )}
        desciption={t( 'delete_warning.description' )}
        confirmText={t( 'delete_warning.confirm' )}
        loading={deleteIsLoading}
      />
      <EditTransaction
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        initialValue={editData}
      />
    </div>
  )
}

export default CashFlow
