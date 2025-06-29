'use client'
import { useField } from 'formik'
import { Switch } from '@headlessui/react'
import { cn } from '@/lib/utils'

interface SwitchFieldProps {
  name: string
  disabled?: boolean
}

const SwitchField = ( { name, disabled }: SwitchFieldProps ) => {
  const [field, , helpers] = useField( name )

  return (
    <Switch
      name={field.name}
      checked={field.value}
      onChange={() => {
        helpers.setValue( !field.value )
        helpers.setTouched( true )
      }}
      value={field.value}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-default bg-dark hover:border-white/25',
        ['bg-dark-secondary', field.value && 'bg-orange']
      )}
      disabled={disabled}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition',
          ['translate-x-1', field.value && 'translate-x-6']
        )}
      />
    </Switch>
  )
}

export default SwitchField