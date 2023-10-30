// latex notation for markdown
export function mathButtonFunction (editor: any, isBlock: boolean): void {
  const cm = editor.codemirror
  let output = ''
  const selectedText = cm.getSelection()
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const text = selectedText || ''
  if (isBlock) {
    output = '$$\n' + text + '\n$$'
  } else {
    output = '$' + text + '$'
  }
  cm.replaceSelection(output)
}
