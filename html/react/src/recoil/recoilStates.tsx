import { type DocumentSummary } from '@/types/document/DocumentSummary'
import { type MarkdownDoc } from '@/types/document/MarkdownDoc'
import { type User } from '@/types/auth/User'
import { atom, selector } from 'recoil'
import { type LoginInput } from '@/types/auth/LoginInput'
import { type LoginError } from '@/types/auth/LoginError'
import { type SignupInput } from '@/types/auth/SignupInput'
import { type SignupError } from '@/types/auth/SignupError'
import { type ResetPasswordInput } from '@/types/auth/ResetPasswordInput'
import { type ResetPasswordError } from '@/types/auth/ResetPasswordError'
import { type Styles } from '@/types/document/Styles'
import { startMarkdown } from '@/misc/startMarkdown'

// general
export const isLoadingState = atom<boolean>({
  key: 'isLoading',
  default: false
})

export const isPdfLoadingState = atom<boolean>({
  key: 'isPdfLoading',
  default: false
})

export const isImageLoadingState = atom<boolean>({
  key: 'isImageLoading',
  default: false
})

export const isDragOverState = atom<boolean>({
  key: 'isDragOver',
  default: false
})

export const isEditModeState = atom<boolean>({
  key: 'isEditMode',
  default: true
})

// auth
export const currentAuthState = atom<boolean>({
  key: 'currentAuth',
  default: false
})

export const userState = atom<User | undefined>({
  key: 'user',
  default: undefined
})

export const useLoginInputState = atom<LoginInput>({
  key: 'loginInput',
  default: {
    email: '',
    password: ''
  }
})

export const useLoginErrorState = atom<LoginError>({
  key: 'loginError',
  default: {
    email: [],
    password: []
  }
})

export const useLogoutErrorState = atom<string[]>({
  key: 'logoutError',
  default: []
})

export const useSignupInputState = atom<SignupInput>({
  key: 'signupInput',
  default: {
    email: '',
    name: '',
    password: '',
    password_confirmation: ''
  }
})

export const useSignupErrorState = atom<SignupError>({
  key: 'singupError',
  default: {
    email: [],
    name: [],
    password: []
  }
})

export const useResetPasswordInputState = atom<ResetPasswordInput>({
  key: 'resetPasswordInput',
  default: {
    email: '',
    password: '',
    password_confirmation: '',
    token: ''
  }
})

export const useResetPasswordErrorState = atom<ResetPasswordError>({
  key: 'resetPasswordError',
  default: {
    email: [],
    password: [],
    token: []
  }
})

// document
export const pdfUrlState = atom<string | null>({
  key: 'pdfUrl',
  default: null
})

export const docSummaryListState = atom<DocumentSummary[]>({
  key: 'documentSummaryList',
  default: []
})

export const docSelectedIdState = atom<number>({
  key: 'docSelectedId',
  default: 0
})

export const markdownDocState = atom<MarkdownDoc>({
  key: 'markdownDoc',
  default: {
    id: null,
    title: 'New Document',
    content: startMarkdown,
    images: []
  }
})

export const htmlBodyState = atom<string>({
  key: 'htmlBody',
  default: ''
})

export const styleState = atom<Styles>({
  key: 'style',
  default: 'notion-style'
})

export const toggleViewButtonState = atom<string>({
  key: 'toggleViewButton',
  default: 'PDF view'
})

export const updatedTimeState = atom<string>({
  key: 'updatedTime',
  default: ''
})

// document selectors
export const isEnableCreateNewDocState = selector<boolean>({
  key: 'isEnableCreateNewDoc',
  get: ({ get }) => {
    const docSummaryList = get(docSummaryListState)
    return docSummaryList.length < 10
  }
})
