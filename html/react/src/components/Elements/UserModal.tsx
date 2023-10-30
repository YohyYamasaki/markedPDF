import { userState } from '@/recoil/recoilStates'
import { type User } from '@/types/auth/User'
import { useRecoilValue } from 'recoil'
import { UserDeleteModal } from './UserDeleteModal'
import { useResendVerification } from '@/hooks/auth/useResendVerification'

export function UserModal (): JSX.Element {
  const user = useRecoilValue<User | undefined>(userState)
  const resendVerification = useResendVerification()

  // show modal for user settings
  function showUserDeleteModal (): void {
    const dialogElement = document.getElementById('user-delete-modal')
    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.showModal()
    }
  }

  return (
    <>
      <dialog id={'user-modal'} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {/* User email and verification status */}
          <form method="dialog">
            <h3 className="font-bold text-lg">User Settings</h3>
            <div className="w-ful py-4">
              <p className="font-bold">{user?.email}</p>
              {user?.email_verified_at != null
                ? (
                <div>
                  <p>(Email Address is verifed)</p>
                </div>
                  )
                : (
                <div className="flex justify-between my-4">
                  <p>(Email Address is not verifed)</p>
                  <button
                    className="btn btn-sm ml-auto block"
                    onClick={() => { void resendVerification() }}
                  >
                    Resend Verification Email
                  </button>
                </div>
                  )}

              {/* User delete button */}
              <button
                className="btn btn-outline btn-error block ml-auto mt-6"
                onClick={showUserDeleteModal}
              >
                Delete User Account
              </button>
            </div>
          </form>
        </div>

        {/* click out side to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <UserDeleteModal />
    </>
  )
}
