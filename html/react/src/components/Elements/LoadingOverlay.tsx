import { isLoadingState } from '@/recoil/recoilStates'
import { useRecoilValue } from 'recoil'

export function LoadingOverlay (): JSX.Element {
  const isLoading = useRecoilValue<boolean>(isLoadingState)

  if (!isLoading) {
    return <></>
  } else {
    return (
      <div className="fixed h-screen w-screen flex justify-center items-center z-50">
        <div className="fixed h-screen w-screen opacity-70 bg-gray-100"></div>
        <span className="loading loading-dots loading-lg opacity-100"></span>
      </div>
    )
  }
}
