'use client'
import { useEffect } from 'react'
import { apiAuth } from '../api'
import { useRemoveUserData } from './api/auth'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

const useAxiosAuth = () => {
  const t = useTranslations()

  // const refreshPromise: any = null
  const removeUserData = useRemoveUserData()

  useEffect( () => {
    const responseIntercept = apiAuth.interceptors.response.use(
      ( response ) => {
        return response
      },
      async ( error ) => {
        // Error 500
        if ( error?.response?.status === 500 ) {
          toast.error( t( 'something_went_wrong_title' ) )
        }
        // When access token invalid
        if ( error?.response?.status === 401 ) {
          removeUserData()
        }

        return await Promise.reject( error )
      }
    )

    return () => {
      apiAuth.interceptors.response.eject( responseIntercept )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  return apiAuth
}

export default useAxiosAuth
