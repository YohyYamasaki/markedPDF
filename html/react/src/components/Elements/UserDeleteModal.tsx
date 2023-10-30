import { useDeleteUser } from '@/hooks/auth/useDeleteUser'

export function UserDeleteModal (): JSX.Element {
  const deleteUser = useDeleteUser()

  return (
    <dialog
      id={'user-delete-modal'}
      className="modal h-screen w-screen flex justify-center items-center"
    >
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form method="dialog">
          <h3 className="font-bold text-lg">Confirmation</h3>
          <div className="w-ful py-4">
            <p>Are you sure you want to delete your account?</p>

            <div className="flex justify-end items-end gap-3 pt-6">
              <button className="btn">Cancel</button>
              <button className="btn btn-warning" onClick={() => { void deleteUser() }}>
                Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  )
}
