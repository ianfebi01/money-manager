'use client'
import Button from '@/components/Buttons/Button'
import Modal from './Modal'
import { FormEvent, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSquareMinus } from '@fortawesome/free-solid-svg-icons'
import { IBodyTransaction, ITransaction } from '@/types/api/transaction'
import SingleDatePicker from '../Inputs/SingleDatePicker'
import DefaultCategories from '../DefaultCategories'
import { cn } from '@/lib/utils'
import formatCurency from '@/utils/format-curency'
import { IOptions } from '@/types/form'
import { useCreate } from '@/lib/hooks/api/cashFlow'
import { useTranslations } from 'next-intl'
import RecentTransactions from '../Pages/CashFlow/RecentTransactions'
import toast from 'react-hot-toast'
import TransactionForm from '../Form/TransactionForm'

interface ITransactionFormInput
  extends Omit<IBodyTransaction, 'date' | 'category'> {
  category: IOptions
}
interface ITransactionForm extends Omit<IBodyTransaction, 'category'> {
  category: IOptions
}

const AddTransaction = () => {
  const t = useTranslations()

  const { createMultiple } = useCreate()
  const [isOpen, setIsOpen] = useState<boolean>( false )
  const [loading, setLoading] = useState( false )
  const [sharedDate, setSharedDate] = useState<Date | null>( new Date() )
  const [form, setForm] = useState<ITransactionFormInput>( {
    type        : 'expense',
    amount      : 0,
    description : '',
    category    : {
      label : '',
      value : '',
    },
  } )
  const [transactions, setTransactions] = useState<ITransactionForm[]>( [] )

  const handleChange = ( value: string | number | IOptions, name: string ) => {
    setForm( ( prev ) => ( {
      ...prev,
      [name] : name === 'amount' ? Number( value ) : value,
    } ) )
  }

  const handleAddTransaction = ( e: FormEvent ) => {
    e.preventDefault()

    if ( !form.amount ) {
      return toast.error( t( 'toast.error_amount_required' ) )
    }

    if ( !sharedDate ) {
      return toast.error( t( 'toast.error_date_required' ) )
    }

    if ( !form.category?.value ) {
      return toast.error( t( 'toast.error_category_required' ) )
    }

    const newTransaction: ITransactionForm = {
      ...form,
      date : new Date( sharedDate ).toISOString(),
    }

    setTransactions( ( prev ) => [...prev, newTransaction] )

    // Reset form
    setForm( {
      type        : 'expense',
      amount      : 0,
      description : '',
      category    : {
        label : '',
        value : '',
      },
    } )
  }

  const handleSubmitAll = async () => {
    const tmp = []

    if ( !!form.amount ) {
      if ( !form.category?.value ) {
        return toast.error( t( 'toast.error_category_required' ) )
      }
      if ( !sharedDate ) {
        return toast.error( t( 'toast.error_date_required' ) )
      }

      tmp.push( {
        ...form,
        date : sharedDate
          ? new Date( sharedDate ).toISOString()
          : new Date().toISOString(),
        category : Number( form.category.value ),
      } )
    }

    const transformTransactions = transactions.map( ( item ) => {
      return {
        ...item,
        category : Number( item.category.value ),
      }
    } )

    const combined = [...tmp, ...transformTransactions]

    if ( !combined.length ) {
      return toast.error( t( 'toast.error_no_transactions' ) )
    }

    try {
      setLoading( true )
      await createMultiple( combined )
      resetForm()
      setIsOpen( false )
      setLoading( false )
    } catch ( error ) {
      setLoading( false )
    }
  }

  const resetForm = () => {
    setForm( {
      type        : 'expense',
      amount      : 0,
      description : '',
      category    : {
        label : '',
        value : '',
      },
    } )

    setTransactions( [] )
    setSharedDate( new Date() )
  }

  const handleDelete = ( index: number ) => {
    setTransactions( ( prev ) => prev.filter( ( _, i ) => i !== index ) )
  }

  const handleEdit = ( index: number ) => {
    setForm( {
      ...transactions[index],
    } )
    setTransactions( ( prev ) => prev.filter( ( _, i ) => i !== index ) )
  }

  const modalRef = useRef<HTMLDivElement | null>( null )

  /**
   * Handle Recent transaction
   */

  const handleClickRecentTransaction = ( val: ITransaction ) => {
    setForm( {
      type        : val?.type,
      amount      : val?.amount,
      description : val?.description,
      category    : {
        label : val?.category_name || '',
        value : val?.category_id,
      },
    } )
  }

  return (
    <div className="w-fit">
      <Button
        type="button"
        variant="secondary"
        className="gap-2 flex"
        onClick={() => setIsOpen( true )}
      >
        <FontAwesomeIcon icon={faPlus} />
        {t( 'add_transaction' )}
      </Button>
      <Modal
        title={t( 'add_transaction' )}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        variant="fullscreen"
        loading={loading}
        onConfirm={() => handleSubmitAll()}
        onCancel={() => {
          resetForm()
          setIsOpen( false )
        }}
        confirmText={t( 'save' )}
      >
        <div
          ref={modalRef}
          className="flex flex-col gap-2 w-full max-w-2xl mx-auto"
        >
          <div className="flex flex-col gap-2 relative mb-4">
            <label htmlFor={'date'}
              className="w-fit text-sm lg:text-base"
            >
              <span>{t( 'date' )}</span>
            </label>
            <SingleDatePicker
              value={sharedDate}
              setValue={setSharedDate}
              boundaryRef={modalRef}
            />
          </div>
          <RecentTransactions
            enabled={isOpen}
            onClick={handleClickRecentTransaction}
          />
          <form onSubmit={( e ) => handleAddTransaction( e )}>
            <TransactionForm
              form={form}
              onChange={handleChange}
              isOpen={isOpen}
            >
              <button
                type="submit"
                className="mt-4 button button-secondary w-full h-20 text-center flex justify-center gap-2 items-center"
              >
                <FontAwesomeIcon icon={faPlus}
                  className="text-orange"
                />
                {t( 'add_other' )}
              </button>
            </TransactionForm>
          </form>
          <div className="flex flex-col gap-2 mt-4">
            <table border={0}
              className="border-none table-auto w-full"
            >
              <tbody>
                {transactions.map( ( item, index ) => (
                  <tr
                    key={index}
                    className="hover:bg-dark/80 cursor-pointer"
                    role="button"
                    onClick={() => handleEdit( index )} // row click = edit
                  >
                    {/* Delete button cell */}
                    <td
                      className="px-4 text-white-overlay"
                      style={{ width : '1px', whiteSpace : 'nowrap' }}
                    >
                      <div className="flex gap-2 items-center translate-y-1">
                        <Button
                          variant="iconOnly"
                          onClick={( e ) => {
                            e.stopPropagation() // prevent the row onClick
                            // if your handler expects an index, keep this:
                            // handleDelete(index)
                            // if it expects an id like in your table example, use this:
                            handleDelete( index )
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSquareMinus}
                            className="text-white-overlay"
                          />
                        </Button>
                      </div>
                    </td>

                    {/* Category cell */}
                    <td className="p-0 text-white-overlay translate-y-0.5 w-1/4 md:w-[35%]">
                      {!!item?.category?.label && (
                        <DefaultCategories name={item.category.label} />
                      )}
                    </td>

                    {/* Description cell */}
                    <td className="px-4">
                      <p className="m-0 line-clamp-1">{item.description}</p>
                    </td>

                    {/* Amount cell */}
                    <td className="p-0 pr-4 text-right">
                      <p
                        className={cn( 'm-0', {
                          'text-blue-400' : item.type === 'income',
                          'text-orange'   : item.type === 'expense',
                        } )}
                      >
                        {formatCurency( item.amount )}
                      </p>
                    </td>
                  </tr>
                ) )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AddTransaction
