import { useNavigate } from 'react-router-dom'
import { login } from '@/features/auth/authAPI'
import {
  currentAuthState,
  isLoadingState,
  pdfUrlState,
  useLoginErrorState,
  useLoginInputState
} from '@/recoil/recoilStates'
import { type LoginError } from '@/types/auth/LoginError'
import { type LoginInput } from '@/types/auth/LoginInput'
import { type AxiosError, type AxiosResponse } from 'axios'
import { useSetRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { useGetUser } from './useGetUser'

interface ErrorResponse {
  errors: LoginError
}

export function useLogin (loginInput: LoginInput): () => Promise<void> {
  const setLoginError = useSetRecoilState<LoginError>(useLoginErrorState)
  const setLoginInput = useSetRecoilState<LoginInput>(useLoginInputState)
  const setCurrentAuth = useSetRecoilState<boolean>(currentAuthState)
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)
  const setPdfUrl = useSetRecoilState<string | null>(pdfUrlState)
  const getUser = useGetUser()
  const navigate = useNavigate()

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setPdfUrl(null)

      const response: AxiosResponse | undefined = await login(loginInput)
      // clear error
      const loginError: LoginError = {
        email: [],
        password: []
      }
      setLoginError(loginError)
      // clear input
      loginInput = { email: '', password: '' }
      setLoginInput(loginInput)
      // set auth state and get user data
      setCurrentAuth(true)
      void getUser()
      // show success message
      toast.success(response?.data.message)
      // redirect to main page
      navigate('/')
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.errors
      // check the error type
      if (errorMessages != null) {
        const loginError: LoginError = { email: [], password: [] }
        if (errorMessages.email != null) loginError.email = errorMessages.email
        if (errorMessages.password != null) { loginError.password = errorMessages.password }
        setLoginError(loginError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return fetchData
}
