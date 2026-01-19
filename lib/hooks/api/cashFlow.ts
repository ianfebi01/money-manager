import { UseQueryResult, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiTransactionTransaction } from '@/types/generated/contentTypes'
import qs from 'qs'
import useAxiosAuth from '../useAxiosAuth'
import { AxiosResponse } from 'axios'
import { IBodyTransaction, ITransaction } from '@/types/api/transaction'
import toast from 'react-hot-toast'
import { IApi } from '@/types/api'
import { ICategory } from '@/types/api/categories'
import { useTranslations } from 'next-intl'

interface IMonthlyTransactions {
  income: number
  expense: number
  transactions: {
    day: string
    income: number
    expense: number
    transactions: ( ITransaction & { id: number } )[]
  }[]
}

export interface IFilter {
  month?: string
  year?: string
  search?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

/**
 *  Get MonthlyDatas
 */
export const useGetMonthlyDatas = (
  filter: IFilter,
  enabled: boolean = true
): UseQueryResult<{ data: IMonthlyTransactions }> => {
  const axiosAuth = useAxiosAuth()
  // query
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const query = {
    month    : filter.month,
    year     : filter.year,
    timezone : timezone,
  }
  const queryString = qs.stringify( query, { addQueryPrefix : true } )

  const data: UseQueryResult<{ data: IMonthlyTransactions }> = useQuery<{
    data: IMonthlyTransactions
  }>( {
    queryKey : ['transactions-monthly', filter.month, filter.year],
    queryFn  : async () => {
      const res: AxiosResponse<{ data: IMonthlyTransactions }> =
        await axiosAuth( `/transactions/monthly${queryString}` )

      return res.data
    },
    enabled : enabled,
  } )

  return data
}

/**
 *  Get recent Transactions
 */
export const useGetRecentTransactions = (
  limit: number = 5,
  enabled: boolean = true
): UseQueryResult<{ data: ITransaction[] }> => {
  const axiosAuth = useAxiosAuth()
  // query
  const query = {
    limit : limit,
  }
  const queryString = qs.stringify( query, { addQueryPrefix : true } )

  const data: UseQueryResult<{ data: ITransaction[] }> = useQuery<{
    data: ITransaction[]
  }>( {
    queryKey : ['recent-transactions', limit],
    queryFn  : async () => {
      const res: AxiosResponse<{ data: ITransaction[] }> = await axiosAuth(
        `/transactions/recent${queryString}`
      )

      return res.data
    },
    enabled : enabled,
  } )

  return data
}

/**
 *  Get Datas
 */
export interface IPaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ITransactionResponse {
  data: ITransaction[]
  meta: {
    pagination: IPaginationMeta
    search?: string
    month?: string
    year?: string
    timezone?: string
  }
}

export const useGetDatas = (
  limit: number = 5,
  page: number = 1,
  filter: IFilter,
  enabled: boolean = true
): UseQueryResult<ITransactionResponse> => {
  const axiosAuth = useAxiosAuth()
  // query
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const query = {
    limit    : limit,
    page     : page,
    ...filter,
    timezone : timezone,
  }
  const queryString = qs.stringify( query, { addQueryPrefix : true } )

  const data: UseQueryResult<ITransactionResponse> = useQuery<ITransactionResponse>( {
    queryKey : ['transactions', limit, page, { timezone : timezone, ...filter },],
    queryFn  : async () => {
      const res: AxiosResponse<ITransactionResponse> = await axiosAuth(
        `/transactions${queryString}`
      )

      return res.data
    },
    enabled : enabled,
    retry   : false
  } )

  return data
}

/**
 *  Create datas
 */
export const useCreate = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()
  const t = useTranslations()

