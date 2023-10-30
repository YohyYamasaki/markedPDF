export interface EmailVerify {
  id: string
  hash: string
  expires: string
  signature: string
}
