import * as api from '@/features/auth/authAPI'
import { isLoadingState } from '@/recoil/recoilStates'
import { type EmailVerify } from '@/types/auth/EmailVerify'
import { type AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'

interface ErrorResponse {
  message: string
}

export function useVerifyEmail (): (verifyData: EmailVerify) => Promise<void> {
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)

  const fetchData = async (verifyData: EmailVerify): Promise<void> => {
    try {
      setIsLoading(true)
      const response: any = await api.verifyEmail(verifyData)
      toast(response.data.message)
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.message
      if (errorMessages != null) toast.error(errorMessages)
    } finally {
      setIsLoading(false)
    }
  }

  return fetchData
}
