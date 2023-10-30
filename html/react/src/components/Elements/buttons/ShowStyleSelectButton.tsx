import { PiFileCssDuotone } from 'react-icons/pi'
import { StyleSelectModal } from '../StyleSelectModal'

export function ShowStyleSelectButton (): JSX.Element {
  function styleSelector (): void {
    const dialogElement = document.getElementById('style-select-modal')
    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.showModal()
    }
  }

  return (
    <>
      <button
        className="btn btn-neutral btn-sm normal-case text-white ml-1 mb-1"
        onClick={styleSelector}
        aria-label="style selector"
      >
        <PiFileCssDuotone />
        Style Selector
      </button>
      <StyleSelectModal />
    </>
  )
}
