'use client'
import { generateValidationSchema } from '@/lib/validation/generateValidationSchema'
import { IDynamicForm } from '@/types/form'
import { Form, FormikProvider, useFormik } from 'formik'
import FormikField from './Inputs/FormikField'
import { useTranslations } from 'next-intl'
import { IBodyRegister } from '@/types/api/auth'
import { useRegister } from '@/lib/hooks/api/auth'
import Button from '@/components/Buttons/Button'

const Register = () => {
  const t = useTranslations()
  const tp = useTranslations( 'placeholder' )
  const { register, loading } = useRegister()

  // Dynamic fields
  const fields: IDynamicForm[] = [
    {
      name        : 'username',
      type        : 'text',
      placeholder : tp( 'username' ),
      label       : t( 'username' ),
      validation  : {
        required   : true,
        charLength : {
          max : 20
        }
      },
    },
    {
      name        : 'email',
      type        : 'email',
      placeholder : tp( 'email' ),
      label       : t( 'email' ),
      validation  : {
        required : true,
      },
    },
    {
      name        : 'password',
      type        : 'password',
      placeholder : tp( 'password' ),
      label       : t( 'password' ),
      validation  : {
        required   : true,
        charLength : {
          min : 8,
        },
      },
    },
  ]

  // @ NOTE Form
  const schema = generateValidationSchema( fields )

  // @ NOTE Formik
  const initialValues: IBodyRegister = {
    email    : '',
    password : '',
    username : ''
  }

  const formik = useFormik( {
    initialValues    : initialValues,
    validationSchema : schema,
    onSubmit         : ( value ) => {
      onSubmitOk( value )
    },
  } )

  const onSubmitOk = async ( value: IBodyRegister ) => {
    await register( value )
  }

  return (
    <div className="w-full">
      <FormikProvider value={formik}>
        <Form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-2 w-full"
        >
          {fields.map( ( item: IDynamicForm ) => (
            <FormikField
              label={item.label}
              name={item.name}
              placeholder={item.placeholder}
              key={item.name}
              type={item.type}
              required={item.validation?.required}
              select={item?.select}
              disabled={loading}
            />
          ) )}
          <Button
            variant='primary'
            type="submit"
            loading={loading}
          >
            {t( 'register' )}
          </Button>
        </Form>
      </FormikProvider>
    </div>
  )
}

export default Register
