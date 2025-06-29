import useAxiosAuth from '../useAxiosAuth'
import { deleteCookie, setCookie } from 'cookies-next'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@/i18n/navigation'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { IAuth, IBodyLogin, IBodyRegister } from '@/types/api/auth'
import { useState } from 'react'
import { AxiosResponse } from 'axios'

const baseUrl = '/api/auth/local'

/**
 *  Login
 */
export const useLogin = () => {
  const axiosAuth = useAxiosAuth()
  const router = useRouter()
  const t = useTranslations()
  const [loading, setLoading] = useState( false )

  const login = async ( body: IBodyLogin ) => {
    try {
      setLoading( true )

      const res: AxiosResponse<IAuth> = await axiosAuth.post( `${baseUrl}`, {
        identifier : body.email,
        password   : body.password,
      } )

      if ( res && res?.data ) {
        setCookie( 'token', JSON.stringify( res.data.jwt ) )
        setCookie( 'userId', JSON.stringify( res.data.user.id ) )
        // setCookie( 'refreshToken', JSON.stringify( res.data.data?.refresh ) )

        setLoading( false )
        router.replace( '/money-manager' )

        return true
      } else {
        setLoading( false )

        return false
      }
    } catch ( err ) {
      // const error = err as AxiosError
      toast.error( t( 'login_failed' ) )

      setLoading( false )

      return false
    }
  }

  return { login, loading }
}

/**
 *  Register
 */
export const useRegister = () => {
  const axiosAuth = useAxiosAuth()
  const router = useRouter()
  const t = useTranslations()
  const [loading, setLoading] = useState( false )

  const register = async ( body: IBodyRegister ) => {
    try {
      setLoading( true )

      const res: AxiosResponse<IAuth> = await axiosAuth.post( `${baseUrl}/register`, {
        ...body
      } )

      if ( res && res?.data ) {
        setCookie( 'token', JSON.stringify( res.data.jwt ) )
        setCookie( 'userId', JSON.stringify( res.data.user.id ) )
        // setCookie( 'refreshToken', JSON.stringify( res.data.data?.refresh ) )

        setLoading( false )
        router.replace( '/money-manager' )

        return true
      } else {
        setLoading( false )

        return false
      }
    } catch ( err ) {
      // const error = err as AxiosError
      toast.error( t( 'register_failed' ) )

      setLoading( false )

      return false
    }
  }

  return { register, loading }
}

export const useRemoveUserData = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const removeUserData = () => {
    deleteCookie( 'token' )
    deleteCookie( 'userId' )
    deleteCookie( 'refreshToken' )
    queryClient.clear()
    router.replace( '/money-manager/login' )
  }

  return removeUserData
}
