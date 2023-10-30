import { GuideModal } from '../GuideModal'
import { FaCircleInfo } from 'react-icons/fa6'
import { PrivacyPolicyModal } from '../PrivacyPolicyModal'

export function ShowGuideButton (): JSX.Element {
  function showGuide (): void {
    const dialogElement = document.getElementById('guide-modal')
    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.showModal()
    }
  }

  return (
    <>
      <button
        className="btn btn-ghost btn-sm text-white"
        onClick={showGuide}
        aria-label="show guide"
      >
        <FaCircleInfo />
      </button>
      <GuideModal />
      <PrivacyPolicyModal />
    </>
  )
}
