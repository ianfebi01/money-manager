'use client'
import { useEffect } from 'react'
import { apiAuth } from '../api'
import { getCookie } from 'cookies-next'
import { useRemoveUserData } from './api/auth'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

const useAxiosAuth = () => {
  const t = useTranslations()

  // const refreshPromise: any = null
  const removeUserData = useRemoveUserData()

  // function refreshAccessToken() {
  //   const cookieRefreshToken = getCookie( 'token' )
  //   const cookieToken = getCookie( 'token' )

  //   const refreshTokenValue =
  //     typeof cookieRefreshToken === 'string'
  //       ? JSON.parse( cookieRefreshToken )
  //       : ''

  //   const token = typeof cookieToken === 'string' ? JSON.parse( cookieToken ) : ''

  //   if ( !refreshPromise ) {
  //     refreshPromise = new Promise( ( resolve, reject ) => {
  //       if ( refreshTokenValue ) {
  //         const body = {
  //           refresh : refreshTokenValue,
  //         }
  //         api
  //           .post( `/v1/auth/refresh`, body, {
  //             headers : {
  //               Authorization : 'Bearer ' + token,
  //             },
  //           } )
  //           .then( ( res ) => {
  //             setCookie( 'token', JSON.stringify( res.data.data?.token ) )
  //             resolve( res.data.data?.token )
  //           } )
  //           .catch( ( error ) => {
  //             removeUserData()
  //             reject( error )
  //           } )
  //           .finally( () => {
  //             refreshPromise = null
  //           } )
  //       } else {
  //         refreshPromise = null
  //         reject() // No refresh token available, reject immediately
  //       }
  //     } )
  //   }

  //   return refreshPromise
  // }

  useEffect( () => {
    const token = getCookie( 'token' )
      ? JSON.parse( getCookie( 'token' ) as string )
      : ''

    const requestIntercept = apiAuth.interceptors.request.use(
      ( config ) => {
        // You can start loading here
        if ( !config.headers['Authorization'] ) {
          config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
      },
      ( error ) => Promise.reject( error )
    )

    const responseIntercept = apiAuth.interceptors.response.use(
      ( response ) => {
        // You can stop loading here

        return response
      },
      async ( error ) => {
        // You can stop loading here
        // const prevRequest = error?.config
        // Error 500
        if ( error?.response?.status === 500 ) {
          
          toast.error( t( 'something_went_wrong_title' ) )
        }
        // When access token invalid
        if ( error?.response?.status === 401 ){
          removeUserData()
        }
        // if (
        //   error?.response?.status === 401 &&
        //   !prevRequest?.sent &&
        //   !error.response.config.url.includes( '/v1/auth' ) &&
        //   error.response.data.error !== 'password: wrong password'
        // ) {
        //   prevRequest.sent = true
        //   let newToken: string = ''

        //   const res = await refreshAccessToken()
        //   newToken = res

        //   prevRequest.headers['Authorization'] = `Bearer ${newToken}`
        //   // You can stop loading here

        //   return apiAuth( prevRequest )
        // }
        // You can stop loading here

        return await Promise.reject( error )
      }
    )

    return () => {
      apiAuth.interceptors.request.eject( requestIntercept )
      apiAuth.interceptors.response.eject( responseIntercept )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] )

  return apiAuth
}

export default useAxiosAuth
