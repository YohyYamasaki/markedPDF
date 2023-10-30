import * as api from '@/features/auth/authAPI'
import {
  isLoadingState,
  useResetPasswordErrorState
} from '@/recoil/recoilStates'
import { type ResetPasswordError } from '@/types/auth/ResetPasswordError'
import { type ResetPasswordInput } from '@/types/auth/ResetPasswordInput'
import { type AxiosError, type AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'

interface ErrorResponse {
  errors: ResetPasswordError
}

export function useResetPassword (): (
  resetData: ResetPasswordInput
) => Promise<void> {
  const setPasswordInputError = useSetRecoilState<ResetPasswordError>(
    useResetPasswordErrorState
  )
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)

  const navigate = useNavigate()
  const resetPasswordError: ResetPasswordError = {
    email: [],
    password: [],
    token: []
  }

  const fetchData = async (resetData: ResetPasswordInput): Promise<void> => {
    try {
      setIsLoading(true)
      const response: AxiosResponse = await api.resetPassword(resetData)
      toast.info(response.data.message)
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.errors
      // check the error type
      if (errorMessages != null) {
        // set error messages
        if (errorMessages.email != null) resetPasswordError.email = errorMessages.email
        if (errorMessages.password != null) { resetPasswordError.password = errorMessages.password }
        if (errorMessages.token != null) resetPasswordError.token = errorMessages.token
      }
    } finally {
      setPasswordInputError(resetPasswordError)

      if (
        resetPasswordError.email.length === 0 &&
        resetPasswordError.token.length === 0 &&
        resetPasswordError.password.length === 0
      ) {
        navigate('/login')
      }
      setIsLoading(false)
    }
  }

  return fetchData
}
