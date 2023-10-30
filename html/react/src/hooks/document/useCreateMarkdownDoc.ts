import { useGetDocSummaryList } from '@/hooks/document/useGetDocSummaryList'
import * as api from '@/features/document/documentAPI'
import { type AxiosError, type AxiosResponse } from 'axios'
import { type MarkdownDocError } from '@/types/document/MarkdownDocError'
import { toast } from 'react-toastify'
import { type InitMarkdownDoc } from '@/types/document/InitMarkdownDoc'

interface ErrorResponse {
  errors: MarkdownDocError
}

export function useCreateMarkdownDoc (): (
  doc: InitMarkdownDoc
) => Promise<void> {
  const getDocSummaryList = useGetDocSummaryList()

  // create document and return the result
  async function createData (doc: InitMarkdownDoc): Promise<void> {
    try {
      const response: AxiosResponse = await api.createDocument(doc)
      // set document data to recoil state
      if (response != null) doc = response.data
      // get doc summary list
      void getDocSummaryList(true)
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

  return createData
}
