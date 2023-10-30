import { type MarkdownDoc } from '@/types/document/MarkdownDoc'
import * as api from '@/features/document/documentAPI'
import { useSetRecoilState } from 'recoil'
import { markdownDocState } from '@/recoil/recoilStates'
import { type AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { decode } from 'html-entities'

interface ErrorResponse {
  message: string
}

export function useGetMarkdownDoc (): (id: number | null) => Promise<void> {
  const setMarkdownDoc = useSetRecoilState<MarkdownDoc>(markdownDocState)
  const fetchData = async (id: number | null): Promise<void> => {
    if (id == null) return

    try {
      // get document data from cache or fetch it
      const response: any = await api.getSingleDocument(id)
      // set document data to recoil state
      // decode html entities
      const doc = {
        id: response.data.id,
        title: response.data.title,
        content: decode(response.data.content),
        images: response.data.images
      }
      setMarkdownDoc(doc)
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.message
      if (errorMessages != null) toast.error(errorMessages)
    }
  }

  return fetchData
}
