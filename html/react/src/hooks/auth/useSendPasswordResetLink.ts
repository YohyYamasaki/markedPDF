import * as api from '@/features/auth/authAPI'
import { type AxiosError, type AxiosResponse } from 'axios'
import { toast } from 'react-toastify'

interface ErrorResponse {
  message: string
}

export function useSendPasswordResetLink (): (email: string) => Promise<void> {
  // Check if user is logged in
  const fetchData = async (email: string): Promise<void> => {
    try {
      const response: AxiosResponse = await api.sendPasswordResetEmail(email)
      toast.info(response.data.message)
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.message
      if (errorMessages != null) toast.error(errorMessages)
    }
  }

  return fetchData
}
