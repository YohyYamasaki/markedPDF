import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainPage } from '@/components/Layout/MainPage'
import { Login } from '@/components/Layout/Login'
import { Signup } from './components/Layout/Signup'
import { EmailVerification } from './components/Layout/EmailVerification'
import { SendPasswordResetLink } from './components/Layout/SendPasswordResetLink'
import { ResetPassword } from './components/Layout/ResetPassword'
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent'
import { useEffect } from 'react'
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
  gtmId: 'GTM-KQJCF29P'
}

export default function RouterComponent (): JSX.Element {
  const handleAcceptCookie = (): void => {
    TagManager.initialize(tagManagerArgs)
  }

  useEffect(() => {
    const isConsent = getCookieConsentValue()
    if (isConsent === 'true') {
      handleAcceptCookie()
    }
  }, [])

  return (
    <>
      <Router basename="/markedPDF">
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/send-password-reset"
            element={<SendPasswordResetLink />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
        </Routes>
      </Router>
      {/* Show cookie concent */}
      <CookieConsent
        enableDeclineButton
        style={{ alignItems: 'center' }}
        buttonStyle={{
          background: '#526BF3',
          color: 'white'
        }}
        declineButtonStyle={{
          background: 'gray',
          color: 'white'
        }}
        onAccept={handleAcceptCookie}
      >
        We use cookies to improve your experience. Google Analytics helps us
        understand usage patterns to enhance the quality of our site. &nbsp;
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
          className="underline "
        >
          Learn more
        </a>
      </CookieConsent>
    </>
  )
}
