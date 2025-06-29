'use client'
import { generateValidationSchema } from '@/lib/validation/generateValidationSchema'
import { IDynamicForm } from '@/types/form'
import { Form, FormikProvider, useFormik } from 'formik'
import FormikField from './Inputs/FormikField'
import { useTranslations } from 'next-intl'
import { IBodyLogin } from '@/types/api/auth'
import { useLogin } from '@/lib/hooks/api/auth'
import Button2 from './Buttons/Button2'

const Login = () => {
  const t = useTranslations()
  const tp = useTranslations( 'placeholder' )
  const { login, loading } = useLogin()

  // Dynamic fields
  const fields: IDynamicForm[] = [
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
  const initialValues: IBodyLogin = {
    email    : '',
    password : '',
  }

  const formik = useFormik( {
    initialValues    : initialValues,
    validationSchema : schema,
    onSubmit         : ( value ) => {
      onSubmitOk( value )
    },
  } )

  const onSubmitOk = async ( value: IBodyLogin ) => {
    await login( value )
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
          <Button2
            variant='primary'
            type="submit"
            loading={loading}
          >
            {t( 'login' )}
          </Button2>
        </Form>
      </FormikProvider>
    </div>
  )
}

export default Login
