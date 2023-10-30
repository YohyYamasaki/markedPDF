import * as api from '@/features/auth/authAPI'
import { type AxiosError } from 'axios'
import { toast } from 'react-toastify'

interface ErrorResponse {
  errors: string[]
}

export function useUpdateUser (): (name: string) => Promise<void> {
  // If the query is already in the cache, return it
  // otherwise fetch it and return the result
  const updateData = async (name: string): Promise<void> => {
    try {
      // get user data from cache or fetch it
      await api.updateUser(name)
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.errors
      if (errorMessages != null) toast.error(errorMessages[0])
    }
  }

  return updateData
}
