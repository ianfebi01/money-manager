'use client'
import Button from '@/components/Buttons/Button'
import Modal from './Modal'
import { FormEvent, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenSquare,
  faPlus,
  faSquareMinus,
} from '@fortawesome/free-solid-svg-icons'
import { IBodyTransaction } from '@/types/api/transaction'
import SingleDatePicker from '../Inputs/SingleDatePicker'
import TextField from '../Inputs/TextField'
import DropdownSelect from '../Inputs/DropdownSelect'
import DropdownCategories from '../Inputs/DropdownCategories'
import DefaultCategories from '../DefaultCategories'
import { cn } from '@/lib/utils'
import formatCurency from '@/utils/format-curency'
import { IOptions } from '@/types/form'
import { useCreate } from '@/lib/hooks/api/cashFlow'
import { useTranslations } from 'next-intl'

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
    if ( !sharedDate ) {
      alert( 'Please select a date first.' )

      return
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
      tmp.push( {
        ...form,
        date : sharedDate
          ? new Date( sharedDate ).toISOString()
          : new Date().toISOString(),
        category : Number( form.category.value ),
      } )
    }

    const transformTransactions = transactions.map( ( item ) => ( {
      ...item,
      category : Number( item.category.value ),
    } ) )

    const combined = [...tmp, ...transformTransactions]
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
        title="Add Transaction"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        variant="fullscreen"
        loading={loading}
        onConfirm={() => handleSubmitAll()}
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
              <span>{'Date'}</span>
            </label>
            <SingleDatePicker
              value={sharedDate}
              setValue={setSharedDate}
              boundaryRef={modalRef}
            />
          </div>
          <form onSubmit={( e ) => handleAddTransaction( e )}>
            <div
              className={cn(
                'flex flex-col gap-2 w-full p-4 border  rounded-lg',
                'border-white-overlay',
                [form.type === 'expense' ? 'border-orange' : 'border-blue-400']
              )}
            >
              <div className="flex flex-col gap-2 relative">
                <label
                  htmlFor={'amount'}
                  className="w-fit text-sm lg:text-base"
                >
                  <span>{'Amount'}</span>
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
                  <span>{'Type'}</span>
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
                  <span>{'Category'}</span>
                </label>
                <DropdownCategories
                  value={form.category.value}
                  enabled={isOpen}
                  onChange={( value: IOptions ) =>
                    handleChange( value, 'category' )
                  }
                  type={form.type || 'all'}
                />
              </div>
              <div className="flex flex-col gap-2 relative">
                <label
                  htmlFor={'description'}
                  className="w-fit text-sm lg:text-base"
                >
                  <span>{'Description'}</span>
                </label>
                <TextField
                  type="text"
                  value={form.description}
                  name="description"
                  placeholder="eg. Burger"
                  onChange={( val: string ) => handleChange( val, 'description' )}
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 button button-secondary w-full h-20 text-center flex justify-center gap-2 items-center"
            >
              <FontAwesomeIcon icon={faPlus}
                className="text-orange"
              />
              Add other
            </button>
          </form>
          <div className="flex flex-col gap-2 mt-4">
            {transactions.map( ( item, index ) => (
              <div className="flex flex-row gap-4 items-center"
                key={index}
              >
                <Button variant="iconOnly">
                  <FontAwesomeIcon
                    icon={faSquareMinus}
                    className="text-white-overlay"
                    onClick={() => handleDelete( index )}
                  />
                </Button>
                <Button variant="iconOnly">
                  <FontAwesomeIcon
                    icon={faPenSquare}
                    className="text-white-overlay"
                    onClick={() => handleEdit( index )}
                  />
                </Button>
                <DefaultCategories name={item.category.label} />
                <p className="m-0">{item.description}</p>
                <div className="grow" />
                <p
                  className={cn( 'm-0', [
                    item.type === 'income' && 'text-blue-400',
                    item.type === 'expense' && 'text-orange',
                  ] )}
                >
                  {formatCurency( item.amount )}
                </p>
              </div>
            ) )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AddTransaction
