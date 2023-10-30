import * as api from '@/features/document/documentAPI'
import { type AxiosError } from 'axios'
import { type MarkdownDocError } from '@/types/document/MarkdownDocError'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { type MarkdownDoc } from '@/types/document/MarkdownDoc'
import { isImageLoadingState, markdownDocState, userState } from '@/recoil/recoilStates'
import { useGetMarkdownDoc } from './useGetMarkdownDoc'

interface ErrorResponse {
  errors: MarkdownDocError
}

export function useDeleteImage (): (imageId: number) => Promise<void> {
  const [markdownDoc, setMarkdownDoc] =
    useRecoilState<MarkdownDoc>(markdownDocState)
  const user = useRecoilValue(userState)
  const getMarkdownDoc = useGetMarkdownDoc()
  const setImageLoading = useSetRecoilState(isImageLoadingState)

  // delete image and return the result
  async function deleteData (imageId: number): Promise<void> {
    try {
      setImageLoading(true)
      await api.deleteImage(imageId)
      if (user != null) {
        // get updated markdownDoc when user is logged in
        void getMarkdownDoc(markdownDoc.id)
      } else {
        // remove image from markdownDoc when user is not logged in
        setMarkdownDoc({
          ...markdownDoc,
          images: [...markdownDoc.images].filter(
            (image) => image.id !== imageId
          )
        })
      }
      // show success message
      toast.success('Successfully deleted image')
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
    } finally {
      setImageLoading(false)
    }
  }

  return deleteData
}
