import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'

export const useRemoveUserData = () => {
  const queryClient = useQueryClient()
  const removeUserData = () => {
    queryClient.clear()
    signOut( { callbackUrl : '/login' } )
  }

  return removeUserData
}
