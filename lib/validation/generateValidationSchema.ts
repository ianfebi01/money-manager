import { IDynamicForm } from '@/types/form'
import * as yup from 'yup'

type Valid = Record<
  string,
  | yup.NumberSchema<number | undefined, yup.AnyObject, undefined, ''>
  | yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>
>

export const generateValidationSchema = ( fields: IDynamicForm[] ) => {
  const validationsGroup: Valid = {}
  for ( const field of fields ) {
    let validations: any = yup

    if ( field.type === 'select' && field.select?.isMulti )
      validations = validations.array().of(
        validations.object( {
          label : yup.string(),
          value : yup.number()
        } ) )
		 else if ( field.type === 'select' && !field.select?.isMulti )
      validations = validations.object( {
        label : yup.string(),
        value : yup.number()
      } ) 
    else
      validations = validations.string()
    if ( field.validation?.required ) {
      if( field.type === 'select' && field.select?.isMulti )
        validations = validations = validations.min( 1, ( { label }: { label: string } ) => `${label} is a required field` )
      else
        validations = validations = validations.required()
    }
    if ( field.type === 'email' ) validations = validations.email()
    if ( field.validation?.numeric )
      validations = validations.matches(
        /^\d*$/,
        ( { label }: { label: string } ) => `${label} must be number only`
      )
    if ( field.type === 'phone' )
      validations = validations.matches(
        /^[0-9]\d*$/,
        'Phone number is not valid'
      )
    if ( field.validation?.charLength ) {
      if ( field.validation?.charLength.min )
        validations = validations.min( field.validation.charLength.min )
      if ( field.validation?.charLength.max )
        validations = validations.max( field.validation.charLength.max )
    }
    if ( field.type === 'select'  ) {
      // if ( field.select?.isMulti )
      // 	validations = validations.array()
      // if ( field.validation?.charLength.max )
      // 	validations = validations.max( field.validation.charLength.max )
    }
    if ( field.type === 'image' ) {
      if ( field.validation?.image?.maxSize ) {
        validations = validations.test( {
          name       : 'maxSize',
          skipAbsent : true,
          test( value: string, ctx: any ) {
						
            const fileSize = Buffer.from(
              value.substring( value.indexOf( ',' ) + 1 ),
              'base64'
            )?.length

            const maxSize = field.validation?.image?.maxSize

            if( maxSize === undefined ) 
              return ctx.createError( {
                message : 'Maximum file size not defined',
              } )

            if ( fileSize > 1024 * 1024 * maxSize / 1000 ) {
              return ctx.createError( {
                message : 'Maximum file size is ' + maxSize,
              } )
            }

            return true
          },
        } )
      }
    }

    validationsGroup[field.name] = validations.label( field.label )
  }

  return yup.object( {
    ...validationsGroup,
  } )
}
