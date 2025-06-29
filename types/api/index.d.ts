export interface IApi<T = void> {
  data: T
  meta: IMeta
}

/**
 *  error
 */

export interface IApiError {
  status: number
  error: string
  title?: number
  message: string
}

export interface IMeta {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}
