import * as api from '@/features/auth/authAPI'
import { isLoadingState } from '@/recoil/recoilStates'
import { type AxiosError, type AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'

interface ErrorResponse {
  errors: string[]
}

export function useResendVerification (): () => Promise<void> {
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response: AxiosResponse = await api.resendEmailVerification()
      toast.info(response.data.message)
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.errors
      if (errorMessages != null) toast.error(errorMessages)
    } finally {
      setIsLoading(false)
    }
  }

  return fetchData
}
