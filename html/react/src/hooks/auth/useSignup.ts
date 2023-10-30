import { useNavigate } from 'react-router-dom'
import { signup } from '@/features/auth/authAPI'
import {
  currentAuthState,
  isLoadingState,
  markdownDocState,
  pdfUrlState,
  useSignupErrorState,
  useSignupInputState
} from '@/recoil/recoilStates'
import { type SignupError } from '@/types/auth/SignupError'
import { type SignupInput } from '@/types/auth/SignupInput'
import { type AxiosError, type AxiosResponse } from 'axios'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { useGetUser } from './useGetUser'
import { useCreateMarkdownDoc } from '../document/useCreateMarkdownDoc'

interface ErrorResponse {
  errors: SignupError
}

export function useSignup (signupInput: SignupInput): () => Promise<void> {
  const setSignupError = useSetRecoilState<SignupError>(useSignupErrorState)
  const setSignupInput = useSetRecoilState<SignupInput>(useSignupInputState)
  const setCurrentAuth = useSetRecoilState<boolean>(currentAuthState)
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)
  const setPdfUrl = useSetRecoilState<string | null>(pdfUrlState)
  const markdownDoc = useRecoilValue(markdownDocState)

  const navigate = useNavigate()
  const getUser = useGetUser()
  const craeteMarkdownDoc = useCreateMarkdownDoc()
  const signupError: SignupError = {
    email: [],
    name: [],
    password: []
  }

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setPdfUrl(null)

      const response: AxiosResponse = await signup(signupInput)
      // clear error
      setSignupError(signupError)
      // clear input
      signupInput = {
        email: '',
        name: '',
        password: '',
        password_confirmation: ''
      }
      setSignupInput(signupInput)
      // set auth state and get user data
      setCurrentAuth(true)
      void getUser()
      // set initial document
      void craeteMarkdownDoc({
        title: markdownDoc.title ?? 'New Document',
        content: markdownDoc.content ?? ''
      })
      // show success message
      toast.success(response.data.message)
      // redirect to main page
      navigate('/')
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.errors
      // check the error type
      if (errorMessages != null) {
        if (errorMessages.email != null) signupError.email = errorMessages.email
        if (errorMessages.name != null) signupError.name = errorMessages.name
        if (errorMessages.password != null) { signupError.password = errorMessages.password }
        setSignupError(signupError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return fetchData
}
