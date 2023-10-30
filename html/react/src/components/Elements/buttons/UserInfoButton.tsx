import { FaGears } from 'react-icons/fa6'
import { UserModal } from '../UserModal'
import { useRecoilValue } from 'recoil'
import { type User } from '@/types/auth/User'
import { currentAuthState, userState } from '@/recoil/recoilStates'

export function UserInfoButton (): JSX.Element {
  const isLoggedIn = useRecoilValue<boolean>(currentAuthState)
  const user = useRecoilValue<User | undefined>(userState)

  // show modal for user settings
  function showUserModal (): void {
    const dialogElement = document.getElementById('user-modal')
    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.showModal()
    }
  }

  return (
    <>
      <button
        className="btn btn-ghost btn-sm w-full flex justify-between"
        onClick={showUserModal}
        aria-label="show user info"
      >
        {isLoggedIn ? user?.email : 'Not logged in'}
        <FaGears />
      </button>
      {/* user info modal */}
      <UserModal />
    </>
  )
}
