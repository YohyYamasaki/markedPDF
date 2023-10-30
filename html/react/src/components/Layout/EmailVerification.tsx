import { useLocation, useNavigate } from 'react-router-dom'
import qs from 'qs'
import { useEffect } from 'react'
import { useVerifyEmail } from '@/hooks/auth/useVerifyEmail'
import { type EmailVerify } from '@/types/auth/EmailVerify'
import { useSetRecoilState } from 'recoil'
import { isLoadingState } from '@/recoil/recoilStates'

export function EmailVerification (): JSX.Element {
  const setIsLoading = useSetRecoilState<boolean>(isLoadingState)
  const location = useLocation()
  const navigate = useNavigate()
  const verifyEmail = useVerifyEmail()

  const query: qs.ParsedQs = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const { id, hash, expires, signature } = query

  useEffect(() => {
    setIsLoading(true)

    // verify email address
    const verify = async (): Promise<void> => {
      const verifyData: EmailVerify = {
        id: String(id),
        hash: String(hash),
        expires: String(expires),
        signature: String(signature)
      }
      await verifyEmail(verifyData)
    }
    void verify()
    setIsLoading(false)
    navigate('/')
  }, [])

  return <></>
}
