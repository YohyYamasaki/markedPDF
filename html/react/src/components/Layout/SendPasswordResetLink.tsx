import { Navbar } from '@/components/Elements/Navbar'
import { useSendPasswordResetLink } from '@/hooks/auth/useSendPasswordResetLink'
import { useState } from 'react'
import SEO from '../Elements/SEO'

export function SendPasswordResetLink (): JSX.Element {
  const [email, setEmail] = useState<string>('')
  const sendPasswordResetLink = useSendPasswordResetLink()

  // Input handlers
  function handleEmailInput (e: React.ChangeEvent<HTMLInputElement>): void {
    setEmail(e.target.value)
  }

  function onSubmit (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    void sendPasswordResetLink(email)
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
                value={email}
                onChange={handleEmailInput}
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