  const create = async ( body: IBodyTransaction ) => {
    try {
      const postTransaction = await axiosAuth.post<{ data: ITransaction }>(
        '/transactions',
        {
          data : {
            ...body,
          },
        }
      )

      queryClient.invalidateQueries( {
        queryKey : ['transactions-monthly'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['top-expense-categories'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['monthly-chart'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['recent-transactions'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['transactions'],
      } )

      return postTransaction
    } catch ( error ) {
      toast.error( t( 'toast.error_create_transaction' ) )
      throw error
    }
  }

  const createMultiple = async ( body: IBodyTransaction[] ) => {
    try {
      const postTransaction = await axiosAuth.post<{ data: ITransaction[] }>(
        '/transactions/bulk',
        {
          transactions : body,
        }
      )

      queryClient.invalidateQueries( {
        queryKey : ['transactions-monthly'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['top-expense-categories'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['monthly-chart'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['transactions'],
      } )

      return postTransaction
    } catch ( error ) {
      toast.error( t( 'toast.error_create_transaction' ) )
      throw error
    }
  }

  return { createMultiple, create }
}
/**
 *  edit data
 */
export const useEdit = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()
  const t = useTranslations()

  const edit = async ( body: IBodyTransaction, id: number ) => {
    try {
      const postTransaction = await axiosAuth.put<ApiTransactionTransaction>(
        `/transactions/${id}`,
        {
          ...body,
        }
      )

      queryClient.invalidateQueries( {
        queryKey : ['transactions-monthly'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['top-expense-categories'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['monthly-chart'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['recent-transactions'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['transactions'],
      } )

      return postTransaction
    } catch ( error ) {
      toast.error( t( 'toast.error_create_transaction' ) )
      throw error
    }
  }

  return { edit }
}

/**
 *  Delete data
 */
export const useDelete = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()
  const t = useTranslations()

  const deleteTransaction = async ( id: number ) => {
    try {
      const res = await axiosAuth.delete( '/transactions/' + id )

      queryClient.invalidateQueries( {
        queryKey : ['transactions-monthly'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['top-expense-categories'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['monthly-chart'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['recent-transactions'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['recent-transactions'],
      } )
      queryClient.invalidateQueries( {
        queryKey : ['transactions'],
      } )

      return res
    } catch ( error ) {
      toast.error( t( 'toast.error_delete_transaction' ) )
      throw error
    }
  }

  return deleteTransaction
}
/**
 *  Get mm categories
 */
export const useCategories = (
  page: number,
  pageSize: number,
  type: 'income' | 'expense' | 'all',
  enabled: boolean = true
): UseQueryResult<IApi<ICategory[]>> => {
  const axiosAuth = useAxiosAuth()
  // query
  const query = {
    page,
    pageSize,
    type,
  }

  const queryString = qs.stringify( query, { addQueryPrefix : true } )

  const data: UseQueryResult<IApi<ICategory[]>> = useQuery<IApi<ICategory[]>>( {
    queryKey : ['categories', page, pageSize, type],
    queryFn  : async () => {
      const res: AxiosResponse<IApi<ICategory[]>> = await axiosAuth(
        `/categories${queryString}`
      )

      return res.data
    },
    enabled : enabled,
  } )

  return data
}

/**
 *  Export transactions to Excel
 */
export const useExportExcel = () => {
  const axiosAuth = useAxiosAuth()
  const t = useTranslations()

  const exportExcel = async ( filter: IFilter ) => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const query = {
        ...filter,
        timezone : timezone,
      }
      const queryString = qs.stringify( query, { addQueryPrefix : true } )

      const res = await axiosAuth( `/transactions/export${queryString}`, {
        responseType : 'blob',
      } )

      // Create download link
      const blob = new Blob( [res.data], {
        type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      } )
      const url = window.URL.createObjectURL( blob )
      const link = document.createElement( 'a' )
      link.href = url

      // Get filename from response headers or generate one
      const contentDisposition = res.headers['content-disposition']
      let filename = 'transactions_export.xlsx'
      if ( contentDisposition ) {
        const match = contentDisposition.match( /filename="(.+)"/ )
        if ( match ) {
          filename = match[1]
        }
      } else if ( filter.month && filter.year ) {
        filename = `transactions_${filter.year}_${filter.month.padStart( 2, '0' )}.xlsx`
      }

      link.download = filename
      document.body.appendChild( link )
      link.click()
      document.body.removeChild( link )
      window.URL.revokeObjectURL( url )

      toast.success( t( 'toast.export_success' ) )
    } catch ( error ) {
      toast.error( t( 'toast.error_export' ) )
      throw error
    }
  }

  return { exportExcel }
}
