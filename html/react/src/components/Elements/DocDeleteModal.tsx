import { useDeleteMarkdownDoc } from '@/hooks/document/useDeleteMarkdownDoc'

export function DocDeleteModal ({
  id,
  title
}: {
  id: number
  title: string
}): JSX.Element {
  const deleteMarkdownDoc = useDeleteMarkdownDoc(id)

  return (
    <dialog id={`delete-modal-${id}`} className="modal">
      <div className="modal-box">
        {/* close button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        {/* modal content */}
        <form method="dialog">
          <h3 className="font-bold text-lg">Delete Document {title}?</h3>
          <div className="flex justify-end items-end gap-3 pt-6">
            <button className="btn">Cancel</button>
            <button
            className="btn btn-warning"
            onClick={() => { void deleteMarkdownDoc() }}>
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
