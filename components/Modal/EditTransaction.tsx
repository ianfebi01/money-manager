'use client'
import Modal from './Modal'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { IBodyTransaction, ITransaction } from '@/types/api/transaction'
import SingleDatePicker from '../Inputs/SingleDatePicker'
import TextField from '../Inputs/TextField'
import DropdownSelect from '../Inputs/DropdownSelect'
import DropdownCategories from '../Inputs/DropdownCategories'
import { cn } from '@/lib/utils'
import { IOptions } from '@/types/form'
import { useEdit } from '@/lib/hooks/api/cashFlow'
import { useTranslations } from 'next-intl'
import RecentTransactions from '../Pages/CashFlow/RecentTransactions'

interface ITransactionFormInput
  extends Omit<IBodyTransaction, 'date' | 'category'> {
  category: number
}

interface Props {
  isOpen: boolean
  setIsOpen: ( value: boolean ) => void
  initialValue?: ITransaction
}

const EditTransaction = ( { isOpen, setIsOpen, initialValue }: Props ) => {
  const t = useTranslations()

  const { edit } = useEdit()
  const [loading, setLoading] = useState( false )
  const [sharedDate, setSharedDate] = useState<Date | null>( new Date() )
  const [form, setForm] = useState<ITransactionFormInput>( {
    type        : initialValue?.type || 'expense',
    amount      : initialValue?.amount || 0,
    description : initialValue?.description || '',
    category    : initialValue?.category_id || 0,
  } )

  useEffect( () => {
    if ( isOpen && initialValue ) {
      setForm( {
        type        : initialValue?.type,
        amount      : initialValue?.amount,
        description : initialValue?.description,
        category    : initialValue?.category_id,
      } )

      if ( initialValue?.date ) setSharedDate( new Date( initialValue?.date ) )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen] )

  const handleChange = ( value: string | number | IOptions, name: string ) => {
    setForm( ( prev ) => {
      let newValue: string | number

      if ( name === 'amount' ) {
        newValue = Number( value )
      } else if ( name === 'category' ) {
        newValue = Number( ( value as IOptions ).value )
      } else {
        newValue = value as string | number
      }

      return {
        ...prev,
        [name] : newValue,
      }
    } )
  }

  const handleAddTransaction = ( e: FormEvent ) => {
    e.preventDefault()
    if ( !sharedDate ) {
      alert( 'Please select a date first.' )

      return
    }

    // Reset form
    setForm( {
      type        : 'expense',
      amount      : 0,
      description : '',
      category    : 0,
    } )
  }

  const handleSubmit = async () => {
    if ( !!form.amount && initialValue?.id ) {
      try {
        setLoading( true )
        await edit(
          {
            ...form,
            date : sharedDate
              ? new Date( sharedDate ).toISOString()
              : new Date().toISOString(),
            category : Number( form.category ),
          },
          initialValue?.id
        )
        resetForm()
        setIsOpen( false )
        setLoading( false )
      } catch ( error ) {
        setLoading( false )
      }
    }
  }

  const resetForm = () => {
    setForm( {
      type        : 'expense',
      amount      : 0,
      description : '',
      category    : 0,
    } )

    setSharedDate( new Date() )
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
      category    : val?.category_id,
    } )
  }

  return (
    <Modal
      title={t( 'edit_transaction' )}
      confirmText={t( 'edit' )}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      variant="fullscreen"
      loading={loading}
      onConfirm={() => handleSubmit()}
      onCancel={() => {
        resetForm()
        setIsOpen( false )
      }}
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
          <div
            className={cn(
              'flex flex-col gap-2 w-full p-4 border  rounded-lg',
              'border-white-overlay',
              [form.type === 'expense' ? 'border-orange' : 'border-blue-400']
            )}
          >
            <div className="flex flex-col gap-2 relative">
              <label htmlFor={'amount'}
                className="w-fit text-sm lg:text-base"
              >
                <span>{t( 'amount' )}</span>
              </label>
              <TextField
                type="currency-id"
                value={String( form.amount )}
                name="amount"
                placeholder="eg. 1000"
                onChange={( val: string ) => handleChange( val, 'amount' )}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label htmlFor={'type'}
                className="w-fit text-sm lg:text-base"
              >
                <span>{t( 'type' )}</span>
              </label>
              <DropdownSelect
                value={form.type as string | number}
                options={[
                  {
                    label : 'Income',
                    value : 'income',
                  },
                  {
                    label : 'Expense',
                    value : 'expense',
                  },
                ]}
                onChange={( value: string | number ) =>
                  handleChange( value, 'type' )
                }
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label
                htmlFor={'category'}
                className="w-fit text-sm lg:text-base"
              >
                <span>{t( 'category' )}</span>
              </label>
              <DropdownCategories
                value={form.category}
                enabled={isOpen}
                onChange={( value: IOptions ) => handleChange( value, 'category' )}
                type={form.type || 'expense'}
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <label
                htmlFor={'description'}
                className="w-fit text-sm lg:text-base"
              >
                <span>{t( 'description' )}</span>
              </label>
              <TextField
                type="text"
                value={form.description}
                name="description"
                placeholder="eg. Burger"
                capitalizeFirstChar
                onChange={( val: string ) => handleChange( val, 'description' )}
              />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default EditTransaction
