import { type MarkdownDoc } from '@/types/document/MarkdownDoc'
import * as api from '@/features/document/documentAPI'
import { type AxiosError } from 'axios'
import { type MarkdownDocError } from '@/types/document/MarkdownDocError'
import { toast } from 'react-toastify'
import { escapeHtml } from 'markdown-it/lib/common/utils'
import { useSetRecoilState } from 'recoil'
import { updatedTimeState } from '@/recoil/recoilStates'

interface ErrorResponse {
  errors: MarkdownDocError
}

export function useUpdateMarkdownDoc (doc: MarkdownDoc): () => Promise<void> {
  const setUpdatedTime = useSetRecoilState(updatedTimeState)
  if (doc.id == null) return async () => { await Promise.resolve() }

  // escape HTML tags
  doc = { ...doc, content: escapeHtml(doc.content) }
  // update document and return the result
  async function updateData (): Promise<void> {
    try {
      await api.updateDocument(doc)
      // set updated time
      const now = new Date()
      const formattedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
        now.getHours()
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
        now.getSeconds()
      ).padStart(2, '0')}`
      setUpdatedTime(formattedDate)
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

  return updateData
}
