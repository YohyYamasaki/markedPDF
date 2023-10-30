import { useRecoilState, useRecoilValue } from 'recoil'
import { Navbar } from '@/components/Elements/Navbar'
import { type LoginInput } from '@/types/auth/LoginInput'
import { useLoginErrorState, useLoginInputState } from '@/recoil/recoilStates'
import { useLogin } from '@/hooks/auth/useLogin'
import { type LoginError } from '@/types/auth/LoginError'
import { FaCircleExclamation } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom'
import SEO from '../Elements/SEO'

export function Login (): JSX.Element {
  const [loginInput, setLoginInput] =
    useRecoilState<LoginInput>(useLoginInputState)
  const loginError = useRecoilValue<LoginError>(useLoginErrorState)
  const login = useLogin(loginInput)

  // Input handlers
  function handleEmailInput (e: React.ChangeEvent<HTMLInputElement>): void {
    setLoginInput({ ...loginInput, email: e.target.value })
  }

  function handlePasswordInput (e: React.ChangeEvent<HTMLInputElement>): void {
    setLoginInput({ ...loginInput, password: e.target.value })
  }

  function onSubmit (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    void login()
  }

  return (
    <>
      <SEO
        title="markedPDF | Markdown to PDF Converter"
        description="An online Markdown editor with PDF converter. Supports basic Markdown features plus page breaks and image uploads, etc."
        name="markedPDF"
        type="website"
      />

      <Navbar />
      <div className="relative flex flex-col justify-center h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-gray-800/50 max-w-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-700">
            Login
          </h1>
          {/* Error Message */}
          {(loginError.email.length > 0 || loginError.password.length > 0)
            ? (
            <div className="my-4 alert alert-error block">
              <div className="flex">
                <FaCircleExclamation />
                <p className="ml-2">Login Error:</p>
              </div>
              {loginError.email.map((message, index) => (
                <span key={index} className="block label-text-alt font-bold">
                  {message}
                </span>
              ))}
              {loginError.password.map((message, index) => (
                <span key={index} className="block label-text-alt font-bold">
                  {message}
                </span>
              ))}
            </div>
              )
            : null}

          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Email input */}
            <div>
              <label className="label">
                <span className="text-base label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="Email Address"
                className="w-full input input-bordered"
                value={loginInput.email}
                onChange={handleEmailInput}
              />
            </div>
            {/* Password input */}
            <div>
              <label className="label">
                <span className="text-base label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full input input-bordered"
                value={loginInput.password}
                onChange={handlePasswordInput}
              />
            </div>
            <NavLink
              to="/send-password-reset"
              className="text-xs text-gray-600 hover:underline hover:text-blue-600"
            >
              Forget Password?
            </NavLink>
            <div>
              <button className="btn btn-block">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
