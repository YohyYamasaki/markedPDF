import { type InitMarkdownDoc } from '@/types/document/InitMarkdownDoc'
import { type MarkdownDoc } from '@/types/document/MarkdownDoc'
import axios from 'axios'

export async function getDocumentSummaryList (): Promise<any> {
  const { data } = await axios.get('/api/markedPDF/document')
  return data
}

export async function getSingleDocument (id: number): Promise<any> {
  const { data } = await axios.get(`/api/markedPDF/document/${id}`)
  return data
}

export async function createDocument (doc: InitMarkdownDoc): Promise<any> {
  const { data } = await axios.post('/api/markedPDF/document', doc)
  return data
}

export async function updateDocument (doc: MarkdownDoc): Promise<any> {
  const { data } = await axios.put(`/api/markedPDF/document/${doc.id}`, doc)
  return data
}

export async function deleteDocument (id: number): Promise<any> {
  const { data } = await axios.delete(`/api/markedPDF/document/${id}`)
  return data
}

export async function convertHtmlToPdf (
  html: string
): Promise<any> {
  const { data } = await axios.post(
    '/api/markedPDF/html-to-pdf',
    { html },
    {
      responseType: 'arraybuffer'
    }
  )
  return data
}

// images
export async function uploadImage (formData: FormData): Promise<any> {
  const { data } = await axios.post('/api/markedPDF/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function deleteImage (id: number): Promise<any> {
  const { data } = await axios.delete(`/api/markedPDF/image/${id}`)
  return data
}
