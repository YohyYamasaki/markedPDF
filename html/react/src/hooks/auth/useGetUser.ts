import { type User } from '@/types/auth/User'
import * as api from '@/features/auth/authAPI'
import { useSetRecoilState } from 'recoil'
import { isLoadingState, userState } from '@/recoil/recoilStates'
import { type AxiosError, type AxiosResponse } from 'axios'
import { toast } from 'react-toastify'

interface ErrorResponse {
  errors: string[]
}

export function useGetUser (): () => Promise<void> {
  const setUser = useSetRecoilState<User | undefined>(userState)
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)

  // fetch user data
  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true)
      // get user data from cache or fetch it
      const response: AxiosResponse = await api.getUser()
      // set user data to recoil state
      if (response != null) setUser(response.data.data)
    } catch (e) {
      setUser(undefined)
      const error = e as AxiosError<ErrorResponse>
      if (error.response != null && error.response.status === 401) return
      toast.error(error?.message)
    } finally {
      setIsLoading(false)
    }
  }

  return fetchData
}
