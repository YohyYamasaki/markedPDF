import { type DocumentSummary } from '@/types/document/DocumentSummary'
import * as api from '@/features/document/documentAPI'
import { useSetRecoilState } from 'recoil'
import { docSummaryListState } from '@/recoil/recoilStates'
import { type AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useGetMarkdownDoc } from './useGetMarkdownDoc'

interface ErrorResponse {
  errors: string[]
}

export function useGetDocSummaryList (): (withGetMdDoc: boolean) => Promise<void> {
  const setDocSummaryList = useSetRecoilState<DocumentSummary[]>(docSummaryListState)
  const getMarkdownDoc = useGetMarkdownDoc()

  const fetchData = async (withGetMdDoc: boolean = false): Promise<void> => {
    try {
      // get document summary data from cache or fetch it
      const response: any = await api.getDocumentSummaryList()
      // set document summary data to recoil state
      let documentSummary: DocumentSummary[] = []
      if (response != null) documentSummary = response
      setDocSummaryList(documentSummary)
      // get markdown document data if needed
      if (withGetMdDoc) void getMarkdownDoc(documentSummary[0].id)
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.errors
      if (errorMessages != null) toast.error(errorMessages[0])
    }
  }

  return fetchData
}
