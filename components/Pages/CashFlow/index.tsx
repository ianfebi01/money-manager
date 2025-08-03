'use client'

import Button from '@/components/Buttons/Button'
import DefaultCategories from '@/components/DefaultCategories'
import ErrorLoadingData from '@/components/Layouts/ErrorLoadingData'
import AddTransaction from '@/components/Modal/AddTransaction'
import EditTransaction from '@/components/Modal/EditTransaction'
import Modal from '@/components/Modal/Modal'
import NoDataFound from '@/components/NoDataFound'
import { IFilter, useDelete, useGetDatas } from '@/lib/hooks/api/cashFlow'
import { useFormatDate } from '@/lib/hooks/useFormatDate'
import { cn } from '@/lib/utils'
import { ITransaction } from '@/types/api/transaction'
import formatCurency from '@/utils/format-curency'
import {
  faChevronLeft,
  faChevronRight,
  faSquareMinus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAnimation, motion, easeInOut } from 'framer-motion'
import { useTranslations } from 'next-intl'

const CashFlow = () => {
  const t = useTranslations()
  const { month, year, spaceMonthYear } = useFormatDate()

  const date = new Date()
  const [filter, setFilter] = useState<IFilter>( {
    month : month( date ),
    year  : year( date ),
  } )

  const { data, isLoading, isError } = useGetDatas( filter )

  const mockLoop = new Array( 6 ).fill( 0 )

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

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation()
    setId( id )
    setDeleteWarningAlert( true )
  }

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

  /**
   * Animation
   */
  const animationControl = useAnimation()

  useEffect( () => {
    if (
      !isLoading &&
      data?.data?.transactions &&
      data?.data?.transactions?.length > 0
    ) {
      animationControl.start( 'visible' )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data] )

  return (
    <div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2 items-center">
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
        <div className="grow"></div>
        <AddTransaction />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-8">
        {isLoading &&
          mockLoop.map( ( _item, i ) => (
            <div
              key={i}
              className="animate-pulse h-32 w-full rounded-lg bg-dark-secondary"
            />
          ) )}
        {!isLoading &&
          data?.data?.transactions &&
          data?.data?.transactions?.length > 0 &&
          data?.data?.transactions.map( ( item, i ) => (
            <motion.div
              key={i}
              variants={{
                hidden : {
                  opacity : 0,
                  y       : 75,
                },
                visible : {
                  opacity : 1,
                  y       : 0,
                },
              }}
              initial="hidden"
              className="h-full flex flex-col"
              animate={animationControl}
              transition={{
                duration : 0.3,
                delay    : 0 + i / 20,
                ease     : easeInOut,
              }}
            >
              <div className="bg-dark-secondary shadow-xl rounded-lg flex flex-col grow pb-4">
                <div className="flex gap-2 items-center px-4 pt-4">
                  <h2 className="m-0">{item.day}</h2>
                  <div className="grow" />
                  <div className="w-28 text-right text-blue-400">
                    <p className="m-0">{formatCurency( item.income )}</p>
                  </div>
                  <div className="w-28 text-right text-orange">
                    <p className="m-0">{formatCurency( item.expense )}</p>
                  </div>
                </div>
                <table border={0}
                  className="border-none table-auto w-full"
                >
                  <tbody>
                    {item.transactions.map( ( subItem, subIndex ) => (
                      <tr
                        key={subIndex}
                        className="hover:bg-dark/80 cursor-pointer"
                        role="button"
                        onClick={() => handleEdit( subItem )}
                      >
                        <td
                          className={cn( 'px-4 text-white-overlay' )}
                          style={{ width : '1px', whiteSpace : 'nowrap' }}
                        >
                          <div className="flex gap-2 items-center translate-y-1">
                            <Button
                              variant="iconOnly"
                              onClick={( e ) => handleDelete( e, subItem.id )}
                            >
                              <FontAwesomeIcon
                                icon={faSquareMinus}
                                className="text-white-overlay"
                              />
                            </Button>
                          </div>
                        </td>
                        <td
                          className="p-0 text-white-overlay translate-y-0.5"
                          style={{ width : '1px', whiteSpace : 'nowrap' }}
                        >
                          {!!subItem?.category_name && (
                            <DefaultCategories name={subItem?.category_name} />
                          )}
                        </td>
                        <td className="px-4">
                          <p className="m-0">{subItem.description}</p>
                        </td>
                        <td className="p-0 pr-4 text-right">
                          <p
                            className={cn( 'm-0', {
                              'text-blue-400' : subItem.type === 'income',
                              'text-orange'   : subItem.type === 'expense',
                            } )}
                          >
                            {formatCurency( subItem.amount )}
                          </p>
                        </td>
                      </tr>
                    ) )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) )}
      </div>
      {!isLoading && data?.data?.transactions.length === 0 && <NoDataFound />}
      {!isLoading && isError && <ErrorLoadingData />}
      <Modal
        isOpen={deleteWarningAlert}
        setIsOpen={setDeleteWarningAlert}
        onConfirm={() => onDeleteOk()}
        onCancel={() => setDeleteWarningAlert( false )}
        variant="warning"
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
