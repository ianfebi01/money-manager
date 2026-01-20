'use client'
import { cn } from '@/lib/utils'
import { IOptions } from '@/types/form'
import TextField from '../Inputs/TextField'
import DropdownSelect from '../Inputs/DropdownSelect'
import DropdownCategories from '../Inputs/DropdownCategories'
import { useTranslations } from 'next-intl'
import { LegacyRef, ReactNode } from 'react'

export interface ITransactionFormData {
  type: 'expense' | 'income' | string
  amount: number
  description: string
  category: IOptions | number
}

interface TransactionFormProps {
  form: ITransactionFormData
  onChange: ( value: string | number | IOptions, name: string ) => void
  isOpen: boolean
  containerRef?: LegacyRef<HTMLDivElement>
  children?: ReactNode
  autoFocusAmount?: boolean
}

const TransactionForm = ( {
  form,
  onChange,
  isOpen,
  containerRef,
  children,
  autoFocusAmount = true,
}: TransactionFormProps ) => {
  const t = useTranslations()

  // Get category value for DropdownCategories (handles both IOptions and number)
  const getCategoryValue = (): string | number => {
    if ( typeof form.category === 'number' ) {
      return form.category
    }

    return form.category?.value ?? ''
  }

  // Handle type change and reset category since categories are type-specific
  const handleTypeChange = ( value: string | number ) => {
    // Reset category when type changes
    const currentCategory = getCategoryValue()
    if ( currentCategory ) {
      // Check if it's IOptions type (from AddTransaction)
      if ( typeof form.category === 'object' ) {
        onChange( { label : '', value : '' }, 'category' )
      } else {
        // It's number type (from EditTransaction)
        onChange( 0, 'category' )
      }
    }
    // Update the type
    onChange( value, 'type' )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col gap-2 w-full p-4 border rounded-lg',
        'border-white-overlay',
        [form.type === 'expense' ? 'border-orange' : 'border-blue-400']
      )}
    >
      {/* Amount Field */}
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
          onChange={( val: string ) => onChange( val, 'amount' )}
          autoFocus={autoFocusAmount}
        />
      </div>

      {/* Type Field */}
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
          onChange={handleTypeChange}
        />
      </div>

      {/* Category Field */}
      <div className="flex flex-col gap-2 relative">
        <label
          htmlFor={'category'}
          className="w-fit text-sm lg:text-base"
        >
          <span>{t( 'category' )}</span>
        </label>
        <DropdownCategories
          value={getCategoryValue()}
          enabled={isOpen}
          onChange={( value: IOptions ) => onChange( value, 'category' )}
          type={( form.type || 'all' ) as 'expense' | 'income' | 'all'}
        />
      </div>

      {/* Description Field */}
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
          onChange={( val: string ) => onChange( val, 'description' )}
          capitalizeFirstChar
        />
      </div>

      {/* Children slot for extra content like "Add Other" button */}
      {children}
    </div>
  )
}

export default TransactionForm
