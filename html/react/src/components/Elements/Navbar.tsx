import { currentAuthState } from '@/recoil/recoilStates'
import { NavLink, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { FaBars } from 'react-icons/fa6'
import { Drawer } from './Drawer'
import { useLogout } from '@/hooks/auth/useLogout'
import { DocTitleInput } from './DocTitleInput'
import { ShowGuideButton } from './buttons/ShowGuideButton'

export function Navbar (): JSX.Element {
  const isLoggedIn = useRecoilValue<boolean>(currentAuthState)
  const logout = useLogout()
  const location = useLocation()

  return (
    <>
      <div className="navbar bg-neutral z-10 min-h-12 p-2">
        <div className="flex-none">
          {isLoggedIn
            ? (
            <div className="drawer">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                {/* menu button */}
                <label
                  htmlFor="my-drawer"
                  className="btn btn-square btn-ghost btn-sm drawer-button text-white"
                >
                  <FaBars />
                </label>
              </div>
              {/* drawer menu content */}
              <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <Drawer />
              </div>
            </div>
              )
            : (
            <></>
              )}
        </div>

        <div>
          <NavLink
            className="btn btn-ghost btn-sm normal-case text-xl text-white"
            to="/"
          >
            <img className='w-10 hidden md:inline' src="/src/markedPDF/icons/icon.png" alt="markedPDF"/>
            <span className='hidden lg:inline'>markedPDF(beta)</span>
          </NavLink>
        </div>

        {/* Title Input */}
        {location.pathname === '/' ? <DocTitleInput /> : ''}

        <div className="flex-none space-x-1 ml-auto">
          {/* Switch logout / login button */}
          {isLoggedIn
            ? (
            <button
              className="btn btn-ghost btn-sm text-white"
              onClick={() => { void logout() }}
            >
              Logout
            </button>
              )
            : (
            <>
              <NavLink className="btn btn-ghost btn-sm text-white" to="/login">
                Login
              </NavLink>
              <NavLink
                className="btn btn-outline btn-sm btn-default text-white"
                to="/signup"
              >
                Sign up
              </NavLink>
            </>
              )}
          <ShowGuideButton />
        </div>
      </div>
    </>
  )
}
