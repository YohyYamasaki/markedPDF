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

export function useUploadImage (): (imageFiles: any) => Promise<void> {
  const [markdownDoc, setMarkdownDoc] =
    useRecoilState<MarkdownDoc>(markdownDocState)
  const user = useRecoilValue(userState)
  const getMarkdownDoc = useGetMarkdownDoc()
  const setImageLoading = useSetRecoilState(isImageLoadingState)

  // upload image and return the result
  async function uploadData (imageFiles: any): Promise<void> {
    // set form data
    const formData = new FormData()
    imageFiles.forEach((file: any) => {
      formData.append('image', file)
    })

    // append document id and user id if they exist
    if (markdownDoc.id != null) {
      formData.append('document_id', markdownDoc.id.toString())
    }
    if (user !== undefined) formData.append('user_id', user?.id.toString())

    try {
      // show loading
      setImageLoading(true)
      const response: any = await api.uploadImage(formData)
      const imageData = response.data
      // if user is logged in, get markdown doc, otherwise update directly update markdown doc
      if (user != null) {
        void getMarkdownDoc(markdownDoc.id)
      } else {
        setMarkdownDoc({
          ...markdownDoc,
          images: [...markdownDoc.images, imageData]
        })
      }
      // show success message
      toast.success('Successfully uploaded image')
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>
      const errorMessages = error?.message
      // show error messages in toast
      if (errorMessages != null) {
        toast.error(errorMessages)
      }
    } finally {
      setImageLoading(false)
    }
  }

  return uploadData
}
