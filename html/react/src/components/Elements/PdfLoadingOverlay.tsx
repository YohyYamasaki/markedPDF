import { isPdfLoadingState } from '@/recoil/recoilStates'
import { useRecoilValue } from 'recoil'

export function PdfLoadingOverlay (): JSX.Element {
  const isPdfLoading = useRecoilValue<boolean>(isPdfLoadingState)

  if (!isPdfLoading) {
    return <></>
  } else {
    return (
      <div className="fixed h-full w-1/2 flex justify-center items-center z-30">
        <div className="fixed h-full w-1/2 opacity-30 bg-gray-100"></div>
        <span className="loading loading-dots loading-lg opacity-100"></span>
      </div>
    )
  }
}
