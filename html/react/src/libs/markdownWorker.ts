/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference lib="webworker" />

import MarkdownIt from 'markdown-it'
import katex from '@traptitech/markdown-it-katex'
import checkbox from 'markdown-it-checkbox'
import footnote from 'markdown-it-footnote'
import codewrap from 'markdown-it-codewrap'

// Initialize the MarkdownIt parser
const mdParser = new MarkdownIt({ html: true, breaks: true })
  // katex
  .use(katex, {
    blockClass: 'math-block',
    errorColor: '#cc0000'
  })
  // checkbox
  .use(
    checkbox,
    {
      divWrap: true,
      divClass: 'checkbox'
    },
    {
      divWrap: true,
      divClass: 'task-list'
    }
  )
  // footnote
  .use(footnote)
  // code block wrap
  .use(codewrap, { wrapClass: 'code-wrapper', hasCopyButton: false })

// Save the original table renderer rules
const defaultRenderTableOpen =
  mdParser.renderer.rules.table_open != null ||
  function () {
    return '<table>'
  }
const defaultRenderTableClose =
  mdParser.renderer.rules.table_close != null ||
  function () {
    return '</table>'
  }

// Modify table renderer rules to wrap tables with a div
mdParser.renderer.rules.table_open = function () {
  // defaultRenderTableOpenが関数であればその結果を、そうでなければ空文字を使用
  const tableOpenString = (typeof defaultRenderTableOpen === 'function')
    ? defaultRenderTableOpen()
    : ''

  return '<div class="table-wrapper">' + tableOpenString
}

mdParser.renderer.rules.table_close = function () {
  const tableCloseString = (typeof defaultRenderTableClose === 'function')
    ? defaultRenderTableClose()
    : ''

  return tableCloseString + '</div>'
}

// Save the original blockquote and code_block renderer rules
const defaultRenderBlockquoteOpen =
  mdParser.renderer.rules.blockquote_open != null ||
  function () {
    return '<blockquote>'
  }
const defaultRenderBlockquoteClose =
  mdParser.renderer.rules.blockquote_close != null ||
  function () {
    return '</blockquote>'
  }

// Modify blockquote renderer rules to wrap with a div
mdParser.renderer.rules.blockquote_open = function () {
  const blockquoteOpenString = (typeof defaultRenderBlockquoteOpen === 'function')
    ? defaultRenderBlockquoteOpen()
    : ''

  return '<div class="blockquote-wrapper">' + blockquoteOpenString
}

mdParser.renderer.rules.blockquote_close = function () {
  const blockquoteCloseString = (typeof defaultRenderBlockquoteClose === 'function')
    ? defaultRenderBlockquoteClose()
    : ''

  return blockquoteCloseString + '</div>'
}

self.addEventListener('message', (event: MessageEvent) => {
  (async () => {
    const markdownContent = event.data as string
    const html = mdParser.render(markdownContent)
    self.postMessage(html)
  })().catch((error) => {
    // Handle the error appropriately
    console.error(error)
  })
})
