import { type Image } from './Image'

export interface MarkdownDoc {
  id: number | null
  title: string
  images: Image[]
  content: string
}
