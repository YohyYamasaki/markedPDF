import { type EmailVerify } from '@/types/auth/EmailVerify'
import { type LoginInput } from '@/types/auth/LoginInput'
import { type ResetPasswordInput } from '@/types/auth/ResetPasswordInput'
import { type SignupInput } from '@/types/auth/SignupInput'
import axios, { type AxiosResponse } from 'axios'

export async function checkAuthState (): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.get('/api/markedPDF/check-auth-state')
  return data
}

export async function getUser (): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.get('/api/markedPDF/user')
  return data
}

export async function updateUser (name: string): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.put('/api/markedPDF/user', { name })
  return data
}

export async function deleteUser (): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.delete('/api/markedPDF/user')
  return data
}

export async function login (loginInput: LoginInput): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.post('/api/markedPDF/auth/login', loginInput)
  return data
}

export async function logout (): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.post('/api/markedPDF/auth/logout')
  return data
}

export async function signup (signupInput: SignupInput): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.post('/api/markedPDF/auth/signup', signupInput)
  return data
}

export async function verifyEmail (
  verifyData: EmailVerify
): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.get(
    `/api/markedPDF/email/verify/${verifyData.id}/${verifyData.hash}?expires=${verifyData.expires}&signature=${verifyData.signature}`
  )
  return data
}

export async function resendEmailVerification (): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.get('/api/markedPDF/email/resend-verification')
  return data
}

export async function sendPasswordResetEmail (
  email: string
): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.post('/api/markedPDF/forgot-password', { email })
  return data
}

export async function resetPassword (
  resetData: ResetPasswordInput
): Promise<AxiosResponse> {
  await axios.get('/api/markedPDF/sanctum/csrf-cookie')
  const data = await axios.post('/api/markedPDF/reset-password', resetData)
  return data
}
