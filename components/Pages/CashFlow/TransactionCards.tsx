import Button from '@/components/Buttons/Button'
import DefaultCategories from '@/components/DefaultCategories'
import ErrorLoadingData from '@/components/Layouts/ErrorLoadingData'
import NoDataFound from '@/components/NoDataFound'
import { IFilter, useExportExcel, useGetMonthlyDatas } from '@/lib/hooks/api/cashFlow'
import { cn } from '@/lib/utils'
import { ITransaction } from '@/types/api/transaction'
import formatCurency from '@/utils/format-curency'
import { faFileExcel, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAnimation, motion, easeInOut } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

interface Props {
  filter: IFilter
  handleDelete: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => void
  handleEdit: ( row: ITransaction ) => void
}

const TransactionCards = ( { filter, handleDelete, handleEdit }: Props ) => {
  const t = useTranslations()
  const { data, isLoading, isError } = useGetMonthlyDatas( filter )
  const [isExporting, setIsExporting] = useState( false )
  const { exportExcel } = useExportExcel()

  const handleExport = useCallback( async () => {
    setIsExporting( true )
    try {
      await exportExcel( filter )
    } finally {
      setIsExporting( false )
    }
  }, [exportExcel, filter] )

  const mockLoop = new Array( 6 ).fill( 0 )

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
    <>
      <div className="flex justify-end mt-4">
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={isExporting || isLoading}
          ariaLabel={t( 'export_excel' )}
        >
          <FontAwesomeIcon
            icon={faFileExcel}
            className="mr-2"
          />
          {isExporting ? t( 'exporting' ) : t( 'export_excel' )}
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4">
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
                        <td className="p-0 text-white-overlay translate-y-0.5 w-1/4 md:w-[35%]">
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
    </>
  )
}

export default TransactionCards
