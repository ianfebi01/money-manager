import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@/i18n/navigation'

export const useRemoveUserData = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const removeUserData = () => {
    queryClient.clear()
    router.replace( '/login' )
  }

  return removeUserData
}
