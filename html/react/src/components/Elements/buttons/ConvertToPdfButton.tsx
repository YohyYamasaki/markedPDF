import { useConvertHtmlToPdf } from '@/hooks/document/useConvertHtmlToPdf'
import {
  htmlBodyState,
  isEditModeState,
  isPdfLoadingState,
  toggleViewButtonState
} from '@/recoil/recoilStates'
import { PiFilePdfDuotone } from 'react-icons/pi'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export function ConverToPdfButton (): JSX.Element {
  const htmlBody = useRecoilValue(htmlBodyState)
  const isPdfLoading = useRecoilValue(isPdfLoadingState)
  const setIsEditMode = useSetRecoilState<boolean>(isEditModeState)
  const [viewButtonText, setViewButtonText] = useRecoilState<string>(toggleViewButtonState)

  const convertHtmlToPdf = useConvertHtmlToPdf()

  // Handler to convert html to pdf
  async function handleClick (): Promise<void> {
    setIsEditMode(false)
    if (viewButtonText === 'PDF view') {
      setViewButtonText('Edit view')
    } else {
      setViewButtonText('PDF view')
    }
    await convertHtmlToPdf(htmlBody)
  }

  return (
    <button
      className={`btn btn-primary btn-sm normal-case text-white font-bold min-w-max ${
        isPdfLoading ? 'btn-disabled' : ''
      }`}
      onClick={() => { void handleClick() }}
      aria-label="convert to pdf"
    >
      <PiFilePdfDuotone />
      Convert to PDF
    </button>
  )
}
