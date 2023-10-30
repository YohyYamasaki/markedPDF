import * as api from '@/features/document/documentAPI'
import { toast } from 'react-toastify'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isPdfLoadingState, pdfUrlState } from '@/recoil/recoilStates'

export function useConvertHtmlToPdf (): (html: string) => Promise<void> {
  const [pdfUrl, setPdfUrl] = useRecoilState<string | null>(pdfUrlState)
  const setIsPdfLoading = useSetRecoilState<boolean>(isPdfLoadingState)

  // update document and return the result
  async function convert (html: string): Promise<void> {
    try {
      setIsPdfLoading(true)

      const response: any = await api.convertHtmlToPdf(html)

      // Revoke the old object URL to free up memory
      if (pdfUrl != null) {
        window.URL.revokeObjectURL(pdfUrl)
      }

      // convert response to blob
      const blob: Blob = new Blob([response], {
        type: 'application/pdf'
      })
      const url: string = window.URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (e) {
      // show error messages in toast
      toast.error('Failed to convert to PDF. Please try again later.')
    } finally {
      setIsPdfLoading(false)
    }
  }

  return convert
}
