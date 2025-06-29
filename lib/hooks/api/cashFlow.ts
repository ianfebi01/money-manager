import { UseQueryResult, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ApiMmCategoryMmCategory,
  ApiTransactionTransaction,
} from '@/types/generated/contentTypes'
import qs from 'qs'
import useAxiosAuth from '../useAxiosAuth'
import { AxiosResponse } from 'axios'
import { IBodyTransaction } from '@/types/api/transaction'
import toast from 'react-hot-toast'
import { IApi } from '@/types/api'

interface IMonthlyTransactions {
  income: number
  expense: number
  transactions: {
    day: string
    income: number
    expense: number
    transactions: ( ApiTransactionTransaction['attributes'] & { id: number } )[]
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
): UseQueryResult<IMonthlyTransactions> => {
  const axiosAuth = useAxiosAuth()
  // query
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const query = {
    month    : filter.month,
    year     : filter.year,
    timezone : timezone
  }
  const queryString = qs.stringify( query, { addQueryPrefix : true } )

  const data: UseQueryResult<IMonthlyTransactions> =
    useQuery<IMonthlyTransactions>( {
      queryKey : ['transactions-monthly', filter.month, filter.year],
      queryFn  : async () => {
        const res: AxiosResponse<IMonthlyTransactions> = await axiosAuth(
          `/api/transactions/monthly${queryString}`
        )

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
      const postTransaction = await axiosAuth.post<ApiTransactionTransaction>(
        '/api/transactions',
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
      const postTransactions = await Promise.all(
        body.map( ( transactionBody ) =>
          axiosAuth.post<ApiTransactionTransaction>( '/api/transactions', {
            data : {
              ...transactionBody,
            },
          } )
        )
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

      return postTransactions
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
        `/api/transactions/${id}`,
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
      const res = await axiosAuth.delete<ApiTransactionTransaction>(
        '/api/transactions/' + id
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
  enabled: boolean = true,
  filters?: Record<string, any>,
  populate?: Record<string, any>
): UseQueryResult<IApi<( ApiMmCategoryMmCategory & { id: number } )[]>> => {
  const axiosAuth = useAxiosAuth()
  // query
  const query = {
    filters    : filters,
    populate   : populate,
    pagination : {
      page,
      pageSize,
    },
    sort : ['name:asc']
  }

  const queryString = qs.stringify( query, { addQueryPrefix : true } )

  const data: UseQueryResult<
    IApi<( ApiMmCategoryMmCategory & { id: number } )[]>
  > = useQuery<IApi<( ApiMmCategoryMmCategory & { id: number } )[]>>( {
    queryKey : ['mm-categories', page, pageSize, filters, populate],
    queryFn  : async () => {
      const res: AxiosResponse<
        IApi<( ApiMmCategoryMmCategory & { id: number } )[]>
      > = await axiosAuth( `/api/mm-categories${queryString}` )

      return res.data
    },
    enabled : enabled,
  } )

  return data
}
/**
 *  Get Detail
 */
// export const useGetDetail = (
//   slug: string | number,
//   enabled: boolean = true
// ): UseQueryResult<ApiArticleArticle> => {
//   const urlParamsObject = {
//     filters  : { slug },
//     populate : {
//       featureImage : { populate : '*' },
//       tags         : { populate : '*' },
//       seo          : { populate : '*' },
//     },
//   }

//   const data = useQuery( {
//     queryKey : ['article', 'detail', slug],
//     queryFn  : async () => {
//       const res = await fetchAPI( `/articles`, urlParamsObject )

//       if ( res.data?.length === 0 ) return notFound()
//       else return res.data[0]
//     },
//     enabled : enabled,
//   } )

//   return data
// }
