import { Navbar } from '@/components/Elements/Navbar'
import {
  useResetPasswordErrorState,
  useResetPasswordInputState
} from '@/recoil/recoilStates'
import { type ResetPasswordInput } from '@/types/auth/ResetPasswordInput'
import { useRecoilState, useRecoilValue } from 'recoil'
import qs from 'qs'
import { useResetPassword } from '@/hooks/auth/useResetPassword'
import { type ResetPasswordError } from '@/types/auth/ResetPasswordError'
import { FaCircleExclamation } from 'react-icons/fa6'
import SEO from '../Elements/SEO'

export function ResetPassword (): JSX.Element {
  const [resetPasswordInput, setResetPasswordInput] =
    useRecoilState<ResetPasswordInput>(useResetPasswordInputState)
  const resetPassword = useResetPassword()
  const resetPasswordError = useRecoilValue<ResetPasswordError>(
    useResetPasswordErrorState
  )

  const query: qs.ParsedQs = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const { token } = query

  // Input handlers
  function handleInputChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target
    setResetPasswordInput((prevInput) => ({
      ...prevInput,
      [name]: value
    }))
  }

  function onSubmit (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    // set token
    const resetData: ResetPasswordInput = {
      ...resetPasswordInput,
      token: String(token)
    }
    void resetPassword(resetData)
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
            Reset Password
          </h1>
          {/* Error Message */}
          {(
            resetPasswordError.email.length > 0 ||
            resetPasswordError.token.length > 0 ||
            resetPasswordError.password.length > 0
          )
            ? (
            <div className="my-4 alert alert-error block">
              <div className="flex">
                <FaCircleExclamation />
                <p className="ml-2">Sign up Error:</p>
              </div>
              {Object.keys(resetPasswordError).map((key) =>
                resetPasswordError[key as keyof typeof resetPasswordError].map(
                  (message, index) => (
                    <span
                      key={`${key}-${index}`}
                      className="block label-text-alt font-bold"
                    >
                      {message}
                    </span>
                  )
                )
              )}
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
                name="email"
                placeholder="Email Address"
                className="w-full input input-bordered"
                value={resetPasswordInput.email}
                onChange={handleInputChange}
              />
            </div>
            {/* Password input */}
            <div>
              <label className="label">
                <span className="text-base label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="w-full input input-bordered"
                value={resetPasswordInput.password}
                onChange={handleInputChange}
              />
            </div>
            {/* Password confirmation input */}
            <div>
              <label className="label">
                <span className="text-base label-text">
                  Password Confirmation
                </span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Enter Password confirmation"
                className="w-full input input-bordered"
                value={resetPasswordInput.password_confirmation}
                onChange={handleInputChange}
              />
            </div>

            <div className="pt-2">
              <button className="btn btn-block">
                Send Password Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
