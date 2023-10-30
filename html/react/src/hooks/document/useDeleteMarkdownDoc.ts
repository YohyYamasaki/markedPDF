import * as api from '@/features/document/documentAPI'
import { type AxiosError } from 'axios'
import { type MarkdownDocError } from '@/types/document/MarkdownDocError'
import { toast } from 'react-toastify'
import { useGetDocSummaryList } from './useGetDocSummaryList'
import { useResetRecoilState } from 'recoil'
import { markdownDocState } from '@/recoil/recoilStates'

interface ErrorResponse {
  errors: MarkdownDocError
}

export function useDeleteMarkdownDoc (id: number | null): () => Promise<void> {
  const getDocumentSummaryList = useGetDocSummaryList()
  const resetMarkdownDoc = useResetRecoilState(markdownDocState)

  // update document and return the result
  async function deleteData (): Promise<void> {
    if (id == null) return

    try {
      await api.deleteDocument(id)
      resetMarkdownDoc()
      void getDocumentSummaryList(false)
      // show success message
      toast.success('Successfully deleted the document')
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.response?.data?.errors
      // show error messages in toast
      if (errorMessages != null) {
        Object.keys(errorMessages).forEach((key) => {
          errorMessages[key as keyof MarkdownDocError].map((message) =>
            toast.error(message)
          )
        })
      }
    }
  }

  return deleteData
}
