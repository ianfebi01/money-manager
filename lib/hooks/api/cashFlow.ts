import { UseQueryResult, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiTransactionTransaction } from '@/types/generated/contentTypes'
import qs from 'qs'
import useAxiosAuth from '../useAxiosAuth'
import { AxiosResponse } from 'axios'
import { IBodyTransaction, ITransaction } from '@/types/api/transaction'
import toast from 'react-hot-toast'
import { IApi } from '@/types/api'
import { ICategory } from '@/types/api/categories'

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
  month: string
  year: string
}

/**
 *  Get datas
 */
export const useGetDatas = (
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
 *  Create datas
 */
export const useCreate = () => {
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

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

      return postTransaction
    } catch ( error ) {
      toast.error( 'Error create transaction' )
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

      return postTransaction
    } catch ( error ) {
      toast.error( 'Error creating transactions' )
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

      return postTransaction
    } catch ( error ) {
      toast.error( 'Error edit transaction' )
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

      return res
    } catch ( error ) {
      toast.error( 'Error creating transactions' )
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