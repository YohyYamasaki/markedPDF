import { useNavigate } from 'react-router-dom'
import { logout } from '@/features/auth/authAPI'
import {
  currentAuthState,
  isLoadingState,
  markdownDocState,
  pdfUrlState,
  useLogoutErrorState
} from '@/recoil/recoilStates'
import { type AxiosError, type AxiosResponse } from 'axios'
import { useSetRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { type LogoutError } from '@/types/auth/LogoutError'
import { useGetUser } from './useGetUser'
import { type MarkdownDoc } from '@/types/document/MarkdownDoc'

interface ErrorResponse {
  errors: string[]
}

export function useLogout (): () => Promise<void> {
  const setLogoutError = useSetRecoilState<LogoutError>(useLogoutErrorState)
  const setCurrentAuth = useSetRecoilState<boolean>(currentAuthState)
  const setMarkdownDoc = useSetRecoilState<MarkdownDoc>(markdownDocState)
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)
  const setPdfUrl = useSetRecoilState<string | null>(pdfUrlState)
  const getUser = useGetUser()
  const navigate = useNavigate()

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response: AxiosResponse = await logout()
      // clear error
      setLogoutError([])
      // set auth state and get user data
      setCurrentAuth(false)
      void getUser()
      // clear markdown doc
      setMarkdownDoc({
        id: null,
        title: 'New Document',
        content: '',
        images: []
      })
      setPdfUrl(null)
      // show success message
      toast.success(response.data.message)
      // redirect to main page
      navigate('/')
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.errors
      // check the error type
      if (errorMessages != null) {
        let logoutError: string[] = []
        if (errorMessages != null) logoutError = errorMessages
        setLogoutError(logoutError)
        toast.error(logoutError.join(', '))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return fetchData
}
