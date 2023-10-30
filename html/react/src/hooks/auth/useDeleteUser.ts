import { type User } from '@/types/auth/User'
import * as api from '@/features/auth/authAPI'
import { useSetRecoilState } from 'recoil'
import {
  currentAuthState,
  isLoadingState,
  markdownDocState,
  userState
} from '@/recoil/recoilStates'
import { type AxiosError, type AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { type MarkdownDoc } from '@/types/document/MarkdownDoc'

interface ErrorResponse {
  errors: string[]
}

export function useDeleteUser (): () => Promise<void> {
  const setUser = useSetRecoilState<User | undefined>(userState)
  const setMarkdownDoc = useSetRecoilState<MarkdownDoc>(markdownDocState)
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)
  const setCurrentAuth = useSetRecoilState<boolean>(currentAuthState)
  // If the query is already in the cache, return it
  // otherwise fetch it and return the result
  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true)
      // get user data from cache or fetch it
      const response: AxiosResponse = await api.deleteUser()
      // set user data to recoil state
      toast.success(response.data.message)
      setUser(undefined)
      setCurrentAuth(false)

      setMarkdownDoc({
        id: null,
        title: 'New Document',
        content: '',
        images: []
      })
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.errors
      if (errorMessages != null) toast.error(errorMessages[0])
    } finally {
      setIsLoading(false)
    }
  }

  return fetchData
}
