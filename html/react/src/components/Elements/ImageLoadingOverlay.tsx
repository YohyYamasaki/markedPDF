import { isImageLoadingState } from '@/recoil/recoilStates'
import { useRecoilValue } from 'recoil'

export function ImageLoadingOverlay (): JSX.Element {
  const isImageLoading = useRecoilValue<boolean>(isImageLoadingState)

  if (!isImageLoading) {
    return <></>
  } else {
    return (
      <div className="fixed h-full w-full flex justify-center items-center z-30">
        <div className="absolute h-full w-full opacity-30 bg-gray-100"></div>
        <span className="loading loading-dots loading-lg opacity-100"></span>
      </div>
    )
  }
}
