// page break for markdown
export function pageBreakButton (editor: any): void {
  const cm = editor.codemirror
  const output =
    '<div class="page-break" style="page-break-after: always"></div>'
  cm.replaceSelection(output)
}
