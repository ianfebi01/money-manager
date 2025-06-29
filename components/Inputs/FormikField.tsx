'use client'
import { useMemo } from 'react'
import TextField from './TextField'
import ImageField from './WithFormik/ImageField'
import SwitchField from './WithFormik/SwitchField'
import { IOptions, TFieldType } from '@/types/form'
import { cn } from '@/lib/utils'
import { useField } from 'formik'

interface Props {
  name: string
  label: string
  placeholder: string
  type?: TFieldType
  defaultImageUrl?: string
  setImageBase64?: ( base64: string ) => void
  required?: boolean
  disabled?: boolean
  select?: {
    isMulti?: boolean
  }
  loading?: boolean
  options?: IOptions
}

const FormikField = ( props: Props ) => {
  const { name, label, type = 'text', required } = props

  const [field, meta, helpers] = useField( name )

  const requiredIcon = useMemo( () => {
    if ( required ) return <span className="text-red-500">*</span>

    return null
  }, [required] )

  return (
    <div className="flex flex-col gap-2 relative">
      <label htmlFor={name}
        className="w-fit text-sm lg:text-base"
      >
        <span>{label}</span>
        {requiredIcon}
      </label>

      {['text', 'email', 'password', 'number', 'currency-id'].includes( type ) && (
        <TextField
          name={name}
          type={type}
          placeholder={props.placeholder}
          value={field.value}
          onChange={( val ) => helpers.setValue( val )}
          onBlur={field.onBlur}
          touched={meta.touched}
          error={meta.touched ? meta.error : undefined}
          disabled={props.disabled}
          loading={props.loading}
        />
      )}
      {type === 'image' && <ImageField {...props} />}
      {type === 'switch' && <SwitchField {...props} />}

      <p className="invisible m-0 text-xs lg:text-sm">
        space for error message
      </p>
      <p
        className={cn(
          'm-0',
          'absolute bottom-0 text-xs lg:text-sm text-red-500 transition-default delay-100',
          [
            '-translate-y-2 opacity-0',
            meta.error && meta.touched && 'translate-y-0 opacity-100',
          ]
        )}
      >
        {meta.error}
      </p>
    </div>
  )
}

export default FormikField
