import { useDeleteImage } from '@/hooks/document/useDeleteImage'
import { imagePath } from '@/libs/imagePath'
import { type Image } from '@/types/document/Image'

export function ImageDeleteModal ({ image }: { image: Image }): JSX.Element {
  const deleteImage = useDeleteImage()

  return (
    <dialog id={`img-delete-modal-${image.id}`} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form method="dialog">
          <h3 className="font-bold text-lg">Delete this Image?</h3>
          <img
            className="w-64 block m-auto pt-4"
            src={imagePath(image.id, image.name)}
            alt="delete image"
          />
          <div className="flex justify-end items-end gap-3 pt-6">
            <button className="btn">Cancel</button>
            <button
              className="btn btn-warning"
              onClick={() => { void deleteImage(image.id) }}
            >
              Delete
            </button>
          </div>
        </form>
      </div>

      {/* click out side to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
