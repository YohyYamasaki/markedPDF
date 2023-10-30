export function imagePath (id: number, name: string): string {
  const uri = new URL(window.location.href)
  return `${uri.protocol}//${uri.hostname}/api/markedPDF/image/${id}/${name}`
}
