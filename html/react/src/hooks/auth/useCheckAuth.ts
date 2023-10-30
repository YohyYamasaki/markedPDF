import { checkAuthState } from '@/features/auth/authAPI'
import { currentAuthState, isLoadingState } from '@/recoil/recoilStates'
import { type AxiosResponse } from 'axios'
import { useSetRecoilState } from 'recoil'

export function useCheckAuth (): () => Promise<boolean> {
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)
  const setCurrentAuth = useSetRecoilState<boolean>(currentAuthState)

  const fetchData = async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      const data: AxiosResponse = await checkAuthState()
      setCurrentAuth(data.data.isAuthenticated)
      return data.data.isAuthenticated
    } catch (e) {
      setCurrentAuth(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return fetchData
}
