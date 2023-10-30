import { currentAuthState, markdownDocState } from '@/recoil/recoilStates'
import { useRecoilValue } from 'recoil'
import { ClickToCopyWrapper } from './ClickToCopyWrapper'
import { type MarkdownDoc } from '@/types/document/MarkdownDoc'
import { PiImagesDuotone } from 'react-icons/pi'
import { FaTrashCan } from 'react-icons/fa6'
import { ImageDeleteModal } from './ImageDeleteModal'
import { DropZone } from './DropZone'
import { useUploadImage } from '@/hooks/document/useUploadImage'
import { imagePath } from '@/libs/imagePath'
import { ImageLoadingOverlay } from './ImageLoadingOverlay'

export function ImageSelector (): JSX.Element {
  const markdownDoc = useRecoilValue<MarkdownDoc>(markdownDocState)
  const isLoggedIn = useRecoilValue<boolean>(currentAuthState)
  const uploadImage = useUploadImage()

  // show modal for image selector
  function showImageSelectorModal (): void {
    const dialogElement = document.getElementById('image-selector-modal')
    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.showModal()
    }
  }

  // show modal for delete image
  function showImageDeleteModal (id: number): void {
    const dialogElement = document.getElementById(`img-delete-modal-${id}`)
    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.showModal()
    }
  }

  function onDrop (acceptedFiles: any): void {
    if (acceptedFiles.length > 0) {
      void uploadImage(acceptedFiles)
    }
  }

  return (
    <>
      {/* Show button */}
      <button
        className="btn btn-sm btn-neutral normal-case text-white mx-1"
        onClick={showImageSelectorModal}
      >
        <PiImagesDuotone />
        Images
      </button>

      {/* modal content */}
      <dialog id="image-selector-modal" className="modal">
          <ImageLoadingOverlay />
          <div className="modal-box">
            {/* Close button */}
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            {/* Drop to upload image */}
            <DropZone className="h-full" onDrop={onDrop} />

            {/* Image list */}
            <ul className="z-[1] py-8 rounded-box flex flex-wrap gap-4">
              {markdownDoc.images.length === 0
                ? (
                // No images uploaded
                <p className="text-center w-full">No images uploaded</p>
                  )
                : (
              // Show uploaded images
                    markdownDoc.images.map((image, index) => (
                  <li className="cursor-pointer relative" key={index}>
                    {/* Click to copy image url */}
                    <ClickToCopyWrapper
                      textToCopy={`![${imagePath(image.id, image.name)}](${imagePath(image.id, image.name)})`}
                    >
                      <img
                        className="w-36"
                        src={imagePath(image.id, image.name)}
                        alt="uploaded image"
                        draggable={false}
                      />
                    </ClickToCopyWrapper>
                    {/* Delete image button */}
                    <div
                      className="btn btn-circle btn-xs absolute top-1 right-1 opacity-60 hover:opacity-100"
                      onClick={() => { showImageDeleteModal(image.id) }}
                    >
                      <FaTrashCan className="w-3 text-red-600" />
                    </div>
                    {/* Delete Image modal */}
                    <ImageDeleteModal image={image} />
                  </li>
                    ))
                  )}
            </ul>
            {/* Show caution */}
            {isLoggedIn
              ? (
                  ''
                )
              : (
              <p className="text-center text-sm w-full text-gray-400">
                Images uploaded without logging in will be deleted after 3 days.
              </p>
                )}
          </div>

        {/* click out side to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
