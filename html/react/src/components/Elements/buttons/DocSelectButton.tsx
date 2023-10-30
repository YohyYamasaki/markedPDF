import { markdownDocState } from '@/recoil/recoilStates'
import { FaTrashCan } from 'react-icons/fa6'
import { useRecoilValue } from 'recoil'

interface DocSelectButtonProps {
  id: number
  title: string
  onClick: () => void
  isShowDeleteBtn: boolean
}

export function DocSelectButton ({
  id,
  title,
  onClick,
  isShowDeleteBtn
}: DocSelectButtonProps): JSX.Element {
  const markdownDoc = useRecoilValue(markdownDocState)

  // show delete modal for each document
  function showDeleteModal (
    e: React.MouseEvent<HTMLSpanElement>,
    id: number
  ): void {
    e.stopPropagation()
    const dialogElement = document.getElementById(`delete-modal-${id}`)
    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.showModal()
    }
  }

  return (
    <>
      <button
        className={
          'btn flex justify-between items-center normal-case hover:bg-base-300 max-w-full' +
          (markdownDoc.id === id ? ' bg-base-300 btn-outline' : '')
        }
        onClick={onClick}
        aria-label="select document"
      >
        <p className="font-bold py-2 truncate w-9/12">{title ?? 'No title'}</p>
        {/* delete button */}
        <span
          onClick={(e) => { showDeleteModal(e, id) }}
          className="self-center px-2 py-1 hover:text-red-700 rounded"
        >
          {isShowDeleteBtn ? <FaTrashCan className="w-4" /> : ''}
        </span>
      </button>
    </>
  )
}
