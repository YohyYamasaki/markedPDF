import { useState } from 'react'

interface ClickToCopyWrapperProps {
  textToCopy: string
  children: JSX.Element
}

export function ClickToCopyWrapper ({
  textToCopy,
  children
}: ClickToCopyWrapperProps): JSX.Element {
  const [copied, setCopied] = useState<boolean>(false)
  const [tooltipText, setTooltipText] = useState<string>('Click to copy URL')

  async function handleCopy (): Promise<void> {
    // copy text to clipboard
    await navigator.clipboard.writeText(textToCopy)
    setTooltipText('Copied!')
    // set copied to show copied tooltip
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setTooltipText('Click to copy URL')
    }, 2000)
  }

  return (
    <div>
        <div
          onClick={() => { void handleCopy() }}
          className={`
            tooltip
            ${copied ? 'tooltip-open tooltip-info' : ''}
          `}
          data-tip={tooltipText}
        >
          {children}
        </div>
    </div>
  )
}
