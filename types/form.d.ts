export interface IDynamicForm {
  name: string
  label: string
  type?: TFieldType
  placeholder: string
  options?: Option[]
  validation?: IValidation
  disabled?: boolean
  defaultImageUrl?: string
  select?: {
    isMulti?: boolean
  }
}

export type TFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'image'
  | 'number'
  | 'switch'
  | 'year'
  | 'date'
  | 'select'
  | 'month-year'
  | 'text-editor'
  | 'phone'
  | 'currency-id'

export type IOptions = {
  label: string
  value: number | string
}

interface IValidation {
  charLength?: {
    max?: number
    min?: number
  }
  date?: {
    min?: Date
    max?: Date
  }
  inputRule?: RegExp[]
  numeric?: boolean
  required?: boolean
  image?: IImageValidation
}

interface IImageValidation {
  maxSize?: number
}

export interface IOptions {
  value: string | number
  label: string
}
